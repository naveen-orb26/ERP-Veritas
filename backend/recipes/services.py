from decimal import Decimal

from django.db import transaction

from rest_framework.exceptions import ValidationError

from .models import (

    Recipe,

    RecipeLine,
)


# =====================================================
# RECIPE VALIDATION
# =====================================================

def validate_recipe(recipe):

    recipe_lines = (
        recipe.recipe_lines.all()
    )

    if not recipe_lines.exists():

        raise ValidationError(
            "Recipe must contain "
            "at least one ingredient."
        )

    scaling_reference_count = (
        recipe_lines.filter(
            is_scaling_reference=True
        ).count()
    )

    if scaling_reference_count != 1:

        raise ValidationError(
            "Recipe must contain "
            "exactly one scaling "
            "reference ingredient."
        )

    duplicate_materials = []

    material_tracker = set()

    for line in recipe_lines:

        material_id = (
            line.raw_material.id
        )

        if material_id in material_tracker:

            duplicate_materials.append(
                line.raw_material.material_name
            )

        material_tracker.add(
            material_id
        )

    if duplicate_materials:

        raise ValidationError(

            "Duplicate raw materials "
            "found in recipe: "
            f"{', '.join(duplicate_materials)}"
        )


# =====================================================
# ACTIVATE RECIPE
# =====================================================

@transaction.atomic
def activate_recipe(recipe):

    validate_recipe(recipe)

    recipe.is_active = True

    recipe.save()


# =====================================================
# DEACTIVATE RECIPE
# =====================================================

@transaction.atomic
def deactivate_recipe(recipe):

    recipe.is_active = False

    recipe.save()


# =====================================================
# SCALE RECIPE
# =====================================================

def scale_recipe(

    recipe,

    scaling_quantity,
):

    validate_recipe(recipe)

    scaling_line = (
        recipe.recipe_lines.get(
            is_scaling_reference=True
        )
    )

    scaling_base_quantity = (
        scaling_line.quantity
    )

    if scaling_base_quantity <= 0:

        raise ValidationError(
            "Scaling reference quantity "
            "must be greater than zero."
        )

    multiplier = (
        Decimal(scaling_quantity)
        / scaling_base_quantity
    )

    scaled_materials = []

    for line in (
        recipe.recipe_lines.all()
    ):

        scaled_quantity = (
            line.quantity * multiplier
        )

        scaled_materials.append({

            "raw_material_id":
                line.raw_material.id,

            "raw_material_name":
                line.raw_material.material_name,

            "quantity":
                round(
                    scaled_quantity,
                    4
                ),

            "unit":
                line.unit,

            "is_scaling_reference":
                line.is_scaling_reference,
        })

    return {

        "recipe_id": recipe.id,

        "development_reference":
            recipe.development_sample.reference_code,

        "scaling_quantity":
            scaling_quantity,

        "scaled_materials":
            scaled_materials,
    }