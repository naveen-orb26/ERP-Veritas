from django.db import transaction

from rest_framework import viewsets
from rest_framework.exceptions import ValidationError

from activity_log.utils import log_activity
from core.permissions import IsEmployee, ManagerOrAbove

from .models import (
    Supplier,
    PurchaseOrder,
    PurchaseInvoice,
    GRN,
    RawStockMovement,
)

from .serializers import (
    SupplierSerializer,
    PurchaseOrderSerializer,
    PurchaseInvoiceSerializer,
    GRNSerializer,
    RawStockMovementSerializer,
)

from .services import (
    validate_purchase_order,
    validate_grn,
    validate_purchase_invoice,
)

class SupplierViewSet(viewsets.ModelViewSet):

    permission_classes = [IsEmployee]

    queryset = Supplier.objects.all().order_by("-id")

    serializer_class = SupplierSerializer

class PurchaseOrderViewSet(viewsets.ModelViewSet):

    permission_classes = [IsEmployee]

    queryset = PurchaseOrder.objects.all().order_by("-id")

    serializer_class = PurchaseOrderSerializer


    def perform_create(self, serializer):

        with transaction.atomic():

            lines_data = serializer.validated_data.get(
                "lines"
            )

            if not lines_data:
                raise ValidationError(
                    "Purchase order must contain at least one line."
                )

            validate_purchase_order(
                order_data=serializer.validated_data,
                lines_data=lines_data,
            )

            order = serializer.save()

            log_activity(
                user=self.request.user,
                action="CREATE",
                module="PurchaseOrder",
                reference_id=order.id,
                description="Purchase order created",
                ip_address=self.request.META.get(
                    "REMOTE_ADDR"
                ),
            )
class GRNViewSet(viewsets.ModelViewSet):

    permission_classes = [IsEmployee]

    queryset = GRN.objects.all().order_by("-id")

    serializer_class = GRNSerializer


    def perform_create(self, serializer):

        with transaction.atomic():

            purchase_line = serializer.validated_data.get(
                "purchase_order_line"
            )

            received_quantity = serializer.validated_data.get(
                "accepted_quantity"
            )

            if not purchase_line:
                raise ValidationError(
                    "Purchase order line is required."
                )

            if received_quantity is None:
                raise ValidationError(
                    "Accepted quantity is required."
                )

            validate_grn(
                purchase_line=purchase_line,
                received_quantity=received_quantity,
            )

            grn = serializer.save()

            # Update received quantity

            purchase_line.received_quantity += received_quantity

            purchase_line.save(
                update_fields=["received_quantity"]
            )

            # Create stock movement

            RawStockMovement.objects.create(
                product=grn.product,
                movement_type="PURCHASE_IN",
                quantity=grn.accepted_quantity,
                reference_id=grn.id,
                remarks="Stock received via GRN",
            )

            log_activity(
                user=self.request.user,
                action="CREATE",
                module="GRN",
                reference_id=grn.id,
                description="Goods received via GRN",
                ip_address=self.request.META.get(
                    "REMOTE_ADDR"
                ),
            )

class PurchaseInvoiceViewSet(viewsets.ModelViewSet):

    permission_classes = [ManagerOrAbove]

    queryset = PurchaseInvoice.objects.all().order_by("-id")

    serializer_class = PurchaseInvoiceSerializer


    def perform_create(self, serializer):

        with transaction.atomic():

            purchase_line = serializer.validated_data.get(
                "purchase_order_line"
            )

            invoiced_quantity = serializer.validated_data.get(
                "invoiced_quantity"
            )

            if not purchase_line:
                raise ValidationError(
                    "Purchase order line is required."
                )

            if invoiced_quantity is None:
                raise ValidationError(
                    "Invoiced quantity is required."
                )

            validate_purchase_invoice(
                purchase_line=purchase_line,
                invoiced_quantity=invoiced_quantity,
            )

            invoice = serializer.save()

            purchase_line.invoiced_quantity += invoiced_quantity

            purchase_line.save(
                update_fields=["invoiced_quantity"]
            )

            log_activity(
                user=self.request.user,
                action="CREATE",
                module="PurchaseInvoice",
                reference_id=invoice.id,
                description="Purchase invoice recorded",
                ip_address=self.request.META.get(
                    "REMOTE_ADDR"
                ),
            )

class RawStockMovementViewSet(viewsets.ModelViewSet):

    permission_classes = [IsEmployee]

    queryset = RawStockMovement.objects.all().order_by("-id")

    serializer_class = RawStockMovementSerializer