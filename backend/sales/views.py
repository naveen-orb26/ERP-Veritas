from rest_framework import viewsets

from rest_framework.permissions import (
    IsAuthenticated
)

from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Exists, OuterRef


from .models import SalesOrder

from .serializers import (

    SalesOrderListSerializer,

    SalesOrderDetailSerializer,

    SalesOrderCreateUpdateSerializer,

    DispatchPreviewSerializer,

    SalesOrderLineSerializer,

    SalesOrderOverviewSerializer,

    ProductionRequest,

)
    
from .models import SalesOrderLine



class SalesOrderViewSet(

    viewsets.ModelViewSet
):

    permission_classes = [
        IsAuthenticated
    ]

    queryset = (
        SalesOrder.objects
        .select_related(
            "customer",
            "created_by"
        )
        .prefetch_related(
            "lines"
        )
        .order_by("-id")
    )

    # =================================================
    # SERIALIZER SWITCHING
    # =================================================

    def get_serializer_class(self):

        if self.action == "list":

            return (
                SalesOrderListSerializer
            )

        if self.action == "overview":

            return (
                SalesOrderOverviewSerializer
            )

        if self.action == "retrieve":

            return (
                SalesOrderDetailSerializer
            )

        return (
            SalesOrderCreateUpdateSerializer
        )

    # =================================================
    # STATUS ACTIONS
    # =================================================

    @action(
        detail=True,
        methods=["post"]
    )
    def confirm(
        self,
        request,
        pk=None
    ):

        order = self.get_object()

        if order.status != "DRAFT":

            return Response({

                "detail":
                    "Only draft orders "
                    "can be confirmed."
            }, status=400)

        order.status = "CONFIRMED"

        order.save(
            update_fields=["status"]
        )

        return Response({

            "detail":
                "Sales order confirmed."
        })

    @action(
        detail=True,
        methods=["post"]
    )
    def hold(
        self,
        request,
        pk=None
    ):

        order = self.get_object()

        if order.status in [

            "CANCELLED",

            "CLOSED"
        ]:

            return Response({

                "detail":
                    "Closed or cancelled "
                    "orders cannot be "
                    "put on hold."
            }, status=400)

        order.status = "ON_HOLD"

        order.save(
            update_fields=["status"]
        )

        return Response({

            "detail":
                "Sales order put on hold."
        })


    @action(
        detail=True,
        methods=["post"]
    )
    def resume(
        self,
        request,
        pk=None
    ):

        order = self.get_object()

        if order.status != "ON_HOLD":

            return Response({

                "detail":
                    "Only orders on hold "
                    "can be resumed."

            }, status=400)

        order.status = "DRAFT"

        order.save(
            update_fields=["status"]
        )

        return Response({

            "detail":
                "Sales order resumed."

        })



    @action(
        detail=True,
        methods=["post"]
    )
    def cancel(
        self,
        request,
        pk=None
    ):

        order = self.get_object()

        if order.status == "DISPATCHED":

            return Response({

                "detail":
                    "Dispatched orders "
                    "cannot be cancelled."
            }, status=400)

        order.status = "CANCELLED"

        order.save(
            update_fields=["status"]
        )

        return Response({

            "detail":
                "Sales order cancelled."
        })

    @action(
        detail=True,
        methods=["post"]
    )
    def mark_in_production(
        self,
        request,
        pk=None
    ):

        order = self.get_object()

        if order.status != "CONFIRMED":

            return Response({

                "detail":
                    "Only confirmed orders "
                    "can move to production."
            }, status=400)

        order.status = (
            "IN_PRODUCTION"
        )

        order.save(
            update_fields=["status"]
        )

        return Response({

            "detail":
                "Sales order moved to "
                "production."
        })

    @action(
        detail=True,
        methods=["post"]
    )
    def mark_qc_pending(
        self,
        request,
        pk=None
    ):

        order = self.get_object()

        if order.status != (
            "IN_PRODUCTION"
        ):

            return Response({

                "detail":
                    "Only production orders "
                    "can move to QC."
            }, status=400)

        order.status = (
            "QC_PENDING"
        )

        order.save(
            update_fields=["status"]
        )

        return Response({

            "detail":
                "Sales order moved to QC."
        })

    @action(
        detail=True,
        methods=["post"]
    )
    def mark_ready_dispatch(
        self,
        request,
        pk=None
    ):

        order = self.get_object()

        if order.status != (
            "QC_PENDING"
        ):

            return Response({

                "detail":
                    "Only QC-completed orders "
                    "can be marked ready "
                    "for dispatch."
            }, status=400)

        order.status = (
            "READY_TO_DISPATCH"
        )

        order.save(
            update_fields=["status"]
        )

        return Response({

            "detail":
                "Sales order ready "
                "for dispatch."
        })

    @action(
        detail=True,
        methods=["get"],
        url_path="dispatch-preview",
    )
    def dispatch_preview(
        self,
        request,
        pk=None
    ):

        order = self.get_object()

        serializer = DispatchPreviewSerializer(
            order
        )

        return Response(
            serializer.data
        )
    @action(
        detail=True,
        methods=["get"],
        url_path="overview",
    )
    def overview(
        self,
        request,
        pk=None
    ):

        order = self.get_object()

        serializer = (
            SalesOrderOverviewSerializer(
                order
            )
        )

        return Response(
            serializer.data
        )

class SalesOrderLineViewSet(
    viewsets.ReadOnlyModelViewSet
):

    queryset = (
        SalesOrderLine.objects
        .select_related(
            "sales_order",
            "sales_order__customer",
            "product",
        )
        .order_by("-id")
    )

    serializer_class = (
        SalesOrderLineSerializer
    )

from django.db.models import F

class PendingSalesOrderLineViewSet(
    viewsets.ReadOnlyModelViewSet
):

    serializer_class = (
        SalesOrderLineSerializer
    )

    queryset = (

    SalesOrderLine.objects

    .select_related(
        "sales_order",
        "sales_order__customer",
        "product",
    )

    .annotate(

        active_production_request=Exists(

            ProductionRequest.objects.filter(

                sales_order_line=OuterRef("pk")

            ).exclude(

                status="CANCELLED"

            )

        )

    )

    .filter(

        sales_order__status="CONFIRMED",

        quantity__gt=F(

            "fulfilled_quantity"

        ),

        active_production_request=False,

    )

    .order_by(

        "sales_order__order_date"

    )

)