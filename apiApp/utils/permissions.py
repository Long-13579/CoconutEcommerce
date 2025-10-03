from rest_framework.response import Response
from rest_framework import status
from functools import wraps

def role_required(allowed_roles):
	def decorator(view_func):
		@wraps(view_func)
		def _wrapped_view(request, *args, **kwargs):
			user = getattr(request, 'user', None)
			# Chưa xác thực
			if not user or not getattr(user, 'is_authenticated', False):
				return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)
			# Chỉ cho phép superuser mới được cập nhật status của user
			if getattr(user, 'is_superuser', False):
				return view_func(request, *args, **kwargs)
			# Kiểm tra theo role tên có phải là admin không được phép cập nhật status của user
			if hasattr(user, 'role') and user.role and user.role.name in allowed_roles:
				return view_func(request, *args, **kwargs)
			return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
		return _wrapped_view
	return decorator