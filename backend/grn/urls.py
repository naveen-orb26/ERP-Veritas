from rest_framework.routers import (
    DefaultRouter
)

from .views import (
    GRNViewSet,
)

router = DefaultRouter()

router.register(

    "grns",

    GRNViewSet,

    basename="grns"
)

urlpatterns = router.urls