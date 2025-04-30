from django.urls import path
from .views import TripListCreateView, TripRetrieveUpdateDestroyView

urlpatterns = [
    path('', TripListCreateView.as_view(), name='list-create-trips'),
    path('<uuid:id>/', TripRetrieveUpdateDestroyView.as_view(), name='detail-update-delete-trip'),
]
