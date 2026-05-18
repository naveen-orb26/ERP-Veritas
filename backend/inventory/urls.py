from rest_framework.routers import DefaultRouter

from .views import (

    WarehouseViewSet,

    InventoryStockViewSet,

    StockLedgerViewSet,
)

router = DefaultRouter()

router.register(

    r"warehouses",

    WarehouseViewSet,

    basename="warehouses"
)

router.register(

    r"inventory-stocks",

    InventoryStockViewSet,

    basename="inventory-stocks"
)

router.register(

    r"stock-ledger",

    StockLedgerViewSet,

    basename="stock-ledger"
)

urlpatterns = router.urls