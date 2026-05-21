from rest_framework import serializers

from .models import (

    RawMaterial,

    MaterialSource,

    RawMaterialInventory,
)


# =====================================================
# RAW MATERIAL LIST
# =====================================================

class RawMaterialListSerializer(

    serializers.ModelSerializer
):

    class Meta:

        model = RawMaterial

        fields = [

            "id",

            "material_code",

            "material_name",

            "material_category",

            "base_unit",

            "minimum_quantity",

            "reorder_quantity",

            "is_active",
        ]


# =====================================================
# RAW MATERIAL DETAIL
# =====================================================

class RawMaterialDetailSerializer(

    serializers.ModelSerializer
):

    class Meta:

        model = RawMaterial

        fields = "__all__"


# =====================================================
# RAW MATERIAL CREATE / UPDATE
# =====================================================

class RawMaterialCreateUpdateSerializer(

    serializers.ModelSerializer
):

    class Meta:

        model = RawMaterial

        fields = "__all__"


# =====================================================
# MATERIAL SOURCE
# =====================================================

class MaterialSourceSerializer(

    serializers.ModelSerializer
):

    material_name = serializers.CharField(

        source=(
            "raw_material"
            ".material_name"
        ),

        read_only=True
    )

    material_code = serializers.CharField(

        source=(
            "raw_material"
            ".material_code"
        ),

        read_only=True
    )

    vendor_name = serializers.CharField(

        source=(
            "vendor"
            ".vendor_name"
        ),

        read_only=True
    )

    base_unit = serializers.CharField(

        source=(
            "raw_material"
            ".base_unit"
        ),

        read_only=True
    )

    class Meta:

        model = MaterialSource

        fields = [

            "id",

            "sm_code",

            "raw_material",

            "material_name",

            "material_code",

            "vendor",

            "vendor_name",

            "vendor_material_code",

            "base_unit",

            "remarks",

            "is_active",

            "created_at",

            "updated_at",
        ]


# =====================================================
# RAW MATERIAL INVENTORY
# =====================================================

class RawMaterialInventorySerializer(

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
            ".name"
        ),

        read_only=True
    )

    is_below_minimum = serializers.BooleanField(

        read_only=True
    )

    class Meta:

        model = RawMaterialInventory

        fields = [

            "id",

            "warehouse",

            "warehouse_name",

            "material_source",

            "sm_code",

            "material_name",

            "material_code",

            "vendor_name",

            "current_quantity",

            "reserved_quantity",

            "available_quantity",

            "remarks",

            "last_movement_at",

            "is_below_minimum",

            "created_at",

            "updated_at",
        ]