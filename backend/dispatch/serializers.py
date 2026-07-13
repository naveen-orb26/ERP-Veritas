from rest_framework import serializers

from .models import (
    Dispatch,
    DispatchItem,
    DispatchPacket,
)


class DispatchPacketSerializer(
    serializers.ModelSerializer
):

    packet_number = serializers.CharField(
        source="packet.packet_number",
        read_only=True
    )

    quantity = serializers.IntegerField(
        source="packet.units_in_packet",
        read_only=True
    )

    batch_number = serializers.CharField(
        source="packet.inspection.batch.batch_number",
        read_only=True
    )

    class Meta:

        model = DispatchPacket

        fields = [

            "id",

            "packet",

            "packet_number",

            "batch_number",

            "quantity",
        ]


class DispatchItemSerializer(
    serializers.ModelSerializer
):

    product_name = serializers.CharField(
        source="sales_order_line.product.product_name",
        read_only=True
    )

    sr_number = serializers.CharField(
        source="sales_order_line.sr_number",
        read_only=True
    )

    ordered_quantity = serializers.IntegerField(
        source="sales_order_line.quantity",
        read_only=True
    )

    packed_quantity = serializers.IntegerField(
        source="sales_order_line.packed_quantity",
        read_only=True
    )

    already_dispatched = serializers.IntegerField(
        source="sales_order_line.dispatched_quantity",
        read_only=True
    )

    remaining_to_dispatch = serializers.IntegerField(
        source="sales_order_line.remaining_to_dispatch",
        read_only=True
    )

    allocated_quantity = serializers.IntegerField(
        read_only=True
    )

    packets = DispatchPacketSerializer(
        many=True,
        read_only=True
    )

    class Meta:

        model = DispatchItem

        fields = "__all__"

        read_only_fields = [

            "dispatch",

            "allocated_quantity",

            "packets",

            "product_name",

            "sr_number",

            "ordered_quantity",

            "packed_quantity",

            "already_dispatched",

            "remaining_to_dispatch",
        ]

class DispatchSerializer(
    serializers.ModelSerializer
):

    sales_order_number = serializers.CharField(
        source="sales_order.order_number",
        read_only=True
    )

    customer_name = serializers.SerializerMethodField()

    total_quantity = serializers.IntegerField(
        read_only=True
    )

    items = DispatchItemSerializer(
        many=True
    )

    class Meta:

        model = Dispatch

        fields = "__all__"

        read_only_fields = [

            "dispatch_number",

            "created_at",

            "total_quantity",
        ]

    def get_customer_name(
        self,
        obj
    ):

        return str(
            obj.sales_order.customer
        )

    def create(
        self,
        validated_data
    ):

        items = validated_data.pop(
            "items",
            []
        )

        dispatch = Dispatch.objects.create(
            **validated_data
        )

        for item in items:

            DispatchItem.objects.create(

                dispatch=dispatch,

                **item
            )

        return dispatch