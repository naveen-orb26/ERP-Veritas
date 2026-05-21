from rest_framework.routers import (
    DefaultRouter
)

from .views import (

    RawMaterialViewSet,

    MaterialSourceViewSet,

    RawMaterialInventoryViewSet,
)

router = DefaultRouter()

router.register(

    "raw-materials",

    RawMaterialViewSet,

    basename="raw-materials"
)

router.register(

    "material-sources",

    MaterialSourceViewSet,

    basename="material-sources"
)

router.register(

    "raw-material-inventory",

    RawMaterialInventoryViewSet,

    basename="raw-material-inventory"
)

urlpatterns = router.urls