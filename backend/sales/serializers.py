from rest_framework import serializers

from .models import (
    SalesOrder,
    SalesOrderLine,
)


# =========================================================
# READ SERIALIZER — SalesOrderLine
# Used when returning data to client
# =========================================================

class SalesOrderLineSerializer(serializers.ModelSerializer):

    sr_number = serializers.CharField(
        source="product.sr_number",
        read_only=True
    )

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

        read_only_fields = [
            "id",
            "sr_number",
            "line_total",
        ]


# =========================================================
# WRITE SERIALIZER — SalesOrderLine
# Used for create/update operations
# =========================================================

class SalesOrderLineCreateUpdateSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = SalesOrderLine

        fields = [
            "product",
            "quantity",
            "unit_price",
            "remarks",
        ]


# =========================================================
# READ SERIALIZER — SalesOrder
# =========================================================

class SalesOrderSerializer(serializers.ModelSerializer):

    lines = SalesOrderLineSerializer(
        many=True,
        read_only=True
    )

    order_number = serializers.SerializerMethodField()

    customer_name = serializers.CharField(
        source="customer.name",
        read_only=True
    )

    class Meta:

        model = SalesOrder

        fields = [
            "id",
            "order_number",
            "customer_name",
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

    def get_order_number(self, obj):

        return f"SO-{obj.id:05d}"


# =========================================================
# WRITE SERIALIZER — SalesOrder
# =========================================================

class SalesOrderCreateUpdateSerializer(
    serializers.ModelSerializer
):

    lines = SalesOrderLineCreateUpdateSerializer(
        many=True
    )

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

    # -----------------------------------------------------
    # CREATE
    # -----------------------------------------------------

    def create(self, validated_data):

        lines_data = validated_data.pop("lines")

        order = SalesOrder.objects.create(
            **validated_data
        )

        for line in lines_data:

            SalesOrderLine.objects.create(
                sales_order=order,
                **line
            )

        return order

    # -----------------------------------------------------
    # UPDATE
    # -----------------------------------------------------

    def update(
        self,
        instance,
        validated_data
    ):

        lines_data = validated_data.pop(
            "lines",
            None
        )

        # Update order fields

        for attr, value in validated_data.items():

            setattr(
                instance,
                attr,
                value
            )

        instance.save()

        # Replace lines if provided

        if lines_data is not None:

            instance.lines.all().delete()

            for line in lines_data:

                SalesOrderLine.objects.create(
                    sales_order=instance,
                    **line
                )

        return instance