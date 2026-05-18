from django.db import models

from django.db import models

from django.utils import timezone


# =====================================================
# RAW MATERIAL
# =====================================================

class RawMaterial(models.Model):

    UNIT_CHOICES = [

        ("KG", "Kilogram"),

        ("GRAM", "Gram"),

        ("LITRE", "Litre"),

        ("ML", "Millilitre"),

        ("PIECE", "Piece"),
    ]

    MATERIAL_CATEGORY_CHOICES = [

        ("CHEMICAL", "Chemical"),

        ("PACKAGING", "Packaging"),

        ("CONSUMABLE", "Consumable"),

        ("GENERAL", "General"),
    ]

    material_code = models.CharField(

        max_length=50,

        unique=True
    )

    material_name = models.CharField(

        max_length=255
    )

    material_category = models.CharField(

        max_length=50,

        choices=MATERIAL_CATEGORY_CHOICES,

        default="GENERAL"
    )

    base_unit = models.CharField(

        max_length=20,

        choices=UNIT_CHOICES
    )

    description = models.TextField(

        blank=True
    )

    is_active = models.BooleanField(

        default=True
    )

    created_at = models.DateTimeField(

        auto_now_add=True
    )

    updated_at = models.DateTimeField(

        auto_now=True
    )

    def __str__(self):

        return (
            f"{self.material_code} | "
            f"{self.material_name}"
        )