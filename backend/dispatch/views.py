from rest_framework import viewsets

from core.permissions import IsEmployee

from .models import Dispatch
from .serializers import DispatchSerializer


class DispatchViewSet(
    viewsets.ModelViewSet
):

    permission_classes = [IsEmployee]

    queryset = (
        Dispatch.objects
        .prefetch_related(
            "packets",
            "packets__packet",
        )
        .select_related(
            "sales_order_line",
        )
        .order_by("-id")
    )

    serializer_class = DispatchSerializer