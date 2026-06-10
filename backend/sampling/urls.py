from .views import (
    DevelopmentSampleViewSet,
    DevelopmentSamplePrefillView,
)

path(
    "approved/<int:pk>/prefill/",
    DevelopmentSamplePrefillView.as_view(),
)