from django.shortcuts import render
from django.db import transaction

from rest_framework import viewsets
from rest_framework.exceptions import ValidationError

from activity_log.utils import log_activity
from core.permissions import ManagerOrAbove

from .models import SalesInvoice
from .serializers import (
    SalesInvoiceSerializer,
    SalesInvoiceCreateUpdateSerializer,
)

from .models import Payment
from .serializers import PaymentSerializer

from .services import validate_payment


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

        with transaction.atomic():

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

    permission_classes = [ManagerOrAbove]

    queryset = Payment.objects.all().order_by("-id")

    serializer_class = PaymentSerializer


    # -----------------------------
    # PAYMENT CREATE
    # -----------------------------

    def perform_create(self, serializer):

        with transaction.atomic():

            invoice = serializer.validated_data.get(
                "sales_invoice"
            )

            amount = serializer.validated_data.get(
                "amount_paid"
            )

            payment_date = serializer.validated_data.get(
                "payment_date"
            )

            # -----------------------------
            # VALIDATION
            # -----------------------------

            validate_payment(
                invoice=invoice,
                payment_amount=amount,
                payment_date=payment_date,
            )

            payment = serializer.save()

            invoice.update_payment_status()

            log_activity(
                user=self.request.user,
                action="CREATE",
                module="Payment",
                reference_id=payment.id,
                description=(
                    f"Payment of {amount} recorded "
                    f"for Invoice {invoice.id}"
                ),
                ip_address=self.request.META.get(
                    "REMOTE_ADDR"
                ),
            )


    # -----------------------------
    # PAYMENT UPDATE
    # -----------------------------

    def perform_update(self, serializer):

        with transaction.atomic():

            payment = self.get_object()

            invoice = payment.sales_invoice

            new_amount = serializer.validated_data.get(
                "amount_paid",
                payment.amount_paid
            )

            payment_date = serializer.validated_data.get(
                "payment_date",
                payment.payment_date
            )

            validate_payment(
                invoice=invoice,
                payment_amount=new_amount,
                payment_date=payment_date,
            )

            payment = serializer.save()

            invoice.update_payment_status()

            log_activity(
                user=self.request.user,
                action="UPDATE",
                module="Payment",
                reference_id=payment.id,
                description=(
                    f"Payment updated for "
                    f"Invoice {invoice.id}"
                ),
                ip_address=self.request.META.get(
                    "REMOTE_ADDR"
                ),
            )


    # -----------------------------
    # PAYMENT DELETE
    # -----------------------------

    def perform_destroy(self, instance):

        with transaction.atomic():

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
                    f"Payment deleted for "
                    f"Invoice {invoice.id}"
                ),
                ip_address=self.request.META.get(
                    "REMOTE_ADDR"
                ),
            )