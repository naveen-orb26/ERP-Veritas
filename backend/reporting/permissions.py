from rest_framework.permissions import BasePermission


class IsOwnerOrAdmin(BasePermission):

    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            return False

        return request.user.role in [
            "owner",
            "admin"
        ]
    
class IsManagerOrAbove(BasePermission):

    def has_permission(self, request, view):

        return request.user.role in [
            "manager",
            "owner",
            "admin"
        ]
    
