from rest_framework import serializers
from .models import SalesOrder, SalesOrderLine


class SalesOrderLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesOrderLine
        fields = [
            "id",
            "product",
            "sr_number",
            "quantity",
            "unit_price",
            "line_total",
            "remarks",
        ]


class SalesOrderSerializer(serializers.ModelSerializer):
    lines = SalesOrderLineSerializer(many=True, read_only=True)

    class Meta:
        model = SalesOrder
        fields = [
            "id",
            "customer",
            "customer_po_id",
            "order_date",
            "expected_delivery_date",
            "priority_flag",
            "status",
            "subtotal_amount",
            "tax_amount",
            "total_amount",
            "remarks",
            "lines",
            "created_at",
            "updated_at",
        ]


class SalesOrderCreateUpdateSerializer(serializers.ModelSerializer):
    lines = SalesOrderLineSerializer(many=True)

    class Meta:
        model = SalesOrder
        fields = [
            "customer",
            "customer_po_id",
            "order_date",
            "expected_delivery_date",
            "priority_flag",
            "status",
            "subtotal_amount",
            "tax_amount",
            "total_amount",
            "remarks",
            "lines",
        ]

    def create(self, validated_data):
        lines_data = validated_data.pop("lines")
        order = SalesOrder.objects.create(**validated_data)

        for line in lines_data:
            SalesOrderLine.objects.create(
                sales_order=order,
                **line
            )
        return order

    def update(self, instance, validated_data):
        lines_data = validated_data.pop("lines", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if lines_data is not None:
            instance.lines.all().delete()
            for line in lines_data:
                SalesOrderLine.objects.create(
                    sales_order=instance,
                    **line
                )
        return instance
