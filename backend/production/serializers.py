from rest_framework import serializers
from .models import Production


class ProductionSerializer(serializers.ModelSerializer):

    produced_quantity = serializers.IntegerField(read_only=True)
    total_rejected = serializers.IntegerField(read_only=True)

    class Meta:
        model = Production
        fields = [
            "id",
            "sales_order_line",
            "product",
            "batch_number",
            "planned_quantity",
            "produced_quantity",
            "total_rejected",
            "production_date",
            "created_by",
            "remarks",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "batch_number",
            "produced_quantity",
            "total_rejected",
            "created_at",
            "updated_at",
        ]

    def validate_planned_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Planned quantity must be greater than zero."
            )
        return value

    def validate(self, data):
        sales_order_line = data.get("sales_order_line")
        product = data.get("product")

        # If sales_order_line is provided, product must match
        if sales_order_line and product:
            if sales_order_line.product != product:
                raise serializers.ValidationError(
                    "Product must match the Sales Order Line product."
                )

        return data