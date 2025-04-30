from django.urls import path
from .views import (
    StudentListCreateView,
    StudentRetrieveUpdateDestroyView,
)

urlpatterns = [
    path('', StudentListCreateView.as_view(), name='list-create-students'),
    path('<uuid:id>/', StudentRetrieveUpdateDestroyView.as_view(), name='retrieve-update-delete-student'),
]
