from rest_framework import serializers
from apiApp.models.role import Role, Permission

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'name', 'description']

class RoleSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True, read_only=True)
    permission_ids = serializers.PrimaryKeyRelatedField(many=True, queryset=Permission.objects.all(), write_only=True, source='permissions')

    class Meta:
        model = Role
        fields = ['id', 'name', 'description', 'permissions', 'permission_ids']
