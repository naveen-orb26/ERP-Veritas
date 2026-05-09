from django.db import transaction

from rest_framework import viewsets
from rest_framework.exceptions import ValidationError

from activity_log.utils import log_activity
from core.permissions import IsEmployee

from .models import Dispatch
from .serializers import DispatchSerializer
from finished_stock.models import FinishedStockPacket

from .services import validate_dispatch

from inventory.services import validate_finished_stock


class DispatchViewSet(viewsets.ModelViewSet):

    permission_classes = [IsEmployee]

    queryset = Dispatch.objects.all().order_by("-id")

    serializer_class = DispatchSerializer


    def perform_create(self, serializer):

        with transaction.atomic():

            # --------------------------------------------------
            # Extract data BEFORE saving
            # --------------------------------------------------

            sales_line = serializer.validated_data.get(
                "sales_order_line"
            )

            qty = serializer.validated_data.get(
                "quantity_dispatched"
            )

            if not sales_line:
                raise ValidationError(
                    "Sales order line is required."
                )

            if qty is None:
                raise ValidationError(
                    "Dispatch quantity is required."
                )

            # --------------------------------------------------
            # VALIDATION — Business Rules
            # --------------------------------------------------

            validate_dispatch(
                sales_line=sales_line,
                dispatch_quantity=qty
            )
            validate_finished_stock(
                product=sales_line.product,
                required_quantity=qty,
            )
            # --------------------------------------------------
            # Save dispatch AFTER validation
            # --------------------------------------------------

            dispatch = serializer.save()

            # --------------------------------------------------
            # Update fulfilled quantity
            # --------------------------------------------------

            sales_line.fulfilled_quantity += qty

            sales_line.save(
                update_fields=["fulfilled_quantity"]
            )

            # --------------------------------------------------
            # Update order status
            # --------------------------------------------------

            order = sales_line.sales_order

            order.update_status_based_on_fulfillment()

            # --------------------------------------------------
            # Consume packets from stock
            # --------------------------------------------------

            packets = (
                FinishedStockPacket.objects.filter(
                    status="IN_STOCK",
                    product=sales_line.product
                )
                .order_by("id")
            )

            remaining = qty

            for stock in packets:

                if remaining <= 0:
                    break

                packet_units = stock.units_in_packet

                if packet_units <= remaining:

                    stock.status = "CONSUMED"

                    stock.save(
                        update_fields=["status"]
                    )

                    packet = stock.packet

                    packet.status = "DISPATCHED"

                    packet.save(
                        update_fields=["status"]
                    )

                    remaining -= packet_units

            # --------------------------------------------------
            # Final safety check
            # --------------------------------------------------

            if remaining > 0:

                raise ValidationError(
                    "Not enough stock packets available "
                    "for dispatch."
                )

            # --------------------------------------------------
            # ACTIVITY LOG — only after success
            # --------------------------------------------------

            log_activity(
                user=self.request.user,
                action="CREATE",
                module="Dispatch",
                reference_id=dispatch.id,
                description=(
                    f"Dispatched {qty} units for "
                    f"SalesOrderLine {sales_line.id}"
                ),
                ip_address=self.request.META.get(
                    "REMOTE_ADDR"
                ),
            )