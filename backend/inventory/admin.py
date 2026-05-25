from django.contrib import admin

from .models import (

    Warehouse,
    StockLedger,
)


admin.site.register(
    Warehouse
)


admin.site.register(
    StockLedger
)