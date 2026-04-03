from django.db import models
from django.conf import settings


class ActivityLog(models.Model):

    ACTION_CHOICES = [
        ("CREATE", "Create"),
        ("UPDATE", "Update"),
        ("DELETE", "Delete"),
        ("LOGIN", "Login"),
        ("LOGOUT", "Logout"),
        ("STATUS_CHANGE", "Status Change"),
        ("APPROVE", "Approve"),
        ("CANCEL", "Cancel"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    action = models.CharField(
        max_length=30,
        choices=ACTION_CHOICES
    )

    module = models.CharField(
        max_length=50)

    reference_id = models.CharField(
        max_length=100)

    description = models.TextField(
        blank=True)

    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True)

    timestamp = models.DateTimeField(
        auto_now_add=True)

    class Meta:

        ordering = ["-timestamp"]

        indexes = [
            models.Index(fields=["module"]),
            models.Index(fields=["reference_id"]),
            models.Index(fields=["timestamp"]),
        ]

    def __str__(self):

        return f"{self.module} | {self.action} | {self.reference_id}"