from django.db import models
from django.utils import timezone
from datetime import date

from product_master.models import Product
from sales.models import SalesOrderLine
from users.models import User

from production.models import (
    Production,
    ProductionBatch,
)

class Inspection(models.Model):

    batch = models.ForeignKey(

        ProductionBatch,

        on_delete=models.CASCADE,

        related_name="inspections",

    )
    STATUS_CHOICES = [

        ("PENDING", "Pending"),

        ("COMPLETED", "Completed"),

    ]

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING",
    )

    accepted_quantity = models.PositiveIntegerField()

    rejected_quantity = models.PositiveIntegerField(
        null=True,
        blank=True
    )


    inspection_date = models.DateField(
        default=date.today
    )
    remarks = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    inspected_by = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        null=True,
        blank=True
        )


    @property
    def product(self):

        return (
            self.batch
            .production
            .product
        )
    
    @property
    def job_card(self):

        return (
            self.batch
            .production
        )
    

    @property
    def production_request(self):

        return (
            self.batch
            .production
            .production_request
        )

    @property
    def total_inspected(self):

        return (

            self.accepted_quantity
            +
            (self.rejected_quantity or 0)
        )

    @property
    def sales_order_line(self):

        return (
            self.batch
            .production
            .production_request
            .sales_order_line
        )


    @property
    def sales_order(self):

        line = self.sales_order_line

        return (
            line.sales_order
            if line else None
        )


    @property
    def customer(self):

        order = self.sales_order

        return (
            order.customer
            if order else None
        )

    @property
    def packed_quantity(self):

        return sum(

            self.packets.values_list(

                "units_in_packet",

                flat=True
            )
        )


    @property
    def remaining_to_pack(self):

        return max(

            self.accepted_quantity
            -
            self.packed_quantity,

            0
        )


    def __str__(self):
        return ( f"Inspection-{self.id} | "f"{self.batch.batch_number}" )

    
class Packet(models.Model):

    STATUS_CHOICES = [
        ("AVAILABLE", "Available"),
        ("IN_STOCK", "In Stock"),
        ("DISPATCHED", "Dispatched"),
    ]

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="AVAILABLE"
    )

    ALLOCATION_CHOICES = [
        ("ORDER", "Order"),
        ("PROJECTION", "Projection"),
        ("STOCK", "Stock"),
    ]

    inspection = models.ForeignKey(
        Inspection,
        on_delete=models.CASCADE,
        related_name="packets"
    )

    packet_number = models.CharField(
        max_length=50,
        unique=True,
        blank=True
    )
    packet_sequence = models.PositiveIntegerField(
        editable=False
    )
        
    units_in_packet = models.PositiveIntegerField()

    is_partial_packet = models.BooleanField(
        default=False,
        editable=False,
    )
        
    manufacture_date = models.DateField(
        default=timezone.now
    )

    allocation_type = models.CharField(
        max_length=20,
        choices=ALLOCATION_CHOICES
    )

    sales_order_line = models.ForeignKey(
        SalesOrderLine,
        null=True,
        blank=True,
        on_delete=models.SET_NULL
    )

    parent_packet = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="reallocated_packets"
    )

    remarks = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    @property
    def product(self):

        return (
            self.inspection
            .batch
            .production
            .product
        )

    @property
    def production(self):

        return (
            self.inspection
            .batch
            .production
        )

    @property
    def production_request(self):

        return self.production.production_request

    @property
    def sales_order(self):

        return (
            self.sales_order_line.sales_order
            if self.sales_order_line
            else None
        )

    @property
    def customer(self):

        order = self.sales_order

        return (
            order.customer
            if order
            else None
        )


    @property
    def label_data(self):

        return {

            "packet_number": self.packet_number,

            "packet_sequence": self.packet_sequence,

            "is_partial_packet": self.is_partial_packet,

            "customer_name": (
                str(self.customer)
                if self.customer
                else None
            ),

            "sales_order_number": (     
                self.sales_order.order_number
                if self.sales_order
                else None
            ),

            "product_name": (
                self.product.product_name
            ),

            "base_unit": (
                self.product.base_unit
            ),

            "quantity": self.units_in_packet,

            "job_card_number": (
                self.production.job_card_number
            ),

            "batch_number": (
                self.inspection.batch.batch_number
            ),

            "manufacture_date": (
                self.manufacture_date
            ),
        }

    def save(self, *args, **kwargs):

        
        request = self.production_request

        if request:

            if request.source_type == "SALES_ORDER":

                self.allocation_type = "ORDER"

                self.sales_order_line = (
                    request.sales_order_line
                )

            elif request.source_type == "PROJECTION":

                self.allocation_type = "PROJECTION"

                self.sales_order_line = (
                    request.sales_order_line
                )

            else:

                self.allocation_type = "STOCK"

                self.sales_order_line = None

        if not self.packet_number:

            product = self.product

            sample = getattr(
                product,
                "development_sample",
                None
            )

            mid_code = (
                sample.mid_code
                if sample
                else "GEN"
            )

            if self.allocation_type == "ORDER":

                reference = (
                    self.sales_order_line
                    .sales_order
                    .order_number
                )

            elif self.allocation_type == "PROJECTION":

                reference = f"PRJ{request.id}"

            else:

                reference = "STK"

            prefix = (
                f"PKT-"
                f"{mid_code}-"
                f"{reference}-"
            )

            sequence = (
                Packet.objects.filter(
                    inspection=self.inspection
                ).count()
                + 1
            )

            self.packet_sequence = sequence

            self.packet_number = (
                f"{prefix}{sequence:03d}"
            )

        super().save(*args, **kwargs)



        if self.allocation_type == "STOCK":
            from finished_stock.models import (
                FinishedStockPacket
            )
            FinishedStockPacket.objects.get_or_create(
                packet=self
            )
        
    def __str__(self):

        return self.packet_number