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
import RegistrarMiembro from './pages/admin/registroPorMes/RegisterMiembro';
import ListMiembro from './pages/admin/usuarios/ListMiembro';

import Error404 from './pages/Error404';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>        
        <Route path='/' element={<Navigate to='/login' />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forget-password" element={<ForgetPassword />} />

        <Route path='dashboard' element={<LayoutAdmin />} >
          <Route index element={<Home />} />
          <Route path="user" element={<ListUser />} />
          <Route path="registrar-miembro" element={<RegistrarMiembro />} />
          <Route path="miembros" element={<ListMiembro />} />
                  
        </Route>
        
        <Route path="*" element={<Error404 />} />

      </Routes>
     
    </BrowserRouter>
  )
}

export default App
