# staff_serializers.py
"""
Renamed from user_serializers.py to staff_serializers.py
"""
from rest_framework import serializers
from ..models import CustomerAddress
from ..models.user import Staff

class StaffSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    joined_on = serializers.SerializerMethodField()
    role_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Staff
        fields = ["id", "email", "username", "first_name", "last_name", "profile_picture_url", "avatar", "joined_on", "role", "role_name", "is_active"]

    def get_role_name(self, obj):
        return obj.role.name if obj.role else None

    def get_avatar(self, obj):
        return obj.profile_picture_url or "https://i.pravatar.cc/300"

    def get_joined_on(self, obj):
        return obj.date_joined.strftime("%a %b %d %Y %H:%M:%S GMT%z (%Z)")

class CustomerAddressSerializer(serializers.ModelSerializer):
    customer = StaffSerializer(read_only=True)
    class Meta:
        model = CustomerAddress
        fields = "__all__"