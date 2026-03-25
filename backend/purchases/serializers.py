from rest_framework import serializers
from .models import Supplier


class SupplierSerializer(serializers.ModelSerializer):

    class Meta:
        model = Supplier
        fields = [
            "id",
            "name",
            "address",
            "gst_number",
            "payment_terms",
            "contact_numbers",
            "contact_emails",
            "is_active",
            "created_at",
        ]

from .models import PurchaseOrder


class PurchaseOrderSerializer(serializers.ModelSerializer):

    class Meta:
        model = PurchaseOrder
        fields = [
            "id",
            "po_number",
            "supplier",
            "po_date",
            "remarks",
            "created_at",
        ]
        read_only_fields = ["created_at"]
    
from .models import PurchaseInvoice

class PurchaseInvoiceSerializer(serializers.ModelSerializer):

    class Meta:
        model = PurchaseInvoice
        fields = [
            "id",
            "supplier",
            "purchase_order",
            "invoice_number",
            "invoice_date",
            "total_amount",
            "pdf_path",
            "status",
            "remarks",
            "created_at",
        ]
        read_only_fields = ["created_at"]

from .models import GRN

class GRNSerializer(serializers.ModelSerializer):

    class Meta:
        model = GRN
        fields = [
            "id",
            "purchase_invoice",
            "product",
            "received_quantity",
            "accepted_quantity",
            "received_date",
            "remarks",
            "created_at",
        ]

        read_only_fields = ["created_at"]

    def validate(self, data):

        received = data["received_quantity"]
        accepted = data["accepted_quantity"]

        if accepted > received:

            raise serializers.ValidationError(
                "Accepted quantity cannot exceed received quantity."
            )

        return data
    

from .models import RawStockMovement

class RawStockMovementSerializer(serializers.ModelSerializer):

    class Meta:
        model = RawStockMovement
        fields = [
            "id",
            "product",
            "movement_type",
            "quantity",
            "date",
            "reference_id",
            "remarks",
            "created_at",
        ]

        read_only_fields = ["created_at"]


