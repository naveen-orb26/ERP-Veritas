from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
)
from django.utils import timezone

from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom User model for ERP where email is used as the login field.
    Includes user roles for access control within the ERP.
    """

    ROLE_CHOICES = [
        ("owner", "Owner"),
        ("admin", "Admin"),
        ("manager", "Manager"),
        ("employee", "Employee"),
    ]

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="employee")

    # Django-required fields
    is_staff = models.BooleanField(default=False)     # access to Django admin site
    is_active = models.BooleanField(default=True)     # can log in to the system
    date_joined = models.DateTimeField(default=timezone.now)

    # Connect custom manager
    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []  # prompts for only password when creating superusers

    def __str__(self):
        return self.email
