from django.db.models import Sum

from rest_framework.exceptions import ValidationError

from purchases.models import RawStockMovement


# --------------------------------------------------
# RAW STOCK CALCULATION
# --------------------------------------------------

def get_raw_stock(product):

    purchase_in = (
        RawStockMovement.objects.filter(
            product=product,
            movement_type="PURCHASE_IN",
        )
        .aggregate(total=Sum("quantity"))
        .get("total")
        or 0
    )

    production_out = (
        RawStockMovement.objects.filter(
            product=product,
            movement_type="PRODUCTION_OUT",
        )
        .aggregate(total=Sum("quantity"))
        .get("total")
        or 0
    )

    current_stock = purchase_in - production_out

    return current_stock


# --------------------------------------------------
# NEGATIVE STOCK PROTECTION
# --------------------------------------------------

def validate_raw_stock(product, required_quantity):

    current_stock = get_raw_stock(product)

    if required_quantity > current_stock:

        raise ValidationError(
            f"Insufficient raw stock for "
            f"{product}. "
            f"Available: {current_stock}"
        )
    
from finished_stock.models import FinishedStockPacket


# --------------------------------------------------
# FINISHED STOCK CALCULATION
# --------------------------------------------------

def get_finished_stock(product):

    stock = (
        FinishedStockPacket.objects.filter(
            product=product,
            status="IN_STOCK",
        )
        .aggregate(total=Sum("units_in_packet"))
        .get("total")
        or 0
    )

    return stock


# --------------------------------------------------
# DISPATCH STOCK VALIDATION
# --------------------------------------------------

def validate_finished_stock(
    product,
    required_quantity,
):

    current_stock = get_finished_stock(product)

    if required_quantity > current_stock:

        raise ValidationError(
            f"Insufficient finished stock for "
            f"{product}. "
            f"Available: {current_stock}"
        )
    
def reconcile_finished_stock(product):

    actual_stock = get_finished_stock(product)

    calculated_dispatch = (
        FinishedStockPacket.objects.filter(
            product=product,
            status="DISPATCHED",
        )
        .aggregate(total=Sum("units_in_packet"))
        .get("total")
        or 0
    )

    return {
        "product": str(product),
        "current_stock": actual_stock,
        "dispatched_units": calculated_dispatch,
    }