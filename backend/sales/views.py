from django.db import transaction

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from activity_log.utils import log_activity
from core.permissions import IsEmployee

from .models import SalesOrder
from .serializers import (
    SalesOrderSerializer,
    SalesOrderCreateUpdateSerializer,
)

from .services import validate_sales_order

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status


class SalesOrderViewSet(viewsets.ModelViewSet):

    permission_classes = [IsEmployee]

    queryset = SalesOrder.objects.all().order_by("-id")

    def get_serializer_class(self):

        if self.action in [
            "create",
            "update",
            "partial_update",
        ]:
            return SalesOrderCreateUpdateSerializer

        return SalesOrderSerializer


    # --------------------------------------------------
    # CREATE ORDER
    # --------------------------------------------------

    def perform_create(self, serializer):

        with transaction.atomic():

            lines_data = serializer.validated_data.get(
                "lines"
            )

            validate_sales_order(
                order_data=serializer.validated_data,
                lines_data=lines_data,
            )

            order = serializer.save()

            log_activity(
                user=self.request.user,
                action="CREATE",
                module="SalesOrder",
                reference_id=order.id,
                description="Sales order created",
                ip_address=self.request.META.get(
                    "REMOTE_ADDR"
                ),
            )


    # --------------------------------------------------
    # UPDATE ORDER
    # --------------------------------------------------

    def perform_update(self, serializer):

        with transaction.atomic():

            lines_data = serializer.validated_data.get(
                "lines",
                []
            )

            validate_sales_order(
                order_data=serializer.validated_data,
                lines_data=lines_data,
            )

            order = serializer.save()

            log_activity(
                user=self.request.user,
                action="UPDATE",
                module="SalesOrder",
                reference_id=order.id,
                description="Sales order updated",
                ip_address=self.request.META.get(
                    "REMOTE_ADDR"
                ),
            )


    # --------------------------------------------------
    # STATUS ACTIONS
    # --------------------------------------------------

    @action(detail=True, methods=["post"])
    def confirm(self, request, pk=None):

        order = self.get_object()

        if order.status != "DRAFT":

            raise ValidationError(
                "Only draft orders can be confirmed."
            )

        order.status = "CONFIRMED"

        order.save()

        log_activity(
            user=request.user,
            action="STATUS_CHANGE",
            module="SalesOrder",
            reference_id=order.id,
            description="Order confirmed",
            ip_address=request.META.get(
                "REMOTE_ADDR"
            ),
        )

        return Response(
            {"status": "confirmed"},
            status=status.HTTP_200_OK,
        )


    @action(detail=True, methods=["post"])
    def hold(self, request, pk=None):

        order = self.get_object()

        if order.status not in [
            "CONFIRMED",
            "IN_PROGRESS",
        ]:

            raise ValidationError(
                "Only active orders can be placed on hold."
            )

        order.status = "ON_HOLD"

        order.save()

        log_activity(
            user=request.user,
            action="STATUS_CHANGE",
            module="SalesOrder",
            reference_id=order.id,
            description="Order placed on hold",
            ip_address=request.META.get(
                "REMOTE_ADDR"
            ),
        )

        return Response(
            {"status": "on_hold"},
            status=status.HTTP_200_OK,
        )

    @action(
    detail=True,
    methods=["post"]
    )
    def resume(
        self,
        request,
        pk=None
    ):

        order = self.get_object()

        order.status = "DRAFT"

        order.save()

        return Response(
            {
                "message":
                "Sales order resumed"
            },
            status=status.HTTP_200_OK
        )


    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):

        order = self.get_object()

        if order.status == "CLOSED":

            raise ValidationError(
                "Closed orders cannot be cancelled."
            )

        order.status = "CANCELLED"

        order.save()

        log_activity(
            user=request.user,
            action="STATUS_CHANGE",
            module="SalesOrder",
            reference_id=order.id,
            description="Order cancelled",
            ip_address=request.META.get(
                "REMOTE_ADDR"
            ),
        )

        return Response(
            {"status": "cancelled"},
            status=status.HTTP_200_OK,
        )
    


    @action(
        detail=True,
        methods=["post"]
    )
    def confirm(
        self,
        request,
        pk=None
    ):

        order = self.get_object()

        order.status = "CONFIRMED"

        order.save()

        return Response(
            {
                "message":
                "Sales order confirmed"
            },
            status=status.HTTP_200_OK
        )
    

    @action(
    detail=True,
    methods=["post"]
    )
    def hold(
        self,
        request,
        pk=None
    ):

        order = self.get_object()

        order.status = "HOLD"

        order.save()

        return Response(
            {
                "message":
                "Sales order placed on hold"
            },
            status=status.HTTP_200_OK
        )
    

    @action(
        detail=True,
        methods=["post"]
    )
    def cancel(
        self,
        request,
        pk=None
    ):

        order = self.get_object()

        order.status = "CANCELLED"

        order.save()

        return Response(
            {
                "message":
                "Sales order cancelled"
            },
            status=status.HTTP_200_OK
        )