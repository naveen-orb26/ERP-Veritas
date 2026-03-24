from rest_framework import serializers
from .models import Payment, SalesInvoice, SalesInvoiceItem


class SalesInvoiceItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = SalesInvoiceItem
        fields = [
            "id",
            "product",
            "quantity",
            "rate",
            "amount",
            "remarks",
        ]
class SalesInvoiceSerializer(serializers.ModelSerializer):

    items = SalesInvoiceItemSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = SalesInvoice
        fields = [
            "id",
            "invoice_number",
            "customer",
            "invoice_date",
            "due_date",
            "total_amount",
            "status",
            "remarks",
            "items",
            "created_at",
        ]
class SalesInvoiceCreateUpdateSerializer(serializers.ModelSerializer):

    items = SalesInvoiceItemSerializer(many=True)

    class Meta:
        model = SalesInvoice
        fields = [
            "invoice_number",
            "customer",
            "invoice_date",
            "due_date",
            "total_amount",
            "status",
            "remarks",
            "items",
        ]

    def create(self, validated_data):

        items_data = validated_data.pop("items")

        invoice = SalesInvoice.objects.create(
            **validated_data
        )

        for item in items_data:

            SalesInvoiceItem.objects.create(
                invoice=invoice,
                **item
            )

        return invoice
    def update(self, instance, validated_data):

        items_data = validated_data.pop(
            "items",
            None
        )

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if items_data is not None:

            instance.items.all().delete()

            for item in items_data:

                SalesInvoiceItem.objects.create(
                    invoice=instance,
                    **item
                )

        return instance    
class PaymentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Payment
        fields = [
            "id",
            "customer",
            "sales_invoice",
            "amount_paid",
            "payment_date",
            "payment_mode",
            "remarks",
            "created_at",
        ]
        read_only_fields = ["created_at"]