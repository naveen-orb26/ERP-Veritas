from rest_framework.exceptions import (
    ValidationError
)


# =====================================================
# VALIDATE RECIPE
# =====================================================

def validate_recipe(recipe):

    items = (
        recipe.items.all()
    )

    # ==========================================
    # MINIMUM ONE INGREDIENT
    # ==========================================

    if not items.exists():

        raise ValidationError(

            "Recipe must contain "
            "at least one ingredient."
        )

    seen_materials = set()

    for item in items:

        # ======================================
        # RAW MATERIAL REQUIRED
        # ======================================

        if not item.raw_material_id:

            raise ValidationError(

                "Raw material is required."
            )

        # ======================================
        # DUPLICATE RAW MATERIAL CHECK
        # ======================================

        if (
            item.raw_material_id
            in
            seen_materials
        ):

            raise ValidationError(

                f"Duplicate raw material "
                f"detected: "
                f"{item.raw_material.material_name}"
            )

        seen_materials.add(
            item.raw_material_id
        )

        # ======================================
        # QUANTITY VALIDATION
        # ======================================

        if item.quantity <= 0:

            raise ValidationError(

                f"Quantity must be greater "
                f"than zero for "
                f"{item.raw_material.material_name}"
            )

        # ======================================
        # UNIT VALIDATION
        # ======================================

        if not item.unit:

            raise ValidationError(

                f"Unit is required for "
                f"{item.raw_material.material_name}"
            )