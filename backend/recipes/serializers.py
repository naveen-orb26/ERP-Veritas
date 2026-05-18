from rest_framework import serializers

from .models import (

    Recipe,

    RecipeLine,
)

from .services import (

    validate_recipe,
)


# =====================================================
# RECIPE LINE
# =====================================================

class RecipeLineSerializer(

    serializers.ModelSerializer
):

    raw_material_name = serializers.CharField(

        source=(
            "raw_material.material_name"
        ),

        read_only=True
    )

    class Meta:

        model = RecipeLine

        fields = [

            "id",

            "raw_material",

            "raw_material_name",

            "quantity",

            "unit",

            "is_scaling_reference",

            "remarks",
        ]


# =====================================================
# RECIPE LIST
# =====================================================

class RecipeListSerializer(

    serializers.ModelSerializer
):

    development_reference = (
        serializers.CharField(

            source=(
                "development_sample"
                ".reference_code"
            ),

            read_only=True
        )
    )

    class Meta:

        model = Recipe

        fields = [

            "id",

            "development_reference",

            "is_active",

            "created_at",
        ]


# =====================================================
# RECIPE DETAIL
# =====================================================

class RecipeDetailSerializer(

    serializers.ModelSerializer
):

    recipe_lines = (
        RecipeLineSerializer(

            many=True,

            read_only=True
        )
    )

    development_reference = (
        serializers.CharField(

            source=(
                "development_sample"
                ".reference_code"
            ),

            read_only=True
        )
    )

    class Meta:

        model = Recipe

        fields = [

            "id",

            "development_sample",

            "development_reference",

            "is_active",

            "recipe_lines",

            "created_at",

            "updated_at",
        ]


# =====================================================
# RECIPE CREATE / UPDATE
# =====================================================

class RecipeCreateUpdateSerializer(

    serializers.ModelSerializer
):

    recipe_lines = (
        RecipeLineSerializer(

            many=True
        )
    )

    class Meta:

        model = Recipe

        fields = [

            "id",

            "development_sample",

            "is_active",

            "recipe_lines",
        ]

    def create(self, validated_data):

        recipe_lines_data = (
            validated_data.pop(
                "recipe_lines"
            )
        )

        recipe = Recipe.objects.create(

            **validated_data
        )

        for line_data in (
            recipe_lines_data
        ):

            RecipeLine.objects.create(

                recipe=recipe,

                **line_data
            )

        validate_recipe(recipe)

        return recipe

    def update(

        self,

        instance,

        validated_data
    ):

        recipe_lines_data = (
            validated_data.pop(
                "recipe_lines",
                []
            )
        )

        instance.is_active = (
            validated_data.get(

                "is_active",

                instance.is_active
            )
        )

        instance.save()

        instance.recipe_lines.all().delete()

        for line_data in (
            recipe_lines_data
        ):

            RecipeLine.objects.create(

                recipe=instance,

                **line_data
            )

        validate_recipe(instance)

        return instance