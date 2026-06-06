from decimal import Decimal

from django.db import transaction

from rest_framework import serializers

from .models import (

    PurchaseOrder,

    PurchaseOrderLine,
)


# =====================================================
# PURCHASE ORDER LINE SERIALIZER
# =====================================================

class PurchaseOrderLineSerializer(

    serializers.ModelSerializer
):

    sm_code = serializers.CharField(

        source=(
            "material_source"
            ".sm_code"
        ),

        read_only=True
    )

    material_name = serializers.CharField(

        source=(
            "material_source"
            ".raw_material"
            ".material_name"
        ),

        read_only=True
    )

    material_code = serializers.CharField(

        source=(
            "material_source"
            ".raw_material"
            ".material_code"
        ),

        read_only=True
    )

    vendor_name = serializers.CharField(

        source=(
            "material_source"
            ".vendor"
            ".vendor_name"
        ),

        read_only=True
    )

    warehouse_name = serializers.CharField(

        source=(
            "warehouse"
            ".warehouse_name"
        ),

        read_only=True
    )

    class Meta:

        model = PurchaseOrderLine

        fields = [

            "id",

            "material_source",

            "sm_code",

            "material_name",

            "material_code",

            "vendor_name",

            "warehouse",

            "warehouse_name",

            "ordered_quantity",

            "received_quantity",

            "pending_quantity",

            "unit",

            "unit_cost",

            "cgst_percent",

            "sgst_percent",

            "igst_percent",

            "tax_amount",

            "line_total",

            "remarks",
        ]

        read_only_fields = [

            "received_quantity",

            "pending_quantity",

            "tax_amount",

            "line_total",
        ]


# =====================================================
# PURCHASE ORDER LIST SERIALIZER
# =====================================================

class PurchaseOrderListSerializer(

    serializers.ModelSerializer
):

    vendor_name = serializers.CharField(

        source="vendor.vendor_name",

        read_only=True
    )

    class Meta:

        model = PurchaseOrder

        fields = [

            "id",

            "po_number",

            "vendor",

            "vendor_name",

            "po_date",

            "expected_delivery_date",

            "status",

            "grand_total",

            "created_at",
        ]


# =====================================================
# PURCHASE ORDER DETAIL SERIALIZER
# =====================================================

class PurchaseOrderDetailSerializer(

    serializers.ModelSerializer
):

    vendor_name = serializers.CharField(

        source="vendor.vendor_name",

        read_only=True
    )

    lines = (
        PurchaseOrderLineSerializer(

            many=True,

            read_only=True
        )
    )

    class Meta:

        model = PurchaseOrder

        fields = [

            "id",

            "po_number",

            "vendor",

            "vendor_name",

            "po_date",

            "vendor_pr_number",

            "billing_address",

            "shipping_address",

            "company_gstin",

            "vendor_gstin",

            "lead_days",

            "expected_delivery_date",

            "subtotal",

            "total_tax_amount",

            "grand_total",

            "status",

            "remarks",

            "lines",

            "created_at",

            "updated_at",
        ]


# =====================================================
# PURCHASE ORDER CREATE UPDATE SERIALIZER
# =====================================================

class PurchaseOrderCreateUpdateSerializer(

    serializers.ModelSerializer
):

    lines = (
        PurchaseOrderLineSerializer(
            many=True
        )
    )

    class Meta:

        model = PurchaseOrder

        fields = [

            "id",

            "vendor",

            "po_date",

            "vendor_pr_number",

            "billing_address",

            "shipping_address",

            "company_gstin",

            "vendor_gstin",

            "lead_days",

            "expected_delivery_date",

            "status",

            "remarks",

            "lines",
        ]

    def validate(self, attrs):

        lines = attrs.get(
            "lines",
            []
        )

        if not lines:

            raise serializers.ValidationError(

                "Purchase order "
                "must contain at least "
                "one line item."
            )

        material_tracker = set()

        duplicate_materials = []

        for line in lines:

            material_source = (
                line["material_source"]
            )

            if (
                material_source.id
                in material_tracker
            ):

                duplicate_materials.append(

                    material_source.sm_code
                )

            material_tracker.add(
                material_source.id
            )

        if duplicate_materials:

            raise serializers.ValidationError(

                "Duplicate material "
                "sources found: "
                f"{', '.join(duplicate_materials)}"
            )

        return attrs

    @transaction.atomic
    def create(self, validated_data):

        lines_data = (
            validated_data.pop(
                "lines"
            )
        )

        purchase_order = (
            PurchaseOrder.objects.create(

                **validated_data
            )
        )

        subtotal = Decimal("0")

        total_tax_amount = Decimal("0")

        grand_total = Decimal("0")

        for line_data in lines_data:

            line = (
                PurchaseOrderLine.objects.create(

                    purchase_order=
                        purchase_order,

                    **line_data
                )
            )

            subtotal += Decimal(
                line.line_total
            ) - Decimal(
                line.tax_amount
            )

            total_tax_amount += Decimal(
                line.tax_amount
            )

            grand_total += Decimal(
                line.line_total
            )

        purchase_order.subtotal = (
            subtotal
        )

        purchase_order.total_tax_amount = (
            total_tax_amount
        )

        purchase_order.grand_total = (
            grand_total
        )

        purchase_order.save()

        return purchase_order

    @transaction.atomic
    def update(

        self,

        instance,

        validated_data
    ):

        if instance.status in [

            "APPROVED",

            "CLOSED",

            "CANCELLED",
        ]:

            raise serializers.ValidationError(

                "This purchase order "
                "cannot be modified."
            )

        lines_data = (
            validated_data.pop(
                "lines",
                []
            )
        )

        for attr, value in (
            validated_data.items()
        ):

            setattr(
                instance,
                attr,
                value
            )

        instance.save()

        instance.lines.all().delete()

        subtotal = Decimal("0")

        total_tax_amount = Decimal("0")

        grand_total = Decimal("0")

        for line_data in lines_data:

            line = (
                PurchaseOrderLine.objects.create(

                    purchase_order=
                        instance,

                    **line_data
                )
            )

            subtotal += Decimal(
                line.line_total
            ) - Decimal(
                line.tax_amount
            )

            total_tax_amount += Decimal(
                line.tax_amount
            )

            grand_total += Decimal(
                line.line_total
            )

        instance.subtotal = (
            subtotal
        )

        instance.total_tax_amount = (
            total_tax_amount
        )

        instance.grand_total = (
            grand_total
        )

        instance.save()

        return instance