from django.db import models
from django.core.exceptions import ValidationError
from customers.models import Customer
from product_master.models import Product
from users.models import User


class SalesOrder(models.Model):

    STATUS_CHOICES = [
        ("DRAFT", "Draft"),
        ("CONFIRMED", "Confirmed"),
        ("ON_HOLD", "On Hold"),
        ("PARTIALLY_FULFILLED", "Partially Fulfilled"),
        ("CLOSED", "Closed"),
        ("CANCELLED", "Cancelled"),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.PROTECT)

    customer_po_id = models.IntegerField(
        null=True,
        blank=True,
        help_text="Reference to Customer Purchase Order (FK added later)"
    )

    created_by = models.ForeignKey(User, on_delete=models.PROTECT)

    order_date = models.DateField()
    expected_delivery_date = models.DateField(null=True, blank=True)

    priority_flag = models.BooleanField(default=False)
    is_locked = models.BooleanField(default=False)

    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default="DRAFT")

    subtotal_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    remarks = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"SO-{self.id}"

    # ----------------------------
    # Derived Quantity Properties
    # ----------------------------

    @property
    def total_order_quantity(self):
        return sum(line.quantity for line in self.lines.all())

    @property
    def total_fulfilled_quantity(self):
        return sum(line.fulfilled_quantity for line in self.lines.all())

    @property
    def pending_quantity(self):
        return max(0, self.total_order_quantity - self.total_fulfilled_quantity)

    # ----------------------------
    # Status Update Logic
    # ----------------------------

    def update_status_based_on_fulfillment(self):

        if self.status in ["ON_HOLD", "CANCELLED"]:
            return

        total = self.total_order_quantity
        fulfilled = self.total_fulfilled_quantity

        if total == 0:
            return

        if fulfilled == 0 and self.status != "DRAFT":
            self.status = "CONFIRMED"
        elif fulfilled < total:
            self.status = "PARTIALLY_FULFILLED"
        else:
            self.status = "CLOSED"

        self.save(update_fields=["status"])


class SalesOrderLine(models.Model):  # product wise order from a single sales order

    sales_order = models.ForeignKey(
        SalesOrder,
        related_name="lines",
        on_delete=models.CASCADE
    )

    product = models.ForeignKey(Product, on_delete=models.PROTECT)

    quantity = models.PositiveIntegerField()
    fulfilled_quantity = models.PositiveIntegerField(default=0)

    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    line_total = models.DecimalField(max_digits=12, decimal_places=2)

    remarks = models.TextField(blank=True)

    def __str__(self):
        return f"SO-{self.sales_order_id}-LINE-{self.id}"

    @property
    def pending_quantity(self):
        return max(0,self.quantity - self.fulfilled_quantity)

    def clean(self):
        if self.fulfilled_quantity > self.quantity:
            raise ValidationError("Fulfilled quantity cannot exceed ordered quantity")


class SalesOrderEditLog(models.Model):

    sales_order = models.ForeignKey(
        SalesOrder,
        on_delete=models.CASCADE,
        related_name="edit_logs"
    )

    field_name = models.CharField(max_length=100)
    old_value = models.TextField(null=True, blank=True)
    new_value = models.TextField(null=True, blank=True)

    changed_by = models.ForeignKey(User, on_delete=models.PROTECT)
    changed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"SO-{self.sales_order_id} | {self.field_name}"