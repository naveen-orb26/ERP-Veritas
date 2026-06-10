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

from purchases.models import (
    PurchaseOrder,
    PurchaseOrderLine,
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

        # =====================================
        # UPDATE PURCHASE ORDER RECEIPTS
        # =====================================

        if grn.purchase_order:

            po = grn.purchase_order

            for grn_line in grn.lines.all():

                try:

                    po_line = (

                        po.lines.get(
                            material_source=
                            grn_line.material_source
                        )
                    )

                except PurchaseOrderLine.DoesNotExist:

                    continue

                po_line.received_quantity += (
                    grn_line.received_quantity
                )

                po_line.pending_quantity = (

                    po_line.ordered_quantity
                    -
                    po_line.received_quantity
                )

                if po_line.pending_quantity < 0:

                    po_line.pending_quantity = 0

                po_line.save()

            all_lines_received = True

            for line in po.lines.all():

                if line.pending_quantity > 0:

                    all_lines_received = False

                    break


            if all_lines_received:

                po.status = "RECEIVED"

            else:

                po.status = (
                    "PARTIALLY_RECEIVED"
                )

            po.save()
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

        po = grn.purchase_order

        for grn_line in grn.lines.all():

            try:

                po_line = (

                    grn.purchase_order.lines.get(

                        material_source=
                        grn_line.material_source
                    )
                )

            except PurchaseOrderLine.DoesNotExist:

                continue

            po_line.received_quantity -= (
                grn_line.received_quantity
            )

            if po_line.received_quantity < 0:
                po_line.received_quantity = 0

            po_line.pending_quantity = (
                po_line.ordered_quantity
                -
                po_line.received_quantity
            )

            po_line.save()

        all_received = True
        any_received = False

        for line in po.lines.all():

            if line.received_quantity > 0:

                any_received = True

            if line.pending_quantity > 0:

                all_received = False


        if all_received:

            po.status = "RECEIVED"

        elif any_received:

            po.status = "PARTIALLY_RECEIVED"

        else:

            po.status = "APPROVED"

        po.save()

        grn.status = "CANCELLED"
        grn.save()

        return Response({
            "detail":
            "GRN cancelled successfully."
        })