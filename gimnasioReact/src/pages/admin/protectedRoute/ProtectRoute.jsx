import { Navigate, Outlet } from "react-router-dom";
//import { useAuth } from "../../../context/authContext"; //Importamos el contexto de autenticación

const ProtectRoute = () => {
    //const { token } = useAuth(); //Obtenemos el token del contexto de autenticación
    const isAuthebticated = !!localStorage.getItem('token'); //Verificamos si el token existe

    return isAuthebticated ? <Outlet /> : <Navigate to="/" replace />;
}

export default ProtectRoute;