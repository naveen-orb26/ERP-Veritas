from rest_framework import viewsets

from core.permissions import IsEmployee

from .models import (
    Inspection,
    Packet,
)

from .serializers import (
    InspectionSerializer,
    PacketSerializer,
)

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
        )

        .order_by("-id")
    )

    @action(
        detail=False,
        methods=["get"],
        url_path="by-batch"
    )
    def by_batch(
        self,
        request
    ):

        batch_id = request.GET.get(
            "batch"
        )

        inspection = (

            Inspection.objects

            .filter(
                batch_id=batch_id
            )

            .order_by("-id")

            .first()
        )

        if not inspection:

            return Response(
                {
                    "detail":
                    "Inspection not found."
                },
                status=404
            )

        serializer = (
            self.get_serializer(
                inspection
            )
        )

        return Response(
            serializer.data
        )

    serializer_class = (
        InspectionSerializer
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

        units_per_packet = int(
            request.data.get(
                "units_per_packet",
                0
            )
        )

        if units_per_packet <= 0:

            return Response(

                {
                    "detail":
                    "Units per packet must be greater than zero."
                },

                status=status.HTTP_400_BAD_REQUEST
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

        while remaining > 0:

            qty = min(

                units_per_packet,

                remaining
            )

            packet = Packet.objects.create(

                inspection=inspection,

                units_in_packet=qty
            )

            packets_created.append(
                packet.id
            )

            remaining -= qty

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