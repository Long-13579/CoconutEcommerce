from rest_framework import serializers
from django.contrib.auth import get_user_model
from ..models import CustomerAddress


class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    joined_on = serializers.SerializerMethodField()
    state = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField(read_only=True)
    phone = serializers.SerializerMethodField(read_only=True)
    account_status = serializers.SerializerMethodField(read_only=True)
    role = serializers.PrimaryKeyRelatedField(queryset=get_user_model().role.field.related_model.objects.all(), required=False, allow_null=True, write_only=True)
    role_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = get_user_model()
        fields = [
            "id",
            "email",
            "username",
            "profile_picture_url",
            "avatar",
            "joined_on",
            "state",
            "account_status",
            "address",
            "phone",
            "role",
            "role_name",
            "is_staff_account",
            "password"
        ]
        extra_kwargs = {
            'password': {'write_only': True}  # Ensure password is write-only
        }

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = super().create(validated_data)
        if password:
            user.set_password(password)
            user.save()
            user.password = password  # For returning in response
        return user

    def get_role_name(self, obj):
        return obj.role.name if obj.role else None

    def get_avatar(self, obj):
        return obj.profile_picture_url or "https://i.pravatar.cc/300"

    def get_joined_on(self, obj):
        try:
            created = getattr(obj, 'created_at', None) or getattr(obj, 'date_joined', None)
            return created.date().isoformat() if created else None
        except Exception:
            return None

    def get_state(self, obj):
        return bool(getattr(obj, 'is_active', True))

    def get_account_status(self, obj):
        is_active = bool(getattr(obj, 'is_active', True))
        return "Active" if is_active else "Inactive"

    def get_address(self, obj):
        addr = CustomerAddress.objects.filter(customer=obj).order_by('-id').first()
        if not addr:
            return None
        parts = [p for p in [addr.street, addr.city, addr.state] if p]
        return ", ".join(parts) if parts else None

    def get_phone(self, obj):
        addr = CustomerAddress.objects.filter(customer=obj).order_by('-id').first()
        return getattr(addr, 'phone', None) if addr else None


class CustomerAddressSerializer(serializers.ModelSerializer):
    customer = UserSerializer(read_only=True)
    class Meta:
        model = CustomerAddress
        fields = "__all__"