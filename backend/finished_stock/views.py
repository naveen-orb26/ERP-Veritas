from django.shortcuts import render

from rest_framework import viewsets
from .models import FinishedStockPacket, FinishedStockMovement
from .serializers import (
    FinishedStockPacketSerializer,
    FinishedStockMovementSerializer
)


class FinishedStockPacketViewSet(viewsets.ModelViewSet):

    queryset = FinishedStockPacket.objects.all().order_by("-id")
    serializer_class = FinishedStockPacketSerializer

    def perform_create(self, serializer):

        stock_entry = serializer.save()

        packet = stock_entry.packet
        packet.status = "IN_STOCK"
        packet.save(update_fields=["status"])


class FinishedStockMovementViewSet(viewsets.ModelViewSet):

    queryset = FinishedStockMovement.objects.all().order_by("-id")
    serializer_class = FinishedStockMovementSerializer