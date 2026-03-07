from rest_framework import serializers
from .models import FinishedStockPacket, FinishedStockMovement


class FinishedStockPacketSerializer(serializers.ModelSerializer):

    class Meta:
        model = FinishedStockPacket
        fields = [
            "id",
            "packet",
            "product",
            "units_in_packet",
            "added_to_stock_date",
            "status",
        ]
        def validate_packet(self, value):

            if value.status != "AVAILABLE":
                raise serializers.ValidationError(
                    "Packet already used in stock or dispatch."
                )

            return value


class FinishedStockMovementSerializer(serializers.ModelSerializer):

    class Meta:
        model = FinishedStockMovement
        fields = [
            "id",
            "product",
            "movement_type",
            "quantity",
            "date",
            "reference_id",
            "remarks",
        ]