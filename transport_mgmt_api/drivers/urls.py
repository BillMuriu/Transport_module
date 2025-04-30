# drivers/urls.py
from django.urls import path
from .views import DriverListCreateView, DriverRetrieveUpdateDestroyView

urlpatterns = [
    path('', DriverListCreateView.as_view(), name='list-create-drivers'),
    path('<uuid:id>/', DriverRetrieveUpdateDestroyView.as_view(), name='retrieve-update-destroy-driver'),
]
