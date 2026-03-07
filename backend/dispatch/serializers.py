from rest_framework import serializers
from .models import Dispatch


class DispatchSerializer(serializers.ModelSerializer):

    class Meta:
        model = Dispatch
        fields = [
            "id",
            "sales_order_line",
            "quantity_dispatched",
            "awb_number",
            "transporter",
            "dispatch_date",
            "remarks",
            "created_at",
        ]
        read_only_fields = ["created_at"]

    def validate_quantity_dispatched(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Dispatched quantity must be greater than zero."
            )
        return value
    def validate(self, data):

        sales_line = data["sales_order_line"]
        qty = data["quantity_dispatched"]

        pending = sales_line.quantity - sales_line.fulfilled_quantity

        if qty > pending:
            raise serializers.ValidationError(
                "Dispatch quantity exceeds pending order quantity."
            )

        return data