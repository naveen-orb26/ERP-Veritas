from rest_framework import viewsets

from rest_framework.decorators import (
    action
)

from rest_framework.response import (
    Response
)

from rest_framework import status

from .models import (

    PurchaseOrder,
)

from .serializers import (

    PurchaseOrderListSerializer,

    PurchaseOrderDetailSerializer,

    PurchaseOrderCreateUpdateSerializer,
)


# =====================================================
# PURCHASE ORDER VIEWSET
# =====================================================

class PurchaseOrderViewSet(

    viewsets.ModelViewSet
):

    queryset = (

        PurchaseOrder.objects

        .select_related(
            "vendor"
        )

        .prefetch_related(
            "lines"
        )

        .order_by("-created_at")
    )

    def get_serializer_class(self):

        if self.action == "list":

            return (
                PurchaseOrderListSerializer
            )

        if self.action == "retrieve":

            return (
                PurchaseOrderDetailSerializer
            )

        return (
            PurchaseOrderCreateUpdateSerializer
        )

    # =================================================
    # APPROVE PURCHASE ORDER
    # =================================================

    @action(

        detail=True,

        methods=["post"]
    )

    def approve(

        self,

        request,

        pk=None
    ):

        purchase_order = (
            self.get_object()
        )

        if (
            purchase_order.status
            ==
            "CANCELLED"
        ):

            return Response(

                {
                    "detail":

                    "Cancelled purchase "
                    "order cannot be "
                    "approved."
                },

                status=(
                    status
                    .HTTP_400_BAD_REQUEST
                )
            )

        purchase_order.status = (
            "APPROVED"
        )

        purchase_order.save()

        return Response({

            "detail":
            "Purchase order approved."
        })

    # =================================================
    # CANCEL PURCHASE ORDER
    # =================================================

    @action(

        detail=True,

        methods=["post"]
    )

    def cancel(

        self,

        request,

        pk=None
    ):

        purchase_order = (
            self.get_object()
        )

        if purchase_order.status in [

            "CLOSED",

            "PARTIALLY_RECEIVED",

            "RECEIVED",
        ]:

            return Response(

                {
                    "detail":

                    "Purchase order with "
                    "received materials "
                    "cannot be cancelled."
                },

                status=(
                    status
                    .HTTP_400_BAD_REQUEST
                )
            )

        purchase_order.save()

        return Response({

            "detail":
            "Purchase order cancelled."
        })