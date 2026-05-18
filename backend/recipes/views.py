from django.shortcuts import render

from rest_framework import viewsets

from .models import Recipe

from .serializers import (

    RecipeListSerializer,

    RecipeDetailSerializer,

    RecipeCreateUpdateSerializer,
)


class RecipeViewSet(

    viewsets.ModelViewSet
):

    queryset = (
        Recipe.objects.all()
        .order_by("-id")
    )

    def get_serializer_class(self):

        if self.action == "list":

            return (
                RecipeListSerializer
            )

        if self.action in [

            "create",

            "update",

            "partial_update",
        ]:

            return (
                RecipeCreateUpdateSerializer
            )

        return (
            RecipeDetailSerializer
        )