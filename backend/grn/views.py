from django.shortcuts import render

from grn.services import apply_grn_inventory, reverse_grn_inventory
from rest_framework import viewsets

from .models import (
    GRN,
)

from .serializers import (

    GRNListSerializer,

    GRNDetailSerializer,

    GRNCreateUpdateSerializer,
)

from rest_framework.decorators import (
    action
)

from rest_framework.response import (
    Response
)

from rest_framework import status


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
    
    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):

        grn = self.get_object()

        if grn.status != "DRAFT":
            return Response(
                {
                    "detail":
                    "Only draft GRNs can be approved."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        grn.status = "APPROVED"
        grn.save()

        apply_grn_inventory(grn)

        return Response({
            "detail":
            "GRN approved successfully."
        })
        

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):

        grn = self.get_object()

        if grn.status != "APPROVED":
            return Response(
                {
                    "detail":
                    "Only approved GRNs can be cancelled."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        reverse_grn_inventory(grn)

        grn.status = "CANCELLED"
        grn.save()

        return Response({
            "detail":
            "GRN cancelled successfully."
        })