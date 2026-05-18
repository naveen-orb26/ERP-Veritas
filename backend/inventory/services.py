from django.db import transaction

from django.utils import timezone

from rest_framework.exceptions import ValidationError


# =====================================================
# GET OR CREATE STOCK SNAPSHOT
# =====================================================


def get_or_create_inventory_stock(

    warehouse,

    product,
):
    from .models import InventoryStock
    stock, _ = (

        InventoryStock.objects
        .get_or_create(

            warehouse=warehouse,

            product=product,

            defaults={

                "current_quantity": 0,

                "reserved_quantity": 0,

                "available_quantity": 0,
            }
        )
    )

    return stock


# =====================================================
# GET CURRENT STOCK
# =====================================================

def get_current_stock(

    warehouse,

    product,
):

    stock = get_or_create_inventory_stock(

        warehouse=warehouse,

        product=product,
    )

    return stock.current_quantity


# =====================================================
# VALIDATE STOCK
# =====================================================


def validate_stock_availability(

    warehouse,

    product,

    required_quantity,
):
    from .models import Warehouse

    current_stock = get_current_stock(

        warehouse=warehouse,

        product=product,
    )

    if required_quantity > current_stock:

        raise ValidationError(

            f"Insufficient stock for "
            f"{product}. "
            f"Available stock: "
            f"{current_stock}"
        )


# =====================================================
# POST STOCK MOVEMENT
# =====================================================
from .models import (

    InventoryStock,

    StockLedger,
)

@transaction.atomic



def post_stock_movement(

    *,

    warehouse,

    product,

    movement_type,

    direction,

    quantity,

    created_by,

    reference_type="",

    reference_id=None,

    remarks="",
):
    from .models import (

    StockLedger,
    )
    
    if quantity <= 0:

        raise ValidationError(

            "Quantity must be "
            "greater than zero"
        )

    stock = get_or_create_inventory_stock(

        warehouse=warehouse,

        product=product,
    )

    # -------------------------------------------------
    # NEGATIVE STOCK PROTECTION
    # -------------------------------------------------

    if direction == "OUT":

        if quantity > stock.current_quantity:

            raise ValidationError(

                f"Insufficient stock for "
                f"{product}. "
                f"Current stock: "
                f"{stock.current_quantity}"
            )

        stock.current_quantity -= quantity

    elif direction == "IN":

        stock.current_quantity += quantity

    else:

        raise ValidationError(

            "Invalid stock direction"
        )

    stock.last_movement_at = timezone.now()

    stock.save()

    # -------------------------------------------------
    # LEDGER ENTRY
    # -------------------------------------------------

    ledger_entry = StockLedger.objects.create(

        warehouse=warehouse,

        product=product,

        movement_type=movement_type,

        direction=direction,

        quantity=quantity,

        reference_type=reference_type,

        reference_id=reference_id,

        remarks=remarks,

        created_by=created_by,
    )

    return ledger_entry


# =====================================================
# MANUAL STOCK RECEIPT
# =====================================================

def manual_stock_receipt(

    *,

    warehouse,

    product,

    quantity,

    created_by,

    remarks="",
):

    return post_stock_movement(

        warehouse=warehouse,

        product=product,

        movement_type="MANUAL_RECEIPT",

        direction="IN",

        quantity=quantity,

        created_by=created_by,

        remarks=remarks,
    )


# =====================================================
# MANUAL STOCK ISSUE
# =====================================================

def manual_stock_issue(

    *,

    warehouse,

    product,

    quantity,

    created_by,

    remarks="",
):

    return post_stock_movement(

        warehouse=warehouse,

        product=product,

        movement_type="MANUAL_ISSUE",

        direction="OUT",

        quantity=quantity,

        created_by=created_by,

        remarks=remarks,
    )

# =====================================================
# LEGACY COMPATIBILITY HELPERS
# =====================================================

def validate_raw_stock(

    product,

    required_quantity,

    warehouse=None,
):

    from .models import Warehouse

    if warehouse is None:

        warehouse = (
            Warehouse.objects.filter(
                warehouse_type="RAW_MATERIAL"
            )
            .first()
        )

    if not warehouse:

        raise ValidationError(
            "No raw material warehouse found"
        )

    validate_stock_availability(

        warehouse=warehouse,

        product=product,

        required_quantity=required_quantity,
    )


def get_finished_stock(

    product,

    warehouse=None,
):

    from .models import Warehouse

    if warehouse is None:

        warehouse = (
            Warehouse.objects.filter(
                warehouse_type="FINISHED_GOOD"
            )
            .first()
        )

    if not warehouse:

        return 0

    return get_current_stock(

        warehouse=warehouse,

        product=product,
    )


def validate_finished_stock(

    product,

    required_quantity,

    warehouse=None,
):

    from .models import Warehouse

    if warehouse is None:

        warehouse = (
            Warehouse.objects.filter(
                warehouse_type="FINISHED_GOOD"
            )
            .first()
        )

    if not warehouse:

        raise ValidationError(
            "No finished goods warehouse found"
        )

    validate_stock_availability(

        warehouse=warehouse,

        product=product,

        required_quantity=required_quantity,
    )