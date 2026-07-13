from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction

from core.permissions import IsEmployee

from .models import (
    Inspection,
    Packet,
)

from .serializers import (
    PacketSerializer,
    InspectionCreateSerializer,
    InspectionDetailSerializer,
    InspectionListSerializer,
)


class InspectionViewSet(
    viewsets.ModelViewSet
):

    permission_classes = [
        IsEmployee
    ]

    queryset = (

        Inspection.objects

        .select_related(

            "batch",

            "batch__production",

            "batch__production__product",

            "batch__production__production_request",

            "batch__production__production_request__sales_order_line",

            "batch__production__production_request__sales_order_line__sales_order",

            "batch__production__production_request__sales_order_line__sales_order__customer",

            "inspected_by",

        )

        .prefetch_related(
            "packets",
        )

        .order_by("-created_at")

    )

    def get_serializer_class(self):

        if self.action == "list":

            return InspectionListSerializer

        elif self.action == "retrieve":

            return InspectionDetailSerializer

        return InspectionCreateSerializer


    @action(
        detail=False,
        methods=["get"],
        url_path="by-batch"
    )
    @action(
        detail=False,
        methods=["get"],
        url_path="by-batch",
    )
    def by_batch(
        self,
        request,
    ):

        batch_id = request.GET.get("batch")

        try:

            inspection = Inspection.objects.get(
                batch_id=batch_id
            )

        except Inspection.DoesNotExist:

            return Response(
                {
                    "detail": "Inspection not found."
                },
                status=404,
            )

        serializer = self.get_serializer(
            inspection
        )

        return Response(
            serializer.data
        )

class PacketViewSet(
    viewsets.ModelViewSet
):

    permission_classes = [
        IsEmployee
    ]

    queryset = (

        Packet.objects

        .select_related(

            "inspection",

            "inspection__batch",

            "inspection__batch__production",

            "inspection__batch__production__product",

            "inspection__batch__production__production_request",

            "sales_order_line",

            "sales_order_line__sales_order",

            "sales_order_line__sales_order__customer",
        )

        .order_by("-id")
    )

    serializer_class = (
        PacketSerializer
    )

    @action(
        detail=False,
        methods=["post"],
        url_path="generate"
    )
    @transaction.atomic
    def generate_packets(
        self,
        request
    ):

        inspection_id = request.data.get(
            "inspection"
        )

        product = inspection.product

        units_per_packet = request.data.get(
            "units_per_packet"
        )

        if units_per_packet:

            units_per_packet = int(
                units_per_packet
            )

        else:

            units_per_packet = (
                product.default_units_per_packet
            )

        if units_per_packet <= 0:

            return Response(

                {
                    "detail":
                        "Default units per packet is not configured."
                },

                status=status.HTTP_400_BAD_REQUEST,

            )

        try:

            inspection = (
                Inspection.objects.get(
                    id=inspection_id
                )
            )

        except Inspection.DoesNotExist:

            return Response(

                {
                    "detail":
                    "Inspection not found."
                },

                status=status.HTTP_404_NOT_FOUND
            )

        remaining = (
            inspection.remaining_to_pack
        )

        if remaining <= 0:

            return Response(

                {
                    "detail":
                    "This inspection has already been fully packed."
                },

                status=status.HTTP_400_BAD_REQUEST
            )

        packets_created = []

        sequence = 1

        while remaining > 0:

            qty = min(
                units_per_packet,
                remaining,
            )

            packet = Packet.objects.create(

                inspection=inspection,

                units_in_packet=qty,

                is_partial_packet=(
                    qty < units_per_packet
                ),

            )

            packets_created.append(
                packet.id
            )

            remaining -= qty

            sequence += 1

        return Response(

            {

                "packets_created":
                    len(
                        packets_created
                    ),

                "packet_ids":
                    packets_created,

                "total_quantity":
                    inspection.packed_quantity,
            },

            status=status.HTTP_201_CREATED
        )