from django.db import models
import os

from sampling.models import DevelopmentSample

class Product(models.Model):
    """
    Product Master model.
    Represents a unique physical product variant identified by SR Number.
    """

    development_sample = models.ForeignKey(

        DevelopmentSample,

        on_delete=models.PROTECT,

        related_name="products",

        null=True,

        blank=True,

        help_text=(
            "Parent development sample "
            "from which this SR was created"
        )
    )
        
    sr_number = models.CharField(
        max_length=100,
        unique=True,
        help_text="Unique SR Number identifying the product"
    )

    product_name = models.CharField(
        max_length=255,
        help_text="Human readable product name"
    )

    description = models.TextField(
        blank=True,
        help_text="Detailed product description"
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
    
    def product_image_upload_path( instance, filename):
            
        extension = filename.split(".")[-1]

        return (
            f"products/"
            f"{instance.sr_number}."
            f"{extension}"
        )
    

    image = models.ImageField(
        upload_to=product_image_upload_path,
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

    