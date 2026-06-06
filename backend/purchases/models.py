from django.db import models

from decimal import Decimal

from django.db import models

from django.utils import timezone

from django.core.exceptions import (
    ValidationError
)

from vendors.models import Vendor

from raw_materials.models import (
    MaterialSource
)

from inventory.models import (
    Warehouse
)


# =====================================================
# PURCHASE ORDER
# =====================================================

class PurchaseOrder(models.Model):

    STATUS_CHOICES = [

        ("DRAFT", "Draft"),

        ("APPROVED", "Approved"),

        (
            "PARTIALLY_RECEIVED",
            "Partially Received"
        ),

        ("CLOSED", "Closed"),

        ("CANCELLED", "Cancelled"),
        ("RECEIVED", "Received"),
    ]

    po_number = models.CharField(

        max_length=50,

        unique=True,

        editable=False
    )

    vendor = models.ForeignKey(

        Vendor,

        on_delete=models.PROTECT,

        related_name="purchase_orders"
    )

    po_date = models.DateField(

        default=timezone.now
    )

    vendor_pr_number = models.CharField(

        max_length=100,

        blank=True
    )

    billing_address = models.TextField()

    shipping_address = models.TextField()

    company_gstin = models.CharField(

        max_length=20
    )

    vendor_gstin = models.CharField(

        max_length=20
    )

    lead_days = models.PositiveIntegerField(

        default=0
    )

    expected_delivery_date = models.DateField(

        null=True,

        blank=True
    )

    subtotal = models.DecimalField(

        max_digits=18,

        decimal_places=2,

        default=0
    )

    total_tax_amount = models.DecimalField(

        max_digits=18,

        decimal_places=2,

        default=0
    )

    grand_total = models.DecimalField(

        max_digits=18,

        decimal_places=2,

        default=0
    )

    status = models.CharField(

        max_length=30,

        choices=STATUS_CHOICES,

        default="DRAFT"
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

    def save(self, *args, **kwargs):

        if not self.po_number:

            year = timezone.now().year

            last_po = (

                PurchaseOrder.objects

                .filter(
                    po_number__startswith=
                    f"PO-{year}"
                )

                .order_by("-id")

                .first()
            )

            next_number = 1

            if last_po:

                try:

                    next_number = (

                        int(

                            last_po.po_number
                            .split("-")[-1]
                        )

                        + 1
                    )

                except Exception:

                    next_number = 1

            self.po_number = (

                f"PO-{year}-"

                f"{str(next_number).zfill(4)}"
            )

        super().save(*args, **kwargs)

    def __str__(self):

        return self.po_number


# =====================================================
# PURCHASE ORDER LINE
# =====================================================

class PurchaseOrderLine(models.Model):

    purchase_order = models.ForeignKey(

        PurchaseOrder,

        on_delete=models.CASCADE,

        related_name="lines"
    )

    material_source = models.ForeignKey(

        MaterialSource,

        on_delete=models.PROTECT,

        related_name="purchase_order_lines"
    )

    warehouse = models.ForeignKey(

        Warehouse,

        on_delete=models.PROTECT,

        related_name="purchase_order_lines"
    )

    ordered_quantity = models.DecimalField(

        max_digits=18,

        decimal_places=4
    )

    received_quantity = models.DecimalField(

        max_digits=18,

        decimal_places=4,

        default=0
    )

    pending_quantity = models.DecimalField(

        max_digits=18,

        decimal_places=4,

        default=0
    )

    unit = models.CharField(

        max_length=30
    )

    unit_cost = models.DecimalField(

        max_digits=18,

        decimal_places=2
    )

    cgst_percent = models.DecimalField(

        max_digits=5,

        decimal_places=2,

        default=0
    )

    sgst_percent = models.DecimalField(

        max_digits=5,

        decimal_places=2,

        default=0
    )

    igst_percent = models.DecimalField(

        max_digits=5,

        decimal_places=2,

        default=0
    )

    tax_amount = models.DecimalField(

        max_digits=18,

        decimal_places=2,

        default=0
    )

    line_total = models.DecimalField(

        max_digits=18,

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

    def clean(self):

        if self.ordered_quantity <= 0:

            raise ValidationError(

                "Ordered quantity "
                "must be greater "
                "than zero."
            )

        if self.unit_cost < 0:

            raise ValidationError(

                "Unit cost "
                "cannot be negative."
            )

    def save(self, *args, **kwargs):

        self.pending_quantity = (

            Decimal(
                self.ordered_quantity
            )

            -

            Decimal(
                self.received_quantity
            )
        )

        subtotal = (

            Decimal(
                self.ordered_quantity
            )

            *

            Decimal(
                self.unit_cost
            )
        )

        total_tax_percent = (

            Decimal(self.cgst_percent)

            +

            Decimal(self.sgst_percent)

            +

            Decimal(self.igst_percent)
        )

        self.tax_amount = (

            subtotal
            *
            total_tax_percent
        ) / Decimal("100")

        self.line_total = (

            subtotal
            +
            self.tax_amount
        )

        super().save(*args, **kwargs)

    def __str__(self):

        return (

            f"{self.purchase_order.po_number} | "

            f"{self.material_source.sm_code}"
        )