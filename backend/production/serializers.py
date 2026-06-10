from rest_framework import serializers

from .models import (
    ProductionRequest,
    Production,
    ProductionBatch,
    BatchStage,
)


# =====================================================
# PRODUCTION REQUEST
# =====================================================

class ProductionRequestSerializer(
    serializers.ModelSerializer
):

    allocated_quantity = (
        serializers.SerializerMethodField()
    )

    remaining_quantity = (
        serializers.SerializerMethodField()
    )

    class Meta:

        model = ProductionRequest

        fields = "__all__"

    def get_allocated_quantity(
        self,
        obj
    ):

        return sum(

            obj.job_cards.values_list(

                "planned_quantity",

                flat=True
            )
        )

    def get_remaining_quantity(
        self,
        obj
    ):

        allocated = (
            self.get_allocated_quantity(
                obj
            )
        )

        return max(

            obj.requested_quantity
            -
            allocated,

            0
        )


# =====================================================
# PRODUCTION / JOB CARD
# =====================================================

class ProductionSerializer(
    serializers.ModelSerializer
):

    product_name = serializers.CharField(
        source="product.product_name",
        read_only=True
    )

    job_card_material_count = (
        serializers.SerializerMethodField()
    )

    produced_quantity = (
        serializers.IntegerField(
            read_only=True
        )
    )

    total_rejected = (
        serializers.IntegerField(
            read_only=True
        )
    )

    allocated_to_batches = (
        serializers.SerializerMethodField()
    )

    remaining_to_batch = (
        serializers.SerializerMethodField()
    )

    class Meta:

        model = Production

        fields = "__all__"

        read_only_fields = [

            "job_card_number",

            "produced_quantity",

            "total_rejected",

            "created_at",

            "updated_at",
        ]

    def get_job_card_material_count(
        self,
        obj
        ):
        return obj.materials.count()

    def get_allocated_to_batches(
        self,
        obj
    ):

        return sum(

            obj.batches.values_list(

                "planned_quantity",

                flat=True
            )
        )

    def get_remaining_to_batch(
        self,
        obj
    ):

        allocated = (
            self.get_allocated_to_batches(
                obj
            )
        )

        return max(

            obj.planned_quantity
            -
            allocated,

            0
        )

    def validate_planned_quantity(
        self,
        value
    ):

        if value <= 0:

            raise serializers.ValidationError(

                "Planned quantity must be greater than zero."
            )

        return value
    
# =====================================================
# PRODUCTION BATCH
# =====================================================

class ProductionBatchSerializer(
    serializers.ModelSerializer
):

    current_stage = (
        serializers.SerializerMethodField()
    )

    stage_progress = (
        serializers.SerializerMethodField()
    )

    class Meta:

        model = ProductionBatch

        fields = "__all__"

        read_only_fields = [

            "batch_number",

            "created_at",
        ]

    def get_current_stage(
        self,
        obj
    ):

        stage = (
            obj.current_stage
        )

        if not stage:
            return None

        return stage.stage_name

    def get_stage_progress(
        self,
        obj
    ):

        return obj.stage_progress

    def validate(
        self,
        data
    ):

        production = data.get(
            "production"
        )

        planned_quantity = data.get(
            "planned_quantity"
        )

        if not production:
            return data

        already_allocated = sum(

            production.batches.values_list(

                "planned_quantity",

                flat=True
            )
        )

        remaining = max(

            production.planned_quantity
            -
            already_allocated,

            0
            )

        if already_allocated >= production.planned_quantity:

            raise serializers.ValidationError(

                "All planned quantity has already been allocated to batches."
            )

        if planned_quantity > remaining:

            raise serializers.ValidationError(

                f"Only {remaining} quantity remains available for batching."
            )

        return data
    
# =====================================================
# BATCH STAGE
# =====================================================

class BatchStageSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = BatchStage

        fields = "__all__"

