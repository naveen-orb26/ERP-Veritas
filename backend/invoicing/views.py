from django.shortcuts import render

from rest_framework import viewsets

from .models import SalesInvoice
from .serializers import (
    SalesInvoiceSerializer,
    SalesInvoiceCreateUpdateSerializer,
)

from .models import Payment
from .serializers import PaymentSerializer


class SalesInvoiceViewSet(viewsets.ModelViewSet):

    queryset = SalesInvoice.objects.all().order_by("-id")

    def get_serializer_class(self):

        if self.action in [
            "create",
            "update",
            "partial_update",
        ]:
            return SalesInvoiceCreateUpdateSerializer

        return SalesInvoiceSerializer
    


class PaymentViewSet(viewsets.ModelViewSet):

    queryset = Payment.objects.all().order_by("-id")
    serializer_class = PaymentSerializer

    def perform_create(self, serializer):

        payment = serializer.save()

        invoice = payment.sales_invoice

        invoice.update_payment_status()
        
    def perform_update(self, serializer):

        payment = serializer.save()

        invoice = payment.sales_invoice

        invoice.update_payment_status()

    def perform_destroy(self, instance):

        invoice = instance.sales_invoice

        instance.delete()

        invoice.update_payment_status()