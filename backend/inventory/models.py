from django.db import models

from django.core.exceptions import ValidationError

from django.utils import timezone

from raw_materials.models import MaterialSource


from users.models import User


# =====================================================
# WAREHOUSE
# =====================================================

class Warehouse(models.Model):

    WAREHOUSE_TYPE_CHOICES = [

        ("RAW_MATERIAL", "Raw Material"),

        ("FINISHED_GOOD", "Finished Good"),
    ]

    warehouse_name = models.CharField(
        max_length=150,
        unique=True
    )

    warehouse_code = models.CharField(
        max_length=30,
        unique=True
    )

    warehouse_type = models.CharField(
        max_length=30,
        choices=WAREHOUSE_TYPE_CHOICES
    )

    is_active = models.BooleanField(
        default=True
    )

    remarks = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):

        return (
            f"{self.warehouse_code} | "
            f"{self.warehouse_name}"
        )



# =====================================================
# STOCK LEDGER
# =====================================================

class StockLedger(models.Model):

    MOVEMENT_TYPE_CHOICES = [

        ("OPENING", "Opening"),

        ("PURCHASE_IN", "Purchase In"),

        ("GRN_REVERSAL","GRN Reversal"),

        ("PRODUCTION_CONSUMPTION",
         "Production Consumption"),

        ("PRODUCTION_OUTPUT",
         "Production Output"),

        ("PACKING_OUTPUT",
         "Packing Output"),

        ("SALES_DISPATCH",
         "Sales Dispatch"),

        ("MANUAL_RECEIPT",
         "Manual Receipt"),

        ("MANUAL_ISSUE",
         "Manual Issue"),

        ("ADJUSTMENT_IN",
         "Adjustment In"),

        ("ADJUSTMENT_OUT",
         "Adjustment Out"),

        ("SCRAP",
         "Scrap"),

        ("SAMPLE_USAGE",
         "Sample Usage"),
    ]

    DIRECTION_CHOICES = [

        ("IN", "In"),

        ("OUT", "Out"),
    ]

    warehouse = models.ForeignKey(

        Warehouse,

        on_delete=models.PROTECT,

        related_name="stock_ledger_entries"
    )

    material_source = models.ForeignKey(

        MaterialSource,

        blank=True,
        on_delete=models.PROTECT,

        related_name="stock_ledger_entries"
    )

    movement_type = models.CharField(

        max_length=50,

        choices=MOVEMENT_TYPE_CHOICES
    )

    direction = models.CharField(

        max_length=10,

        choices=DIRECTION_CHOICES
    )

    quantity = models.DecimalField(

        max_digits=18,

        decimal_places=4
    )

    reference_type = models.CharField(

        max_length=100,

        blank=True
    )

    reference_id = models.PositiveIntegerField(

        null=True,

        blank=True
    )

    remarks = models.TextField(
        blank=True
    )

    movement_date = models.DateTimeField(
        default=timezone.now
    )

    created_by = models.ForeignKey(

            User,

            on_delete=models.PROTECT,

            related_name=
                "stock_ledger_entries",

            null=True,

            blank=True,
        )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def clean(self):

        if self.quantity <= 0:

            raise ValidationError(
                "Quantity must "
                "be greater than zero"
            )

    def __str__(self):

        return (
            f"{self.material_source} | "
            f"{self.movement_type} | "
            f"{self.quantity}"
        )
    
