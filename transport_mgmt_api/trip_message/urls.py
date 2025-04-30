from django.urls import path
from .views import TripMessageListCreateView, TripMessageRetrieveUpdateDestroyView

urlpatterns = [
    path('', TripMessageListCreateView.as_view(), name='list-create-trip-messages'),
    path('<uuid:pk>/', TripMessageRetrieveUpdateDestroyView.as_view(), name='retrieve-update-destroy-trip-message'),
]
