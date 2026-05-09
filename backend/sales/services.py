from rest_framework.exceptions import ValidationError


def validate_sales_order(order_data, lines_data):

    # --------------------------------------------------
    # Rule 1 — At least one line required
    # --------------------------------------------------

    if not lines_data:

        raise ValidationError(
            "Sales order must contain at least one line."
        )

    # --------------------------------------------------
    # Rule 2 — Delivery date validation
    # --------------------------------------------------

    order_date = order_data.get("order_date")

    expected_delivery_date = order_data.get(
        "expected_delivery_date"
    )

    if (
        expected_delivery_date
        and order_date
        and expected_delivery_date < order_date
    ):

        raise ValidationError(
            "Expected delivery date cannot be earlier "
            "than order date."
        )

    # --------------------------------------------------
    # Rule 3 — Duplicate product prevention
    # --------------------------------------------------

    product_ids = []

    for line in lines_data:

        product = line.get("product")

        if not product:

            raise ValidationError(
                "Product is required for each line."
            )

        if product.id in product_ids:

            raise ValidationError(
                "Duplicate product lines are not allowed "
                "in the same order."
            )

        product_ids.append(product.id)

    # --------------------------------------------------
    # Rule 4 — Quantity validation
    # --------------------------------------------------

    for line in lines_data:

        quantity = line.get("quantity")

        if quantity is None or quantity <= 0:

            raise ValidationError(
                "Line quantity must be greater than zero."
            )

    # --------------------------------------------------
    # Rule 5 — Price validation
    # --------------------------------------------------

    for line in lines_data:

        unit_price = line.get("unit_price")

        if unit_price is None or unit_price < 0:

            raise ValidationError(
                "Unit price cannot be negative."
            )