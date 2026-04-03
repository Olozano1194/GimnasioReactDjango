from rest_framework.permissions import BasePermission


class IsAdminUser(BasePermission):
    """
    Permiso personalizado: Solo usuarios con rol 'admin' pueden acceder.
    """
    def has_permission(self, request, view):
        return (
            request.user 
            and request.user.is_authenticated 
            and request.user.roles == 'admin'
        )


class IsRecepcionUser(BasePermission):
    """
    Permiso personalizado: Usuarios con rol 'recepcion' O 'admin' pueden acceder.
    Los recepcionistas pueden leer y escribir, pero no eliminar.
    """
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        return request.user.roles in ['admin', 'recepcion']
    
    def has_object_permission(self, request, view, obj):
        # recepcionistas no pueden eliminar
        if request.method == 'DELETE' and request.user.roles == 'recepcion':
            return False
        return True


class IsOwnerOrAdmin(BasePermission):
    """
    Permiso: El usuario puede acceder solo a sus propios objetos,
    o los admins pueden acceder a todos.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.roles == 'admin':
            return True
        
        # Verificar si el objeto tiene usuario
        if hasattr(obj, 'user'):
            return obj.user == request.user
        if hasattr(obj, 'usuario'):
            return obj.usuario == request.user
        
        return False