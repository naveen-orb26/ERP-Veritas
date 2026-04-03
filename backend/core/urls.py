"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from packing.views import InspectionViewSet, PacketViewSet, PackingEntryView
from production.views import ProductionViewSet
from finished_stock.views import (
    FinishedStockPacketViewSet,
    FinishedStockMovementViewSet,
)
from dispatch.views import DispatchViewSet
from sales.views import SalesOrderViewSet

from invoicing.views import SalesInvoiceViewSet
from invoicing.views import PaymentViewSet

from purchases.views import SupplierViewSet
from purchases.views import PurchaseOrderViewSet
from purchases.views import PurchaseInvoiceViewSet
from purchases.views import GRNViewSet
from purchases.views import RawStockMovementViewSet

from reporting.views import (
    RawMaterialStockSummaryView,
    FinishedGoodsStockSummaryView,
    DispatchSummaryView,
    SalesOrderProgressView,
    OutstandingPaymentsView,
    PurchaseSummaryView,

    LowStockAlertView,
    OrderDelayReportView,
    AgingInventoryView,
    ProductionDispatchBalanceView,
    DailyProductionReportView,
)
router = DefaultRouter()

router.register(r'production', ProductionViewSet, basename='production')

router.register(r"inspections", InspectionViewSet, basename="inspection")
router.register(r"packets", PacketViewSet, basename="packet")

router.register(r"stock", FinishedStockPacketViewSet, basename="stock")
router.register(r"stock-movements", FinishedStockMovementViewSet, basename="stock-movement")

router.register(r"dispatch", DispatchViewSet, basename="dispatch")
router.register(r"sales-orders", SalesOrderViewSet, basename="sales-order")

router.register(r"invoices", SalesInvoiceViewSet, basename="invoice")
router.register(r"payments", PaymentViewSet, basename="payment")

router.register(r"suppliers", SupplierViewSet, basename="supplier")
router.register(r"purchase-orders", PurchaseOrderViewSet, basename="purchase-order")
router.register(r"purchase-invoices", PurchaseInvoiceViewSet, basename="purchase-invoice")
router.register(r"grn", GRNViewSet, basename="grn")
router.register(r"raw-stock", RawStockMovementViewSet, basename="raw-stock-movement")




urlpatterns = [
    path('admin/', admin.site.urls),
    # production routes
    path('api/', include(router.urls)),
    path("api/packing-entry/", PackingEntryView.as_view()),
    path( "api/reports/raw-material-stock/", RawMaterialStockSummaryView.as_view(),),
    path("api/reports/finished-goods-stock/", FinishedGoodsStockSummaryView.as_view(),),
    path("api/reports/dispatch-summary/", DispatchSummaryView.as_view(),),
    path("api/reports/sales-order-progress/", SalesOrderProgressView.as_view(),),
    path("api/reports/outstanding-payments/", OutstandingPaymentsView.as_view(),),
    path("api/reports/purchase-summary/", PurchaseSummaryView.as_view(),),
    path("api/reports/low-stock/", LowStockAlertView.as_view()),
    path("api/reports/order-delay/", OrderDelayReportView.as_view()),
    path("api/reports/aging-inventory/", AgingInventoryView.as_view()),
    path("api/reports/production-dispatch/", ProductionDispatchBalanceView.as_view()),
    path("api/reports/daily-production/", DailyProductionReportView.as_view()),
]