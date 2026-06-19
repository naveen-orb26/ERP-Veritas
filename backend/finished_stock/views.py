from rest_framework import viewsets

from core.permissions import IsEmployee

from .models import (
    FinishedStockPacket,
    FinishedStockMovement,
)

from .serializers import (
    FinishedStockPacketSerializer,
    FinishedStockMovementSerializer,
)


class FinishedStockPacketViewSet(
    viewsets.ReadOnlyModelViewSet
):

    permission_classes = [IsEmployee]

    queryset = (
        FinishedStockPacket.objects
        .select_related(
            "packet",
            "packet__inspection",
            "packet__inspection__batch",
            "packet__inspection__batch__production",
        )
        .order_by("-id")
    )

    serializer_class = (
        FinishedStockPacketSerializer
    )


class FinishedStockMovementViewSet(
    viewsets.ReadOnlyModelViewSet
):

    permission_classes = [IsEmployee]

    queryset = (
        FinishedStockMovement.objects
        .select_related("product")
        .order_by("-id")
    )

    serializer_class = (
        FinishedStockMovementSerializer
    )