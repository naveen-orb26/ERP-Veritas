from decimal import Decimal

from django.db import transaction

from django.core.exceptions import (
    ValidationError
)

from raw_materials.models import (
    RawMaterialInventory,
)

from .models import (
    GRN,
    GRNLine,
)

from inventory.services import (
    post_stock_movement
)

# =====================================================
# APPLY GRN INVENTORY
# =====================================================

@transaction.atomic
def apply_grn_inventory(

    grn: GRN
):

    for line in grn.lines.all():

        inventory, _ = (
            RawMaterialInventory.objects
            .get_or_create(

                warehouse=line.warehouse,

                material_source=
                    line.material_source,

                defaults={

                    "current_quantity":
                        Decimal("0"),

                    "reserved_quantity":
                        Decimal("0"),
                }
            )
        )

        inventory.current_quantity = (

            Decimal(
                inventory.current_quantity
            )

            +

            Decimal(
                line.received_quantity
            )
        )

        inventory.last_movement_at = (
            line.updated_at
        )

        inventory.full_clean()

        inventory.save()

        post_stock_movement(

        warehouse=
            line.warehouse,

        material_source=
            line.material_source,

        movement_type=
            "PURCHASE_IN",

        direction="IN",

        quantity=
            line.received_quantity,

        created_by=
            None,
            # kept as None because auth is not fully complete now, later update to the default user who has logged in only.
        reference_type="GRN",

        reference_id=
            grn.id,

        remarks=(

            f"GRN Receipt | "

            f"{grn.grn_number}"
        ),
    )
# =====================================================
# REVERSE GRN INVENTORY
# =====================================================

@transaction.atomic
def reverse_grn_inventory(

    grn: GRN
):

    for line in grn.lines.all():

        try:

            inventory = (
                RawMaterialInventory.objects
                .get(

                    warehouse=
                        line.warehouse,

                    material_source=
                        line.material_source,
                )
            )

        except RawMaterialInventory.DoesNotExist:

            raise ValidationError(

                f"Inventory missing for "

                f"{line.material_source.sm_code}"
            )

        new_quantity = (

            Decimal(
                inventory.current_quantity
            )

            -

            Decimal(
                line.received_quantity
            )
        )

        if new_quantity < 0:

            raise ValidationError(

                f"Cannot reverse GRN. "

                f"Negative stock for "

                f"{line.material_source.sm_code}"
            )

        inventory.current_quantity = (
            new_quantity
        )

        inventory.last_movement_at = (
            line.updated_at
        )

        inventory.full_clean()

        inventory.save()

        post_stock_movement(

            warehouse=
                line.warehouse,

            material_source=
                line.material_source,

            movement_type=
                "GRN_REVERSAL",

            direction="OUT",

            quantity=
                line.received_quantity,

            created_by=
                None,

            reference_type="GRN_REVERSAL",

            reference_id=
                grn.id,

            remarks=(

                f"GRN Reversal | "

                f"{grn.grn_number}"
            ),
        )