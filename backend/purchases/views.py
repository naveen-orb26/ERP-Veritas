from django.shortcuts import render
from rest_framework import viewsets
from .models import PurchaseInvoice, RawStockMovement, RawStockMovement, Supplier
from .serializers import PurchaseInvoiceSerializer, RawStockMovementSerializer, RawStockMovementSerializer, SupplierSerializer


class SupplierViewSet(viewsets.ModelViewSet):

    queryset = Supplier.objects.all().order_by("-id")
    serializer_class = SupplierSerializer

from .models import PurchaseOrder
from .serializers import PurchaseOrderSerializer


class PurchaseOrderViewSet(viewsets.ModelViewSet):

    queryset = PurchaseOrder.objects.all().order_by("-id")
    serializer_class = PurchaseOrderSerializer

class PurchaseInvoiceViewSet(viewsets.ModelViewSet):

    queryset = PurchaseInvoice.objects.all().order_by("-id")
    serializer_class = PurchaseInvoiceSerializer

from.models import GRN
from .serializers import GRNSerializer

from django.db import transaction

class GRNViewSet(viewsets.ModelViewSet):

    queryset = GRN.objects.all().order_by("-id")
    serializer_class = GRNSerializer

    def perform_create(self, serializer):

        with transaction.atomic():

            grn = serializer.save()

            # Create stock movement

            RawStockMovement.objects.create(
                product=grn.product,
                movement_type="PURCHASE_IN",
                quantity=grn.accepted_quantity,
                reference_id=grn.id,
                remarks="Stock received via GRN"
            )

            
class RawStockMovementViewSet(viewsets.ModelViewSet):

    queryset = RawStockMovement.objects.all().order_by("-id")
    serializer_class = RawStockMovementSerializer