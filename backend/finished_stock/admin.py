from django.contrib import admin

from django.contrib import admin
from .models import FinishedStockPacket, FinishedStockMovement


admin.site.register(FinishedStockPacket)
admin.site.register(FinishedStockMovement)