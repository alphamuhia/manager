from rest_framework import serializers
from .models import CustomUser, Department, Position, Payroll, Salary, Advertisement, Announcement, Notification, AssignEmployee

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        from django.contrib.auth import authenticate
        user = authenticate(username=data['username'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        return user

class TokenSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'department', 'position', 'is_approved']  
        extra_kwargs = {
            'password': {'write_only': True},
            'is_approved': {'read_only': True}
        }

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'department', 'salary'] 

    def create(self, validated_data):
        user = CustomUser(**validated_data)
        user.set_password(validated_data['password']) 
        user.save()
        return user

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'user', 'message', 'read', 'created_at']

    def create(self, validated_data):
        user = CustomUser(
            username=validated_data['username'],
            email=validated_data['email'],
            is_approved=False  
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name']

class AssignEmployeeSerializer(serializers.ModelSerializer):
    employee = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())
    
    class Meta:
        model = AssignEmployee
        fields = ['employee', 'department', 'role']

class PositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = ['id', 'title', 'department']

class PayrollSerializer(serializers.ModelSerializer):
    total_salary = serializers.ReadOnlyField()

    class Meta:
        model = Payroll
        fields = ['id', 'employee', 'amount', 'total_salary']

class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = ['id', 'title', 'text', 'created_at', 'updated_at']

class AdvertisementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Advertisement
        fields = ['id', 'text', 'created_at']

class SalarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Salary
        fields = '__all__'
