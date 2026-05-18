from rest_framework import serializers

from .models import (

    Warehouse,

    InventoryStock,

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

        fields = "__all__"


# =====================================================
# INVENTORY STOCK SERIALIZERS
# =====================================================

class InventoryStockSerializer(
    serializers.ModelSerializer
):

    product_name = serializers.CharField(
        source="product.product_name",
        read_only=True
    )

    warehouse_name = serializers.CharField(
        source="warehouse.warehouse_name",
        read_only=True
    )

    warehouse_code = serializers.CharField(
        source="warehouse.warehouse_code",
        read_only=True
    )

    class Meta:

        model = InventoryStock

        fields = [

            "id",

            "warehouse",

            "warehouse_name",

            "warehouse_code",

            "product",

            "product_name",

            "current_quantity",

            "reserved_quantity",

            "available_quantity",

            "reorder_level",

            "last_movement_at",

            "created_at",

            "updated_at",
        ]


# =====================================================
# STOCK LEDGER SERIALIZERS
# =====================================================

class StockLedgerSerializer(
    serializers.ModelSerializer
):

    product_name = serializers.CharField(
        source="product.product_name",
        read_only=True
    )

    warehouse_name = serializers.CharField(
        source="warehouse.warehouse_name",
        read_only=True
    )

    created_by_name = serializers.CharField(
        source="created_by.username",
        read_only=True
    )

    class Meta:

        model = StockLedger

        fields = [

            "id",

            "warehouse",

            "warehouse_name",

            "product",

            "product_name",

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