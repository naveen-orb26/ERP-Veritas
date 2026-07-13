from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError
from sales.models import (
    SalesOrder,
    SalesOrderLine,
)
from django.db import models
from django.utils import timezone

class Dispatch(models.Model):

    dispatch_number = models.CharField(
        max_length=30,
        unique=True,
        blank=True,
        null = True,
    )

    sales_order = models.ForeignKey(
        SalesOrder,
        on_delete=models.PROTECT,
        related_name="dispatches"
    )

    awb_number = models.CharField(
        max_length=100,
        blank=True,
        null=True,
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

    delivery_partner = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    vehicle_number = models.CharField(
        max_length=50,
        blank=True,
        null=True
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
    def total_quantity(self):

        return sum(

            self.items.values_list(

                "dispatched_quantity",

                flat=True
            )
        )

    @property
    def total_quantity(self):

        return sum(

            self.items.values_list(

                "dispatched_quantity",

                flat=True
            )
        )

    def save(self, *args, **kwargs):

        if not self.dispatch_number:

            today = timezone.localdate()

            prefix = (
                f"DSP-"
                f"{today.strftime('%Y%m%d')}"
            )

            last = (

                Dispatch.objects

                .filter(
                    dispatch_number__startswith=prefix
                )

                .order_by(
                    "-dispatch_number"
                )

                .first()
            )

            if last:

                sequence = int(

                    last.dispatch_number
                    .split("-")[-1]

                ) + 1

            else:

                sequence = 1

            self.dispatch_number = (

                f"{prefix}-"

                f"{sequence:03d}"
            )

        super().save(*args, **kwargs)
        

    def __str__(self):

        return (

            f"{self.dispatch_number}"

            f" | "

            f"{self.sales_order.order_number}"
        )


class DispatchItem(models.Model):

    dispatch = models.ForeignKey(

        Dispatch,

        on_delete=models.CASCADE,

        related_name="items"
    )

    sales_order_line = models.ForeignKey(

        SalesOrderLine,

        on_delete=models.PROTECT,

        related_name="dispatch_items"
    )

    dispatched_quantity = models.PositiveIntegerField()

    remarks = models.TextField(
        blank=True
    )

    @property
    def packed_quantity(self):

        from packing.models import Packet

        return sum(

            Packet.objects.filter(

                sales_order_line=
                self.sales_order_line,

                status="AVAILABLE"

            ).values_list(

                "units_in_packet",

                flat=True
            )
        )

    @property
    def allocated_quantity(self):

        return sum(

            self.packets.values_list(

                "packet__units_in_packet",

                flat=True
            )
        )


    def clean(self):

        super().clean()

        if self.dispatched_quantity <= 0:

            raise ValidationError(

                "Dispatch quantity must be greater than zero."
            )

        if (

            self.dispatched_quantity
            >
            self.sales_order_line.remaining_to_dispatch

        ):

            raise ValidationError(

                f"Only "
                f"{self.sales_order_line.remaining_to_dispatch} "
                f"quantity remains available for dispatch."
            )
        
    def save(self, *args, **kwargs):

        creating = self.pk is None

        self.full_clean()

        super().save(*args, **kwargs)

        if not creating:

            return

        from packing.models import Packet

        remaining = self.dispatched_quantity

        packets = (

            Packet.objects

            .filter(

                sales_order_line=self.sales_order_line,

                status="AVAILABLE"

            )

            .order_by(

                "manufacture_date",

                "packet_number"
            )
        )

        for packet in packets:

            if remaining <= 0:

                break

            DispatchPacket.objects.create(

                dispatch_item=self,

                packet=packet
            )

            remaining -= packet.units_in_packet

        if remaining > 0:

            raise ValidationError(

                "Not enough packed quantity is available for dispatch."
            )
        
        
    def __str__(self):

        return (

            f"{self.dispatch.id} - "

            f"{self.sales_order_line}"
        )
    


class DispatchPacket(models.Model):

    dispatch_item = models.ForeignKey(

        DispatchItem,

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
            ("dispatch_item", "packet")
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

            f"{self.dispatch_item.dispatch.id}"

            f" | "

            f"{self.packet.packet_number}"
        )