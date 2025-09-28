from django.db import migrations
from django.contrib.auth.hashers import make_password

def create_admin_user(apps, schema_editor):
    CustomUser = apps.get_model('apiApp', 'CustomUser')
    Role = apps.get_model('apiApp', 'Role')
    admin_role, _ = Role.objects.get_or_create(name='admin')
    if not CustomUser.objects.filter(email='admin@gmail.com').exists():
        CustomUser.objects.create(
            email='admin@gmail.com',
            username='admin',
            password=make_password('admin123'),
            role=admin_role,
            is_staff_account=True,
            is_superuser=True,
            is_active=True
        )

class Migration(migrations.Migration):
    dependencies = [
        ('apiApp', '0007_add_chat_permission'),
    ]
    operations = [
        migrations.RunPython(create_admin_user),
    ]