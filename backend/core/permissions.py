from rest_framework.permissions import BasePermission


SAFE_METHODS = ["GET", "HEAD", "OPTIONS"]


# --------------------------------------------------
# Base Role Check
# --------------------------------------------------

class RolePermission(BasePermission):

    allowed_roles = []

    def has_permission(self, request, view):

        user = request.user

        if not user or not user.is_authenticated:
            return False

        return user.role in self.allowed_roles


# --------------------------------------------------
# Role Classes
# --------------------------------------------------

class IsEmployee(RolePermission):
    allowed_roles = ["employee", "manager", "owner", "admin"]


class IsManager(RolePermission):
    allowed_roles = ["manager", "owner", "admin"]


class IsOwner(RolePermission):
    allowed_roles = ["owner", "admin"]


class IsAdmin(RolePermission):
    allowed_roles = ["admin"]


# --------------------------------------------------
# Financial Access
# --------------------------------------------------

class FinancialAccess(RolePermission):

    allowed_roles = ["owner", "admin"]


# --------------------------------------------------
# Manager Or Above
# --------------------------------------------------

class ManagerOrAbove(RolePermission):

    allowed_roles = ["manager", "owner", "admin"]


# --------------------------------------------------
# Read Only For Employee
# --------------------------------------------------

class ReadOnlyForEmployee(RolePermission):

    allowed_roles = ["employee", "manager", "owner", "admin"]

    def has_permission(self, request, view):

        if request.method in SAFE_METHODS:
            return True

        return request.user.role in [
            "manager",
            "owner",
            "admin"
        ]