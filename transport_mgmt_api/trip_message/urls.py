from django.urls import path
from .views import (
    TripMessageListCreateView,
    TripMessageRetrieveUpdateDestroyView,
    SendTripMessageView,
    SendBulkTripMessagesView,  # ✅ Import the new view
    SendBulkTripStudentMessagesViewV2,
    SendBulkTripStudentMessagesViewWithRateLimit,
    SendBulkTripStudentArriveStartMessagesView
)

urlpatterns = [
    path('', TripMessageListCreateView.as_view(), name='list-create-trip-messages'),
    path('<uuid:pk>/', TripMessageRetrieveUpdateDestroyView.as_view(), name='retrieve-update-destroy-trip-message'),
    path('send/', SendTripMessageView.as_view(), name='send-trip-message'),
    path('send-bulk/', SendBulkTripMessagesView.as_view(), name='send-bulk-trip-messages'),  # ✅ New URL
    path('send-bulk-messages/', SendBulkTripStudentMessagesViewV2.as_view(), name='send-bulk-trip-student-messages'),
    path('send-bulk-messages-mobilesasa/', SendBulkTripStudentMessagesViewWithRateLimit.as_view(), name='send-bulk-trip-student-messages-mobilesasa'),
    path('bulk-start-arrive-messages/', SendBulkTripStudentArriveStartMessagesView.as_view(), name='bulk-start-arrive-messages')

]
