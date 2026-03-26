from django.shortcuts import render
from django.db.models import Sum, Case, When, IntegerField
from rest_framework.views import APIView
from rest_framework.response import Response

from purchases.models import RawStockMovement


class RawMaterialStockSummaryView(APIView):

    def get(self, request):

        movements = (
            RawStockMovement.objects
            .values("product__product_name")
            .annotate(

                total_in=Sum(
                    Case(
                        When(
                            movement_type__in=[
                                "PURCHASE_IN",
                                "ADJUSTMENT_IN",
                                "RETURN_IN",
                            ],
                            then="quantity",
                        ),
                        default=0,
                        output_field=IntegerField(),
                    )
                ),

                total_out=Sum(
                    Case(
                        When(
                            movement_type__in=[
                                "ADJUSTMENT_OUT",
                                "RETURN_OUT",
                            ],
                            then="quantity",
                        ),
                        default=0,
                        output_field=IntegerField(),
                    )
                ),
            )
        )

        result = []

        for row in movements:

            total_in = row["total_in"] or 0
            total_out = row["total_out"] or 0

            result.append(
                {
                    "product": row["product__product_name"],
                    "total_in": total_in,
                    "total_out": total_out,
                    "current_stock": total_in - total_out,
                }
            )

        return Response(result)
    

from django.db.models import Sum, Count
from finished_stock.models import FinishedStockPacket


class FinishedGoodsStockSummaryView(APIView):

    def get(self, request):

        stock = (
            FinishedStockPacket.objects
            .filter(status="IN_STOCK")
            .values("product__product_name")
            .annotate(
                packets_in_stock=Count("id"),
                total_units=Sum("units_in_packet")
            )
        )

        result = []

        for row in stock:

            result.append(
                {
                    "product": row["product__product_name"],
                    "packets_in_stock": row["packets_in_stock"],
                    "total_units": row["total_units"] or 0,
                }
            )

        return Response(result)


from dispatch.models import Dispatch


class DispatchSummaryView(APIView):

    def get(self, request):

        summary = (
            Dispatch.objects
            .values(
                "sales_order_line__product__product_name"
            )
            .annotate(
                total_dispatched=Sum(
                    "quantity_dispatched"
                ),
                dispatch_count=Count("id")
            )
        )

        result = []

        for row in summary:

            result.append(
                {
                    "product": row[
                        "sales_order_line__product__product_name"
                    ],
                    "total_dispatched":
                        row["total_dispatched"] or 0,
                    "dispatch_count":
                        row["dispatch_count"] or 0,
                }
            )

        return Response(result)
    
from sales.models import SalesOrder


class SalesOrderProgressView(APIView):

    def get(self, request):

        orders = SalesOrder.objects.all()

        result = []

        for order in orders:

            ordered = order.total_order_quantity
            fulfilled = order.total_fulfilled_quantity
            pending = order.pending_quantity

            result.append(
                {
                    "order_id": order.id,
                    "customer": order.customer.name,
                    "ordered": ordered,
                    "fulfilled": fulfilled,
                    "pending": pending,
                    "status": order.status,
                }
            )

        return Response(result)

from invoicing.models import SalesInvoice


class OutstandingPaymentsView(APIView):

    def get(self, request):

        invoices = SalesInvoice.objects.all()

        result = []

        for invoice in invoices:

            total_paid = sum(
                payment.amount_paid
                for payment in invoice.payments.all()
            )

            outstanding = invoice.total_amount - total_paid

            result.append(
                {
                    "invoice_number": invoice.invoice_number,
                    "customer": invoice.customer.name,
                    "total_amount": invoice.total_amount,
                    "paid_amount": total_paid,
                    "outstanding_amount": outstanding,
                    "status": invoice.status,
                }
            )

        return Response(result)
    
from django.db.models import Sum, Count
from purchases.models import PurchaseInvoice


class PurchaseSummaryView(APIView):

    def get(self, request):

        summary = (
            PurchaseInvoice.objects
            .values("supplier__name")
            .annotate(
                invoice_count=Count("id"),
                total_purchase_value=Sum("total_amount")
            )
        )

        result = []

        for row in summary:

            result.append(
                {
                    "supplier": row["supplier__name"],
                    "invoice_count": row["invoice_count"] or 0,
                    "total_purchase_value":
                        row["total_purchase_value"] or 0,
                }
            )

        return Response(result)
    
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum
from purchases.models import RawStockMovement
from product_master.models import Product


class LowStockAlertView(APIView):

    def get(self, request):

        products = Product.objects.all()

        result = []

        for product in products:

            total_in = RawStockMovement.objects.filter(
                product=product,
                movement_type__in=[
                    "PURCHASE_IN",
                    "ADJUSTMENT_IN",
                    "RETURN_IN",
                ]
            ).aggregate(total=Sum("quantity"))["total"] or 0

            total_out = RawStockMovement.objects.filter(
                product=product,
                movement_type__in=[
                    "ADJUSTMENT_OUT",
                    "RETURN_OUT",
                ]
            ).aggregate(total=Sum("quantity"))["total"] or 0

            current_stock = total_in - total_out

            if current_stock <= product.reorder_level:

                result.append(
                    {
                        "product": product.product_name,
                        "current_stock": current_stock,
                        "reorder_level": product.reorder_level,
                    }
                )

        return Response(result)


from datetime import date
from sales.models import SalesOrder


class OrderDelayReportView(APIView):

    def get(self, request):

        today = date.today()

        delayed_orders = SalesOrder.objects.filter(
            expected_delivery_date__lt=today
        ).exclude(status="CLOSED")

        result = []

        for order in delayed_orders:

            days_late = (
                today - order.expected_delivery_date
            ).days

            result.append(
                {
                    "order_id": order.id,
                    "customer": order.customer.name,
                    "pending_quantity": order.pending_quantity,
                    "days_late": days_late,
                }
            )

        return Response(result)
    

from datetime import date
from purchases.models import GRN


class AgingInventoryView(APIView):

    def get(self, request):

        today = date.today()

        result = []

        grns = GRN.objects.all()

        for grn in grns:

            days = (
                today - grn.received_date
            ).days

            result.append(
                {
                    "product": grn.product.product_name,
                    "accepted_quantity": grn.accepted_quantity,
                    "days_in_stock": days,
                }
            )

        return Response(result)


from production.models import Production


class ProductionDispatchBalanceView(APIView):

    def get(self, request):

        productions = Production.objects.all()

        result = []

        for prod in productions:

            produced = prod.planned_quantity

            dispatched = sum(
                d.quantity_dispatched
                for d in prod.sales_order_line.dispatches.all()
            )

            remaining = produced - dispatched

            result.append(
                {
                    "batch": prod.batch_number,
                    "produced": produced,
                    "dispatched": dispatched,
                    "remaining": remaining,
                }
            )

        return Response(result)
    

from production.models import Production
from django.db.models import Sum


class DailyProductionReportView(APIView):

    def get(self, request):

        summary = (
            Production.objects
            .values("production_date")
            .annotate(
                total_produced=Sum(
                    "planned_quantity"
                )
            )
        )

        return Response(summary)