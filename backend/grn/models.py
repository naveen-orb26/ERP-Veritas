from django.db import models
from django.db import models
from django.core.exceptions import ValidationError
from vendors.models import Vendor
from raw_materials.models import MaterialSource



# =====================================================
# GRN HEADER
# =====================================================

class GRN(models.Model):

    STATUS_CHOICES = [

        ("DRAFT", "Draft"),

        ("COMPLETED", "Completed"),

        ("CANCELLED", "Cancelled"),
    ]

    grn_number = models.CharField(

        max_length=50,

        unique=True,

        editable=False
    )

    purchase_order = models.ForeignKey(

        "purchases.PurchaseOrder",

        on_delete=models.PROTECT,

        related_name="grns",

        null=True,

        blank=True,
    )

    vendor = models.ForeignKey(

        Vendor,

        on_delete=models.PROTECT,

        related_name="grns"
    )

    po_number = models.CharField(

        max_length=100,

        blank=True
    )

    invoice_number = models.CharField(

        max_length=100,

        blank=True
    )

    invoice_date = models.DateField(

        null=True,

        blank=True
    )

    received_by = models.CharField(

        max_length=255,

        blank=True
    )

    status = models.CharField(

        max_length=20,

        choices=STATUS_CHOICES,

        default="COMPLETED"
    )

    remarks = models.TextField(

        blank=True
    )

    received_at = models.DateTimeField(

        auto_now_add=True
    )

    created_at = models.DateTimeField(

        auto_now_add=True
    )

    updated_at = models.DateTimeField(

        auto_now=True
    )

    def save(self, *args, **kwargs):

        if not self.grn_number:

            last_grn = (
                GRN.objects
                .order_by("-id")
                .first()
            )

            next_id = 1

            if last_grn:

                try:

                    next_id = (

                        int(

                            last_grn
                            .grn_number
                            .split("-")[1]
                        )
                        + 1
                    )

                except Exception:

                    next_id = 1

            self.grn_number = (
                f"GRN-{next_id:05d}"
            )

        super().save(*args, **kwargs)

    def __str__(self):

        return self.grn_number
    
# =====================================================
# GRN LINE
# =====================================================

class GRNLine(models.Model):
        
    grn = models.ForeignKey(

        GRN,

        on_delete=models.CASCADE,

        related_name="lines"
    )

    warehouse = models.ForeignKey(

        "inventory.Warehouse",

        on_delete=models.PROTECT,

        related_name="grn_lines"
    )

    material_source = models.ForeignKey(

        MaterialSource,

        on_delete=models.PROTECT,

        related_name="grn_lines"
    )

    received_quantity = models.DecimalField(

        max_digits=18,

        decimal_places=4
    )

    received_unit = models.CharField(

        max_length=20
    )

    unit_cost = models.DecimalField(

        max_digits=18,

        decimal_places=4,

        default=0
    )

    tax_percent = models.DecimalField(

        max_digits=10,

        decimal_places=2,

        default=0
    )

    tax_amount = models.DecimalField(

        max_digits=18,

        decimal_places=4,

        default=0
    )

    line_total = models.DecimalField(

        max_digits=18,

        decimal_places=4,

        default=0
    )

    batch_reference = models.CharField(

        max_length=100,

        blank=True
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

    class Meta:

        unique_together = (

            "grn",

            "material_source",
        )

    def clean(self):

        if self.received_quantity <= 0:

            raise ValidationError(

                "Received quantity "
                "must be greater "
                "than zero."
            )

        if self.unit_cost < 0:

            raise ValidationError(

                "Unit cost cannot "
                "be negative."
            )

        if self.tax_percent < 0:

            raise ValidationError(

                "Tax percent cannot "
                "be negative."
            )

        if self.tax_amount < 0:

            raise ValidationError(

                "Tax amount cannot "
                "be negative."
            )

        if self.line_total < 0:

            raise ValidationError(

                "Line total cannot "
                "be negative."
            )

    def save(self, *args, **kwargs):

        subtotal = (

            self.received_quantity
            *
            self.unit_cost
        )

        self.tax_amount = (

            subtotal
            *
            (self.tax_percent / 100)
        )

        self.line_total = (
            subtotal
            + self.tax_amount
        )

        super().save(*args, **kwargs)

    def __str__(self):

        return (

            f"{self.grn.grn_number} | "

            f"{self.material_source.sm_code}"
        )