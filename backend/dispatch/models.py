from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError

from sales.models import SalesOrderLine


class Dispatch(models.Model):

    sales_order_line = models.ForeignKey(
        SalesOrderLine,
        on_delete=models.PROTECT,
        related_name="dispatches"
    )

    awb_number = models.CharField(
        max_length=100,
        blank=True
    )

    transporter = models.CharField(
        max_length=100,
        blank=True
    )

    dispatch_date = models.DateField(
        default=timezone.now
    )

    remarks = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    @property
    def quantity_dispatched(self):

        return sum(
            self.packets.values_list(
                "packet__units_in_packet",
                flat=True
            )
        )
    
    @property
    def label_data(self):

        return {
            "packet_number": self.packet_number,

            "customer": (
                self.customer.name
                if self.customer
                else ""
            ),

            "sales_order": (
                self.sales_order.order_number
                if self.sales_order
                else ""
            ),

            "sr_number": (
                self.sales_order_line.sr_number
                if self.sales_order_line
                else ""
            ),

            "product": str(self.product),

            "quantity": self.units_in_packet,

            "manufacture_date": self.manufacture_date,

            "awb_number": (
                self.dispatch_entries
                .order_by("-id")
                .first()
                .dispatch
                .awb_number
                if self.dispatch_entries.exists()
                else ""
            ),
        }
    
    def __str__(self):
        return f"Dispatch-{self.id}"



class DispatchPacket(models.Model):

    dispatch = models.ForeignKey(
        Dispatch,
        on_delete=models.CASCADE,
        related_name="packets"
    )

    packet = models.ForeignKey(
        "packing.Packet",
        on_delete=models.PROTECT,
        related_name="dispatch_entries"
    )

    class Meta:

        unique_together = [
            ("dispatch", "packet")
        ]

    def clean(self):

        if self.packet.status == "DISPATCHED":

            raise ValidationError(
                "Packet has already been dispatched."
            )

    def save(self, *args, **kwargs):

        self.full_clean()

        super().save(*args, **kwargs)

        from packing.models import Packet
        from finished_stock.models import (
            FinishedStockPacket
        )

        Packet.objects.filter(
            pk=self.packet_id
        ).update(
            status="DISPATCHED"
        )

        FinishedStockPacket.objects.filter(
            packet_id=self.packet_id
        ).update(
            status="CONSUMED"
        )

    def __str__(self):

        return (
            f"{self.dispatch.id} | "
            f"{self.packet.packet_number}"
        )