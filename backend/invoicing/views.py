from django.shortcuts import render

from rest_framework import viewsets

from activity_log.utils import log_activity

from .models import SalesInvoice
from .serializers import (
    SalesInvoiceSerializer,
    SalesInvoiceCreateUpdateSerializer,
)

from .models import Payment
from .serializers import PaymentSerializer


# =====================================================
# SALES INVOICE
# =====================================================

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

    # -----------------------------
    # INVOICE CREATE LOGGING
    # -----------------------------

    def perform_create(self, serializer):

        invoice = serializer.save()

        log_activity(
            user=self.request.user,
            action="CREATE",
            module="SalesInvoice",
            reference_id=invoice.id,
            description=(
                f"Invoice created for SalesOrder "
                f"{invoice.sales_order.id}"
            ),
            ip_address=self.request.META.get("REMOTE_ADDR"),
        )


# =====================================================
# PAYMENT
# =====================================================

class PaymentViewSet(viewsets.ModelViewSet):

    queryset = Payment.objects.all().order_by("-id")
    serializer_class = PaymentSerializer

    # -----------------------------
    # PAYMENT CREATE
    # -----------------------------

    def perform_create(self, serializer):

        payment = serializer.save()

        invoice = payment.sales_invoice

        invoice.update_payment_status()

        log_activity(
            user=self.request.user,
            action="CREATE",
            module="Payment",
            reference_id=payment.id,
            description=(
                f"Payment recorded for Invoice "
                f"{invoice.id}"
            ),
            ip_address=self.request.META.get("REMOTE_ADDR"),
        )

    # -----------------------------
    # PAYMENT UPDATE
    # -----------------------------

    def perform_update(self, serializer):

        payment = serializer.save()

        invoice = payment.sales_invoice

        invoice.update_payment_status()

        log_activity(
            user=self.request.user,
            action="UPDATE",
            module="Payment",
            reference_id=payment.id,
            description=(
                f"Payment updated for Invoice "
                f"{invoice.id}"
            ),
            ip_address=self.request.META.get("REMOTE_ADDR"),
        )

    # -----------------------------
    # PAYMENT DELETE
    # -----------------------------

    def perform_destroy(self, instance):

        invoice = instance.sales_invoice

        payment_id = instance.id

        instance.delete()

        invoice.update_payment_status()

        log_activity(
            user=self.request.user,
            action="DELETE",
            module="Payment",
            reference_id=payment_id,
            description=(
                f"Payment deleted for Invoice "
                f"{invoice.id}"
            ),
            ip_address=self.request.META.get("REMOTE_ADDR"),
        )