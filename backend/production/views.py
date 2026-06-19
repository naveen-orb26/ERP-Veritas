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
            "materials",
        )

        .order_by("-id")
    )

    serializer_class = (
        ProductionSerializer
    )

class ProductionBatchViewSet(
    viewsets.ModelViewSet
):

    permission_classes = [IsEmployee]

    queryset = (
        ProductionBatch.objects
        .prefetch_related("stages")
        .select_related(
            "production",
        )
        .order_by("-id")
    )

    serializer_class = (
        ProductionBatchSerializer
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