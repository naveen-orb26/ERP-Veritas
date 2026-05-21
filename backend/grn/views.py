from django.shortcuts import render

from rest_framework import viewsets

from .models import (
    GRN,
)

from .serializers import (

    GRNListSerializer,

    GRNDetailSerializer,

    GRNCreateUpdateSerializer,
)


# =====================================================
# GRN VIEWSET
# =====================================================

class GRNViewSet(

    viewsets.ModelViewSet
):

    queryset = (
        GRN.objects
        .prefetch_related(
            "lines"
        )
        .select_related(
            "vendor"
        )
        .order_by("-created_at")
    )

    def get_serializer_class(self):

        if self.action == "list":

            return GRNListSerializer

        if self.action == "retrieve":

            return GRNDetailSerializer

        return (
            GRNCreateUpdateSerializer
        )