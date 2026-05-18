from django.shortcuts import render

from rest_framework import status

from rest_framework import viewsets

from rest_framework.decorators import action

from rest_framework.response import Response

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

        sr_number = request.data.get(
            "sr_number"
        )

        if not sr_number:

            return Response(

                {

                    "error":
                        "sr_number is required."
                },

                status=400
            )

        product = (
            approve_development_sample(

                development_sample,

                sr_number
            )
        )

        return Response({

            "message":
                "Development sample approved.",

            "product_id":
                product.id,

            "sr_number":
                product.sr_number,
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