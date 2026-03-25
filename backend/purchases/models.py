from django.db import models
from django.core.exceptions import ValidationError
from product_master.models import Product


class Supplier(models.Model):

    name = models.CharField(
        max_length=255
    )

    address = models.TextField()

    gst_number = models.CharField(
        max_length=50,
        unique=True
    )

    payment_terms = models.CharField(
        max_length=100,
        blank=True
    )

    contact_numbers = models.JSONField(
        default=list
    )

    contact_emails = models.JSONField(
        default=list
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.name


from django.utils import timezone


class PurchaseOrder(models.Model):

    po_number = models.CharField(
        max_length=50,
        unique=True
    )

    supplier = models.ForeignKey(
        Supplier,
        on_delete=models.PROTECT,
        related_name="purchase_orders"
    )

    po_date = models.DateField(
        default=timezone.now
    )

    remarks = models.TextField(blank=True)

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.po_number
    


class PurchaseInvoice(models.Model):

    STATUS_CHOICES = [
        ("UNPAID", "Unpaid"),
        ("PARTIAL", "Partial"),
        ("PAID", "Paid"),
    ]

    supplier = models.ForeignKey(
        Supplier,
        on_delete=models.PROTECT,
        related_name="purchase_invoices"
    )

    purchase_order = models.ForeignKey(
        PurchaseOrder,
        on_delete=models.PROTECT,
        related_name="invoices"
    )

    invoice_number = models.CharField(
        max_length=50,
        unique=True
    )

    invoice_date = models.DateField(
        default=timezone.now
    )

    total_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    pdf_path = models.CharField(
        max_length=255,
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="UNPAID"
    )

    remarks = models.TextField(blank=True)

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.invoice_number



class GRN(models.Model):

    purchase_invoice = models.ForeignKey(
        PurchaseInvoice,
        on_delete=models.PROTECT,
        related_name="grns"
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT
    )

    received_quantity = models.PositiveIntegerField()

    accepted_quantity = models.PositiveIntegerField()

    received_date = models.DateField(
        default=timezone.now
    )

    remarks = models.TextField(blank=True)

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def clean(self):

        if self.accepted_quantity > self.received_quantity:
            raise ValidationError(
                "Accepted quantity cannot exceed received quantity."
            )

    def __str__(self):
        return f"GRN-{self.id}"
    


class RawStockMovement(models.Model):

    MOVEMENT_CHOICES = [
        ("PURCHASE_IN", "Purchase In"),
        ("ADJUSTMENT_IN", "Adjustment In"),
        ("ADJUSTMENT_OUT", "Adjustment Out"),
        ("RETURN_IN", "Return In"),
        ("RETURN_OUT", "Return Out"),
    ]

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT
    )

    movement_type = models.CharField(
        max_length=20,
        choices=MOVEMENT_CHOICES
    )

    quantity = models.PositiveIntegerField()

    date = models.DateField(
        default=timezone.now
    )

    reference_id = models.IntegerField(
        null=True,
        blank=True
    )

    remarks = models.TextField(blank=True)

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.product} | {self.movement_type}"
