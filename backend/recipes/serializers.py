from django.db import transaction

from rest_framework import serializers

from .models import (

    Recipe,

    RecipeItem,
)

from .services import (
    validate_recipe
)

from sampling.models import (
    DevelopmentSample
)


# =====================================================
# RECIPE ITEM
# =====================================================

class RecipeItemSerializer(

    serializers.ModelSerializer
):

    raw_material_name = serializers.CharField(

        source=(
            "raw_material.material_name"
        ),

        read_only=True
    )

    class Meta:

        model = RecipeItem

        fields = [

            "id",

            "raw_material",

            "raw_material_name",

            "quantity",

            "unit",

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

            "created_at",
        ]

        # =====================================================
# RECIPE DETAIL
# =====================================================

class RecipeDetailSerializer(

    serializers.ModelSerializer
):

    items = (
        RecipeItemSerializer(

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

            "notes",

            "items",

            "created_at",

            "updated_at",
        ]

# =====================================================
# RECIPE CREATE / UPDATE
# =====================================================

class RecipeCreateUpdateSerializer(

    serializers.ModelSerializer
):

    items = (
        RecipeItemSerializer(
            many=True
        )
    )

    class Meta:

        model = Recipe

        fields = [

            "id",

            "development_sample",

            "notes",

            "items",
        ]


    @transaction.atomic
    def create(

        self,

        validated_data
    ):

        items_data = (
            validated_data.pop(
                "items"
            )
        )

        development_sample = (
            validated_data[
                "development_sample"
            ]
        )

        # =====================================
        # IMMUTABLE APPROVED CHECK
        # =====================================

        if (

            development_sample.status
            ==
            DevelopmentSample
            .STATUS_APPROVED
        ):

            raise serializers.ValidationError(

                "Approved samples "
                "cannot create recipes."
            )

        recipe = Recipe.objects.create(

            **validated_data
        )

        for item_data in items_data:

            RecipeItem.objects.create(

                recipe=recipe,

                **item_data
            )

        validate_recipe(recipe)

        return recipe
    
    @transaction.atomic
    def update(

        self,

        instance,

        validated_data
    ):

        development_sample = (
            instance.development_sample
        )

        # =====================================
        # IMMUTABLE APPROVED CHECK
        # =====================================

        if (

            development_sample.status
            ==
            DevelopmentSample
            .STATUS_APPROVED
        ):

            raise serializers.ValidationError(

                "Approved sample recipes "
                "cannot be edited."
            )

        items_data = (
            validated_data.pop(
                "items",
                []
            )
        )

        instance.notes = (
            validated_data.get(

                "notes",

                instance.notes
            )
        )

        instance.save()

        # =====================================
        # REPLACE RECIPE ITEMS
        # =====================================

        instance.items.all().delete()

        for item_data in items_data:

            RecipeItem.objects.create(

                recipe=instance,

                **item_data
            )

        validate_recipe(instance)

        return instance