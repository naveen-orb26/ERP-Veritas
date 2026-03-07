from django.db import models
from django.utils import timezone

from sales.models import SalesOrderLine


class Dispatch(models.Model):

    sales_order_line = models.ForeignKey(
        SalesOrderLine,
        on_delete=models.PROTECT,
        related_name="dispatches"
    )

    quantity_dispatched = models.PositiveIntegerField()

    awb_number = models.CharField(
        max_length=100,
        blank=True
    )

    transporter = models.CharField(
        max_length=100,
        blank=True
    )

    dispatch_date = models.DateField(default=timezone.now)

    remarks = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Dispatch-{self.id} | SO-Line-{self.sales_order_line_id}"