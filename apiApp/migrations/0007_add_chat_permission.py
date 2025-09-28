from django.db import migrations

def add_chat_permission(apps, schema_editor):
    Permission = apps.get_model('apiApp', 'Permission')
    Role = apps.get_model('apiApp', 'Role')
    # Tạo permission chat.access nếu chưa có
    chat_perm, created = Permission.objects.get_or_create(name='chat.access', defaults={'description': 'Quyền chat cho sale/support'})
    # Thêm chat.access vào các role liên quan
    for role_name in ['staff_support', 'staff_sale']:
        role_obj = Role.objects.filter(name=role_name).first()
        if role_obj:
            role_obj.permissions.add(chat_perm)
            role_obj.save()

class Migration(migrations.Migration):
    dependencies = [
        ('apiApp', '0006_order_orderitem'),
    ]
    operations = [
        migrations.RunPython(add_chat_permission),
    ]
