from django.shortcuts import render

# from rest_framework.viewsets import (
#     ReadOnlyModelViewSet
# )
from rest_framework import viewsets

from rest_framework.permissions import (
    IsAuthenticated
)

from .models import Customer

from .serializers import (
    CustomerCreateUpdateSerializer,
    CustomerDetailSerializer,
    CustomerListSerializer
)


class CustomerViewSet(
    viewsets.ModelViewSet
):

    permission_classes = [
        IsAuthenticated
    ]

    queryset = (
        Customer.objects
        .all()
        .order_by("name")
    )

    def get_serializer_class(self):

        if self.action == "list":

            return CustomerListSerializer

        if self.action == "retrieve":

            return CustomerDetailSerializer

        return CustomerCreateUpdateSerializer