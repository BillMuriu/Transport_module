from django.urls import path
from .views import RouteListCreateView, RouteRetrieveUpdateDestroyView

urlpatterns = [
    path('', RouteListCreateView.as_view(), name='route-list-create'),
    path('<uuid:id>/', RouteRetrieveUpdateDestroyView.as_view(), name='route-retrieve-update-destroy'),
]
