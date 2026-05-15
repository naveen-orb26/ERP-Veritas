from django.shortcuts import render

from rest_framework import viewsets

from rest_framework.permissions import (
    IsAuthenticated
)

from .models import Product
from .serializers import (
    ProductListSerializer,
    ProductDetailSerializer,
    ProductCreateUpdateSerializer
)


class ProductViewSet(
    viewsets.ModelViewSet
):

    permission_classes = [
        IsAuthenticated
    ]

    queryset = (
        Product.objects
        .all()
        .order_by("product_name")
    )

    def get_serializer_class(self):

        if self.action == "list":

            return ProductListSerializer

        if self.action == "retrieve":

            return ProductDetailSerializer

        return ProductCreateUpdateSerializer