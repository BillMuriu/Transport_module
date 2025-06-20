"""
URL configuration for transport_mgmt_api project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    path('users/', include('users.urls')),

    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('schools/', include('schools.urls')),
    path('drivers/', include('drivers.urls')),
    path('vehicles/', include('vehicles.urls')),
    path('routes/', include('routes.urls')),
    path('stations/', include('stations.urls')),
    path('students/', include('students.urls')),
    path('trips/', include('trips.urls')),
    path('trip-messages/', include('trip_message.urls')),
    path('school_admin/', include('school_admin.urls')),
    path('messaging/', include('messaging.urls')),
]
