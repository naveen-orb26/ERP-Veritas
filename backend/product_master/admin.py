from django.contrib import admin
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "sr_number",
        "product_name",
        "category",
        "size_or_variant",
        "color",
        "base_unit",
        "is_active",
        "created_at",
    )

    list_filter = (
        "category",
        "base_unit",
        "is_active",
        "color",
    )

    search_fields = (
        "sr_number",
        "product_name",
    )

    readonly_fields = ("created_at",)

    fieldsets = (
        ("Product Identity", {
            "fields": (
                "sr_number",
                "product_name",
                "category",
                "size_or_variant",
                "color",
            )
        }),
        ("Measurement & Packing Defaults", {
            "fields": (
                "base_unit",
                "units_per_base_unit",
                "default_units_per_packet",
            )
        }),
        ("Status & Media", {
            "fields": (
                "is_active",
                "image",
            )
        }),
        ("Audit", {
            "fields": (
                "created_at",
            )
        }),
    )
