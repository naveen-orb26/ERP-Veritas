from django.contrib import admin

from django.contrib import admin
from .models import ActivityLog


@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):

    list_display = (
        "timestamp",
        "user",
        "module",
        "action",
        "reference_id",
    )

    list_filter = (
        "module",
        "action",
        "timestamp",
    )

    search_fields = (
        "reference_id",
        "description",
    )

    ordering = ("-timestamp",)

    readonly_fields = (
        "timestamp",
    )