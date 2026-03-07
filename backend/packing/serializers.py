from django.db.models import Sum
from rest_framework import serializers

from .models import Inspection, Packet
from production.models import Production


class InspectionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Inspection
        fields = [
            "id",
            "production",
            "accepted_quantity",
            "rejected_quantity",
            "inspection_date",
            "remarks",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]

    def validate_accepted_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Accepted quantity must be greater than zero."
            )
        return value


class PacketSerializer(serializers.ModelSerializer):

    class Meta:
        model = Packet
        fields = [
            "id",
            "inspection",
            "production",
            "product",
            "units_in_packet",
            "manufacture_date",
            "batch_number",
            "allocation_type",
            "sales_order_line",
            "remarks",
            "created_at",
        ]
        read_only_fields = ["created_at"]


class PackingEntrySerializer(serializers.Serializer):

    production = serializers.PrimaryKeyRelatedField(
        queryset=Production.objects.all()
    )

    accepted_quantity = serializers.IntegerField()
    rejected_quantity = serializers.IntegerField(required=False)

    units_per_packet = serializers.IntegerField()
    number_of_packets = serializers.IntegerField()

    allocation_type = serializers.CharField()
    sales_order_line = serializers.IntegerField(required=False)

    remarks = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):

        production = data["production"]
        accepted = data["accepted_quantity"]
        units = data["units_per_packet"]
        packets = data["number_of_packets"]

        if units * packets != accepted:
            raise serializers.ValidationError(
                "accepted_quantity must equal units_per_packet × number_of_packets"
            )

        inspected_so_far = (
            production.inspections.aggregate(total=Sum("accepted_quantity"))["total"] or 0
        )

        if inspected_so_far + accepted > production.planned_quantity:
            raise serializers.ValidationError(
                "Inspection exceeds planned production quantity."
            )

        return data