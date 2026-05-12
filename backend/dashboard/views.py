from django.shortcuts import render

from django.db.models import Sum
from django.db.models import F

from django.db.models.functions import Coalesce

from rest_framework.views import APIView
from rest_framework.response import Response

from sales.models import SalesOrderLine
from production.models import Production
from dispatch.models import Dispatch
from activity_log.models import ActivityLog

from rest_framework.permissions import AllowAny



class DashboardOverviewAPIView(APIView):
    
    permission_classes = [AllowAny]

    def get(self, request):

        # =====================================================
        # SALES
        # =====================================================

        active_orders = SalesOrderLine.objects.filter(
            fulfilled_quantity__lt=F("quantity")
        ).count()

        # =====================================================
        # PRODUCTION
        # =====================================================

        production_running = Production.objects.count()

        # =====================================================
        # DISPATCH
        # =====================================================

        dispatch_pending = SalesOrderLine.objects.filter(
            fulfilled_quantity__lt=F("quantity")
        ).aggregate(
            total=Coalesce(
                Sum("quantity"),
                0
            )
        )["total"]

        # =====================================================
        # EFFICIENCY (TEMP MOCK)
        # =====================================================

        efficiency = 98.2

        # =====================================================
        # ACTIVITY FEED
        # =====================================================

        recent_activity = ActivityLog.objects.order_by(
            "-timestamp"
        )[:8]

        activity_data = []

        for activity in recent_activity:

            activity_data.append({
                "module": activity.module,
                "action": activity.action,
                "description": activity.description,
                "timestamp": activity.timestamp,
            })

        # =====================================================
        # RESPONSE
        # =====================================================

        return Response({

            "metrics": {

                "active_orders":
                    active_orders,

                "production_running":
                    production_running,

                "dispatch_pending":
                    dispatch_pending,

                "efficiency":
                    efficiency,
            },

            "activity":
                activity_data,
        })