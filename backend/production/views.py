from django.db import transaction

from rest_framework import viewsets
from rest_framework.exceptions import ValidationError

from activity_log.utils import log_activity
from core.permissions import IsEmployee

from .models import Production
from .serializers import ProductionSerializer

from .services import validate_production

# from inventory.services import validate_raw_stock

class ProductionViewSet(viewsets.ModelViewSet):

    permission_classes = [IsEmployee]

    queryset = Production.objects.all().order_by("-id")

    serializer_class = ProductionSerializer


    # --------------------------------------------------
    # CREATE PRODUCTION
    # --------------------------------------------------

    def perform_create(self, serializer):

        with transaction.atomic():

            # ---------------------------------------------
            # Extract validated data BEFORE save
            # ---------------------------------------------

            sales_line = serializer.validated_data.get(
                "sales_order_line"
            )

            quantity = serializer.validated_data.get(
                "quantity_produced"
            )

            production_date = serializer.validated_data.get(
                "production_date"
            )

            batch_number = serializer.validated_data.get(
                "batch_number"
            )

            if not sales_line:
                raise ValidationError(
                    "Sales order line is required."
                )

            if quantity is None:
                raise ValidationError(
                    "Production quantity is required."
                )
            
            validate_raw_stock(
                product=sales_line.product,
                required_quantity=quantity,
            )   
            # ---------------------------------------------
            # VALIDATION
            # ---------------------------------------------

            validate_production(
                sales_line=sales_line,
                production_quantity=quantity,
                production_date=production_date,
                batch_number=batch_number,
            )

            # ---------------------------------------------
            # VALIDATE RAW STOCK
            # ---------------------------------------------

            validate_raw_stock(
                product=sales_line.product,
                required_quantity=quantity * sales_line.product.raw_material_required_per_unit
            )

            # --------------------------------------------- 
            # SAVE PRODUCTION
            # ---------------------------------------------

            production = serializer.save()

            # ---------------------------------------------
            # Update produced quantity
            # ---------------------------------------------

            sales_line.produced_quantity += quantity

            sales_line.save(
                update_fields=["produced_quantity"]
            )

            # ---------------------------------------------
            # Update order status
            # ---------------------------------------------

            order = sales_line.sales_order

            order.update_status_based_on_production()

            # ---------------------------------------------
            # ACTIVITY LOG
            # ---------------------------------------------

            log_activity(
                user=self.request.user,
                action="CREATE",
                module="Production",
                reference_id=production.id,
                description=(
                    f"Produced {quantity} units "
                    f"for SalesOrderLine {sales_line.id}"
                ),
                ip_address=self.request.META.get(
                    "REMOTE_ADDR"
                ),
            )