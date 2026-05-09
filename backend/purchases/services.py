from rest_framework.exceptions import ValidationError


# --------------------------------------------------
# PURCHASE ORDER VALIDATION
# --------------------------------------------------

def validate_purchase_order(order_data, lines_data):

    if not lines_data:

        raise ValidationError(
            "Purchase order must contain at least one line."
        )

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

    product_ids = []

    for line in lines_data:

        product = line.get("product")

        if not product:

            raise ValidationError(
                "Product is required for each line."
            )

        if product.id in product_ids:

            raise ValidationError(
                "Duplicate product lines are not allowed."
            )

        product_ids.append(product.id)

        quantity = line.get("quantity")

        if quantity is None or quantity <= 0:

            raise ValidationError(
                "Quantity must be greater than zero."
            )

        unit_cost = line.get("unit_cost")

        if unit_cost is None or unit_cost < 0:

            raise ValidationError(
                "Unit cost cannot be negative."
            )


# --------------------------------------------------
# GRN VALIDATION
# --------------------------------------------------

def validate_grn(purchase_line, received_quantity):

    if received_quantity <= 0:

        raise ValidationError(
            "Received quantity must be greater than zero."
        )

    remaining_qty = (
        purchase_line.quantity
        - purchase_line.received_quantity
    )

    if received_quantity > remaining_qty:

        raise ValidationError(
            f"Received quantity exceeds remaining "
            f"quantity ({remaining_qty})."
        )


# --------------------------------------------------
# PURCHASE INVOICE VALIDATION
# --------------------------------------------------

def validate_purchase_invoice(
    purchase_line,
    invoiced_quantity,
):

    if invoiced_quantity <= 0:

        raise ValidationError(
            "Invoice quantity must be greater than zero."
        )

    remaining_qty = (
        purchase_line.received_quantity
        - purchase_line.invoiced_quantity
    )

    if invoiced_quantity > remaining_qty:

        raise ValidationError(
            f"Invoiced quantity exceeds received "
            f"quantity ({remaining_qty})."
        )