from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    department = models.ForeignKey('Department', on_delete=models.SET_NULL, null=True, blank=True)
    position = models.ForeignKey('Position', on_delete=models.SET_NULL, null=True, blank=True)
    is_approved = models.BooleanField(default=False)

class Profile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="profile")
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    bio = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

class Notification(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username} - {self.message[:50]}..."

class Announcement(models.Model):
    title = models.CharField(max_length=200)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Department(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class AssignEmployee(models.Model):
    employee = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    role = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.employee.username} - {self.department.name} ({self.role})"

class Position(models.Model):
    title = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

class Payroll(models.Model):
    employee = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    month = models.DateField()
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2)
    bonuses = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    @property
    def total_salary(self):
        return self.basic_salary + self.bonuses - self.deductions

    def __str__(self):
        return f"{self.employee.username} - {self.month.strftime('%B %Y')}"

class Salary(models.Model):
    employee = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    effective_date = models.DateField()

    def __str__(self):
        return f"{self.employee.username} - {self.amount} - {self.effective_date}"

class Advertisement(models.Model):
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text
