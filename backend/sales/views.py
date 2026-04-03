from django.shortcuts import render

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from activity_log.utils import log_activity

from .models import SalesOrder
from .serializers import (
    SalesOrderSerializer,
    SalesOrderCreateUpdateSerializer,
)


class SalesOrderViewSet(viewsets.ModelViewSet):

    queryset = SalesOrder.objects.all().order_by("-id")

    # -----------------------------
    # Serializer Selection
    # -----------------------------
    def get_serializer_class(self):

        if self.action in ["create", "update", "partial_update"]:
            return SalesOrderCreateUpdateSerializer

        return SalesOrderSerializer

    # -----------------------------
    # CREATE LOGGING
    # -----------------------------
    def perform_create(self, serializer):

        order = serializer.save()

        log_activity(
            user=self.request.user,
            action="CREATE",
            module="SalesOrder",
            reference_id=order.id,
            description="Sales order created",
            ip_address=self.request.META.get("REMOTE_ADDR"),
        )

    # -----------------------------
    # STATUS: CONFIRM
    # -----------------------------
    @action(detail=True, methods=["post"])
    def confirm(self, request, pk=None):

        order = self.get_object()

        order.status = "CONFIRMED"
        order.save()

        log_activity(
            user=request.user,
            action="STATUS_CHANGE",
            module="SalesOrder",
            reference_id=order.id,
            description="Sales order confirmed",
            ip_address=request.META.get("REMOTE_ADDR"),
        )

        return Response(
            {"status": "confirmed"},
            status=status.HTTP_200_OK,
        )

    # -----------------------------
    # STATUS: HOLD
    # -----------------------------
    @action(detail=True, methods=["post"])
    def hold(self, request, pk=None):

        order = self.get_object()

        order.status = "ON_HOLD"
        order.save()

        log_activity(
            user=request.user,
            action="STATUS_CHANGE",
            module="SalesOrder",
            reference_id=order.id,
            description="Sales order put on hold",
            ip_address=request.META.get("REMOTE_ADDR"),
        )

        return Response(
            {"status": "on_hold"},
            status=status.HTTP_200_OK,
        )

    # -----------------------------
    # STATUS: CANCEL
    # -----------------------------
    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):

        order = self.get_object()

        order.status = "CANCELLED"
        order.save()

        log_activity(
            user=request.user,
            action="STATUS_CHANGE",
            module="SalesOrder",
            reference_id=order.id,
            description="Sales order cancelled",
            ip_address=request.META.get("REMOTE_ADDR"),
        )

        return Response(
            {"status": "cancelled"},
            status=status.HTTP_200_OK,
        )