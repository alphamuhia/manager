from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import (
    DepartmentViewSet, 
    PositionViewSet, 
    EmployeeViewSet, 
    SalaryViewSet, 
    # LoginView,
    # login, 
    TokenRefreshView,
    RegisterView, 
    CheckPermissionView, 
    AdvertisementViewSet, 
    AnnouncementList, 
    NotificationList,
)

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet)
router.register(r'positions', PositionViewSet)
router.register(r'employees', EmployeeViewSet)
router.register(r'salaries', SalaryViewSet)
router.register(r'advertisements', AdvertisementViewSet)
router.register(r'announcement', AnnouncementList)
router.register(r'notification', NotificationList)

urlpatterns = [
    path('auth/', include(router.urls)),
    path('login/', views.login, name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('check_permission/', CheckPermissionView.as_view(), name='check_permission'),
]
