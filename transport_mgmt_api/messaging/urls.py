from django.urls import path
from .views import SendBulkGradeMessageView

urlpatterns = [
    path("send-bulk-grade-message/", SendBulkGradeMessageView.as_view(), name="send-bulk-grade-message"),
]
