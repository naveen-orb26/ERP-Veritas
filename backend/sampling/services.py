from django.db import transaction

from django.utils import timezone

from rest_framework.exceptions import ValidationError

from product_master.models import Product

from recipes.models import Recipe

from .models import DevelopmentSample

from recipes.models import (
    Recipe
)
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
    development_sample
):

    # ================================
    # VALIDATION
    # ================================

    if (
        development_sample.status
        ==
        DevelopmentSample
        .STATUS_APPROVED
    ):

        raise ValidationError(
            "Sample already approved."
        )

    # ================================
    # APPROVE
    # ================================
    # ==========================================
    # RECIPE VALIDATION
    # ==========================================

    try:

        recipe = (
            development_sample.recipe
        )

    except Recipe.DoesNotExist:

        raise ValidationError(

            "Please add recipe before approval."
        )

    if not recipe.items.exists():

        raise ValueError(

            "Recipe must contain at least one ingredient."
        )
    development_sample.status = (

        DevelopmentSample
        .STATUS_APPROVED    
    )

    development_sample.approved_at = (
        timezone.now()
    )

    development_sample.rejected_at = None

    development_sample.save()

    return development_sample

# =====================================================
# REJECT DEVELOPMENT SAMPLE
# =====================================================

@transaction.atomic



def reject_development_sample(
    development_sample
):

    if (
        development_sample.status
        ==
        DevelopmentSample
        .STATUS_APPROVED
    ):

        raise ValueError(
            "Approved samples cannot be rejected."
        )

    # ================================
    # VALIDATION
    # ================================

    if (
        development_sample.status
        ==
        DevelopmentSample
        .STATUS_REJECTED
    ):

        raise ValueError(
            "Sample already rejected."
        )

    # ================================
    # REJECT
    # ================================

    development_sample.status = (

        DevelopmentSample
        .STATUS_REJECTED
    )

    development_sample.rejected_at = (
        timezone.now()
    )

    development_sample.approved_at = None

    development_sample.save()

    return development_sample