# vehicles/urls.py
from django.urls import path
from . import views
from . import generateAccesstoken

urlpatterns = [
    path('', views.VehicleListCreateView.as_view(), name='vehicle-list-create'),
    path('<uuid:id>/', views.VehicleRetrieveUpdateDestroyView.as_view(), name='vehicle-retrieve-update-destroy'),
    path('daraja/stk-push', views.initiate_stk_push, name='mpesa_stk_push_callback'),
    path('daraja', generateAccesstoken.get_access_token, name='index'),
]
