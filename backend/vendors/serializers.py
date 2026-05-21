from rest_framework import serializers

from .models import (
    Vendor,
)


# =====================================================
# VENDOR
# =====================================================

class VendorSerializer(

    serializers.ModelSerializer
):

    class Meta:

        model = Vendor

        fields = [

            "id",

            "vendor_code",

            "vendor_name",

            "vendor_type",

            "gstin",

            "payment_terms_days",

            "contacts",

            "address",

            "state",

            "country",

            "remarks",

            "is_active",

            "created_at",

            "updated_at",
        ]