from rest_framework import serializers

from .models import Product


class ProductListSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Product

        fields = [

            "id",

            "sr_number",

            "product_name",

            "category",

            "size_or_variant",

            "color",

            "base_unit",

            "image",

            "is_active",
        ]

class ProductDetailSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Product

        fields = "__all__"

class ProductCreateUpdateSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Product

        fields = "__all__"

