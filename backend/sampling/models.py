from django.db import models

from customers.models import Customer


class DevelopmentSample(models.Model):
    """
    Development / Sampling model.

    Represents experimental or approved
    product developments before they
    become finalized Product Master entries.
    """

    STATUS_CHOICES = [

        ("DRAFT", "Draft"),

        ("UNDER_REVIEW", "Under Review"),

        ("APPROVED", "Approved"),

        ("REJECTED", "Rejected"),
    ]

    BASE_UNIT_CHOICES = [

        ("PCS", "Pieces"),

        ("GROSS", "Gross"),

        ("METER", "Meter"),

        ("ROLL", "Roll"),

        ("SET", "Set"),
    ]

    reference_code = models.CharField(

        max_length=100,

        unique=True,

        help_text=(
            "Generated development "
            "reference code "
            "(e.g. VRT-BTN-001)"
        )
    )

    mid_code = models.CharField(

        max_length=20,

        help_text=(
            "Category sequence code "
            "(e.g. BTN, LBL, TPE)"
        )
    )

    product_name = models.CharField(

        max_length=255,

        help_text="Development product name"
    )

    description = models.TextField(

        blank=True,

        help_text="Development notes/details"
    )

    category = models.CharField(

        max_length=100,

        help_text=(
            "Product category "
            "(button, tape, label, etc.)"
        )
    )

    size_or_variant = models.CharField(

        max_length=100,

        help_text=(
            "Variant / size "
            "(e.g. 18L-4H)"
        )
    )

    color = models.CharField(

        max_length=50,

        help_text="Development color"
    )

    base_unit = models.CharField(

        max_length=20,

        choices=BASE_UNIT_CHOICES,

        default="GROSS",

        help_text="Base unit"
    )

    units_per_base_unit = models.PositiveIntegerField(

        default=144,

        help_text=(
            "Conversion factor "
            "(e.g. 144 for gross)"
        )
    )

    customer = models.ForeignKey(

        Customer,

        on_delete=models.SET_NULL,

        null=True,

        blank=True
    )

    customer_name = models.CharField(

        max_length=255,

        blank=True,

        help_text=(
            "Used when customer "
            "does not yet exist "
            "in master"
        )
    )

    remarks = models.TextField(

        blank=True
    )

    status = models.CharField(

        max_length=50,

        choices=STATUS_CHOICES,

        default="DRAFT"
    )

    is_active = models.BooleanField(

        default=True
    )

    approved_at = models.DateTimeField(

        null=True,

        blank=True
    )

    created_at = models.DateTimeField(

        auto_now_add=True
    )

    updated_at = models.DateTimeField(

        auto_now=True
    )

    def __str__(self):

        return (
            f"{self.reference_code} - "
            f"{self.product_name}"
        )