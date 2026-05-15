from django.shortcuts import render

from rest_framework.viewsets import (
    ReadOnlyModelViewSet
)

from rest_framework.permissions import (
    IsAuthenticated
)

from .models import Product
from .serializers import (
    ProductListSerializer
)


class ProductViewSet(
    ReadOnlyModelViewSet
):

    serializer_class = (
        ProductListSerializer
    )

    permission_classes = [
        IsAuthenticated
    ]

    queryset = (
        Product.objects
        .filter(is_active=True)
        .order_by("product_name")
    )