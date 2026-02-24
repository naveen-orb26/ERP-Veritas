from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Production
from .serializers import ProductionSerializer


class ProductionViewSet(viewsets.ModelViewSet):
    queryset = Production.objects.all().order_by("-id")
    serializer_class = ProductionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)