from django.db import models

from django.db import models

from django.core.exceptions import (
    ValidationError
)


# =====================================================
# VENDOR
# =====================================================

class Vendor(models.Model):

    VENDOR_TYPE_CHOICES = [

        ("MANUFACTURER", "Manufacturer"),

        ("DISTRIBUTOR", "Distributor"),

        ("TRADER", "Trader"),

        ("IMPORTER", "Importer"),
    ]

    vendor_code = models.CharField(

        max_length=50,

        unique=True,

        editable=False
    )

    vendor_name = models.CharField(

        max_length=255,

        unique=True
    )

    vendor_type = models.CharField(

        max_length=50,

        choices=VENDOR_TYPE_CHOICES,

        default="TRADER"
    )

    gstin = models.CharField(

        max_length=30,

        blank=True
    )

    payment_terms_days = models.PositiveIntegerField(

        default=0
    )

    contacts = models.JSONField(

        default=list,

        blank=True
    )

    address = models.TextField(

        blank=True
    )

    state = models.CharField(

        max_length=100,

        blank=True
    )

    country = models.CharField(

        max_length=100,

        default="India"
    )

    remarks = models.TextField(

        blank=True
    )

    is_active = models.BooleanField(

        default=True
    )

    created_at = models.DateTimeField(

        auto_now_add=True
    )

    updated_at = models.DateTimeField(

        auto_now=True
    )

    def clean(self):

        self.vendor_code = (
            self.vendor_code.upper()
        )

        if not (
            self.vendor_code
            .replace("-", "")
            .replace("_", "")
            .isalnum()
        ):

            raise ValidationError(

                "Vendor code may only contain letters, numbers, hyphens, and underscores."
            )
        if self.gstin:

            duplicate_gstin = (

                Vendor.objects

                .exclude(id=self.id)

                .filter(
                    gstin__iexact=
                        self.gstin.strip()
                )

                .exists()
            )

        if duplicate_gstin:

            raise ValidationError(
              "Vendor with this GSTIN already exists."
                )


    def save(self, *args, **kwargs):

        if not self.vendor_code:

            last_vendor = (
                Vendor.objects
                .order_by("-id")
                .first()
            )

            next_id = 1

            if last_vendor:

                try:

                    next_id = (

                        int(

                            last_vendor
                            .vendor_code
                            .split("-")[1]
                        )
                        + 1
                    )

                except Exception:

                    next_id = 1

            self.vendor_code = (
                f"VND-{next_id:05d}"
            )

        super().save(*args, **kwargs)
        
    def __str__(self):

        return (

            f"{self.vendor_code} | "

            f"{self.vendor_name}"
        )