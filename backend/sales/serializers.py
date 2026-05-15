from decimal import Decimal

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

    class Meta:

        model = SalesOrderLine

        fields = [

            "id",

            "product",

            "product_name",

            "sr_number",

            "quantity",

            "fulfilled_quantity",

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

            "fulfilled_quantity",

            "line_total",

            "gst_percentage",

            "cgst_amount",

            "sgst_amount",

            "igst_amount",
        ]


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