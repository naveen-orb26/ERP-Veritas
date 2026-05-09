from datetime import date

from rest_framework.exceptions import ValidationError


def validate_production(
    sales_line,
    production_quantity,
    production_date=None,
    batch_number=None,
):

    # --------------------------------------------------
    # Rule 1 — Quantity must be positive
    # --------------------------------------------------

    if production_quantity <= 0:

        raise ValidationError(
            "Production quantity must be greater than zero."
        )

    # --------------------------------------------------
    # Rule 2 — Order status validation
    # --------------------------------------------------

    order = sales_line.sales_order

    if order.status in ["CANCELLED", "CLOSED"]:

        raise ValidationError(
            "Cannot produce for cancelled or closed orders."
        )

    if order.status not in ["CONFIRMED", "IN_PROGRESS", "PARTIAL"]:

        raise ValidationError(
            "Order must be confirmed before production."
        )

    # --------------------------------------------------
    # Rule 3 — Remaining order quantity
    # --------------------------------------------------

    remaining_order_qty = (
        sales_line.quantity
        - sales_line.produced_quantity
    )

    if production_quantity > remaining_order_qty:

        raise ValidationError(
            f"Production exceeds remaining order quantity "
            f"({remaining_order_qty})."
        )

    # --------------------------------------------------
    # Rule 4 — Future date protection
    # --------------------------------------------------

    if production_date:

        if production_date > date.today():

            raise ValidationError(
                "Production date cannot be in the future."
            )