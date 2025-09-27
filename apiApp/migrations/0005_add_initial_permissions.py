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
        "dashboard.view"
    ]
    for perm_name in initial_perms:
        Permission.objects.get_or_create(name=perm_name)

class Migration(migrations.Migration):
    dependencies = [
        ("apiApp", "0004_customuser_is_staff_account"),
    ]

    operations = [
        migrations.RunPython(create_initial_permissions),
    ]