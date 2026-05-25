from rest_framework import serializers

from .models import (

    Warehouse,

      StockLedger,
)


# =====================================================
# WAREHOUSE SERIALIZERS
# =====================================================


class WarehouseSerializer(

        serializers.ModelSerializer
    ):

        class Meta:

            model = Warehouse

            fields = [

                "id",

                "warehouse_name",

                "warehouse_code",

                "warehouse_type",

                "is_active",
            ]


# =====================================================
# STOCK LEDGER SERIALIZERS
# =====================================================

class StockLedgerSerializer(
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

    chemical_identity = serializers.CharField(

        source=(
            "material_source"
            ".raw_material"
            ".chemical_identity"
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

    created_by_name = serializers.CharField(

        source=(
            "created_by"
            ".username"
        ),

        read_only=True
    )

    class Meta:

        model = StockLedger

        fields = [

            "id",

            "warehouse",

            "warehouse_name",

            "material_source",

            "sm_code",

            "material_name",

            "material_code",

            "chemical_identity",

            "vendor_name",

            "movement_type",

            "direction",

            "quantity",

            "reference_type",

            "reference_id",

            "remarks",

            "movement_date",

            "created_by",

            "created_by_name",

            "created_at",
        ]

# =====================================================
# MANUAL STOCK MOVEMENT SERIALIZER
# =====================================================

class ManualStockMovementSerializer(
    serializers.Serializer
):

    warehouse = serializers.IntegerField()

    product = serializers.IntegerField()

    quantity = serializers.DecimalField(

        max_digits=18,

        decimal_places=4
    )

    remarks = serializers.CharField(
        required=False,
        allow_blank=True
    )
