from rest_framework.response import Response
from rest_framework import status
from functools import wraps

def role_required(allowed_roles):
	def decorator(view_func):
		@wraps(view_func)
		def _wrapped_view(request, *args, **kwargs):
			user = getattr(request, 'user', None)
			if hasattr(user, 'role') and user.role and user.role.name in allowed_roles:
				return view_func(request, *args, **kwargs)
			return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
		return _wrapped_view
	return decorator
