from django.utils import timezone
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets

from core.permissions import IsEmployee

from .models import (
    ProductionRequest,
    Production,
    ProductionBatch,
    BatchStage,
)

from .serializers import (
    ProductionRequestSerializer,
    ProductionSerializer,
    ProductionListSerializer,
    ProductionDetailSerializer,
    ProductionBatchSerializer,
    BatchStageSerializer,
)

from django.core.exceptions import ValidationError

class ProductionRequestViewSet(
    viewsets.ModelViewSet
):

    permission_classes = [IsEmployee]

    queryset = (
        ProductionRequest.objects
        .all()
        .order_by("-id")
    )

    serializer_class = ProductionRequestSerializer
    
    def perform_destroy(self, instance):

        if instance.job_cards.exists():

            raise ValidationError(
                "Cannot delete production request "
                "after job cards exist."
            )

        instance.delete()
    
    @action(
    detail=True,
    methods=["post"],
)
    def cancel(
        self,
        request,
        pk=None
    ):

        production_request = self.get_object()

        if production_request.job_cards.exists():

            return Response(

                {
                    "detail":
                        "Production Request cannot be cancelled because Job Cards already exist."
                },

                status=status.HTTP_400_BAD_REQUEST,
            )

        production_request.status = "CANCELLED"

        production_request.save(
            update_fields=["status"]
        )

        return Response(

            {
                "detail":
                    "Production Request cancelled successfully."
            }
        )
            

class ProductionViewSet(
    viewsets.ModelViewSet
):

    permission_classes = [
        IsEmployee
    ]

    def perform_create(self, serializer):

        serializer.save(
            created_by=self.request.user
        )
        
    def get_serializer_class(self):

        if self.action == "list":
            serializer = ProductionListSerializer

        elif self.action == "retrieve":
            serializer = ProductionDetailSerializer

        else:
            serializer = ProductionSerializer

        print(
            f">>> ACTION: {self.action} | SERIALIZER: {serializer.__name__}"
        )

        return serializer

    def get_queryset(self):

        queryset = (
            Production.objects
            .select_related(
                "product",
                "production_request",
                "production_request__sales_order_line",
                "production_request__sales_order_line__sales_order",
                "production_request__sales_order_line__sales_order__customer",
            )
            .prefetch_related(
                "batches",
                "batches__inspections",
                "materials",
            )
            .order_by("-created_at")
        )

        sales_order_line = self.request.query_params.get(
            "sales_order_line"
        )

        if sales_order_line:

            queryset = queryset.filter(

                production_request__sales_order_line_id=sales_order_line

            )

        return queryset



from django.utils import timezone

from rest_framework import status
from rest_framework import viewsets

from rest_framework.decorators import action
from rest_framework.response import Response

from core.permissions import IsEmployee

from .models import (
    ProductionBatch,
)

from .serializers import (
    ProductionBatchSerializer,
)


class ProductionBatchViewSet(
    viewsets.ModelViewSet
):

    permission_classes = [IsEmployee]

    queryset = (

        ProductionBatch.objects

        .select_related(
            "production",
        )

        .prefetch_related(
            "stages",
        )

        .order_by("-id")
    )

    serializer_class = (
        ProductionBatchSerializer
    )

    @property
    def current_stage(self):

        if self.status == "PLANNED":

            return "Not Started"

        if self.status == "PRODUCTION_COMPLETE":

            return "Production Complete"

        stage = (

            self.stages

            .filter(
                status="IN_PROGRESS"
            )

            .first()

        )

        if stage:

            return stage

        stage = (

            self.stages

            .filter(
                status="PENDING"
            )

            .order_by("sequence")

            .first()

        )

        if stage:

            return stage

        return "Production"

    @action(
        detail=True,
        methods=["post"],
        url_path="start-stage",
    )
    def start_stage(
        self,
        request,
        pk=None,
    ):

        batch = self.get_object()

        if batch.status == "PRODUCTION_COMPLETE":

            return Response(
                {
                    "detail":
                        "Production has already been completed."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        active_stage = (

            batch.stages

            .filter(
                status="IN_PROGRESS"
            )

            .first()

        )

        if active_stage:

            return Response(
                {
                    "detail":
                        "A stage is already in progress."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        stage = (

            batch.stages

            .filter(
                status="PENDING"
            )

            .order_by("sequence")

            .first()

        )

        if not stage:

            return Response(
                {
                    "detail":
                        "No pending stage."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        stage.status = "IN_PROGRESS"

        if not stage.started_at:

            stage.started_at = timezone.now()

        stage.save()

        if batch.status == "PLANNED":

            batch.status = "IN_PROGRESS"

            if not batch.start_time:

                batch.start_time = timezone.now()

            batch.save(
                update_fields=[
                    "status",
                    "start_time",
                ]
            )
        from .workflow import update_production_workflow

        update_production_workflow(batch)

        batch.refresh_from_db()

        return Response(

            ProductionBatchSerializer(
                batch,
                context={
                    "request": request
                }
            ).data

        )

    @action(
        detail=True,
        methods=["post"],
        url_path="complete-stage",
    )
    def complete_stage(
        self,
        request,
        pk=None,
    ):

        batch = self.get_object()

        stage = (

            batch.stages

            .filter(
                status="IN_PROGRESS"
            )

            .order_by("sequence")

            .first()

        )

        if not stage:

            return Response(
                {
                    "detail":
                        "No active stage."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        stage.status = "COMPLETED"

        stage.completed_at = timezone.now()

        stage.save()

        pending_exists = (

            batch.stages

            .filter(
                status="PENDING"
            )

            .exists()

        )

        if not pending_exists:

            batch.status = "PRODUCTION_COMPLETE"

            if not batch.end_time:

                batch.end_time = timezone.now()

            batch.save(
                update_fields=[
                    "status",
                    "end_time",
                ]
            )

        from .workflow import update_production_workflow

        update_production_workflow(batch)

        batch.refresh_from_db()

        return Response(

            ProductionBatchSerializer(
                batch,
                context={
                    "request": request
                }
            ).data

    )

class BatchStageViewSet(
    viewsets.ModelViewSet
):

    permission_classes = [IsEmployee]

    queryset = (

        BatchStage.objects

        .select_related(
            "batch"
        )

        .order_by(
            "batch_id",
            "sequence",
        )
    )

    serializer_class = (
        BatchStageSerializer
    )