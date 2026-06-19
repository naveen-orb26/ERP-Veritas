from rest_framework import serializers

from .models import (
    Inspection,
    Packet,
)


class InspectionSerializer(
    serializers.ModelSerializer
):

    total_inspected = serializers.IntegerField(
        read_only=True
    )

    product_name = serializers.CharField(
        source=(
            "batch.production.product.product_name"
        ),
        read_only=True
    )

    job_card_number = serializers.CharField(
        source=(
            "batch.production.job_card_number"
        ),
        read_only=True
    )

    batch_number = serializers.CharField(
        source="batch.batch_number",
        read_only=True
    )

    customer_name = serializers.SerializerMethodField()

    class Meta:

        model = Inspection

        fields = "__all__"

        read_only_fields = [

            "created_at",

            "updated_at",
        ]

    def get_customer_name(
        self,
        obj
    ):

        request = (
            obj.batch
            .production
            .production_request
        )

        sales_line = getattr(
            request,
            "sales_order_line",
            None
        )

        if sales_line:

            return str(
                sales_line
                .sales_order
                .customer
            )

        return None


class PacketSerializer(
    serializers.ModelSerializer
):

    product_name = serializers.CharField(
        source="product.product_name",
        read_only=True
    )

    customer_name = serializers.SerializerMethodField()

    sales_order_number = (
        serializers.SerializerMethodField()
    )

    job_card_number = serializers.CharField(
        source="production.job_card_number",
        read_only=True
    )

    batch_number = serializers.CharField(
        source=(
            "inspection.batch.batch_number"
        ),
        read_only=True
    )

    label_data = serializers.ReadOnlyField()

    class Meta:

        model = Packet

        fields = "__all__"

        read_only_fields = [

            "packet_number",

            "allocation_type",

            "sales_order_line",

            "created_at",
        ]

    def get_customer_name(
        self,
        obj
    ):

        customer = obj.customer

        return (
            str(customer)
            if customer
            else None
        )

    def get_sales_order_number(
        self,
        obj
    ):

        order = obj.sales_order

        return (
            order.order_number
            if order
            else None
        )