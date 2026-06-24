from django.db import models
from django.utils import timezone
from django.db.models import Max, Sum

from sales.models import SalesOrderLine
from product_master.models import Product
from users.models import User

from raw_materials.models import (
    RawMaterial,
    MaterialSource,
)

from recipes.models import Recipe
from django.core.exceptions import ValidationError

# =====================================================
# PRODUCTION REQUEST
# =====================================================

class ProductionRequest(models.Model):

    SOURCE_CHOICES = [

        ("SALES_ORDER", "Sales Order"),

        ("PROJECTION", "Projection"),

        ("MANUAL", "Manual"),
    ]

    STATUS_CHOICES = [

        ("PENDING", "Pending"),

        ("IN_PROGRESS", "In Progress"),

        ("COMPLETED", "Completed"),

        ("CANCELLED", "Cancelled"),
    ]

    source_type = models.CharField(

        max_length=20,

        choices=SOURCE_CHOICES,

        default="SALES_ORDER"
    )

    sales_order_line = models.ForeignKey(

        SalesOrderLine,

        on_delete=models.PROTECT,

        null=True,

        blank=True,

        related_name="production_requests"
    )

    product = models.ForeignKey(

        Product,

        on_delete=models.PROTECT,

        related_name="production_requests"
    )
        
    sr_number = models.CharField(
        max_length=100,
        blank=True
    )
        
    requested_quantity = models.PositiveIntegerField(
        default=0
    )

    status = models.CharField(

        max_length=20,

        choices=STATUS_CHOICES,

        default="PENDING"
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

    def save(self, *args, **kwargs):

        if ( self.source_type == "SALES_ORDER" and self.sales_order_line):

            self.requested_quantity = (

                self.sales_order_line
                .pending_quantity
            )

            self.sr_number = (

                self.sales_order_line
                .sr_number
            )

        super().save(*args, **kwargs)

    def __str__(self):

        return f"PR-{self.id}"
    

class Production(models.Model):

    STATUS_CHOICES = [

        ("DRAFT", "Draft"),

        ("APPROVED", "Approved"),

        ("IN_PROGRESS", "In Progress"),

        ("COMPLETED", "Completed"),

        ("CANCELLED", "Cancelled"),
    ]

    production_request = models.ForeignKey(

        ProductionRequest,

        on_delete=models.PROTECT,

        related_name="job_cards"
    )

    product = models.ForeignKey(

        Product,

        on_delete=models.PROTECT
    )

    job_card_number = models.CharField(

        max_length=30,

        unique=True,

        blank=True
    )

    status = models.CharField(

        max_length=20,

        choices=STATUS_CHOICES,

        default="DRAFT"
    )

    planned_quantity = models.PositiveIntegerField()

    production_date = models.DateField(
        default=timezone.localdate
    )

    created_by = models.ForeignKey(

        User,

        on_delete=models.PROTECT
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
    @property
    def allocated_to_batches(self):

        return (
            self.batches.aggregate(
                total=Sum("planned_quantity")
            )["total"]
            or 0
        )

    @property
    def remaining_to_batch(self):

        return (
            self.planned_quantity
            - self.allocated_to_batches
        )

    @property
    def allocated_quantity(self):

        return (
            self.job_cards.aggregate(
                total=Sum("planned_quantity")
            )["total"]
            or 0
        )

    @property
    def remaining_quantity(self):

        return (
            self.requested_quantity
            - self.allocated_quantity
        )
    
    @property
    def produced_quantity(self):

        return (

            self.batches.aggregate(

                total=Sum(
                    "inspections__accepted_quantity"
                )

            )["total"]

            or 0
        )

    @property
    def total_rejected(self):

        return (

            self.batches.aggregate(

                total=Sum(
                    "inspections__rejected_quantity"
                )

            )["total"]

            or 0
        )

    def generate_materials(self):

        if self.materials.exists():
            return

        product = self.product

        if not product.development_sample:
            return

        try:
            recipe = (
                product
                .development_sample
                .recipe
            )

        except Recipe.DoesNotExist:
            return

        for item in recipe.items.all():

            JobCardMaterial.objects.create(

                production=self,

                raw_material=item.raw_material,

                required_quantity=item.quantity,

                unit=item.unit,
            )
            
    def save(self, *args, **kwargs):

        if (not self.product_id
        and self.production_request.sales_order_line):

            self.product = (
                self.production_request
                .sales_order_line
                .product
            )

        if not self.job_card_number:

            today_str = (
                timezone.now()
                .strftime("%Y%m%d")
            )

            prefix = (
                f"JC-{today_str}-"
            )

            last_jc = (

                Production.objects

                .filter(

                    job_card_number__startswith=
                    prefix
                )

                .aggregate(

                    Max(
                        "job_card_number"
                    )

                )["job_card_number__max"]
            )

            if last_jc:

                sequence = (

                    int(

                        last_jc
                        .split("-")[-1]

                    ) + 1
                )

            else:

                sequence = 1

            self.job_card_number = (

                f"{prefix}"
                f"{str(sequence).zfill(3)}"
            )   

        is_new = self.pk is None

        super().save(*args, **kwargs)

        if is_new:
            self.generate_materials()

    def __str__(self):

        return self.job_card_number

# =====================================================
# PRODUCTION BATCH
# =====================================================

class ProductionBatch(models.Model):

    production = models.ForeignKey(

        Production,

        on_delete=models.CASCADE,

        related_name="batches"
    )

    batch_number = models.CharField(

        max_length=30,
        unique=True,
        blank = True
    )

    
    planned_quantity = models.PositiveIntegerField()

    actual_quantity = models.PositiveIntegerField(

        null=True,

        blank=True
    )

    STATUS_CHOICES = [

        ("PLANNED", "Planned"),

        ("IN_PROGRESS", "In Progress"),

        ("COMPLETED", "Completed"),
    ]

    status = models.CharField(

        max_length=20,

        choices=STATUS_CHOICES,

        default="PLANNED"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )


    machine_name = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    operator_name = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    shift = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    start_time = models.DateTimeField(
        blank=True,
        null=True
    )

    end_time = models.DateTimeField(
        blank=True,
        null=True
    )

    def create_default_stages(self):

        if self.stages.exists():
            return

        product = (
            self.production.product
        )

        sample = (
            product.development_sample
        )

        if not sample:
            return

        if sample.mid_code != "BTN":
            return

        stages = [

            "Mixing",

            "Casting",

            "Turning",

            "Polishing",
        ]

        for index, stage in enumerate(
            stages,
            start=1
        ):

            BatchStage.objects.create(

                batch=self,

                stage_name=stage,

                sequence=index
            )    


    @property
    def inspected_quantity(self):

        total = 0

        for inspection in self.inspections.all():

            total += (
                inspection.accepted_quantity
                +
                (
                    inspection.rejected_quantity
                    or 0
                )
            )

        return total

    @property
    def remaining_for_inspection(self):

        return max(

            self.planned_quantity
            -
            self.inspected_quantity,

            0
        )

    
    @property
    def current_stage(self):

        stage = (

            self.stages

            .exclude(
                status="COMPLETED"
            )

            .order_by("sequence")

            .first()
        )

        if stage:

            return stage

        return "Completed"
    
    @property
    def stage_progress(self):

        total = self.stages.count()

        completed = (
            self.stages
            .filter(
                status="COMPLETED"
            )
            .count()
        )

        return {
            "completed": completed,
            "total": total,
        }
    
    def clean(self):

        if not self.production_id:
            return

        allocated = sum(

            self.production.batches

            .exclude(id=self.id)

            .values_list(
                "planned_quantity",
                flat=True
            )
        )

        if (

            allocated
            +
            self.planned_quantity

            >

            self.production.planned_quantity
        ):

            raise ValidationError(

                "Batch quantity exceeds remaining Job Card quantity."
            )
            
    
    def __str__(self):

        return self.batch_number


    def save(self, *args, **kwargs):
        
        is_new = self.pk is None

        if not self.batch_number:

            today_str = (
                timezone.now()
                .strftime("%Y%m%d")
            )

            prefix = (
                f"BAT-{today_str}-"
            )

            last_batch = (

                ProductionBatch.objects

                .filter(
                    batch_number__startswith=
                    prefix
                )

                .aggregate(
                    Max("batch_number")
                )["batch_number__max"]
            )

            if last_batch:

                sequence = (

                    int(
                        last_batch
                        .split("-")[-1]
                    ) + 1
                )

            else:

                sequence = 1

            self.batch_number = (

                f"{prefix}"
                f"{str(sequence).zfill(3)}"
            )

        self.full_clean()
        super().save(*args, **kwargs)
        
        if is_new:

            self.create_default_stages()


class BatchStage(models.Model):

    STATUS_CHOICES = [

        ("PENDING", "Pending"),

        ("IN_PROGRESS", "In Progress"),

        ("COMPLETED", "Completed"),
    ]

    batch = models.ForeignKey(

        ProductionBatch,

        on_delete=models.CASCADE,

        related_name="stages"
    )

    stage_name = models.CharField(
        max_length=50
    )

    sequence = models.PositiveIntegerField()

    status = models.CharField(

        max_length=20,

        choices=STATUS_CHOICES,

        default="PENDING"
    )

    started_at = models.DateTimeField(

        null=True,

        blank=True
    )

    completed_at = models.DateTimeField(

        null=True,

        blank=True
    )

    remarks = models.TextField(
        blank=True
    )

    class Meta:

        ordering = ["sequence"]

    def __str__(self):

        return (

            f"{self.batch.batch_number}"
            f" - "
            f"{self.stage_name}"
        )
    

# =====================================================
# JOB CARD MATERIAL
# =====================================================

class JobCardMaterial(models.Model):

    production = models.ForeignKey(

        Production,

        on_delete=models.CASCADE,

        related_name="materials"
    )

    raw_material = models.ForeignKey(

        RawMaterial,

        on_delete=models.PROTECT,

         null=True,

        blank=True,

    )

    material_source = models.ForeignKey(

        MaterialSource,

        on_delete=models.PROTECT,

        null=True,

        blank=True
    )

    required_quantity = models.DecimalField(

        max_digits=18,

        decimal_places=4
    )

    issued_quantity = models.DecimalField(

        max_digits=18,

        decimal_places=4,

        default=0
    )

    unit = models.CharField(
        max_length=20,

        null=True,

        blank=True,
    )

    remarks = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return (

            f"{self.production.job_card_number}"

            f" | "

            f"{self.raw_material.material_name}"
        )