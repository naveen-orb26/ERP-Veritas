from django.db import transaction

from rest_framework import viewsets

from activity_log.utils import log_activity

from .models import Dispatch
from .serializers import DispatchSerializer
from finished_stock.models import FinishedStockPacket


class DispatchViewSet(viewsets.ModelViewSet):

    queryset = Dispatch.objects.all().order_by("-id")
    serializer_class = DispatchSerializer

    def perform_create(self, serializer):

        with transaction.atomic():

            dispatch = serializer.save()

            sales_line = dispatch.sales_order_line
            qty = dispatch.quantity_dispatched

            # Update fulfilled quantity
            sales_line.fulfilled_quantity += qty
            sales_line.save(update_fields=["fulfilled_quantity"])

            # Update order status
            order = sales_line.sales_order
            order.update_status_based_on_fulfillment()

            # Consume packets from stock
            packets = FinishedStockPacket.objects.filter(
                status="IN_STOCK",
                product=sales_line.product
            ).order_by("id")

            remaining = qty

            for stock in packets:

                if remaining <= 0:
                    break

                packet_units = stock.units_in_packet

                if packet_units <= remaining:

                    stock.status = "CONSUMED"
                    stock.save(update_fields=["status"])

                    packet = stock.packet
                    packet.status = "DISPATCHED"
                    packet.save(update_fields=["status"])

                    remaining -= packet_units

            if remaining > 0:
                raise Exception(
                    "Not enough stock packets available for dispatch."
                )

            # -----------------------------
            # ACTIVITY LOG
            # -----------------------------

            log_activity(
                user=self.request.user,
                action="CREATE",
                module="Dispatch",
                reference_id=dispatch.id,
                description=(
                    f"Dispatched {qty} units for "
                    f"SalesOrderLine {sales_line.id}"
                ),
                ip_address=self.request.META.get("REMOTE_ADDR"),
            )