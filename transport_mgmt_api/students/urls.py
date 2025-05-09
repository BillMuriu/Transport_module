from django.urls import path
from .views import (
    StudentListCreateView,
    StudentRetrieveUpdateDestroyView,
    StudentRouteTotalView,  # Import the new view
    ParentContactBatchView,
    StudentIdListView
)

urlpatterns = [
    path('', StudentListCreateView.as_view(), name='list-create-students'),
    path('<uuid:id>/', StudentRetrieveUpdateDestroyView.as_view(), name='retrieve-update-delete-student'),
    path('route-total/', StudentRouteTotalView.as_view(), name='student-route-total'),  # Add the new URL
    path("parents/contact-info/", ParentContactBatchView.as_view(), name="parent-contact-info"),
    path('student-ids/', StudentIdListView.as_view(), name='student-id-list'),
]
