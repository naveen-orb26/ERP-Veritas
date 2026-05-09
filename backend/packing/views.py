from django.db import transaction

from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response

from activity_log.utils import log_activity
from core.permissions import IsEmployee

from .models import Inspection, Packet
from .serializers import (
    InspectionSerializer,
    PacketSerializer,
    PackingEntrySerializer
)


class InspectionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsEmployee]
    queryset = Inspection.objects.all().order_by("-id")
    serializer_class = InspectionSerializer


class PacketViewSet(viewsets.ModelViewSet):
    permission_classes = [IsEmployee]
    queryset = Packet.objects.all().order_by("-id")
    serializer_class = PacketSerializer


class PackingEntryView(APIView):
    permission_classes = [IsEmployee]
    def post(self, request):

        serializer = PackingEntrySerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        data = serializer.validated_data

        production = data["production"]
        accepted = data["accepted_quantity"]
        rejected = data.get("rejected_quantity")
        units = data["units_per_packet"]
        packets = data["number_of_packets"]
        allocation = data["allocation_type"]
        sales_line = data.get("sales_order_line")
        remarks = data.get("remarks", "")

        with transaction.atomic():

            # Create Inspection
            inspection = Inspection.objects.create(
                production=production,
                accepted_quantity=accepted,
                rejected_quantity=rejected,
                remarks=remarks
            )

            packet_ids = []

            # Create packets
            for _ in range(packets):

                packet = Packet.objects.create(
                    inspection=inspection,
                    production=production,
                    product=production.product,
                    units_in_packet=units,
                    batch_number=production.batch_number,
                    allocation_type=allocation,
                    sales_order_line_id=sales_line
                )

                packet_ids.append(packet.id)

        # -----------------------------
        # ACTIVITY LOG — ADD HERE
        # -----------------------------

        log_activity(
            user=request.user,
            action="CREATE",
            module="InspectionPacking",
            reference_id=inspection.id,
            description=(
                f"Inspection completed and {packets} packets created "
                f"from production batch {production.batch_number}"
            ),
            ip_address=request.META.get("REMOTE_ADDR"),
        )

        return Response(
            {
                "inspection_id": inspection.id,
                "packets_created": packet_ids
            },
            status=status.HTTP_201_CREATED
        )