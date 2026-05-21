from rest_framework import viewsets

from .models import (
    Recipe
)

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

    def get_serializer_class(

        self
    ):

        if self.action == "list":

            return (
                RecipeDetailSerializer
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
    def get_queryset(self):

        queryset = (
            super()
            .get_queryset()
        )

        development_sample = (
            self.request.query_params.get(
                "development_sample"
            )
        )

        if development_sample:

            queryset = queryset.filter(

                development_sample=
                development_sample
            )

        return queryset
