# users/permissions.py
from rest_framework.permissions import BasePermission
from .models import User

class IsMainAdmin(BasePermission):
    """
    Custom permission to allow only MAIN_ADMIN users to access the view.
    """

    def has_permission(self, request, view):
        # Check if the user is authenticated and is a MAIN_ADMIN
        return request.user and request.user.is_authenticated and request.user.user_type == User.UserType.MAIN_ADMIN
