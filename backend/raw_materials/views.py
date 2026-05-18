from django.shortcuts import render

from rest_framework import viewsets

from .models import RawMaterial

from .serializers import (

    RawMaterialListSerializer,

    RawMaterialDetailSerializer,

    RawMaterialCreateUpdateSerializer,
)


class RawMaterialViewSet(

    viewsets.ModelViewSet
):

    queryset = (
        RawMaterial.objects.all()
        .order_by("-id")
    )

    def get_serializer_class(self):

        if self.action == "list":

            return (
                RawMaterialListSerializer
            )

        if self.action in [

            "create",

            "update",

            "partial_update",
        ]:

            return (
                RawMaterialCreateUpdateSerializer
            )

        return (
            RawMaterialDetailSerializer
        )