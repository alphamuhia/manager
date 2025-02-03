from django.contrib.auth import authenticate, login
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from rest_framework.decorators import action
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, status, permissions
from .models import CustomUser, Department, Position, Payroll, Salary, Advertisement, Announcement, Notification
from rest_framework import viewsets
from .serializers import UserSerializer, LoginSerializer, DepartmentSerializer, PositionSerializer, PayrollSerializer, SalarySerializer, AdvertisementSerializer, AnnouncementSerializer, NotificationSerializer, EmployeeSerializer
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
import logging

logger = logging.getLogger(__name__)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if not user:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_approved:
            return Response({"error": "User is not approved"}, status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        response_data = {
            "user": {
                "username": user.username,
                "email": user.email,
                "is_superuser": user.is_superuser,
                "is_approved": user.is_approved,
            },
            "access_token": access_token,
            "refresh_token": str(refresh),
            "redirect": "/admin" if user.is_superuser else "/employee"
        }

        return Response(response_data, status=status.HTTP_200_OK)

class EmployeeCreateView(generics.CreateAPIView):
    serializer_class = EmployeeSerializer

class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        employee = request.user
        serializer = EmployeeSerializer(employee)
        return Response(serializer.data)
    
    def put(self, request):
        employee = request.user
        serializer = EmployeeSerializer(employee, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['POST', 'GET'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    CustomUser = authenticate(username=username, password=password)
    if CustomUser:
        refresh = RefreshToken.for_user(CustomUser)
        return Response({"access_token": str(refresh.access_token), "refresh_token": str(refresh)})
    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        user = serializer.save()

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

    @action(detail=True, methods=['get'])
    def available_positions(self, request, pk=None):
        department = self.get_object()
        positions = Position.objects.filter(department=department, is_available=True)  
        serializer = PositionSerializer(positions, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def assign_employee(self, request):
        employee_id = request.data.get('employee_id')
        department_id = request.data.get('department_id')

        employee = get_object_or_404(CustomUser, id=employee_id)
        department = get_object_or_404(Department, id=department_id)

        employee.department = department
        employee.save()

        return Response({"message": "Employee assigned successfully"}, status=status.HTTP_200_OK)

class PositionViewSet(viewsets.ModelViewSet):
    queryset = Position.objects.all()
    serializer_class = PositionSerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.filter(is_superuser=False) 
    serializer_class = UserSerializer
    # permission_classes = [IsAuthenticated]

class CheckPermissionView(APIView):
    def get(self, request):
        user = request.user
        if hasattr(user, 'is_approved') and user.is_approved:
            return Response({'permissionGranted': True})
        return Response({'permissionGranted': False})

class NotificationList(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    # permission_classes = [IsAuthenticated] 

    def perform_create(self, serializer):
       
        serializer.save(user=self.request.user)

class AdvertisementViewSet(viewsets.ModelViewSet):
    queryset = Advertisement.objects.all()
    serializer_class = AdvertisementSerializer

class AnnouncementList(viewsets.ModelViewSet):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer

class PayrollViewSet(viewsets.ModelViewSet):
    queryset = Payroll.objects.all()
    serializer_class = PayrollSerializer

class SalaryViewSet(viewsets.ModelViewSet):
    queryset = Salary.objects.all()
    serializer_class = SalarySerializer
