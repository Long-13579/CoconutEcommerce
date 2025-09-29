from django.db import migrations

def create_initial_permissions(apps, schema_editor):
    Permission = apps.get_model('apiApp', 'Permission')
    initial_perms = [
        "orders.view",
        "orders.edit",
        "products.manage",
        "customers.view",
        "reports.view",
        "users.manage",
        "rbac.manage",
        "orders.assign",
        "products.view",
        "dashboard.view",
        "chat.access"
    ]
    for perm_name in initial_perms:
        Permission.objects.get_or_create(name=perm_name)

    # Gán permission cho từng role
    Role = apps.get_model('apiApp', 'Role')
    role_permissions = {
        "admin": initial_perms,  # Admin có tất cả quyền
        "staff_inventory": ["products.manage", "products.view", "dashboard.view"],
        "staff_support": ["orders.view", "customers.view", "chat.access", "dashboard.view"],
        "staff_delivery": ["orders.view", "orders.assign", "dashboard.view"],
        "staff_sale": ["orders.view", "customers.view", "chat.access", "dashboard.view"],
    }
    for role_name, perms in role_permissions.items():
        role_obj, _ = Role.objects.get_or_create(name=role_name)
        perm_objs = Permission.objects.filter(name__in=perms)
        role_obj.permissions.set(perm_objs)
        role_obj.save()

class Migration(migrations.Migration):
    dependencies = [
        ("apiApp", "0004_customuser_is_staff_account"),
    ]

    operations = [
        migrations.RunPython(create_initial_permissions),
    ]