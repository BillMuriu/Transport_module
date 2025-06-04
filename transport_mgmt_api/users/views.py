from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.signing import SignatureExpired, BadSignature, TimestampSigner
from .models import User, Invitation
from .serializers import UserSerializer, InvitationSerializer
from .permissions import IsMainAdmin
from django.conf import settings


signer = TimestampSigner()

class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        user_type = serializer.validated_data.get('user_type')
        if user_type != User.UserType.TRIP_TEACHER:
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

class InvitationListView(generics.ListAPIView):
    queryset = Invitation.objects.all()
    serializer_class = InvitationSerializer

class CreateInvitationView(generics.CreateAPIView):
    serializer_class = InvitationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        invitation = serializer.save()

        invite_link = f"{settings.FRONTEND_URL}/accept-invite/{invitation.token}/"
        return Response({
            "invite_link": invite_link,
            "token": str(invitation.token),
        })



class AcceptInvitationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        token = request.data.get("token")
        email = request.data.get("email")
        username = request.data.get("username")
        password = request.data.get("password")
        phone_number = request.data.get("phone_number", "")

        if not all([token, email, username, password]):
            return Response({"detail": "Missing fields"}, status=400)

        try:
            invitation = Invitation.objects.get(token=token, is_used=False)
        except Invitation.DoesNotExist:
            return Response({"detail": "Invalid or expired invitation"}, status=400)

        user = User.objects.create_user(
            email=email,
            username=username,
            password=password,
            phone_number=phone_number,
            user_type=invitation.user_type,
            school=invitation.school,
        )

        invitation.is_used = True
        invitation.save()

        return Response({"detail": "User created successfully"}, status=status.HTTP_201_CREATED)