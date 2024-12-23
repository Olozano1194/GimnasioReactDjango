import {BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

//Layouts
import LayoutAdmin from './layouts/LayoutAdmin';
//Pages auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgetPassword from './pages/auth/ForgetPassword';
//Pages admin
import Home from './pages/admin/Home';
import ListUser from './pages/admin/usuarios/ListUser';
// Miembros mensuales
import RegisterMiembro from './pages/admin/registroPorMes/RegisterMiembro';
import ListMiembro from './pages/admin/registroPorMes/ListMiembro';
// Miembros por dia
import ListMiembroDay from './pages/admin/registroPorDia/ListMiembroDay';
import RegisterMiembroDay from './pages/admin/registroPorDia/RegisterMiembroDay';

//Ruta protegida
import ProtectRoute from './pages/admin/protectedRoute/ProtectRoute';


import Error404 from './pages/Error404';

function App() {
  
  return (
      <BrowserRouter>
        <Routes>        
          <Route path="/" element={<Navigate to='/login' />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forget-password" element={<ForgetPassword />} />
          {/* Rutas protegidas */}
          <Route element={<ProtectRoute />} >
            <Route path="dashboard" element={<LayoutAdmin />} >
              <Route index element={<Home />} />
              <Route path="listUser" element={<ListUser />} />
              <Route path="registrar-miembro" element={<RegisterMiembro />} />
              <Route path="miembros" element={<ListMiembro />} />
              <Route path="miembros-day" element={<ListMiembroDay />} />
              <Route path="registrar-miembro-day" element={<RegisterMiembroDay />} />                   
            </Route> 
          </Route>       
          <Route path="*" element={<Error404 />} />
        </Routes>
      
      </BrowserRouter>    
  );
}

export default App
