from django.db import models
from django.utils import timezone

from customers.models import Customer
from product_master.models import Product



class SalesInvoice(models.Model):

    STATUS_CHOICES = [
        ("UNPAID", "Unpaid"),
        ("PARTIAL", "Partial"),
        ("PAID", "Paid"),
    ]

    invoice_number = models.CharField(
        max_length=50,
        unique=True
    )

    customer = models.ForeignKey(
        Customer,
        on_delete=models.PROTECT
    )

    invoice_date = models.DateField(
        default=timezone.now
    )

    due_date = models.DateField(
        null=True,
        blank=True
    )

    total_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
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

    created_at = models.DateTimeField(auto_now_add=True)

    def update_payment_status(self):

        total_paid = sum(
            payment.amount_paid
            for payment in self.payments.all()
        )

        if total_paid == 0:

            self.status = "UNPAID"

        elif total_paid < self.total_amount:

            self.status = "PARTIAL"

        else:

            self.status = "PAID"

        self.save(update_fields=["status"])

    def __str__(self):
        return self.invoice_number


class SalesInvoiceItem(models.Model):

    invoice = models.ForeignKey(
        SalesInvoice,
        related_name="items",
        on_delete=models.CASCADE
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT
    )

    quantity = models.PositiveIntegerField()

    rate = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    remarks = models.TextField(blank=True)

    def __str__(self):
        return f"Invoice-{self.invoice_id} Item-{self.id}"
    
class Payment(models.Model):

    PAYMENT_MODE_CHOICES = [
        ("CASH", "Cash"),
        ("BANK", "Bank Transfer"),
        ("UPI", "UPI"),
        ("CHEQUE", "Cheque"),
    ]

    customer = models.ForeignKey(
        Customer,
        on_delete=models.PROTECT
    )

    sales_invoice = models.ForeignKey(
        SalesInvoice,
        related_name="payments",
        on_delete=models.PROTECT
    )

    amount_paid = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    payment_date = models.DateField(
        default=timezone.now
    )

    payment_mode = models.CharField(
        max_length=20,
        choices=PAYMENT_MODE_CHOICES
    )

    remarks = models.TextField(blank=True)

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"Payment-{self.id} | {self.sales_invoice.invoice_number}"