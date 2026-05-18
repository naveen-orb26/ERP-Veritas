from django.db import transaction

from django.utils import timezone

from rest_framework.exceptions import ValidationError

from product_master.models import Product

from recipes.models import Recipe

from recipes.services import (

    activate_recipe,
)

from .models import DevelopmentSample


# =====================================================
# GENERATE REFERENCE CODE
# =====================================================

def generate_reference_code(mid_code):

    latest_sample = (

        DevelopmentSample.objects.filter(

            mid_code=mid_code
        )
        .order_by("-id")
        .first()
    )

    if not latest_sample:

        next_sequence = 1

    else:

        latest_reference = (
            latest_sample.reference_code
        )

        try:

            latest_number = int(

                latest_reference.split("-")[-1]
            )

        except Exception:

            raise ValidationError(
                "Invalid existing "
                "reference code format."
            )

        next_sequence = (
            latest_number + 1
        )

    sequence = str(
        next_sequence
    ).zfill(3)

    return (
        f"VRT-{mid_code}-{sequence}"
    )


# =====================================================
# APPROVE DEVELOPMENT SAMPLE
# =====================================================

@transaction.atomic
def approve_development_sample(

    development_sample,

    sr_number,
):

    if (
        development_sample.status
        == "APPROVED"
    ):

        raise ValidationError(
            "Development sample "
            "already approved."
        )

    recipe = getattr(

        development_sample,

        "recipe",

        None
    )

    if recipe:

        activate_recipe(recipe)

    product = Product.objects.create(

        sr_number=sr_number,

        product_name=
            development_sample.product_name,

        description=
            development_sample.description,

        category=
            development_sample.category,

        size_or_variant=
            development_sample.size_or_variant,

        color=
            development_sample.color,

        base_unit=
            development_sample.base_unit,

        units_per_base_unit=
            development_sample.units_per_base_unit,

        default_units_per_packet=1,

        is_active=True,
    )

    development_sample.status = (
        "APPROVED"
    )

    development_sample.is_active = (
        True
    )

    development_sample.approved_at = (
        timezone.now()
    )

    development_sample.save()

    return product


# =====================================================
# REJECT DEVELOPMENT SAMPLE
# =====================================================

@transaction.atomic
def reject_development_sample(

    development_sample
):

    development_sample.status = (
        "REJECTED"
    )

    development_sample.is_active = (
        False
    )

    development_sample.save()