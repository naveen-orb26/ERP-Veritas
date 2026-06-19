from rest_framework import serializers

from .models import (
    Dispatch,
    DispatchPacket,
)

from packing.models import Packet


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

    class Meta:

        model = DispatchPacket

        fields = [
            "id",
            "packet",
            "packet_number",
            "quantity",
        ]


class DispatchSerializer(
    serializers.ModelSerializer
):

    packet_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True
    )

    packets = DispatchPacketSerializer(
        many=True,
        read_only=True
    )

    quantity_dispatched = serializers.IntegerField(
        read_only=True
    )

    class Meta:

        model = Dispatch

        fields = [
            "id",

            "sales_order_line",

            "packet_ids",

            "packets",

            "quantity_dispatched",

            "awb_number",

            "transporter",

            "dispatch_date",

            "remarks",

            "created_at",
        ]

        read_only_fields = [
            "created_at",
            "quantity_dispatched",
            "packets",
        ]

    def validate_packet_ids(
        self,
        value
    ):

        packets = Packet.objects.filter(
            id__in=value
        )

        if packets.count() != len(value):

            raise serializers.ValidationError(
                "One or more packets do not exist."
            )

        invalid = packets.exclude(
            status="AVAILABLE"
        )

        if invalid.exists():

            raise serializers.ValidationError(
                "Some packets are already dispatched."
            )

        return value

    def create(
        self,
        validated_data
    ):

        packet_ids = validated_data.pop(
            "packet_ids"
        )

        dispatch = Dispatch.objects.create(
            **validated_data
        )

        packets = Packet.objects.filter(
            id__in=packet_ids
        )

        for packet in packets:

            DispatchPacket.objects.create(
                dispatch=dispatch,
                packet=packet
            )

        return dispatch