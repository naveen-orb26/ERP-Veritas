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
    
    order_number = serializers.SerializerMethodField()

    sr_number = serializers.CharField(
        read_only=True
    )   

    product_name = serializers.SerializerMethodField()

    # reference_number = serializers.SerializerMethodField()

    customer_name = serializers.SerializerMethodField()

    is_locked = serializers.SerializerMethodField()

    allocated_quantity = (
        serializers.SerializerMethodField()
    )

    remaining_quantity = (
        serializers.SerializerMethodField()
    )

    class Meta:

        model = ProductionRequest

        fields = [

            "id",

            "source_type",

            "sales_order_line",

            "requested_quantity",

            "status",

            "remarks",

            "created_at",

            "updated_at",

            "allocated_quantity",

            "remaining_quantity",

            "customer_name",

            "order_number",

            "sr_number",

            "product_name",

            "is_locked",
        ]

    def get_order_number(self, obj):

        if obj.sales_order_line:

            return (
                obj.sales_order_line
                .sales_order
                .order_number
            )

        return None


    def get_sr_number(self, obj):

        if obj.sales_order_line:

            return obj.sales_order_line.sr_number

        return obj.sr_number

    def get_product_name(self, obj):

        line = obj.sales_order_line

        if line and line.product:

            return line.product.product_name

        return None

    def validate(self, data):

        instance = getattr(
            self,
            "instance",
            None
        )

        # ==========================
        # CREATE VALIDATIONS
        # ==========================

        if not instance:

            source_type = data.get(
                "source_type"
            )

            sales_order_line = data.get(
                "sales_order_line"
            )

            if source_type == "SALES_ORDER":

                if not sales_order_line:

                    raise serializers.ValidationError({

                        "sales_order_line":
                            "This field is required."
                    })

                if (
                    sales_order_line
                    .sales_order
                    .status
                    != "CONFIRMED"
                ):

                    raise serializers.ValidationError({

                        "sales_order_line":
                            (
                                "Only confirmed sales "
                                "orders can be used."
                            )
                    })

            return data

        # ==========================
        # UPDATE VALIDATIONS
        # ==========================

        allocated = sum(

            instance.job_cards.values_list(
                "planned_quantity",
                flat=True
            )
        )

        if allocated > 0:

            immutable_fields = [

                "source_type",

                "sales_order_line",

                "requested_quantity",
            ]

            for field in immutable_fields:

                if field in data:

                    old = getattr(
                        instance,
                        field
                    )

                    new = data[field]

                    if old != new:

                        raise serializers.ValidationError(

                            f"{field} cannot be changed "
                            "after job cards exist."
                        )

        return data
    
    def validate_status(self, value):

        instance = getattr(self, "instance", None)

        if (
            instance
            and value == "CANCELLED"
            and instance.job_cards.exists()
        ):

            raise serializers.ValidationError(
                "Cannot cancel request after job cards exist."
            )

        return value
    

    def get_is_locked(self, obj):

        return obj.job_cards.exists()

    # def get_reference_number(self, obj):

    #     if obj.source_type == "SALES_ORDER":

    #         line = obj.sales_order_line

    #         if line:

    #             return (
    #                 f"{line.sales_order.order_number}"
    #                 f" / "
    #                 f"{line.sr_number}"
    #             )

    #     if obj.source_type == "PROJECTION":

    #         return f"PRJ-{obj.id}"

    #     return "STOCK"


    def get_customer_name(self, obj):

        line = getattr(
            obj,
            "sales_order_line",
            None
        )

        if line:

            return str(
                line.sales_order.customer
            )

        return None

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

    def create(self, validated_data):

        source_type = validated_data.get(
            "source_type"
        )

        sales_order_line = validated_data.get(
            "sales_order_line"
        )

        if (
            source_type == "SALES_ORDER"
            and sales_order_line
        ):

            validated_data["product"] = (
                sales_order_line.product
            )

        return super().create(
            validated_data
        )
    
 
# =====================================================
# BATCH STAGE
# =====================================================

class BatchStageSerializer(
    serializers.ModelSerializer
):

    duration = (
        serializers.SerializerMethodField()
    )

    class Meta:

        model = BatchStage

        fields = [

            "id",

            "stage_name",

            "sequence",

            "status",

            "started_at",

            "completed_at",

            "duration",

            "remarks",

            "batch",
        ]

    def get_duration(
        self,
        obj
    ):

        if (
            obj.started_at
            and obj.completed_at
        ):

            return (

                obj.completed_at
                -
                obj.started_at

            ).total_seconds()

        return None

# =====================================================
# PRODUCTION BATCH
# =====================================================

class ProductionBatchSerializer(
    serializers.ModelSerializer
):
    
    current_stage = serializers.CharField(
        read_only=True
    )

    stage_progress = (
        serializers.SerializerMethodField()
    )

    stages = BatchStageSerializer(
        many=True,
        read_only=True
    )

    product_name = serializers.SerializerMethodField()

    job_card_number = serializers.SerializerMethodField()

    source_type = serializers.SerializerMethodField()

    reference_number = serializers.SerializerMethodField()

    customer_name = serializers.SerializerMethodField()

    remaining_for_inspection = (
        serializers.SerializerMethodField()
    )

    inspected_quantity = (
        serializers.SerializerMethodField()
    )   

    inspection_complete = serializers.SerializerMethodField()

    class Meta:

        model = ProductionBatch

        fields = "__all__"

        read_only_fields = [

            "batch_number",

            "created_at",

            "inspection_complete",
        ]


    def get_inspection_complete(
        self,
        obj
    ):

        return (
            obj.remaining_for_inspection == 0
        )

    def get_product_name(self, obj):

        return (
            obj.production.product.product_name
        )


    def get_job_card_number(self, obj):

        return (
            obj.production.job_card_number
        )


    def get_source_type(self, obj):

        return (
            obj.production
            .production_request
            .source_type
        )


    def get_reference_number(self, obj):

        request = (
            obj.production
            .production_request
        )

        if request.source_type == "SALES_ORDER":

            line = request.sales_order_line

            if line:

                return (
                    line.sales_order
                    .order_number
                )

        if request.source_type == "PROJECTION":

            return f"PRJ-{request.id}"

        return f"MAN-{request.id}"


    def get_customer_name(self, obj):

        request = (
            obj.production
            .production_request
        )

        line = request.sales_order_line

        if line:

            return str(
                line.sales_order.customer
            )

        return None


    def get_inspected_quantity(self, obj):

        total = 0

        for inspection in (
            obj.inspections.all()
        ):

            total += (
                inspection.accepted_quantity
                +
                (
                    inspection.rejected_quantity
                    or 0
                )
            )

        return total


    def get_remaining_for_inspection(
        self,
        obj
    ):

        return (
            obj.remaining_for_inspection
        )

    # def get_current_stage(
    #     self,
    #     obj
    # ):

    #     stage = obj.current_stage

    #     if not stage:

    #         return "Completed"

    #     if isinstance(
    #         stage,
    #         str
    #     ):

    #         return stage

    #     return (
    #         stage.stage_name
    #     )

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
# PRODUCTION / JOB CARD
# =====================================================

class ProductionSerializer(
    serializers.ModelSerializer
):

    order_number = serializers.SerializerMethodField()

    customer_name = serializers.SerializerMethodField()

    sr_number = serializers.SerializerMethodField()

    product_name = serializers.CharField(
        source="product.product_name",
        read_only=True
    )

    batches = ProductionBatchSerializer(
        many=True,
        read_only=True
    )
        
    job_card_material_count = (
        serializers.SerializerMethodField()
    )

    produced_quantity = (
        serializers.SerializerMethodField()
    )

    total_rejected = (
        serializers.SerializerMethodField()
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

            "product",

            "created_by",

            "production_date",

            "status",

            "produced_quantity",

            "total_rejected",

            "created_at",

            "updated_at",
        ]


    def get_produced_quantity(
        self,
        obj
    ):

        total = 0

        for batch in obj.batches.all():

            for inspection in (
                batch.inspections.all()
            ):

                total += (
                    inspection.accepted_quantity
                    or 0
                )

        return total


    def get_total_rejected(
        self,
        obj
    ):

        total = 0

        for batch in obj.batches.all():

            for inspection in (
                batch.inspections.all()
            ):

                total += (
                    inspection.rejected_quantity
                    or 0
                )

        return total
    def get_order_number(self, obj):

        line = obj.production_request.sales_order_line

        if line:
            return line.sales_order.order_number

        return None


    def get_customer_name(self, obj):

        line = obj.production_request.sales_order_line

        if line:
            return str(line.sales_order.customer)

        return None


    def get_sr_number(self, obj):

        request = obj.production_request

        if not request:
            return None

        line = request.sales_order_line

        if not line:
            return None

        return line.sr_number

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
    

    def validate(self, data):

        request = data["production_request"]

        if not request.product:

            raise serializers.ValidationError(

                "Production request must have a product."
            )
        
        planned = data["planned_quantity"]

        allocated = sum(

            request.job_cards.values_list(
                "planned_quantity",
                flat=True
            )
        )

        remaining = max(

            request.requested_quantity
            - allocated,

            0
        )

        if planned > remaining:

            raise serializers.ValidationError(

                f"Only {remaining} quantity "
                "is available."
            )

        return data
    
    def create(self, validated_data):

        request = validated_data["production_request"]

        validated_data["product"] = (
            request.product
        )

        validated_data["created_by"] = (
            self.context["request"].user
        )

        return super().create(validated_data)