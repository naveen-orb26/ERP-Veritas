from django.db import models


class Customer(models.Model):
    """
    Customer Master.
    Represents a business entity we sell to.
    """

    vendor_id = models.CharField(
        max_length=4,
        unique=True,
        help_text="4-digit business identifier for the customer"
    )

    name = models.CharField(
        max_length=255,
        help_text="Customer name (may repeat)"
    )

    is_active = models.BooleanField(
        default=True,
        help_text="Whether the customer is active or inactive"
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="When the customer was registered in the system"
    )

    def __str__(self):
        return f"{self.vendor_id} - {self.name}"

    billing_address = models.TextField(
        help_text="Billing address used for invoices"
    )

    billing_gst_number = models.CharField(
        max_length=15,
        null=True,
        blank=True,
        help_text="GST number for billing address (if applicable)"
    )

    shipping_address = models.TextField(
        help_text="Shipping address used for dispatch"
    )

    shipping_gst_number = models.CharField(
        max_length=15,
        null=True,
        blank=True,
        help_text="GST number for shipping address (if applicable)"
    )
    contact_numbers = models.JSONField(
        default=list,
        blank=True,
        help_text="List of contact phone numbers"
    )

    contact_emails = models.JSONField(
        default=list,
        blank=True,
        help_text="List of contact email addresses"
    )

    credit_terms = models.CharField(
        max_length=100,
        blank=True,
        help_text="Default credit terms (e.g., Advance, 30 days)"
    )
