# schools/urls.py
from django.urls import path
from .views import SchoolListCreateView, SchoolRetrieveUpdateDestroyView

urlpatterns = [
    path('', SchoolListCreateView.as_view(), name='school-list-create'),
    path('<uuid:id>/', SchoolRetrieveUpdateDestroyView.as_view(), name='school-detail'),
]
