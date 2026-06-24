from rest_framework import serializers

from .models import (
    Inspection,
    Packet,
)


class InspectionSerializer(
    serializers.ModelSerializer
):

    total_inspected = serializers.IntegerField(
        read_only=True
    )
    remaining_for_inspection = serializers.SerializerMethodField()

    product_name = serializers.CharField(
        source=(
            "batch.production.product.product_name"
        ),
        read_only=True
    )
    
    batch_quantity = serializers.IntegerField(
        source="batch.planned_quantity",
        read_only=True
    )
    
    job_card_number = serializers.CharField(
        source=(
            "batch.production.job_card_number"
        ),
        read_only=True
    )

    job_card_remaining = serializers.SerializerMethodField()

    batch_number = serializers.CharField(
        source="batch.batch_number",
        read_only=True
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

            "created_at",

            "updated_at",
        ]



    def get_order_number(
        self,
        obj
    ):

        line = (
            obj.batch
            .production
            .production_request
            .sales_order_line
        )

        if line:

            return (
                line.sales_order
                .order_number
            )

        return None

    def get_reference_number(
        self,
        obj
    ):

        request = (
            obj.batch
            .production
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


    def get_source_type(
        self,
        obj
    ):

        return (
            obj.batch
            .production
            .production_request
            .source_type
        )

    def get_remaining_for_inspection(
        self,
        obj
    ):

        return (
            obj.batch
            .remaining_for_inspection
        )

    def get_job_card_remaining(
        self,
        obj
    ):

        production = (
            obj.batch.production
        )

        produced = sum(

            inspection.accepted_quantity

            for batch in (
                production.batches.all()
            )

            for inspection in (
                batch.inspections.all()
            )
        )

        return max(

            production.planned_quantity
            -
            produced,

            0
        )

    def get_inspector_name(
        self,
        obj
    ):

        if not obj.inspected_by:

            return None

        return (
            getattr(
                obj.inspected_by,
                "email",
                str(obj.inspected_by)
            )
        )

    def validate(self, data):

        batch = data["batch"]

        if batch.status != "COMPLETED":

            raise serializers.ValidationError(

                "Batch must be completed before inspection."
            )

        accepted = data.get(
            "accepted_quantity",
            0
        )

        rejected = data.get(
            "rejected_quantity",
            0
        ) or 0

        total = (
            accepted
            +
            rejected
        )

        if total <= 0:

            raise serializers.ValidationError(

                "Inspection quantity "
                "must be greater than zero."
            )

        if (

            total

            >

            batch.remaining_for_inspection
        ):

            raise serializers.ValidationError(

                f"Only "
                f"{batch.remaining_for_inspection} "
                f"quantity remains "
                f"for inspection."
            )

        return data
    
    def get_customer_name(
        self,
        obj
    ):

        request = (
            obj.batch
            .production
            .production_request
        )

        sales_line = getattr(
            request,
            "sales_order_line",
            None
        )

        if sales_line:

            return str(
                sales_line
                .sales_order
                .customer
            )

        return None

    def get_packed_quantity(
        self,
        obj
    ):

        return (
            obj.packed_quantity
        )


    def get_remaining_to_pack(
        self,
        obj
    ):

        return (
            obj.remaining_to_pack
        )

    def create(
        self,
        validated_data
    ):

        validated_data[
            "inspected_by"
        ] = (
            self.context[
                "request"
            ].user
        )

        return super().create(
            validated_data
        )
    


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