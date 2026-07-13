from django.db import models

from django.core.exceptions import (
    ValidationError
)

from django.utils import timezone

from datetime import timedelta

from customers.models import Customer

from product_master.models import Product

from users.models import User


class SalesOrder(models.Model):

    STATUS_CHOICES = [

        ("DRAFT", "Draft"),

        ("CONFIRMED", "Confirmed"),

        (
            "IN_PRODUCTION",
            "In Production"
        ),

        (
            "QC_PENDING",
            "QC Pending"
        ),

        (
            "READY_TO_DISPATCH",
            "Ready To Dispatch"
        ),

        (
            "PARTIALLY_DISPATCHED",
            "Partially Dispatched"
        ),

        ("DISPATCHED", "Dispatched"),

        ("CLOSED", "Closed"),

        ("ON_HOLD", "On Hold"),

        ("CANCELLED", "Cancelled"),
    ]

    order_number = models.CharField(
        max_length=50,
        unique=True,
        blank=True,
        null=True,
    )

    customer = models.ForeignKey(
        Customer,
        on_delete=models.PROTECT
    )

    customer_po_id = models.IntegerField(
        null=True,
        blank=True,
        help_text=(
            "Reference to customer "
            "purchase order"
        )
    )

    created_by = models.ForeignKey(
        User,
        on_delete=models.PROTECT
    )

    order_date = models.DateField()

    delivery_lead_days = (
        models.PositiveIntegerField(
            null=True,
            blank=True,
            help_text=(
                "Promised delivery "
                "lead time in days"
            )
        )
    )

    expected_delivery_date = (
        models.DateField(
            null=True,
            blank=True
        )
    )

    priority_flag = models.BooleanField(
        default=False
    )

    is_locked = models.BooleanField(
        default=False
    )

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default="DRAFT"
    )

    subtotal_amount = (
        models.DecimalField(
            max_digits=12,
            decimal_places=2,
            default=0
        )
    )

    tax_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    total_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    remarks = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:

        ordering = ["-id"]

    def __str__(self):

        return self.order_number

    # -----------------------------------
    # QUANTITY DERIVATIONS
    # -----------------------------------

    @property
    def total_order_quantity(self):

        return sum(
            line.quantity
            for line in self.lines.all()
        )

    @property
    def total_fulfilled_quantity(self):

        return sum(
            line.fulfilled_quantity
            for line in self.lines.all()
        )

    @property
    def pending_quantity(self):

        return max(

            0,

            self.total_order_quantity
            -
            self.total_fulfilled_quantity
        )

    # -----------------------------------
    # DELIVERY ANALYTICS
    # -----------------------------------

    @property
    def remaining_days(self):

        if not self.expected_delivery_date:
            return None

        return (

            self.expected_delivery_date
            -
            timezone.now().date()

        ).days

    # -----------------------------------
    # STATUS LOGIC
    # -----------------------------------

    def update_status_based_on_fulfillment(
        self
    ):

        if self.status in [

            "ON_HOLD",

            "CANCELLED",

            "CLOSED",
        ]:

            return

        total = (
            self.total_order_quantity
        )

        fulfilled = (
            self.total_fulfilled_quantity
        )

        if total == 0:
            return

        if fulfilled == 0:

            self.status = "CONFIRMED"

        elif fulfilled < total:

            self.status = (
                "PARTIALLY_DISPATCHED"
            )

        else:

            self.status = "DISPATCHED"

        self.save(
            update_fields=["status"]
        )

    # -----------------------------------
    # SAVE LOGIC
    # -----------------------------------

    def save(self, *args, **kwargs):

        # -----------------------------
        # ORDER NUMBER GENERATION
        # -----------------------------

        if not self.order_number:

            next_id = (
                SalesOrder.objects.count()
                + 1
            )

            self.order_number = (

                f"SO-2026-{next_id:05d}"
            )

        # -----------------------------
        # DELIVERY DATE CALCULATION
        # -----------------------------

        if (

            self.order_date and

            self.delivery_lead_days
            is not None and

            not self.expected_delivery_date
        ):

            self.expected_delivery_date = (

                self.order_date
                +
                timedelta(
                    days=self.delivery_lead_days
                )
            )

        # -----------------------------
        # LEAD DAYS CALCULATION
        # -----------------------------

        elif (

            self.order_date and

            self.expected_delivery_date and

            self.delivery_lead_days
            is None
        ):

            self.delivery_lead_days = (

                self.expected_delivery_date
                -
                self.order_date

            ).days

        super().save(
            *args,
            **kwargs
        )
            
class SalesOrderLine(models.Model):

    sales_order = models.ForeignKey(

        SalesOrder,

        related_name="lines",

        on_delete=models.CASCADE
    )

    product = models.ForeignKey(

        Product,

        on_delete=models.PROTECT
    )

    # -----------------------------------
    # PRODUCT SNAPSHOTS
    # -----------------------------------

    sr_number = models.CharField(
        max_length=100
    )

    gst_percentage = (
        models.DecimalField(
            max_digits=5,
            decimal_places=2,
            default=0
        )
    )

    # -----------------------------------
    # QUANTITIES
    # -----------------------------------

    quantity = models.PositiveIntegerField()

    fulfilled_quantity = (
        models.PositiveIntegerField(
            default=0
        )
    )

    # -----------------------------------
    # PRICING
    # -----------------------------------

    unit_price = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    line_total = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    # -----------------------------------
    # GST BREAKUP
    # -----------------------------------

    cgst_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    sgst_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    igst_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    remarks = models.TextField(
        blank=True
    )

    class Meta:

        ordering = ["id"]

   
    def __str__(self):

        return (

            f"{self.sales_order.order_number}"
            f" | "
            f"{self.sr_number}"
        )

    @property
    def pending_quantity(self):

        return max(

            0,

            self.quantity
            -
            self.fulfilled_quantity
        )
    @property
    def dispatched_quantity(self):

        return sum(

            self.dispatch_items.values_list(

                "dispatched_quantity",

                flat=True
            )
        )


    @property
    def remaining_to_dispatch(self):

        return max(

            self.quantity
            -
            self.dispatched_quantity,

            0
        )
    
    @property
    def packed_quantity(self):

        from packing.models import Packet

        return sum(

            Packet.objects.filter(

                sales_order_line=self

            ).values_list(

                "units_in_packet",

                flat=True
            )
        )

    def clean(self):

        if (

            self.fulfilled_quantity
            >
            self.quantity
        ):

            raise ValidationError(

                "Fulfilled quantity "
                "cannot exceed ordered "
                "quantity"
            )


class SalesOrderEditLog(models.Model):

    sales_order = models.ForeignKey(

        SalesOrder,

        on_delete=models.CASCADE,

        related_name="edit_logs"
    )

    field_name = models.CharField(
        max_length=100
    )

    old_value = models.TextField(
        null=True,
        blank=True
    )

    new_value = models.TextField(
        null=True,
        blank=True
    )

    changed_by = models.ForeignKey(

        User,

        on_delete=models.PROTECT
    )

    changed_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:

        ordering = ["-changed_at"]

    def __str__(self):

        return (

            f"{self.sales_order.order_number}"
            f" | "
            f"{self.field_name}"
        )