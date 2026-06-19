"""
URL configuration for core project.
"""

from django.contrib import admin
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static

from rest_framework.routers import DefaultRouter

# =====================================================
# PRODUCTION
# =====================================================

from production.views import (
    ProductionViewSet,
    ProductionRequestViewSet,
    ProductionBatchViewSet,
    BatchStageViewSet,
)

# =====================================================
# PACKING / INSPECTION
# =====================================================

from packing.views import (
    InspectionViewSet,
    PacketViewSet,
)

# =====================================================
# FINISHED STOCK
# =====================================================

from finished_stock.views import (
    FinishedStockPacketViewSet,
    FinishedStockMovementViewSet,
)

# =====================================================
# DISPATCH
# =====================================================

from dispatch.views import (
    DispatchViewSet,
)

# =====================================================
# SALES
# =====================================================

from sales.views import (
    PendingSalesOrderLineViewSet,
    SalesOrderLineViewSet,
    SalesOrderViewSet,
)

# =====================================================
# INVOICING
# =====================================================

from invoicing.views import (
    SalesInvoiceViewSet,
    PaymentViewSet,
)

# =====================================================
# RAW MATERIALS
# =====================================================

from raw_materials.views import (
    RawMaterialViewSet,
)

# =====================================================
# RECIPES
# =====================================================

from recipes.views import (
    RecipeViewSet,
)

# =====================================================
# SAMPLING
# =====================================================

from sampling.views import (
    DevelopmentSampleViewSet,
)


router = DefaultRouter()

# =====================================================
# PRODUCTION
# =====================================================

router.register(
    r"production-requests",
    ProductionRequestViewSet,
    basename="production-request",
)

router.register(
    r"production",
    ProductionViewSet,
    basename="production",
)

router.register(
    r"production-batches",
    ProductionBatchViewSet,
    basename="production-batch",
)

router.register(
    r"batch-stages",
    BatchStageViewSet,
    basename="batch-stage",
)


# =====================================================
# INSPECTION / PACKING
# =====================================================

router.register(
    r"inspections",
    InspectionViewSet,
    basename="inspection",
)

router.register(
    r"packets",
    PacketViewSet,
    basename="packet",
)

# =====================================================
# FINISHED STOCK
# =====================================================

router.register(
    r"stock",
    FinishedStockPacketViewSet,
    basename="stock",
)

router.register(
    r"stock-movements",
    FinishedStockMovementViewSet,
    basename="stock-movement",
)

# =====================================================
# DISPATCH
# =====================================================

router.register(
    r"dispatch",
    DispatchViewSet,
    basename="dispatch",
)

# =====================================================
# SALES
# =====================================================

router.register(
    r"sales-orders",
    SalesOrderViewSet,
    basename="sales-order",
)

router.register(
    r"sales-order-lines",
    SalesOrderLineViewSet,
    basename="sales-order-line",
)

router.register(
    r"pending-sales-order-lines",
    PendingSalesOrderLineViewSet,
    basename="pending-sales-order-lines",
)
    
# =====================================================
# INVOICING
# =====================================================

router.register(
    r"invoices",
    SalesInvoiceViewSet,
    basename="invoice",
)

router.register(
    r"payments",
    PaymentViewSet,
    basename="payment",
)

# =====================================================
# RAW MATERIALS
# =====================================================

router.register(
    r"raw-materials",
    RawMaterialViewSet,
)

# =====================================================
# RECIPES
# =====================================================

router.register(
    r"recipes",
    RecipeViewSet,
)

# =====================================================
# DEVELOPMENT SAMPLES
# =====================================================

router.register(
    r"development-samples",
    DevelopmentSampleViewSet,
)

# =====================================================
# URL PATTERNS
# =====================================================

urlpatterns = [

    path(
        "admin/",
        admin.site.urls
    ),

    path(
        "api/",
        include(router.urls)
    ),

    path(
        "api/dashboard/",
        include("dashboard.urls"),
    ),

    path(
        "api/auth/",
        include("authentication.urls"),
    ),

    path(
        "api/",
        include("customers.urls"),
    ),

    path(
        "api/",
        include("product_master.urls"),
    ),

    path(
        "api/",
        include("inventory.urls"),
    ),

    path(
        "api/",
        include("grn.urls"),
    ),

    path(
        "api/",
        include("vendors.urls"),
    ),

    path(
        "api/",
        include("raw_materials.urls"),
    ),

    path(
        "api/",
        include("purchases.urls"),
    ),
]

urlpatterns += static(
    settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT,
)

