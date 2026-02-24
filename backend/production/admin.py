from django.contrib import admin
from .models import Production


@admin.register(Production)
class ProductionAdmin(admin.ModelAdmin):
    list_display = (
        "batch_number",
        "product",
        "sales_order_line",
        "planned_quantity",
        "production_date",
        "created_by",
    )
    search_fields = ("batch_number",)
    list_filter = ("production_date",)