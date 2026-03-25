from django.contrib import admin
from .models import Supplier

admin.site.register(Supplier)

from .models import PurchaseOrder

admin.site.register(PurchaseOrder)

from .models import PurchaseInvoice

admin.site.register(PurchaseInvoice)

from .models import GRN

admin.site.register(GRN)

from .models import RawStockMovement

admin.site.register(RawStockMovement)