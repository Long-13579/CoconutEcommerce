from django.db import migrations

def create_initial_permissions(apps, schema_editor):
    Permission = apps.get_model('apiApp', 'Permission')
    initial_perms = [
        # Orders
        "orders.view",
        "orders.edit",
        "orders.assign",
        "orders.update_status",
        # Products
        "products.create",
        "products.update",
        "products.delete",
        "products.view",
        "products.manage",
        # Customers
        "customers.view",
        # Inventory
        "inventory.manage",
        # Tickets / hỗ trợ khách hàng
        "tickets.create",
        "tickets.update",
        "tickets.close",
        # Delivery
        "delivery.view",
        "delivery.manage",
        # Returns
        "returns.process",
        # Reports
        "reports.view",
        "reports.sales",
        "reports.finance",
        # Payments
        "payments.view",
        "payments.verify",
        "payments.refund",
        # Users & RBAC
        "users.manage",
        "rbac.manage",
        # Khác
        "dashboard.view",
        "chat.access",
    ]
    for perm_name in initial_perms:
        Permission.objects.get_or_create(name=perm_name)

    # Gán permission cho từng role
    Role = apps.get_model('apiApp', 'Role')
    role_permissions = {
        "admin": "all",  # Admin có tất cả quyền

        # Quản lý kho / tồn kho
        "staff_inventory": [
            "products.create",
            "products.update",
            "products.delete",
            "products.view",
            "inventory.manage",      # nhập / xuất / kiểm kho
            "dashboard.view"
        ],

        # Nhân viên hỗ trợ khách hàng
        "staff_support": [
            "orders.view",           # xem đơn hàng
            "customers.view",        # xem thông tin khách hàng
            "tickets.create",        # tạo ticket hỗ trợ
            "tickets.update",        # cập nhật trạng thái ticket
            "tickets.close",         # đóng ticket
            "chat.access",           # chat / email với khách
            "dashboard.view"
        ],

        # Nhân viên giao hàng / vận hành
        "staff_delivery": [
            "orders.view",           
            "orders.assign",         # nhận đơn giao
            "orders.update_status",  # cập nhật trạng thái giao
            "delivery.view",         # xem thông tin vận chuyển
            "delivery.manage",       # thêm tracking / update chi tiết
            "returns.process",       # xử lý hàng hoàn
            "dashboard.view"
        ],

        # Nhân viên bán hàng (sale)
        "staff_sale": [
            "orders.view",
            "customers.view",
            "chat.access",
            "delivery.view",         # chỉ xem tình trạng vận chuyển
            "reports.sales",         # xem báo cáo bán hàng
            "dashboard.view"
        ],

        # Nhân viên tài chính / kế toán
        "staff_finance": [
            "payments.view",         # xem danh sách thanh toán
            "payments.verify",       # xác nhận thanh toán
            "payments.refund",       # hoàn tiền
            "reports.finance",       # báo cáo doanh thu / chi phí
            "dashboard.view"
        ],
    }

    for role_name, perms in role_permissions.items():
        role_obj, _ = Role.objects.get_or_create(name=role_name)
        if perms == "all":
            perm_objs = Permission.objects.all()
        else:
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