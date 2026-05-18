from rest_framework import status

from rest_framework.decorators import action

from rest_framework.response import Response

from rest_framework.viewsets import ModelViewSet

from .models import (

    Warehouse,

    InventoryStock,

    StockLedger,
)

from .serializers import (

    WarehouseSerializer,

    InventoryStockSerializer,

    StockLedgerSerializer,

    ManualStockMovementSerializer,
)

from .services import (

    manual_stock_receipt,

    manual_stock_issue,
)

from product_master.models import Product


# =====================================================
# WAREHOUSE VIEWSET
# =====================================================

class WarehouseViewSet(
    ModelViewSet
):

    queryset = (
        Warehouse.objects.all()
        .order_by("warehouse_name")
    )

    serializer_class = (
        WarehouseSerializer
    )


# =====================================================
# INVENTORY STOCK VIEWSET
# =====================================================

class InventoryStockViewSet(
    ModelViewSet
):

    queryset = (
        InventoryStock.objects
        .select_related(

            "product",

            "warehouse",
        )
        .order_by("-updated_at")
    )

    serializer_class = (
        InventoryStockSerializer
    )

    http_method_names = [

        "get",
    ]


# =====================================================
# STOCK LEDGER VIEWSET
# =====================================================

class StockLedgerViewSet(
    ModelViewSet
):

    queryset = (
        StockLedger.objects
        .select_related(

            "product",

            "warehouse",

            "created_by",
        )
        .order_by("-movement_date")
    )

    serializer_class = (
        StockLedgerSerializer
    )

    http_method_names = [

        "get",
    ]

    # -------------------------------------------------
    # MANUAL STOCK RECEIPT
    # -------------------------------------------------

    @action(

        detail=False,

        methods=["post"],

        url_path="manual-receipt"
    )

    def manual_receipt(
        self,
        request,
    ):

        serializer = (
            ManualStockMovementSerializer(
                data=request.data
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        warehouse = (
            Warehouse.objects.get(
                id=serializer.validated_data[
                    "warehouse"
                ]
            )
        )

        product = (
            Product.objects.get(
                id=serializer.validated_data[
                    "product"
                ]
            )
        )

        ledger_entry = (
            manual_stock_receipt(

                warehouse=warehouse,

                product=product,

                quantity=serializer.validated_data[
                    "quantity"
                ],

                created_by=request.user,

                remarks=serializer.validated_data.get(
                    "remarks",
                    "",
                ),
            )
        )

        return Response(

            StockLedgerSerializer(
                ledger_entry
            ).data,

            status=status.HTTP_201_CREATED
        )

    # -------------------------------------------------
    # MANUAL STOCK ISSUE
    # -------------------------------------------------

    @action(

        detail=False,

        methods=["post"],

        url_path="manual-issue"
    )

    def manual_issue(
        self,
        request,
    ):

        serializer = (
            ManualStockMovementSerializer(
                data=request.data
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        warehouse = (
            Warehouse.objects.get(
                id=serializer.validated_data[
                    "warehouse"
                ]
            )
        )

        product = (
            Product.objects.get(
                id=serializer.validated_data[
                    "product"
                ]
            )
        )

        ledger_entry = (
            manual_stock_issue(

                warehouse=warehouse,

                product=product,

                quantity=serializer.validated_data[
                    "quantity"
                ],

                created_by=request.user,

                remarks=serializer.validated_data.get(
                    "remarks",
                    "",
                ),
            )
        )

        return Response(

            StockLedgerSerializer(
                ledger_entry
            ).data,

            status=status.HTTP_201_CREATED
        )