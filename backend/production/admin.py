from django.contrib import admin
from .models import (
    Production,
    ProductionRequest,
    ProductionBatch,
    JobCardMaterial,
)


@admin.register(Production)
class ProductionAdmin(admin.ModelAdmin):

    list_display = (

        "job_card_number",

        "product",

        "status",

        "planned_quantity",

        "production_date",
    )

    list_filter = (

        "status",

        "production_date",
    )

    search_fields = (

        "job_card_number",

        "product__sr_number",

        "product__product_name",
    )

@admin.register(ProductionRequest)
class ProductionRequestAdmin(admin.ModelAdmin):

    list_display = (

        "id",

        "source_type",

        "requested_quantity",

        "status",

        "created_at",
    )

    list_filter = (

        "status",

        "source_type",
    )