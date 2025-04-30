# users/views.py
from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.signing import SignatureExpired, BadSignature, TimestampSigner
from .models import User
from .serializers import UserSerializer
from .permissions import IsMainAdmin

signer = TimestampSigner()

class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        user_type = serializer.validated_data.get('user_type')
        if user_type != User.UserType.MAIN_ADMIN:
            raise PermissionDenied("Only MAIN_ADMIN users can be created here.")
        serializer.save()

class UserRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'id'

class CreatePrivilegedUserView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsMainAdmin]

    def perform_create(self, serializer):
        user_type = serializer.validated_data.get('user_type')
        if user_type not in [
            User.UserType.SCHOOL_ADMIN,
            User.UserType.TRIP_TEACHER,
        ]:
            raise PermissionDenied("Only SCHOOL_ADMIN or TRIP_TEACHER can be created here.")
        serializer.save()

class ExpiringUserInviteView(APIView):
    def post(self, request):
        token = request.query_params.get('token')

        try:
            user_type = signer.unsign(token, max_age=3600)  # 1 hour expiry
        except SignatureExpired:
            return Response({'detail': 'This link has expired.'}, status=status.HTTP_400_BAD_REQUEST)
        except BadSignature:
            return Response({'detail': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user_type=user_type)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
