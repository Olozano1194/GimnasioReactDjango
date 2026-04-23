import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const ProtectRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    // Mientras carga, mostrar nada o un loader
    if (loading) {
        return null;
    }

    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Si está autenticado, mostrar el contenido protegido
    return <Outlet />;
}

export default ProtectRoute;