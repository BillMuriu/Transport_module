from django.urls import path
from .views import StationListCreateView, StationRetrieveUpdateDestroyView

urlpatterns = [
    path('', StationListCreateView.as_view(), name='station-list-create'),
    path('<uuid:id>/', StationRetrieveUpdateDestroyView.as_view(), name='station-retrieve-update-destroy'),
]
