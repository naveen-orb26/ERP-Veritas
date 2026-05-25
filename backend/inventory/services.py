from django.db import transaction

from rest_framework.exceptions import (
    ValidationError
)

from .models import (
    StockLedger
)


# =====================================================
# POST STOCK MOVEMENT
# =====================================================

@transaction.atomic
def post_stock_movement(

    *,

    warehouse,

    material_source,

    movement_type,

    direction,

    quantity,

    created_by,

    reference_type="",

    reference_id=None,

    remarks="",
):

    if quantity <= 0:

        raise ValidationError(

            "Quantity must be "
            "greater than zero"
        )

    if direction not in [

        "IN",

        "OUT",
    ]:

        raise ValidationError(

            "Invalid stock direction"
        )

    ledger_entry = (
        StockLedger.objects.create(

            warehouse=warehouse,

            material_source=
                material_source,

            movement_type=
                movement_type,

            direction=direction,

            quantity=quantity,

            reference_type=
                reference_type,

            reference_id=
                reference_id,

            remarks=remarks,

            created_by=created_by,
        )
    )

    return ledger_entry


def manual_stock_receipt(

    *,

    warehouse,

    material_source,

    quantity,

    created_by,

    remarks="",
):

    return post_stock_movement(

        warehouse=warehouse,

        material_source=
            material_source,

        movement_type=
            "MANUAL_RECEIPT",

        direction="IN",

        quantity=quantity,

        created_by=created_by,

        remarks=remarks,
    )


def manual_stock_issue(

    *,

    warehouse,

    material_source,

    quantity,

    created_by,

    remarks="",
):

    return post_stock_movement(

        warehouse=warehouse,

        material_source=
            material_source,

        movement_type=
            "MANUAL_ISSUE",

        direction="OUT",

        quantity=quantity,

        created_by=created_by,

        remarks=remarks,
    )