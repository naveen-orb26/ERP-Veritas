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
            "base_unit",
        ]