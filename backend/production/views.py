from rest_framework import viewsets
from activity_log.utils import log_activity

from .models import Production
from .serializers import ProductionSerializer


class ProductionViewSet(viewsets.ModelViewSet):

    queryset = Production.objects.all().order_by("-id")

    serializer_class = ProductionSerializer


    def perform_create(self, serializer):

        production = serializer.save()

        log_activity(
            user=self.request.user,
            action="CREATE",
            module="Production",
            reference_id=production.id,
            description="Production batch created",
            ip_address=self.request.META.get("REMOTE_ADDR"),
        )