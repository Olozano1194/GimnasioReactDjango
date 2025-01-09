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
import Profile from './pages/admin/usuarios/ProfileAdmin';

// Miembros mensuales
import MemberForm from './pages/admin/registroPorMes/MemberForm';
import ListMiembro from './pages/admin/registroPorMes/ListMiembro';
// Miembros por dia
import ListMiembroDay from './pages/admin/registroPorDia/ListMiembroDay';
import MemberFormDay from './pages/admin/registroPorDia/MemberFormDay';

//Ruta protegida
import ProtectRoute from './pages/admin/protectedRoute/ProtectRoute';

import Error404 from './pages/Error404';
//Notificaciones
import { Toaster } from 'react-hot-toast'

function App() {

  return (
      <BrowserRouter>
        <Routes>        
          <Route path="/" element={<Navigate to='/login' />} />
          <Route path="login" element={<Login />} />
          <Route path="forget-password" element={<ForgetPassword />} /><Route path="register" element={<Register />} />
          {/* Rutas protegidas */}
          <Route element={<ProtectRoute />} >
            <Route path="dashboard" element={<LayoutAdmin />} >
              <Route index element={<Home />} />
              <Route path="register" element={<Register />} />
              <Route path="listUser" element={<ListUser />} />
              <Route path="profile" element={<Profile />} />
              <Route path="registrar-miembro" element={<MemberForm />} />
              <Route path="miembros" element={<ListMiembro />} />
              <Route path="miembro/:id" element={<MemberForm />} />
              <Route path="miembros-day" element={<ListMiembroDay />} />
              <Route path="registrar-miembro-day" element={<MemberFormDay />} />
              <Route path="miembro-day/:id" element={<MemberFormDay />} />                   
            </Route> 
          </Route>       
          <Route path="*" element={<Error404 />} />
        </Routes>
        <Toaster />      
      </BrowserRouter>    
  );
}

export default App
