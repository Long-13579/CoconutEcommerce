from rest_framework import serializers
from django.contrib.auth import get_user_model
from ..models import CustomerAddress


class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    joined_on = serializers.SerializerMethodField()
    state = serializers.SerializerMethodField()
    role = serializers.PrimaryKeyRelatedField(queryset=get_user_model().role.field.related_model.objects.all(), required=False, allow_null=True, write_only=True)
    role_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = get_user_model()
        fields = ["id", "email", "username", "first_name", "last_name", "profile_picture_url", "avatar", "joined_on", "state", "role", "role_name", "is_staff_account"]

    def get_role_name(self, obj):
        return obj.role.name if obj.role else None

    def get_avatar(self, obj):
        return obj.profile_picture_url or "https://i.pravatar.cc/300"

    def get_joined_on(self, obj):
        return obj.date_joined.strftime("%a %b %d %Y %H:%M:%S GMT%z (%Z)")

    def get_state(self, obj):
        return True

class CustomerAddressSerializer(serializers.ModelSerializer):
    customer = UserSerializer(read_only=True)
    class Meta:
        model = CustomerAddress
        fields = "__all__"