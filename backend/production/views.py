from rest_framework import viewsets

from .serializers import (
    ProductionRequestSerializer,
    ProductionSerializer,
    ProductionBatchSerializer,
    BatchStageSerializer,
)

from .models import (
    ProductionRequest,
    Production,
    ProductionBatch,
    BatchStage,
)

# =====================================================
# PRODUCTION REQUEST
# =====================================================

class ProductionRequestViewSet(
    viewsets.ModelViewSet
):

    queryset = (

        ProductionRequest.objects

        .all()

        .order_by("-id")
    )

    serializer_class = (
        ProductionRequestSerializer
    )


# =====================================================
# PRODUCTION / JOB CARD
# =====================================================

class ProductionViewSet(
    viewsets.ModelViewSet
):

    queryset = (

        Production.objects

        .all()

        .order_by("-id")
    )

    serializer_class = (
        ProductionSerializer
    )


# =====================================================
# PRODUCTION BATCH
# =====================================================

class ProductionBatchViewSet(
    viewsets.ModelViewSet
):

    queryset = (

        ProductionBatch.objects

        .all()

        .order_by("-id")
    )

    serializer_class = (
        ProductionBatchSerializer
    )


# =====================================================
# BATCH STAGE
# =====================================================

class BatchStageViewSet(
    viewsets.ModelViewSet
):

    queryset = (

        BatchStage.objects

        .all()

        .order_by(
            "batch_id",
            "sequence"
        )
    )

    serializer_class = (BatchStageSerializer)
