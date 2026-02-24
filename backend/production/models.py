from django.db import models
from django.utils import timezone
from django.db.models import Max, Sum

from sales.models import SalesOrderLine
from product_master.models import Product
from users.models import User


class Production(models.Model):

    sales_order_line = models.ForeignKey(
        SalesOrderLine,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="productions"
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT
    )

    batch_number = models.CharField(
        max_length=30,
        unique=True,
        blank=True
    )

    planned_quantity = models.PositiveIntegerField()

    production_date = models.DateField(default=timezone.now)

    created_by = models.ForeignKey(
        User,
        on_delete=models.PROTECT
    )

    remarks = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # ----------------------------
    # Derived Quantities
    # ----------------------------

    @property
    def produced_quantity(self):
        return self.inspections.aggregate(
            total=Sum("accepted_quantity")
        )["total"] or 0

    @property
    def total_rejected(self):
        return self.inspections.aggregate(
            total=Sum("rejected_quantity")
        )["total"] or 0

    # ----------------------------
    # Save Override
    # ----------------------------

    def save(self, *args, **kwargs):

        # Auto-set product if sales_order_line provided
        if self.sales_order_line and not self.product_id:
            self.product = self.sales_order_line.product

        # Generate batch number only on first creation
        if not self.batch_number:
            today_str = timezone.now().strftime("%Y%m%d")
            prefix = f"PROD-{today_str}-"

            last_batch = Production.objects.filter(
                batch_number__startswith=prefix
            ).aggregate(Max("batch_number"))["batch_number__max"]

            if last_batch:
                last_sequence = int(last_batch.split("-")[-1])
                new_sequence = last_sequence + 1
            else:
                new_sequence = 1

            self.batch_number = f"{prefix}{str(new_sequence).zfill(3)}"

        super().save(*args, **kwargs)

    def __str__(self):
        return self.batch_number