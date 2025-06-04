# users/urls.py
from django.urls import path
from .views import (
    UserListCreateView,
    UserRetrieveUpdateDestroyView,
    CreatePrivilegedUserView,
    ExpiringUserInviteView,
    CreateInvitationView,
    AcceptInvitationView,
    InvitationListView
)

urlpatterns = [
    path('', UserListCreateView.as_view(), name='user-list-create'),
    path('<uuid:id>/', UserRetrieveUpdateDestroyView.as_view(), name='user-detail'),
    path('create-privileged/', CreatePrivilegedUserView.as_view(), name='create-privileged-user'),
    path('invite/', ExpiringUserInviteView.as_view(), name='user-invite'),
    path('invite-user/', CreateInvitationView.as_view(), name='create-invitation'),
    path("invitations/", InvitationListView.as_view(), name="invitation-list"),
    path('accept-invite/', AcceptInvitationView.as_view(), name='accept-invitation'),
]
