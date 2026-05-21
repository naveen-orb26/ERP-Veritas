from django.shortcuts import render

from rest_framework import viewsets

from .models import (

    RawMaterial,

    MaterialSource,

    RawMaterialInventory,
)

from .serializers import (

    RawMaterialListSerializer,

    RawMaterialDetailSerializer,

    RawMaterialCreateUpdateSerializer,

    MaterialSourceSerializer,

    RawMaterialInventorySerializer,
)
# =====================================================
# MATERIAL SOURCE VIEWSET
# =====================================================

class MaterialSourceViewSet(

    viewsets.ModelViewSet
):

    queryset = (

        MaterialSource.objects

        .select_related(

            "raw_material",

            "vendor"
        )

        .order_by(
            "sm_code"
        )
    )

    serializer_class = (
        MaterialSourceSerializer
    )


# =====================================================
# RAW MATERIAL INVENTORY VIEWSET
# =====================================================

class RawMaterialViewSet(

    viewsets.ModelViewSet
):

    queryset = (
        RawMaterial.objects
        .order_by(
            "material_name"
        )
    )

    def get_serializer_class(self):

        if self.action == "list":

            return (
                RawMaterialListSerializer
            )

        if self.action == "retrieve":

            return (
                RawMaterialDetailSerializer
            )

        return (
            RawMaterialCreateUpdateSerializer
        )
    

# =====================================================
# RAW MATERIAL INVENTORY VIEWSET
# =====================================================

class RawMaterialInventoryViewSet(

    viewsets.ReadOnlyModelViewSet
):

    queryset = (

        RawMaterialInventory.objects

        .select_related(

            "warehouse",

            "material_source",

            "material_source__raw_material",

            "material_source__vendor",
        )

        .order_by(
            "material_source__sm_code"
        )
    )

    serializer_class = (
        RawMaterialInventorySerializer
    )