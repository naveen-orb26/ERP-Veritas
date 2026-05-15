from django.db import models


class Product(models.Model):
    """
    Product Master model.
    Represents a unique physical product variant identified by SR Number.
    """

    sr_number = models.CharField(
        max_length=100,
        unique=True,
        help_text="Unique SR Number identifying the product"
    )

    product_name = models.CharField(
        max_length=255,
        help_text="Human readable product name"
    )

    category = models.CharField(
        max_length=100,
        help_text="Product category (button, elastic, tape, etc.)"
    )

    size_or_variant = models.CharField(
        max_length=100,
        help_text="Size or variant (e.g. 16L, 24L, 1 inch)"
    )

    color = models.CharField(
        max_length=50,
        help_text="Color of the product"
    )
    reorder_level = models.PositiveIntegerField(
    default=0
    )
    BASE_UNIT_CHOICES = [
        ("PCS", "Pieces"),
        ("GROSS", "Gross"),
        ("METER", "Meter"),
        ("ROLL", "Roll"),
        ("SET", "Set"),
    ]

    base_unit = models.CharField(
        max_length=20,
        choices=BASE_UNIT_CHOICES,
        default="GROSS",
        help_text="Base unit of measurement for this product"
    )

    units_per_base_unit = models.PositiveIntegerField(
        default=144,
        help_text="Conversion factor (e.g., 144 for 1 GROSS)"
    )

    default_units_per_packet = models.PositiveIntegerField(
        help_text="Suggested default packing quantity (editable during packing)"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this product is currently active or discontinued"
    )

    image = models.ImageField(
        upload_to="products/",
        null=True,
        blank=True,
        help_text="Product image (stored in media storage)"
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the product was created"
    )

    hsn_code = models.CharField(
    max_length=20,
    blank=True,
    help_text="HSN/SAC classification code"
    )

    gst_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=18.00,
        help_text="Default GST percentage for this product"
    )

    def __str__(self):
        return f"{self.sr_number} - {self.product_name}"
