from django.shortcuts import render

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import SalesOrder
from .serializers import (
    SalesOrderSerializer,
    SalesOrderCreateUpdateSerializer,
)


class SalesOrderViewSet(viewsets.ModelViewSet):
    queryset = SalesOrder.objects.all().order_by("-id")

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return SalesOrderCreateUpdateSerializer
        return SalesOrderSerializer

    @action(detail=True, methods=["post"])
    def confirm(self, request, pk=None):
        order = self.get_object()
        order.status = "CONFIRMED"
        order.save()
        return Response({"status": "confirmed"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def hold(self, request, pk=None):
        order = self.get_object()
        order.status = "ON_HOLD"
        order.save()
        return Response({"status": "on_hold"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        order = self.get_object()
        order.status = "CANCELLED"
        order.save()
        return Response({"status": "cancelled"}, status=status.HTTP_200_OK)
