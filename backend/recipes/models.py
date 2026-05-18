from django.db import models

from sampling.models import DevelopmentSample

from raw_materials.models import RawMaterial


# =====================================================
# RECIPE
# =====================================================

class Recipe(models.Model):

    development_sample = models.OneToOneField(

        DevelopmentSample,

        on_delete=models.CASCADE,

        related_name="recipe"
    )

    is_active = models.BooleanField(

        default=False
    )

    created_at = models.DateTimeField(

        auto_now_add=True
    )

    updated_at = models.DateTimeField(

        auto_now=True
    )

    def __str__(self):

        return (
            f"Recipe - "
            f"{self.development_sample.reference_code}"
        )


# =====================================================
# RECIPE LINE
# =====================================================

class RecipeLine(models.Model):

    UNIT_CHOICES = [

        ("KG", "Kilogram"),

        ("GRAM", "Gram"),

        ("LITRE", "Litre"),

        ("ML", "Millilitre"),

        ("PIECE", "Piece"),
    ]

    recipe = models.ForeignKey(

        Recipe,

        on_delete=models.CASCADE,

        related_name="recipe_lines"
    )

    raw_material = models.ForeignKey(

        RawMaterial,

        on_delete=models.PROTECT
    )

    quantity = models.DecimalField(

        max_digits=18,

        decimal_places=4
    )

    unit = models.CharField(

        max_length=20,

        choices=UNIT_CHOICES
    )

    is_scaling_reference = models.BooleanField(

        default=False
    )

    remarks = models.TextField(

        blank=True
    )

    created_at = models.DateTimeField(

        auto_now_add=True
    )

    def __str__(self):

        return (
            f"{self.recipe.development_sample.reference_code}"
            f" | "
            f"{self.raw_material.material_name}"
        )