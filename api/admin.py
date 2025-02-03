from django.contrib import admin
from .models import CustomUser, Department, Position, Salary


admin.site.register(CustomUser)
admin.site.register(Department)
admin.site.register(Position)
admin.site.register(Salary)