from django.shortcuts import render

from rest_framework import status

from rest_framework import viewsets

from rest_framework.decorators import action

from rest_framework.response import Response

from rest_framework.exceptions import ValidationError

from .models import DevelopmentSample

from .serializers import (

    DevelopmentSampleListSerializer,

    DevelopmentSampleDetailSerializer,

    DevelopmentSampleCreateUpdateSerializer,

)

from .services import (

    approve_development_sample,

    reject_development_sample,
)


class DevelopmentSampleViewSet(

    viewsets.ModelViewSet
):

    queryset = (
        DevelopmentSample.objects.all()
        .order_by("-id")
    )

    def get_serializer_class(self):

        if self.action == "list":

            return (
                DevelopmentSampleListSerializer
            )

        if self.action in [

            "create",

            "update",

            "partial_update",
        ]:

            return (
                DevelopmentSampleCreateUpdateSerializer
            )

        return (
            DevelopmentSampleDetailSerializer
        )

    def perform_update(

        self,

        serializer
    ):

        development_sample = (
            self.get_object()
        )

        if (

            development_sample.status
            ==
            DevelopmentSample
            .STATUS_APPROVED
        ):

            raise ValidationError(

                "Approved samples cannot be edited."
            )

        updated_sample = (
            serializer.save()
        )

        # ============================
        # REWORK LOGIC
        # ============================

        if (

            development_sample.status
            ==
            DevelopmentSample
            .STATUS_REJECTED
        ):

            updated_sample.status = (

                DevelopmentSample
                .STATUS_DRAFT
            )

            updated_sample.rejected_at = None

            updated_sample.save()
        
    # =================================================
    # APPROVE SAMPLE
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

        development_sample = (
            self.get_object()
        )


        product = (
            approve_development_sample(

                development_sample,

            )
        )

        return Response({

            "message":
                "Development sample approved.",

            "status":
                development_sample.status,
        })

    # =================================================
    # REJECT SAMPLE
    # =================================================

    @action(

        detail=True,

        methods=["post"]
    )
    def reject(

        self,

        request,

        pk=None
    ):

        development_sample = (
            self.get_object()
        )

        reject_development_sample(
            development_sample
        )

        return Response({

            "message":
                "Development sample rejected."
        })
    