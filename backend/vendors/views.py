from django.shortcuts import render
from rest_framework import viewsets

from .models import (
    Vendor,
)

from .serializers import (
    VendorSerializer,
)


# =====================================================
# VENDOR VIEWSET
# =====================================================

class VendorViewSet(

    viewsets.ModelViewSet
):

    queryset = (
        Vendor.objects
        .order_by(
            "vendor_name"
        )
    )

    serializer_class = (
        VendorSerializer
    )