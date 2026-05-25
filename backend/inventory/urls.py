from rest_framework.routers import DefaultRouter

from .views import (

    WarehouseViewSet,

    StockLedgerViewSet,
)

router = DefaultRouter()

router.register(

    r"warehouses",

    WarehouseViewSet,

    basename="warehouses"
)



router.register(

    r"stock-ledger",

    StockLedgerViewSet,

    basename="stock-ledger"
)

urlpatterns = router.urls