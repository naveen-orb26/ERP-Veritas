from decimal import Decimal

from django.utils import timezone
from django.db import transaction

from rest_framework import serializers

from customers.models import Customer

from product_master.models import Product

from core.services.company import (
    get_company_state
)

from .models import (
    SalesOrder,
    SalesOrderLine,
    SalesOrderEditLog,
)

from production.models import (
    ProductionRequest,
    Production,
    ProductionBatch,
)

from packing.models import (
    Inspection,
    Packet,
)

from dispatch.models import (
    DispatchItem,
)

# =====================================================
# GST HELPERS
# =====================================================

def calculate_gst_breakup(

    *,
    customer_state,
    gst_percentage,
    line_total,
):

    company_state = (
        get_company_state()
    )

    gst_percentage = Decimal(
        gst_percentage
    )

    line_total = Decimal(
        line_total
    )

    total_tax = (

        line_total
        *
        gst_percentage

    ) / Decimal("100")

    cgst_amount = Decimal("0")

    sgst_amount = Decimal("0")

    igst_amount = Decimal("0")

    # -----------------------------------------
    # SAME STATE
    # -----------------------------------------

    if (

        customer_state.strip().lower()

        ==

        company_state.strip().lower()
    ):

        half_tax = (
            total_tax / Decimal("2")
        )

        cgst_amount = half_tax

        sgst_amount = half_tax

    # -----------------------------------------
    # INTERSTATE
    # -----------------------------------------

    else:

        igst_amount = total_tax

    return {

        "cgst_amount":
            cgst_amount,

        "sgst_amount":
            sgst_amount,

        "igst_amount":
            igst_amount,

        "total_tax":
            total_tax,
    }


# =====================================================
# SALES ORDER LINE SERIALIZER
# =====================================================

class SalesOrderLineSerializer(
    serializers.ModelSerializer
):

    product_name = serializers.CharField(
        source="product.product_name",
        read_only=True
    )
    pending_quantity = serializers.IntegerField(
        read_only=True
    )
        
    order_number = serializers.CharField(
        source="sales_order.order_number",
        read_only=True
    )

    customer_name = serializers.CharField(
        source="sales_order.customer.name",
        read_only=True
    )
    sales_order = serializers.PrimaryKeyRelatedField(
        read_only=True
    )

    pending_production_quantity = serializers.SerializerMethodField()

    class Meta:

        model = SalesOrderLine

        fields = [

            "id",
            
            "sales_order",

            "product",

            "sr_number",
            
            "product_name",
            
            "order_number",
            
            "customer_name",

            "quantity",
            
            "pending_quantity",
          
            "fulfilled_quantity",

            "pending_production_quantity",

            "unit_price",

            "line_total",

            "gst_percentage",

            "cgst_amount",

            "sgst_amount",

            "igst_amount",

            "remarks",
        ]

        read_only_fields = [

            "sr_number",

            "sales_order",

            "fulfilled_quantity",

            "line_total",

            "gst_percentage",

            "cgst_amount",

            "sgst_amount",

            "igst_amount",
        ]


    def get_pending_production_quantity(
        self,
        obj
    ):
        requested = sum(

            obj.production_requests.values_list(
                "requested_quantity",
                flat=True
            )
        )

        return max(
            obj.quantity - requested,
            0
        )
# =====================================================
# SALES ORDER LIST SERIALIZER
# =====================================================

class SalesOrderListSerializer(
    serializers.ModelSerializer
):

    customer_name = serializers.CharField(
        source="customer.name",
        read_only=True
    )

    class Meta:

        model = SalesOrder

        fields = [

            "id",

            "order_number",

            "customer_name",

            "status",

            "order_date",

            "expected_delivery_date",

            "remaining_days",

            "priority_flag",

            "total_amount",
        ]


# =====================================================
# SALES ORDER DETAIL SERIALIZER
# =====================================================

class SalesOrderDetailSerializer(
    serializers.ModelSerializer
):

    customer_name = serializers.CharField(
        source="customer.name",
        read_only=True
    )

    lines = (
        SalesOrderLineSerializer(
            many=True,
            read_only=True
        )
    )

    class Meta:

        model = SalesOrder

        fields = "__all__"

# =====================================================
# SALES ORDER CREATE / UPDATE
# =====================================================

class SalesOrderCreateUpdateSerializer(
    serializers.ModelSerializer
):

    order_date = serializers.DateField(
        required=False,
        default=timezone.localdate
    )
        
    lines = SalesOrderLineSerializer(
        many=True
    )

    class Meta:

        model = SalesOrder

        fields = [

            "customer",

            "order_date",

            "delivery_lead_days",

            "expected_delivery_date",

            "priority_flag",

            "status",

            "remarks",

            "lines",
        ]

    # =================================================
    # VALIDATIONS
    # =================================================

    def validate(self, attrs):

        lines = attrs.get("lines", [])

        if not lines:

            raise serializers.ValidationError({

                "lines": (
                    "At least one line item "
                    "is required."
                )
            })

        return attrs

    # =================================================
    # CREATE
    # =================================================

    @transaction.atomic
    def create(self, validated_data):

        request = self.context.get(
            "request"
        )

        line_data = validated_data.pop(
            "lines"
        )

        if request and request.user.is_authenticated:

            validated_data[
                "created_by"
            ] = request.user

        order = SalesOrder.objects.create(
            **validated_data
        )

        subtotal_amount = Decimal("0")

        total_tax_amount = Decimal("0")

        customer = order.customer

        # ---------------------------------------------
        # CREATE LINES
        # ---------------------------------------------

        for line in line_data:

            product = line["product"]

            quantity = Decimal(
                line["quantity"]
            )

            unit_price = Decimal(
                line["unit_price"]
            )

            line_total = (
                quantity * unit_price
            )

            gst_percentage = Decimal(
                product.gst_percentage
            )

            gst_data = (
                calculate_gst_breakup(

                    customer_state=
                        customer.state,

                    gst_percentage=
                        gst_percentage,

                    line_total=
                        line_total,
                )
            )

            SalesOrderLine.objects.create(

                sales_order=order,

                product=product,

                sr_number=
                    product.sr_number,

                quantity=
                    quantity,

                unit_price=
                    unit_price,

                line_total=
                    line_total,

                gst_percentage=
                    gst_percentage,

                cgst_amount=
                    gst_data[
                        "cgst_amount"
                    ],

                sgst_amount=
                    gst_data[
                        "sgst_amount"
                    ],

                igst_amount=
                    gst_data[
                        "igst_amount"
                    ],

                remarks=line.get(
                    "remarks",
                    ""
                )
            )

            subtotal_amount += (
                line_total
            )

            total_tax_amount += (

                gst_data[
                    "total_tax"
                ]
            )

        # ---------------------------------------------
        # ORDER TOTALS
        # ---------------------------------------------

        order.subtotal_amount = (
            subtotal_amount
        )

        order.tax_amount = (
            total_tax_amount
        )

        order.total_amount = (

            subtotal_amount
            +
            total_tax_amount
        )

        order.save()

        return order

    # =================================================
    # UPDATE
    # =================================================

    @transaction.atomic
    def update(

        self,
        instance,
        validated_data
    ):

        if self.instance:

            if self.instance.status != "DRAFT":

                raise serializers.ValidationError(

                    "Only draft sales orders can be edited."

                )
            
        request = self.context.get(
            "request"
        )

        line_data = validated_data.pop(
            "lines"
        )

        old_values = {}

        # ---------------------------------------------
        # TRACK CHANGES
        # ---------------------------------------------

        tracked_fields = [

            "customer",

            "order_date",

            "expected_delivery_date",

            "status",

            "remarks",
        ]

        for field in tracked_fields:

            old_values[field] = getattr(
                instance,
                field
            )

        # ---------------------------------------------
        # UPDATE ORDER FIELDS
        # ---------------------------------------------

        for attr, value in (
            validated_data.items()
        ):

            setattr(
                instance,
                attr,
                value
            )

        instance.save()

        # ---------------------------------------------
        # DELETE OLD LINES
        # ---------------------------------------------

        instance.lines.all().delete()

        subtotal_amount = Decimal("0")

        total_tax_amount = Decimal("0")

        customer = instance.customer

        # ---------------------------------------------
        # RECREATE LINES
        # ---------------------------------------------

        for line in line_data:

            product = line["product"]

            quantity = Decimal(
                line["quantity"]
            )

            unit_price = Decimal(
                line["unit_price"]
            )

            line_total = (
                quantity * unit_price
            )

            gst_percentage = Decimal(
                product.gst_percentage
            )

            gst_data = (
                calculate_gst_breakup(

                    customer_state=
                        customer.state,

                    gst_percentage=
                        gst_percentage,

                    line_total=
                        line_total,
                )
            )

            SalesOrderLine.objects.create(

                sales_order=instance,

                product=product,

                sr_number=
                    product.sr_number,

                quantity=
                    quantity,

                unit_price=
                    unit_price,

                line_total=
                    line_total,

                gst_percentage=
                    gst_percentage,

                cgst_amount=
                    gst_data[
                        "cgst_amount"
                    ],

                sgst_amount=
                    gst_data[
                        "sgst_amount"
                    ],

                igst_amount=
                    gst_data[
                        "igst_amount"
                    ],

                remarks=line.get(
                    "remarks",
                    ""
                )
            )

            subtotal_amount += (
                line_total
            )

            total_tax_amount += (

                gst_data[
                    "total_tax"
                ]
            )

        # ---------------------------------------------
        # UPDATE TOTALS
        # ---------------------------------------------

        instance.subtotal_amount = (
            subtotal_amount
        )

        instance.tax_amount = (
            total_tax_amount
        )

        instance.total_amount = (

            subtotal_amount
            +
            total_tax_amount
        )

        instance.save()

        # ---------------------------------------------
        # EDIT LOGGING
        # ---------------------------------------------

        for field in tracked_fields:

            old_value = old_values[field]

            new_value = getattr(
                instance,
                field
            )

            if old_value != new_value:

                SalesOrderEditLog.objects.create(

                    sales_order=instance,

                    field_name=field,

                    old_value=str(
                        old_value
                    ),

                    new_value=str(
                        new_value
                    ),

                    changed_by=request.user
                )

        return instance
    
from rest_framework import serializers

from .models import (
    SalesOrder,
    SalesOrderLine,
)


class DispatchPreviewLineSerializer(
    serializers.ModelSerializer
):

    product_name = serializers.CharField(
        source="product.product_name",
        read_only=True
    )

    ordered_quantity = serializers.IntegerField(
        source="quantity",
        read_only=True
    )

    packed_quantity = serializers.IntegerField(
        read_only=True
    )

    base_unit = serializers.CharField(
        source="product.base_unit",
        read_only=True
    )
        
    dispatched_quantity = serializers.IntegerField(
        read_only=True
    )

    remaining_to_dispatch = serializers.IntegerField(
        read_only=True
    )

    class Meta:

        model = SalesOrderLine

        fields = [

            "id",

            "sr_number",

            "product_name",

            "ordered_quantity",

            "packed_quantity",

            "base_unit",

            "dispatched_quantity",

            "remaining_to_dispatch",
        ]


class DispatchPreviewSerializer(
    serializers.ModelSerializer
):

    customer_name = serializers.CharField(
        source="customer.name",
        read_only=True
    )

    lines = DispatchPreviewLineSerializer(
        many=True,
        read_only=True
    )

    class Meta:

        model = SalesOrder

        fields = [

            "id",

            "order_number",

            "customer_name",

            "lines",
        ]


class SalesOrderOverviewLineSerializer(
    serializers.ModelSerializer
):

    product_name = serializers.CharField(
        source="product.product_name",
        read_only=True
    )

    base_unit = serializers.CharField(
        source="product.base_unit",
        read_only=True
    )

    production_requested = serializers.SerializerMethodField()

    produced_quantity = serializers.SerializerMethodField()

    inspected_quantity = serializers.SerializerMethodField()

    packed_quantity = serializers.SerializerMethodField()

    dispatched_quantity = serializers.SerializerMethodField()

    remaining_to_dispatch = serializers.SerializerMethodField()

    production_request_id = serializers.SerializerMethodField()

    batch_count = serializers.SerializerMethodField()

    inspection_count = serializers.SerializerMethodField()

    packet_count = serializers.SerializerMethodField()

    dispatch_count = serializers.SerializerMethodField()

    has_job_cards = serializers.SerializerMethodField()

    workflow_state = serializers.SerializerMethodField()

    job_card_id = serializers.SerializerMethodField()

    class Meta:

        model = SalesOrderLine

        fields = [

            "id",

            "sr_number",

            "product_name",

            "quantity",

            "fulfilled_quantity",

            "base_unit",

            "production_requested",

            "produced_quantity",

            "inspected_quantity",

            "packed_quantity",

            "dispatched_quantity",

            "remaining_to_dispatch",

            "production_request_id",

            "has_job_cards",

            "job_card_id",

            "batch_count",

            "inspection_count",

            "packet_count",

            "dispatch_count",

            "workflow_state",
        ]


    def get_workflow_state(
        self,
        obj
    ):

        request = (

            obj.production_requests

            .exclude(

                status="CANCELLED"

            )

            .first()

        )

        if not request:

            return "NO_PR"

        allocated = sum(

            request.job_cards.values_list(

                "planned_quantity",

                flat=True

            )

        )

        remaining = max(

            request.requested_quantity -

            allocated,

            0

        )

        if allocated == 0:

            return "PR_CREATED"

        if remaining > 0:

            return "PARTIALLY_ALLOCATED"

        return "FULLY_ALLOCATED"



    def get_production_requested(
        self,
        obj
    ):

        return sum(

            obj.production_requests

            .exclude(

                status="CANCELLED"

            )

            .values_list(

                "requested_quantity",

                flat=True

            )

        )

    def get_produced_quantity(
        self,
        obj
    ):

        total = 0

        requests = obj.production_requests.all()

        for request in requests:

            for production in request.job_cards.all():

                total += production.planned_quantity

        return total

    def get_inspected_quantity(
        self,
        obj
    ):

        total = 0

        requests = obj.production_requests.all()

        for request in requests:

            for production in request.job_cards.all():

                for batch in production.batches.all():

                    for inspection in batch.inspections.all():

                        total += (

                            inspection.accepted_quantity
                            +
                            (
                                inspection.rejected_quantity
                                or 0
                            )
                        )

        return total

    def get_packed_quantity(
        self,
        obj
    ):

        return sum(

            Packet.objects.filter(

                sales_order_line=obj

            ).values_list(

                "units_in_packet",

                flat=True
            )
        )

    def get_dispatched_quantity(
        self,
        obj
    ):

        return obj.dispatched_quantity

    def get_remaining_to_dispatch(
        self,
        obj
    ):

        return obj.remaining_to_dispatch
    
    def get_production_request_id(
        self,
        obj
    ):

        request = (

            obj.production_requests

            .exclude(

                status="CANCELLED"

            )

            .first()

        )
        return (
            request.id
            if request
            else None
        )


    def get_has_job_cards(
        self,
        obj
    ):

        request = (

            obj.production_requests

            .exclude(
                status="CANCELLED"
            )

            .first()

        )

        if not request:

            return False

        return request.job_cards.exists()

    def get_batch_count(
        self,
        obj
    ):

        count = 0

        for request in (

            obj.production_requests

            .exclude(

                status="CANCELLED"

            )

        ):
            for production in (
            request.job_cards.all()
        ):

                count += (
                    production.batches.count()
                )

        return count


    def get_inspection_count(
        self,
        obj
    ):

        return Inspection.objects.filter(

            batch__production__production_request__sales_order_line=obj

        ).count()


    def get_packet_count(
        self,
        obj
    ):

        return Packet.objects.filter(

            sales_order_line=obj

        ).count()


    def get_dispatch_count(
        self,
        obj
    ):

        return DispatchItem.objects.filter(

            sales_order_line=obj

        ).count()
    
    def get_job_card_id(
        self,
        obj
    ):

        request = (

            obj.production_requests

            .exclude(

                status="CANCELLED"

            )

            .first()

        )

        if not request:

            return None

        production = (

            request.job_cards

            .first()

        )

        return (

            production.id

            if production

            else None

        )

class SalesOrderOverviewSerializer(
    serializers.ModelSerializer
):

    customer_name = serializers.CharField(
        source="customer.name",
        read_only=True
    )

    lines = SalesOrderOverviewLineSerializer(
        many=True,
        read_only=True
    )

    product_count = serializers.SerializerMethodField()

    ordered_quantity = serializers.SerializerMethodField()

    dispatched_quantity = serializers.SerializerMethodField()

    completion_percentage = serializers.SerializerMethodField()

    class Meta:

        model = SalesOrder

        fields = [

            "id",

            "order_number",

            "customer_name",

            "status",

            "order_date",

            "expected_delivery_date",

            "priority_flag",

            "remarks",

            "product_count",

            "ordered_quantity",

            "dispatched_quantity",

            "completion_percentage",

            "lines",
        ]

    def get_product_count(
        self,
        obj
    ):

        return obj.lines.count()

    def get_ordered_quantity(
        self,
        obj
    ):

        return sum(

            obj.lines.values_list(

                "quantity",

                flat=True
            )
        )

    def get_dispatched_quantity(
        self,
        obj
    ):

        return sum(

            line.dispatched_quantity

            for line in obj.lines.all()
        )

    def get_completion_percentage(
        self,
        obj
    ):

        ordered = self.get_ordered_quantity(
            obj
        )

        if ordered == 0:

            return 0

        dispatched = (
            self.get_dispatched_quantity(
                obj
            )
        )

        return round(

            (
                dispatched
                /
                ordered
            )
            *
            100,

            1
        )