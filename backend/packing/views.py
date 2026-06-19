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