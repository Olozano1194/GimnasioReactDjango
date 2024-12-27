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

//Ejemplo de usar una sola tabla en varios componentes
//API
import { getUsers } from './api/users.api';
import { useEffect, useState } from "react";
import { createColumnHelper } from '@tanstack/react-table';
//Enlaces
import { Link } from "react-router-dom";



function App() {  
  const [users, setUser] = useState([]);
  useEffect(() => {
    const axiosUserData = async () => {
        try {
            const data = await getUsers();
            console.log('User data received:', data);
            
            setUser(data);
        }catch (error) {
            console.error(error);
        }
    };
    axiosUserData();
  }, []);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor('index', {
        header: 'N°',
        cell: ((info) => info.row.index + 1),
    }),
    columnHelper.accessor('name', {
        header: 'Nombre',

    }),
    columnHelper.accessor('lastname', {
        header: 'Apellido',
    }),
    columnHelper.accessor('email', {
        header: 'Correo',
    }),
    columnHelper.accessor('roles', {
        header: 'Rol',
    }),
    columnHelper.accessor('actions', {
        header: 'Acciones',
        cell: (({ row }) => (
            <div className="flex justify-center items-center gap-x-4">
                <Link to={`/edit/usuarios/${row.original.id}`} className="bg-green-500 text-white p-2 rounded-md">Editar</Link>
                <button className="bg-red-500 text-white p-2 rounded-md">Eliminar</button>
            </div>
        )),
    }),
];

  
  return (
      <BrowserRouter>
        <Routes>        
          <Route path="/" element={<Navigate to='/login' />} />
          <Route path="login" element={<Login />} />
          <Route path="forget-password" element={<ForgetPassword />} />
          {/* Rutas protegidas */}
          <Route element={<ProtectRoute />} >
            <Route path="dashboard" element={<LayoutAdmin />} >
              <Route index element={<Home />} />
              <Route path="register" element={<Register />} />
              <Route path="listUser" element={<ListUser data={users} columns={columns} />} />
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
