from django.urls import path
from .views import SendBulkGradeMessageView, MessageListView

urlpatterns = [
    path("send-bulk-grade-message/", SendBulkGradeMessageView.as_view(), name="send-bulk-grade-message"),
    path('', MessageListView.as_view(), name='list-messages'),
]
