from django.db import models
from django.utils import timezone

from packing.models import Packet
from product_master.models import Product


class FinishedStockPacket(models.Model):

    STATUS_CHOICES = [
        ("IN_STOCK", "In Stock"),
        ("CONSUMED", "Consumed"),
    ]

    packet = models.ForeignKey(
        Packet,
        on_delete=models.CASCADE,
        related_name="stock_entries"
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT
    )

    units_in_packet = models.PositiveIntegerField()

    added_to_stock_date = models.DateField(default=timezone.now)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="IN_STOCK"
    )

    def __str__(self):
        return f"StockPacket-{self.id} | {self.product}"
    
class FinishedStockMovement(models.Model):

    MOVEMENT_CHOICES = [
        ("SURPLUS_IN", "Surplus In"),
        ("STOCK_OUT", "Stock Out"),
        ("RETURN_IN", "Return In"),
        ("RETURN_OUT", "Return Out"),
    ]

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT
    )

    movement_type = models.CharField(
        max_length=20,
        choices=MOVEMENT_CHOICES
    )

    quantity = models.PositiveIntegerField()

    date = models.DateField(default=timezone.now)

    reference_id = models.IntegerField(null=True, blank=True)

    remarks = models.TextField(blank=True)

    def __str__(self):
        return f"{self.product} | {self.movement_type}"