"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from packing.views import InspectionViewSet, PacketViewSet, PackingEntryView
from production.views import ProductionViewSet
from finished_stock.views import (
    FinishedStockPacketViewSet,
    FinishedStockMovementViewSet,
)
from dispatch.views import DispatchViewSet

router = DefaultRouter()

router.register(r'production', ProductionViewSet, basename='production')

router.register(r"inspections", InspectionViewSet, basename="inspection")
router.register(r"packets", PacketViewSet, basename="packet")

router.register(r"stock", FinishedStockPacketViewSet, basename="stock")
router.register(r"stock-movements", FinishedStockMovementViewSet, basename="stock-movement")

router.register(r"dispatch", DispatchViewSet, basename="dispatch")


urlpatterns = [
    path('admin/', admin.site.urls),
    # production routes
    path('api/', include(router.urls)),
    path("api/packing-entry/", PackingEntryView.as_view()),
   
]