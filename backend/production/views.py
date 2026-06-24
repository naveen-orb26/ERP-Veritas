from django.utils import timezone
from finished_stock import serializers
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

    serializer_class = (
        ProductionRequestSerializer
    )

    def perform_destroy(self, instance):

        if instance.job_cards.exists():

            raise ValidationError(
                "Cannot delete production request "
                "after job cards exist."
            )

        instance.delete()

class ProductionViewSet(
    viewsets.ModelViewSet
):

    permission_classes = [
        IsEmployee
    ]

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

        .order_by("-id")
    )

    serializer_class = (
        ProductionSerializer
    )


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

    @action(
        detail=True,
        methods=["post"],
        url_path="start-stage",
    )
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

        completed_count = (

            batch.stages

            .filter(
                status="COMPLETED"
            )

            .count()
        )

        stage = (

            batch.stages

            .filter(
                sequence=completed_count + 1
            )

            .first()
        )

        if not stage:

            return Response(
                {
                    "detail":
                        "No pending stages."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if stage.status != "PENDING":

            return Response(
                {
                    "detail":
                        "Stage cannot be started."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        stage.status = "IN_PROGRESS"

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

        remaining = (

            batch.stages

            .filter(
                status__in=[
                    "PENDING",
                    "IN_PROGRESS",
                ]
            )

            .exists()
        )

        if remaining:

            batch.status = "IN_PROGRESS"

        else:

            batch.status = "COMPLETED"

            batch.end_time = timezone.now()

        batch.save(
    update_fields=[
        "status",
        "end_time",
    ]
)   

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