from decimal import Decimal
from datetime import date

from rest_framework.exceptions import ValidationError


def validate_payment(invoice, payment_amount, payment_date=None):

    # --------------------------------------------------
    # Rule 1 — Amount must be positive
    # --------------------------------------------------

    if payment_amount <= 0:

        raise ValidationError(
            "Payment amount must be greater than zero."
        )

    # --------------------------------------------------
    # Rule 2 — Invoice status validation
    # --------------------------------------------------

    if invoice.status in ["CANCELLED"]:

        raise ValidationError(
            "Cannot record payment for cancelled invoice."
        )

    # --------------------------------------------------
    # Rule 3 — Remaining balance check
    # --------------------------------------------------

    remaining_balance = (
        invoice.total_amount
        - invoice.amount_paid
    )

    if payment_amount > remaining_balance:

        raise ValidationError(
            f"Payment exceeds remaining balance "
            f"({remaining_balance})."
        )

    # --------------------------------------------------
    # Rule 4 — Fully paid protection
    # --------------------------------------------------

    if remaining_balance == Decimal("0"):

        raise ValidationError(
            "Invoice is already fully paid."
        )

    # --------------------------------------------------
    # Rule 5 — Future date protection
    # --------------------------------------------------

    if payment_date:

        if payment_date > date.today():

            raise ValidationError(
                "Payment date cannot be in the future."
            )