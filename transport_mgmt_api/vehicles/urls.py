# vehicles/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.VehicleListCreateView.as_view(), name='vehicle-list-create'),
    path('<uuid:id>/', views.VehicleRetrieveUpdateDestroyView.as_view(), name='vehicle-retrieve-update-destroy'),
]
