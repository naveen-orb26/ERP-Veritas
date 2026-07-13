from rest_framework import viewsets

from core.permissions import IsEmployee

from .models import Dispatch

from .serializers import (
    DispatchSerializer,
)


class DispatchViewSet(
    viewsets.ModelViewSet
):

    permission_classes = [
        IsEmployee
    ]

    queryset = (

        Dispatch.objects

        .select_related(

            "sales_order",

            "sales_order__customer",
        )

        .prefetch_related(

            "items",

            "items__sales_order_line",

            "items__sales_order_line__product",

            "items__packets",

            "items__packets__packet",

            "items__packets__packet__inspection",

            "items__packets__packet__inspection__batch",
        )

        .order_by("-id")
    )

    serializer_class = (
        DispatchSerializer
    )