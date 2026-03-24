from django.contrib import admin
from .models import SalesInvoice, SalesInvoiceItem
from .models import Payment


class SalesInvoiceItemInline(admin.TabularInline):
    model = SalesInvoiceItem
    extra = 0


class SalesInvoiceAdmin(admin.ModelAdmin):

    list_display = (
        "invoice_number",
        "customer",
        "invoice_date",
        "total_amount",
        "status",
    )

    inlines = [
        SalesInvoiceItemInline
    ]


admin.site.register(SalesInvoice, SalesInvoiceAdmin)
admin.site.register(SalesInvoiceItem)

admin.site.register(Payment)