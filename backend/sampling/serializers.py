from rest_framework import serializers

from .models import DevelopmentSample

from recipes.models import Recipe

from .services import (

    generate_reference_code,
)


# =====================================================
# SAMPLE LIST
# =====================================================

class DevelopmentSampleListSerializer(

    serializers.ModelSerializer
):

    class Meta:

        model = DevelopmentSample

        fields = [

            "id",

            "reference_code",

            "product_name",

            "category",

            "color",

            "status",

            "is_active",
        ]


# =====================================================
# SAMPLE DETAIL
# =====================================================

class DevelopmentSampleDetailSerializer(

    serializers.ModelSerializer
):

    recipe_id = serializers.SerializerMethodField()

    class Meta:

        model = DevelopmentSample

        fields = "__all__"

    def get_recipe_id(

        self,

        obj
    ):

        recipe = getattr(

            obj,

            "recipe",

            None
        )

        if recipe:

            return recipe.id

        return None


# =====================================================
# SAMPLE CREATE / UPDATE
# =====================================================

class DevelopmentSampleCreateUpdateSerializer(

    serializers.ModelSerializer
):

    class Meta:

        model = DevelopmentSample

        fields = "__all__"

        read_only_fields = [

            "reference_code",

            "approved_at",
        ]

    def create(

        self,

        validated_data
    ):

        mid_code = (
            validated_data.get(
                "mid_code"
            )
        )

        if not mid_code:

            raise serializers.ValidationError({

                "mid_code":
                    "Mid code is required."
            })

        validated_data[
            "reference_code"
        ] = generate_reference_code(
            mid_code
        )

        return (
            super().create(
                validated_data
            )
        )