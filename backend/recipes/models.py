from django.db import models

from sampling.models import (
    DevelopmentSample
)

from raw_materials.models import (
    RawMaterial
)


class Recipe(models.Model):

    development_sample = (
        models.OneToOneField(

            DevelopmentSample,

            on_delete=models.CASCADE,

            related_name="recipe"
        )
    )

    notes = models.TextField(

        blank=True
    )

    created_at = (
        models.DateTimeField(

            auto_now_add=True
        )
    )

    updated_at = (
        models.DateTimeField(

            auto_now=True
        )
    )

    def __str__(self):

        return (
            f"Recipe - "
            f"{self.development_sample.reference_code}"
        )
    
class RecipeItem(models.Model):

    recipe = models.ForeignKey(Recipe,on_delete=models.CASCADE, related_name="items")

    raw_material = (
        models.ForeignKey(

            RawMaterial,

            on_delete=models.PROTECT,

            related_name="recipe_items"
        )
    )

    quantity = models.DecimalField(

        max_digits=12,

        decimal_places=3
    )

    unit = models.CharField(

        max_length=20
    )

    remarks = models.CharField(

        max_length=255,

        blank=True
    )

    created_at = (
        models.DateTimeField(

            auto_now_add=True
        )
    )

    def __str__(self):

        return (

            f"{self.raw_material.material_name}"
            f" - "
            f"{self.quantity}"
            f" {self.unit}"
        )
    
    