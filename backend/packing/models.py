from django.db import models
from django.utils import timezone

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

    accepted_quantity = models.PositiveIntegerField()

    rejected_quantity = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    inspection_date = models.DateField(default=timezone.now)

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
    def total_inspected(self):

        return (

            self.accepted_quantity
            +
            (self.rejected_quantity or 0)
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
        ("STOCK", "Stock"),
    ]
    
    inspection = models.ForeignKey(
        Inspection,
        on_delete=models.CASCADE,
        related_name="packets"
    )

    units_in_packet = models.PositiveIntegerField()

    manufacture_date = models.DateField(default=timezone.now)


    allocation_type = models.CharField(
        max_length=10,
        choices=ALLOCATION_CHOICES
    )

    sales_order_line = models.ForeignKey(
        SalesOrderLine,
        null=True,
        blank=True,
        on_delete=models.SET_NULL
    )

    remarks = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Packet-{self.id} | {self.product}"
    @property
    def product(self):

        return (
            self.inspection
            .batch
            .production
            .product
        )