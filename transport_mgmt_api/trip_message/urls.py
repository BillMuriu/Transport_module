from django.urls import path
from .views import (
    TripMessageListCreateView,
    TripMessageRetrieveUpdateDestroyView,
    SendTripMessageView,
    SendBulkTripMessagesView,  # ✅ Import the new view
)

urlpatterns = [
    path('', TripMessageListCreateView.as_view(), name='list-create-trip-messages'),
    path('<uuid:pk>/', TripMessageRetrieveUpdateDestroyView.as_view(), name='retrieve-update-destroy-trip-message'),
    path('send/', SendTripMessageView.as_view(), name='send-trip-message'),
    path('send-bulk/', SendBulkTripMessagesView.as_view(), name='send-bulk-trip-messages'),  # ✅ New URL
]
