from rest_framework import serializers

from .models import RawMaterial


# =====================================================
# RAW MATERIAL LIST
# =====================================================

class RawMaterialListSerializer(

    serializers.ModelSerializer
):

    class Meta:

        model = RawMaterial

        fields = [

            "id",

            "material_code",

            "material_name",

            "material_category",

            "base_unit",

            "is_active",
        ]


# =====================================================
# RAW MATERIAL DETAIL
# =====================================================

class RawMaterialDetailSerializer(

    serializers.ModelSerializer
):

    class Meta:

        model = RawMaterial

        fields = "__all__"


# =====================================================
# RAW MATERIAL CREATE / UPDATE
# =====================================================

class RawMaterialCreateUpdateSerializer(

    serializers.ModelSerializer
):

    class Meta:

        model = RawMaterial

        fields = "__all__"