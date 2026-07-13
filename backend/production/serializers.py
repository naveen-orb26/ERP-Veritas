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

    sr_number = serializers.CharField(read_only=True)   

    product_name = serializers.SerializerMethodField()

    # reference_number = serializers.SerializerMethodField()

    customer_name = serializers.SerializerMethodField()

    is_locked = serializers.SerializerMethodField()

    allocated_quantity = (serializers.SerializerMethodField())

    remaining_quantity = (serializers.SerializerMethodField())

    has_job_cards = serializers.SerializerMethodField()

    total_job_cards = serializers.SerializerMethodField()

    completed_job_cards = serializers.SerializerMethodField()

    running_job_cards = serializers.SerializerMethodField()

    pending_job_cards = serializers.SerializerMethodField()

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

            "has_job_cards",

            "total_job_cards",

            "completed_job_cards",

            "running_job_cards",

            "pending_job_cards",

        ]

    
    def get_has_job_cards(self, obj):

        return obj.job_cards.exists()

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
                # Prevent duplicate Production Requests
                if ProductionRequest.objects.filter(

                    sales_order_line=sales_order_line

                ).exclude(

                    status="CANCELLED"

                ).exists():

                    raise serializers.ValidationError({

                        "sales_order_line":

                            "A Production Request already exists "
                            "for this Sales Order Line."
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
                instance = getattr(self, "instance", None)

                if (
                    instance
                    and
                    instance.status == "CANCELLED"
                ):

                    raise serializers.ValidationError(

                        "Cancelled Production Requests cannot be modified."

                    )

        # ==========================
        # UPDATE VALIDATIONS
        # ==========================

        from django.db.models import Sum

        if instance is None:

            return data

        allocated = (

            instance.job_cards.aggregate(

                total=Sum("planned_quantity")

            )["total"]

            or 0
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
    

    def get_total_job_cards(self, obj):

        return obj.job_cards.count()


    def get_completed_job_cards(self, obj):

        return obj.job_cards.filter(
            status="PRODUCTION_COMPLETE"
        ).count()


    def get_running_job_cards(self, obj):

        return obj.job_cards.filter(
            status="IN_PROGRESS"
        ).count()


    def get_pending_job_cards(self, obj):

        return obj.job_cards.filter(
            status__in=[
                "DRAFT",
                "APPROVED",
            ]
        ).count()

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
    
    current_stage = serializers.SerializerMethodField()

    stage_progress = (
        serializers.SerializerMethodField()
    )

    stages = BatchStageSerializer(
        many=True,
        read_only=True
    )

    mid_code = serializers.SerializerMethodField()

    product_name = serializers.SerializerMethodField()

    job_card_number = serializers.SerializerMethodField()

    source_type = serializers.SerializerMethodField()

    sales_order_number = serializers.SerializerMethodField()

    customer_name = serializers.SerializerMethodField()

    remaining_for_inspection = (
        serializers.SerializerMethodField()
    )

    inspected_quantity = (
        serializers.SerializerMethodField()
    )   

    inspection_complete = serializers.SerializerMethodField()

    image = serializers.SerializerMethodField()

    sr_number = serializers.SerializerMethodField()

    category = serializers.SerializerMethodField()

    variant = serializers.SerializerMethodField()

    color = serializers.SerializerMethodField()

    base_unit = serializers.SerializerMethodField()

    units_per_base_unit = serializers.SerializerMethodField()

    job_card_status = serializers.SerializerMethodField()

    production_request_status = serializers.SerializerMethodField()

    production_request_id = serializers.SerializerMethodField()

    class Meta:

        model = ProductionBatch

        fields = "__all__"

        read_only_fields = [

            "batch_number",

            "created_at",

            "inspection_complete",
        ]

    def get_mid_code(self,obj):
        sample = (obj.production.product.development_sample)
        if not sample:
            return None
        return sample.mid_code

    def get_current_stage(self, obj):

        stage = obj.current_stage

        if isinstance(stage, str):

            return stage

        return stage.stage_name
        
    def get_sr_number(self, obj):

        return obj.production.product.sr_number


    def get_category(self, obj):

        return obj.production.product.category


    def get_variant(self, obj):

        return obj.production.product.size_or_variant


    def get_color(self, obj):

        return obj.production.product.color


    def get_base_unit(self, obj):

        return obj.production.product.base_unit


    def get_job_card_status(self, obj):

        return obj.production.status


    def get_production_request_status(self, obj):

        return obj.production.production_request.status


    def get_production_request_id(self, obj):

        return obj.production.production_request.id

    def get_inspection_complete(self,obj):

        return (obj.remaining_for_inspection == 0)

    def get_product_name(self, obj):

        return (obj.production.product.product_name)


    def get_job_card_number(self, obj):

        return (obj.production.job_card_number)


    def get_source_type(self, obj):

        return (obj.production.production_request.source_type)


    def get_image(self, obj):

        image = obj.production.product.image
        if image:
            return image.url
        return None

    def get_units_per_base_unit(self, obj):
        return (obj.production.product.units_per_base_unit)

    def get_sales_order_number(
        self,
        obj
    ):

        request = (
            obj.production
            .production_request
        )

        if request.source_type != "SALES_ORDER":

            return None

        line = request.sales_order_line

        if not line:

            return None

        return (
            line.sales_order.order_number
        )


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


class ProductionSerializer(serializers.ModelSerializer):

    class Meta:

        model = Production

        fields = [

            "id",

            "production_request",

            "product",

            "planned_quantity",

            "production_date",

            "remarks",

            "status",

            "job_card_number",

            "created_at",

            "updated_at",

        ]

        read_only_fields = [

            
            "job_card_number",

            "product",
            
            "status",

            "created_at",

            "updated_at",

        ]

    def validate(self, data):

        production_request = data["production_request"]

        planned_quantity = data["planned_quantity"]

        allocated = sum(

            production_request.job_cards.values_list(

                "planned_quantity",

                flat=True,

            )

        )

        remaining = max(

            production_request.requested_quantity - allocated,

            0,

        )

        if planned_quantity > remaining:

            raise serializers.ValidationError(

                f"Only {remaining} quantity remains available."

            )

        return data

    def create(self, validated_data):

        production_request = validated_data["production_request"]

        validated_data["product"] = (

            production_request
            .sales_order_line
            .product

        )

        return super().create(validated_data)
        
# =====================================================
# PRODUCTION / JOB CARD DETAIL
# =====================================================

class ProductionDetailSerializer(serializers.Serializer):

    header = serializers.SerializerMethodField()

    product = serializers.SerializerMethodField()

    planning_summary = serializers.SerializerMethodField()

    quantity_summary = serializers.SerializerMethodField()

    batch_summary = serializers.SerializerMethodField()

    progress_summary = serializers.SerializerMethodField()

    workflow = serializers.SerializerMethodField()

    footer = serializers.SerializerMethodField()

    # =================================================
    # HEADER
    # =================================================

    def get_header(self, obj):

        production_request = obj.production_request

        sales_order_line = production_request.sales_order_line

        sales_order = (
            sales_order_line.sales_order
            if sales_order_line
            else None
        )

        return {

            "job_card_id": obj.id,

            "product_name": obj.product.product_name,
            
            "job_card_number": obj.job_card_number,

            "status": obj.status,

            "status_display": obj.get_status_display(),

            "production_request_id": production_request.id,

            "production_request_number": (
                f"PR-{production_request.id}"
            ),

            "sales_order_id": (
                sales_order.id
                if sales_order
                else None
            ),

            "sales_order_number": (
                sales_order.order_number
                if sales_order
                else None
            ),

            "customer_name": (
                str(sales_order.customer)
                if sales_order
                else None
            ),

            "production_request_status": production_request.status,

            "production_request_status_display": production_request.get_status_display(),

            "production_date": obj.production_date,

            "remarks": obj.remarks,
        }

    # =================================================
    # PRODUCT
    # =================================================

    def get_product(self, obj):

        product = obj.product

        return {

            "id": product.id,

            "sr_number": product.sr_number,

            "product_name": product.product_name,

            "category": product.category,

            "color": product.color,

            "variant": product.size_or_variant,

            "base_unit": product.base_unit,

            "units_per_base_unit": product.units_per_base_unit,

            "image": (
                product.image.url
                if product.image
                else None
            ),
        }

    # =================================================
    # PLANNING SUMMARY
    # =================================================

    def get_planning_summary(self, obj):

        return {

            "planned_quantity": obj.planned_quantity,

            "allocated_to_batches": obj.allocated_to_batches,

            "remaining_to_batch": obj.remaining_to_batch,

        }

    # =================================================
    # QUANTITY SUMMARY
    # =================================================

    def get_quantity_summary(self, obj):

        return {

            "planned_quantity": obj.planned_quantity,

            "accepted_quantity": obj.accepted_quantity,

            "rejected_quantity": obj.rejected_quantity,

            "produced_quantity": obj.produced_quantity,

            "remaining_quantity": obj.remaining_quantity,

            "completion_percentage": obj.completion_percentage,

        }

    # =================================================
    # BATCH SUMMARY
    # =================================================

    def get_batch_summary(self, obj):

        batches = obj.batches.all().order_by("id")

        return ProductionBatchSerializer(

            batches,

            many=True,

            context=self.context,

        ).data

    # =================================================
    # PROGRESS SUMMARY
    # =================================================

    def get_progress_summary(self, obj):

        return {

            "total_batches": obj.batches.count(),

            "completed_batches": obj.batches.filter(
                status="PRODUCTION_COMPLETE"
            ).count(),

            "remaining_batches": obj.batches.exclude(
                status="PRODUCTION_COMPLETE"
            ).count(),

            "completion_percentage": (
                round(
                    (
                        obj.batches.filter(
                            status="PRODUCTION_COMPLETE"
                        ).count()
                        /
                        obj.batches.count()
                    ) * 100,
                    2,
                )
                if obj.batches.exists()
                else 0
            ),
        }

    # =================================================
    # WORKFLOW
    # =================================================

    def get_workflow(self, obj):

        if obj.can_create_batch:

            next_action = "CREATE_BATCH"

            next_action_display = "Create Batch"

        elif obj.status == "PRODUCTION_COMPLETE":

            next_action = "PROCEED_TO_INSPECTION"

            next_action_display = "Proceed to Inspection"

        else:

            next_action = "WAIT_FOR_BATCH_COMPLETION"

            next_action_display = "Waiting for Batch Completion"

        return {

            "production_id": obj.id,

            "status": obj.status,

            "status_display": obj.get_status_display(),

            "can_create_batch": obj.can_create_batch,

            "remaining_to_batch": obj.remaining_to_batch,

            "next_action": next_action,

            "next_action_display": next_action_display,

        }

    # =================================================
    # FOOTER
    # =================================================

    def get_footer(self, obj):

        return {

            "created_at": obj.created_at,

            "updated_at": obj.updated_at,

            "created_by": str(obj.created_by),

        }
    



# =====================================================
# PRODUCTION / JOB CARD LIST
# =====================================================

class ProductionListSerializer(serializers.ModelSerializer):

    order_number = serializers.SerializerMethodField()

    customer_name = serializers.SerializerMethodField()

    sr_number = serializers.SerializerMethodField()

    sales_order_id = serializers.IntegerField(
        source="production_request.sales_order_line.sales_order.id",
        read_only=True,
    )

    product_name = serializers.CharField(
        source="product.product_name",
        read_only=True,
    )

    accepted_quantity = serializers.SerializerMethodField()

    rejected_quantity = serializers.SerializerMethodField()

    produced_quantity = serializers.SerializerMethodField()

    remaining_quantity = serializers.SerializerMethodField()

    completion_percentage = serializers.SerializerMethodField()

    class Meta:

        model = Production

        fields = [

            "id",

            "job_card_number",

            "status",

            "production_request",

            "sales_order_id",

            "product",

            "product_name",

            "order_number",

            "customer_name",

            "sr_number",

            "planned_quantity",

            "accepted_quantity",

            "rejected_quantity",

            "produced_quantity",

            "remaining_quantity",

            "completion_percentage",

            "production_date",

            "created_at",

        ]

        read_only_fields = fields

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


    def get_accepted_quantity(self, obj):

        return obj.accepted_quantity


    def get_rejected_quantity(self, obj):

        return obj.rejected_quantity


    def get_produced_quantity(self, obj):

        return obj.produced_quantity


    def get_remaining_quantity(self, obj):

        return obj.remaining_quantity


    def get_completion_percentage(self, obj):

        return obj.completion_percentage