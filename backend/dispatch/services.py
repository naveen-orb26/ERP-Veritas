from django.db.models import Sum

from finished_stock.models import FinishedStockPacket


def validate_dispatch(sales_line, dispatch_quantity):

    # --------------------------------------------------
    # Rule 1 — Quantity must be positive
    # --------------------------------------------------

    if dispatch_quantity <= 0:
        raise Exception(
            "Dispatch quantity must be greater than zero."
        )

    # --------------------------------------------------
    # Rule 2 — Order status check
    # --------------------------------------------------

    order = sales_line.sales_order

    if order.status in ["CANCELLED", "CLOSED"]:
        raise Exception(
            "Cannot dispatch for cancelled or closed orders."
        )

    # --------------------------------------------------
    # Rule 3 — Remaining order quantity
    # --------------------------------------------------

    remaining_order_qty = (
        sales_line.quantity
        - sales_line.fulfilled_quantity
    )

    if dispatch_quantity > remaining_order_qty:
        raise Exception(
            f"Dispatch exceeds remaining order quantity "
            f"({remaining_order_qty})."
        )

    # --------------------------------------------------
    # Rule 4 — Available stock quantity
    # --------------------------------------------------

    available_units = (
        FinishedStockPacket.objects.filter(
            status="IN_STOCK",
            product=sales_line.product
        )
        .aggregate(
            total=Sum("units_in_packet")
        )
        .get("total")
        or 0
    )

    if dispatch_quantity > available_units:
        raise Exception(
            f"Not enough stock available. "
            f"Available units: {available_units}"
        )