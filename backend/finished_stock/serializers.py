from rest_framework import serializers

from .models import (
    FinishedStockPacket,
    FinishedStockMovement
)

from packing.models import Packet


class FinishedStockPacketSerializer(
    serializers.ModelSerializer
):

    packet_number = serializers.CharField(
        source="packet.packet_number",
        read_only=True
    )

    product_name = serializers.CharField(
        source="packet.product.product_name",
        read_only=True
    )

    customer_name = serializers.SerializerMethodField()

    quantity = serializers.IntegerField(
        source="packet.units_in_packet",
        read_only=True
    )

    class Meta:

        model = FinishedStockPacket

        fields = [
            "id",

            "packet",

            "packet_number",

            "product_name",

            "customer_name",

            "quantity",

            "added_to_stock_date",

            "status",
        ]

        read_only_fields = fields

    def get_customer_name(
        self,
        obj
    ):

        customer = obj.packet.customer

        return (
            str(customer)
            if customer
            else None
        )
    
class FinishedStockMovementSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = FinishedStockMovement

        fields = "__all__"