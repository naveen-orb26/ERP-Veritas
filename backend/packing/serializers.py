from rest_framework import serializers

from .models import (
    Inspection,
    Packet,
)


class InspectionCreateSerializer(
    serializers.ModelSerializer
):

    total_inspected = serializers.IntegerField(
        read_only=True
    )

    product_name = serializers.CharField(
        source="batch.production.product.product_name",
        read_only=True,
    )

    batch_quantity = serializers.IntegerField(
        source="batch.planned_quantity",
        read_only=True,
    )

    job_card_number = serializers.CharField(
        source="batch.production.job_card_number",
        read_only=True,
    )

    batch_number = serializers.CharField(
        source="batch.batch_number",
        read_only=True,
    )

    customer_name = serializers.SerializerMethodField()

    inspector_name = serializers.SerializerMethodField()

    source_type = serializers.SerializerMethodField()

    reference_number = serializers.SerializerMethodField()

    order_number = serializers.SerializerMethodField()

    packed_quantity = serializers.SerializerMethodField()

    remaining_to_pack = serializers.SerializerMethodField()

    class Meta:

        model = Inspection

        fields = "__all__"

        read_only_fields = [

            "status",

            "inspected_by",

            "created_at",

            "updated_at",

        ]

    # ==========================================
    # DISPLAY FIELDS
    # ==========================================

    def get_order_number(self, obj):

        line = (
            obj.batch
            .production
            .production_request
            .sales_order_line
        )

        if line:

            return line.sales_order.order_number

        return None

    def get_reference_number(self, obj):

        request = (
            obj.batch
            .production
            .production_request
        )

        if request.source_type == "SALES_ORDER":

            line = request.sales_order_line

            if line:

                return line.sales_order.order_number

        if request.source_type == "PROJECTION":

            return f"PRJ-{request.id}"

        return f"MAN-{request.id}"

    def get_source_type(self, obj):

        return (
            obj.batch
            .production
            .production_request
            .source_type
        )

    def get_customer_name(self, obj):

        request = (
            obj.batch
            .production
            .production_request
        )

        line = getattr(
            request,
            "sales_order_line",
            None,
        )

        if line:

            return str(
                line.sales_order.customer
            )

        return None

    def get_inspector_name(self, obj):

        if not obj.inspected_by:

            return None

        return getattr(

            obj.inspected_by,

            "email",

            str(obj.inspected_by),

        )

    def get_packed_quantity(self, obj):

        return obj.packed_quantity

    def get_remaining_to_pack(self, obj):

        return obj.remaining_to_pack

    # ==========================================
    # VALIDATION
    # ==========================================

    def validate(self, data):

        batch = data["batch"]

        instance = getattr(
            self,
            "instance",
            None,
        )

        if (
            instance is None
            and
            Inspection.objects.filter(
                batch=batch
            ).exists()
        ):

            raise serializers.ValidationError(

                "Inspection already exists for this batch."

            )

        if batch.status != "PRODUCTION_COMPLETE":

            raise serializers.ValidationError(

                "Batch must be production complete before inspection."

            )

        accepted = data.get(
            "accepted_quantity",
            0,
        )

        rejected = (
            data.get(
                "rejected_quantity",
                0,
            )
            or 0
        )

        total = accepted + rejected

        if total != batch.planned_quantity:

            raise serializers.ValidationError(

                f"Accepted ({accepted}) + "
                f"Rejected ({rejected}) "
                f"must equal Batch Quantity "
                f"({batch.planned_quantity})."

            )

        return data

    # ==========================================
    # CREATE
    # ==========================================

    def create(
        self,
        validated_data,
    ):

        validated_data["inspected_by"] = (

            self.context["request"].user

        )

        validated_data["status"] = "COMPLETED"

        return super().create(
            validated_data
        )
    

class InspectionListSerializer(
    serializers.ModelSerializer
):

    order_number = serializers.SerializerMethodField()

    customer_name = serializers.SerializerMethodField()

    product_name = serializers.CharField(
        source="batch.production.product.product_name",
        read_only=True,
    )

    job_card_number = serializers.CharField(
        source="batch.production.job_card_number",
        read_only=True,
    )

    batch_number = serializers.CharField(
        source="batch.batch_number",
        read_only=True,
    )

    batch_quantity = serializers.IntegerField(
        source="batch.planned_quantity",
        read_only=True,
    )

    packed_quantity = serializers.IntegerField(
        source="packed_quantity",
        read_only=True,
    )

    remaining_to_pack = serializers.IntegerField(
        source="remaining_to_pack",
        read_only=True,
    )

    class Meta:

        model = Inspection

        fields = [

            "id",

            "status",

            "inspection_date",

            "batch_number",

            "job_card_number",

            "order_number",

            "customer_name",

            "product_name",

            "batch_quantity",

            "accepted_quantity",

            "rejected_quantity",

            "packed_quantity",

            "remaining_to_pack",

        ]

    def get_order_number(self, obj):

        order = obj.sales_order

        return (
            order.order_number
            if order
            else None
        )

    def get_customer_name(self, obj):

        customer = obj.customer

        return (
            str(customer)
            if customer
            else None
        )
    

class InspectionDetailSerializer(
    serializers.Serializer
):

    header = serializers.SerializerMethodField()

    product = serializers.SerializerMethodField()

    inspection_summary = serializers.SerializerMethodField()

    packet_summary = serializers.SerializerMethodField()

    workflow = serializers.SerializerMethodField()

    footer = serializers.SerializerMethodField()

    # ==========================================
    # HEADER
    # ==========================================

    def get_header(self, obj):

        production = obj.batch.production

        request = production.production_request

        line = request.sales_order_line

        order = (
            line.sales_order
            if line
            else None
        )

        return {

            "inspection_id": obj.id,

            "status": obj.status,

            "status_display": obj.get_status_display(),

            "inspection_date": obj.inspection_date,

            "batch_id": obj.batch.id,

            "batch_number": obj.batch.batch_number,

            "job_card_id": production.id,

            "job_card_number": production.job_card_number,

            "production_request_id": request.id,

            "production_request_number": (
                f"PR-{request.id}"
            ),

            "sales_order_id": (
                order.id
                if order
                else None
            ),

            "sales_order_number": (
                order.order_number
                if order
                else None
            ),

            "customer_name": (
                str(order.customer)
                if order
                else None
            ),

            "remarks": obj.remarks,

        }

    # ==========================================
    # PRODUCT
    # ==========================================

    def get_product(self, obj):

        product = obj.product

        return {

            "id": product.id,

            "sr_number": product.sr_number,

            "product_name": product.product_name,

            "category": product.category,

            "colour": product.color,

            "variant": product.size_or_variant,

            "base_unit": product.base_unit,

            "units_per_base_unit": (
                product.units_per_base_unit
            ),

            "image": (
                product.image.url
                if product.image
                else None
            ),

        }

    # ==========================================
    # INSPECTION SUMMARY
    # ==========================================

    def get_inspection_summary(self, obj):

        return {

            "batch_quantity": (
                obj.batch.planned_quantity
            ),

            "accepted_quantity": (
                obj.accepted_quantity
            ),

            "rejected_quantity": (
                obj.rejected_quantity
            ),

            "total_inspected": (
                obj.total_inspected
            ),

            "completion_percentage": 100,

        }

    # ==========================================
    # PACKET SUMMARY
    # ==========================================

    def get_packet_summary(self, obj):

        packets = obj.packets.all()

        return {

            "total_packets": packets.count(),

            "packed_quantity": (
                obj.packed_quantity
            ),

            "remaining_to_pack": (
                obj.remaining_to_pack
            ),

            "packets": PacketSerializer(

                packets,

                many=True,

                context=self.context,

            ).data,

        }

    # ==========================================
    # WORKFLOW
    # ==========================================

    def get_workflow(self, obj):

        can_create_packets = (

            obj.status == "COMPLETED"

            and

            obj.remaining_to_pack > 0

        )

        return {

            "status": obj.status,

            "status_display": obj.get_status_display(),

            "can_create_packets": (
                can_create_packets
            ),

            "remaining_to_pack": (
                obj.remaining_to_pack
            ),

            "next_action": (

                "CREATE_PACKETS"

                if can_create_packets

                else "VIEW_PACKETS"

            ),

            "next_action_display": (

                "Create Packets"

                if can_create_packets

                else "View Packets"

            ),

        }

    # ==========================================
    # FOOTER
    # ==========================================

    def get_footer(self, obj):

        return {

            "created_at": obj.created_at,

            "updated_at": obj.updated_at,

            "inspected_by": (

                str(obj.inspected_by)

                if obj.inspected_by

                else None

            ),

        }

class PacketSerializer(
    serializers.ModelSerializer
):

    product_name = serializers.CharField(
        source="product.product_name",
        read_only=True
    )

    customer_name = serializers.SerializerMethodField()

    sales_order_number = (
        serializers.SerializerMethodField()
    )

    job_card_number = serializers.CharField(
        source="production.job_card_number",
        read_only=True
    )

    batch_number = serializers.CharField(
        source=
        "inspection.batch.batch_number",
        read_only=True
    )

    batch = serializers.IntegerField(
        source="inspection.batch.id",
        read_only=True
    )
        
    inspection_id = serializers.IntegerField(
        source="inspection.id",
        read_only=True
    )

    packed_quantity = (
        serializers.SerializerMethodField()
    )

    remaining_to_pack = (
        serializers.SerializerMethodField()
    )

    label_data = serializers.ReadOnlyField()

    class Meta:

        model = Packet

        fields = "__all__"

        read_only_fields = [

            "packet_number",

            "allocation_type",

            "sales_order_line",

            "created_at",
        ]

    def validate(
        self,
        data
    ):

        inspection = data["inspection"]

        qty = data["units_in_packet"]

        if qty <= 0:

            raise serializers.ValidationError(

                "Packet quantity must be greater than zero."
            )

        if (
            inspection.remaining_to_pack <= 0
        ):

            raise serializers.ValidationError(

                "This inspection has already been fully packed."
            )

        if (
            qty >
            inspection.remaining_to_pack
        ):

            raise serializers.ValidationError(

                f"Only "
                f"{inspection.remaining_to_pack} "
                f" units remain available for packing."
            )

        return data

    def get_customer_name(
        self,
        obj
    ):

        customer = obj.customer

        return (
            str(customer)
            if customer
            else None
        )

    def get_sales_order_number(
        self,
        obj
    ):

        order = obj.sales_order

        return (
            order.order_number
            if order
            else None
        )

    def get_packed_quantity(
        self,
        obj
    ):

        return (
            obj.inspection
            .packed_quantity
        )

    def get_remaining_to_pack(
        self,
        obj
    ):

        return (
            obj.inspection
            .remaining_to_pack
        )