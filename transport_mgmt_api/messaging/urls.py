from django.urls import path
from .views import (
    SendBulkGradeMessageView, 
    MessageListView,
    MessageTemplateViewSet,
    MessageTemplateDetailView
)

urlpatterns = [
    path("send-bulk-grade-message/", SendBulkGradeMessageView.as_view(), name="send-bulk-grade-message"),
    path('', MessageListView.as_view(), name='list-messages'),
    path('templates/', MessageTemplateViewSet.as_view(), name='message-templates'),
    path('templates/<int:pk>/', MessageTemplateDetailView.as_view(), name='message-template-detail'),
]
