from django.db import models

from django.db import models

from django.utils import timezone

from django.core.exceptions import (
    ValidationError
)

from vendors.models import Vendor
from decimal import Decimal


# =====================================================
# RAW MATERIAL
# =====================================================

class RawMaterial(models.Model):

    UNIT_CHOICES = [

    ("KG", "Kilogram"),

    ("GRAM", "Gram"),

    ("LITRE", "Litre"),

    ("ML", "Millilitre"),

    ("CC", "CC"),
]

    MATERIAL_CATEGORY_CHOICES = [

        ("CHEMICAL", "Chemical"),

        ("PACKAGING", "Packaging"),

        ("CONSUMABLE", "Consumable"),

        ("GENERAL", "General"),
    ]

    material_code = models.CharField(

        max_length=50,

        unique=True
    )

    material_name = models.CharField(

        max_length=255
    )

    material_category = models.CharField(

        max_length=50,

        choices=MATERIAL_CATEGORY_CHOICES,

        default="GENERAL"
    )

    base_unit = models.CharField(

        max_length=20,

        choices=UNIT_CHOICES
    )

    minimum_quantity = models.DecimalField(

        max_digits=18,

        decimal_places=4,

        default=0
    )

    reorder_quantity = models.DecimalField(

        max_digits=18,

        decimal_places=4,

        default=0
    )


    description = models.TextField(

        blank=True
    )

    is_active = models.BooleanField(

        default=True
    )

    created_at = models.DateTimeField(

        auto_now_add=True
    )

    updated_at = models.DateTimeField(

        auto_now=True
    )

    def clean(self):

        if self.minimum_quantity < 0:

            raise ValidationError(

                "Minimum quantity "
                "cannot be negative."
            )

        if self.reorder_quantity < 0:

            raise ValidationError(

                "Reorder quantity "
                "cannot be negative."
            )

        if (

            self.reorder_quantity
            <
            self.minimum_quantity
        ):

            raise ValidationError(

                "Reorder quantity "
                "cannot be less than "
                "minimum quantity."
            )
        
    def __str__(self):

        return (
            f"{self.material_code} | "
            f"{self.material_name}"
        )
    
# =====================================================
# MATERIAL SOURCE (SM CODE)
# =====================================================

class MaterialSource(models.Model):

    sm_code = models.CharField(

        max_length=50,

        unique=True,

        editable=False
    )

    raw_material = models.ForeignKey(

        RawMaterial,

        on_delete=models.PROTECT,

        related_name="material_sources"
    )

    vendor = models.ForeignKey(

        Vendor,

        on_delete=models.PROTECT,

        related_name="material_sources"
    )

    vendor_material_code = models.CharField(

        max_length=100,

        blank=True
    )

    remarks = models.TextField(

        blank=True
    )

    is_active = models.BooleanField(

        default=True
    )

    created_at = models.DateTimeField(

        auto_now_add=True
    )

    updated_at = models.DateTimeField(

        auto_now=True
    )

    class Meta:

        unique_together = (

            "raw_material",

            "vendor",
        )

    def clean(self):

        duplicate_exists = (
            MaterialSource.objects
            .exclude(id=self.id)
            .filter(

                raw_material=
                    self.raw_material,

                vendor=
                    self.vendor,
            )
            .exists()
        )

        if duplicate_exists:

            raise ValidationError(

                "This vendor is "
                "already linked to "
                "this raw material."
            )

    def save(self, *args, **kwargs):

        if not self.sm_code:

            last_source = (
                MaterialSource.objects
                .order_by("-id")
                .first()
            )

            next_id = 1

            if last_source:

                try:

                    next_id = (

                        int(

                            last_source
                            .sm_code
                            .split("-")[1]
                        )
                        + 1
                    )

                except Exception:

                    next_id = (
                        self.id or 1
                    )

            self.sm_code = (
                f"SM-{next_id:05d}"
            )

        super().save(*args, **kwargs)

    def __str__(self):

        return (

            f"{self.sm_code} | "

            f"{self.raw_material.material_name} | "

            f"{self.vendor.vendor_name}"
        )
    
# =====================================================
# RAW MATERIAL INVENTORY
# =====================================================

class RawMaterialInventory(models.Model):

    warehouse = models.ForeignKey(

        "inventory.Warehouse",

        on_delete=models.PROTECT,

        related_name="raw_material_inventory"
    )

    material_source = models.ForeignKey(

        MaterialSource,

        on_delete=models.PROTECT,

        related_name="inventory_entries"
    )

    current_quantity = models.DecimalField(

        max_digits=18,

        decimal_places=4,

        default=0
    )

    reserved_quantity = models.DecimalField(

        max_digits=18,

        decimal_places=4,

        default=0
    )

    available_quantity = models.DecimalField(

        max_digits=18,

        decimal_places=4,

        default=0
    )

    remarks = models.TextField(

        blank=True
    )

    last_movement_at = models.DateTimeField(

        null=True,

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

            "warehouse",

            "material_source",
        )

    def clean(self):

        if self.current_quantity < 0:

            raise ValidationError(

                "Current quantity "
                "cannot be negative."
            )

        if self.reserved_quantity < 0:

            raise ValidationError(

                "Reserved quantity "
                "cannot be negative."
            )

        if (

            self.reserved_quantity
            >
            self.current_quantity
        ):

            raise ValidationError(

                "Reserved quantity "
                "cannot exceed "
                "current quantity."
            )

    def save(self, *args, **kwargs):

        self.available_quantity = (

            Decimal(
                self.current_quantity
            )

            -

            Decimal(
                self.reserved_quantity
            )
        )

        super().save(*args, **kwargs)

    @property
    def is_below_minimum(self):

        total_quantity = (
            self.current_quantity
        )

        minimum_quantity = (
            self.material_source
            .raw_material
            .minimum_quantity
        )

        return (
            total_quantity
            <=
            minimum_quantity
        )

    def __str__(self):

        return (

            f"{self.material_source.sm_code} | "

            f"{self.warehouse.name}"
        )