from django.contrib import admin
from .models import Inspection, Packet


@admin.register(Inspection)
class InspectionAdmin(admin.ModelAdmin):
    list_display = ("id", "production", "accepted_quantity", "rejected_quantity", "inspection_date")
    list_filter = ("inspection_date",)
    search_fields = ("production__batch_number",)


@admin.register(Packet)
class PacketAdmin(admin.ModelAdmin):
    list_display = ("id", "product", "units_in_packet", "allocation_type", "production")
    list_filter = ("allocation_type",)
    search_fields = ("product__product_name",)