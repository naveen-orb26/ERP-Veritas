from django.db import transaction

from rest_framework import serializers

from django.core.exceptions import (
    ValidationError
)

from .models import (
    GRN,
    GRNLine,
)

from .services import (

    apply_grn_inventory,

    reverse_grn_inventory,
)


# =====================================================
# GRN LINE
# =====================================================

class GRNLineSerializer(

    serializers.ModelSerializer
):

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

    sm_code = serializers.CharField(

        source=(
            "material_source"
            ".sm_code"
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

    class Meta:

        model = GRNLine

        fields = [

            "id",

            "warehouse",

            "material_source",

            "material_name",

            "material_code",

            "sm_code",

            "vendor_name",

            "received_quantity",

            "received_unit",

            "unit_cost",

            "tax_percent",

            "tax_amount",

            "line_total",

            "batch_reference",

            "remarks",
        ]


# =====================================================
# GRN LIST
# =====================================================

class GRNListSerializer(

    serializers.ModelSerializer
):

    vendor_name = serializers.CharField(

        source="vendor.vendor_name",

        read_only=True
    )

    class Meta:

        model = GRN

        fields = [

            "id",

            "grn_number",

            "vendor",

            "vendor_name",

            "invoice_number",

            "po_number",

            "status",

            "received_at",
        ]


# =====================================================
# GRN DETAIL
# =====================================================

class GRNDetailSerializer(

    serializers.ModelSerializer
):

    vendor_name = serializers.CharField(

        source="vendor.vendor_name",

        read_only=True
    )

    lines = GRNLineSerializer(

        many=True,

        read_only=True
    )

    class Meta:

        model = GRN

        fields = [

            "id",

            "grn_number",

            "vendor",

            "vendor_name",

            "po_number",

            "invoice_number",

            "invoice_date",

            "received_by",

            "status",

            "remarks",

            "received_at",

            "created_at",

            "updated_at",

            "lines",
        ]


# =====================================================
# GRN CREATE / UPDATE
# =====================================================

class GRNCreateUpdateSerializer(

    serializers.ModelSerializer
):

    lines = GRNLineSerializer(

        many=True
    )

    class Meta:

        model = GRN

        fields = [

            "id",

            "vendor",

            "po_number",

            "invoice_number",

            "invoice_date",

            "received_by",

            "status",

            "remarks",

            "lines",
        ]

    def validate(self, attrs):

        lines = attrs.get(
            "lines",
            []
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

        grn = GRN.objects.create(

            **validated_data
        )

        for line_data in lines_data:

            GRNLine.objects.create(

                grn=grn,

                **line_data
            )

        apply_grn_inventory(grn)

        return grn

    @transaction.atomic
    def update(

        self,

        instance,

        validated_data
    ):

        if instance.status == "CANCELLED":

            raise serializers.ValidationError(

                "Cancelled GRN cannot "
                "be modified."
            )

        previous_status = (
            instance.status
        )

        reverse_grn_inventory(
            instance
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

        for line_data in lines_data:

            GRNLine.objects.create(

                grn=instance,

                **line_data
            )

        if (
            instance.status
            !=
            "CANCELLED"
        ):

            apply_grn_inventory(
                instance
            )

        return instance