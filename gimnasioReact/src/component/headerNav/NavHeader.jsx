import { useEffect, useState } from "react";

// icons
import { RiNotification3Line, RiArrowDownSLine, RiSettings3Line, RiLogoutCircleRLine, RiThumbUpLine, RiChat3Line } from "react-icons/ri";

//Enlaces
import { Link, useNavigate } from "react-router-dom";

//react-menu
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

//API
import { getUserProfile } from '../../api/users.api';


function NavHeader() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: '', lastName: '', email: ''});

    useEffect(() => {
        const axiosUserData = async () => {
            try {
                const data = await getUserProfile();
                console.log('User data received:', data);
                
                setUser({
                    name: data.user.name,
                    lastName: data.user.lastname,
                    email: data.user.email
                });
            }catch (error) {
                console.error(error);
            }
        };
        axiosUserData();
    }, []);

    // Esta función nos sirve para cerrar la sesión
    const setLoggedOut= false;
    const handleLogout = () => {
        localStorage.removeItem('token');
        setLoggedOut(true)
        console.log('Token removed:', localStorage.getItem('token'));
        navigate('/', { replace: true});
        
    }
    
    return (
        <nav className="flex items-center gap-x-2">
            {/* este seria el menu de las notificaciones */}
                <Menu>
                    <MenuButton className="relative hover:bg-slate-700 p-2 rounded-lg transition-colors">
                        <RiNotification3Line className="text-2xl" />
                        <span className="absolute -top-0.5 right-0 bg-sky-500 py-0.5 px-[5px] box-content text-black rounded-full text-[8px] font-bold">2</span>
                    </MenuButton> 
                    <MenuItems anchor='bottom end' className='bg-secondary mt-1 p-4 rounded-lg'>
                        <h1 className="text-dark text-center font-medium">Notificaciones</h1>
                        <hr className="my-6 border-gray-500" />
                        <MenuItem className='p-0 hover:bg-slate-200'>
                            <Link to="/notifications" 
                                className="flex flex-1 items-center gap-x-2 py-2 px-4 hover:bg-slate-200 transition-colors rounded-lg text-dark">
                                <img src="https://img.freepik.com/foto-gratis/feliz-optimista-guapo-gerente-ventas-latina-apuntando-lado-mirando-camara_1262-12679.jpg" alt="" className="w-8 h-8 object-cover rounded-full" />
                                <div className="text-sm flex flex-col">
                                    <div className="flex items-center justify-between gap-2">
                                        <span>Fulanito de Tal</span> <span className="text-[11px]">2/07/2024</span>
                                    </div>
                                    <p className="text-dark">Lorem ipsum dolor sit amet...</p>
                                    
                                </div>
                            </Link>
                        </MenuItem>
                        <hr className="my-6 border-gray-500" />
                        <MenuItem className='p-0 hover:bg-slate-200'>
                            <Link to="/notifications" 
                                className="flex flex-1 items-center gap-x-2 py-2 px-4 hover:bg-slate-200 transition-colors rounded-lg text-dark">
                                <RiThumbUpLine className="p-2 bg-blue-100 text-blue-700 box-content rounded-full" />
                                <div className="text-sm flex flex-col">
                                    <div className="flex items-center justify-between gap-2">
                                        <span>Nuevo Like</span> <span className="text-[11px]">2/07/2024</span>
                                    </div>
                                    <p className="text-dark">A Fulanito le gusta tu publ...</p>
                                    
                                </div>
                            </Link>
                        </MenuItem>
                        <hr className="my-6 border-gray-500" />
                        <MenuItem className='p-0 hover:bg-slate-200'>
                            <Link to="/notifications" 
                                className="flex items-center gap-x-2 py-2 px-4 hover:bg-slate-200 transition-colors rounded-lg text-dark">
                                <RiChat3Line className="p-2 bg-yellow-100 text-yellow-500 box-content rounded-full" />
                                <div className="text-sm flex flex-col">
                                    <div className="flex items-center justify-between gap-2">
                                        <span>Nuevo Comentario</span> <span className="text-[11px]">2/07/2024</span>
                                    </div>
                                    <p className="text-dark">Fulanito ha comentado tu ta...</p>
                                    
                                </div>
                            </Link>
                        </MenuItem>
                        <hr className="my-6 border-gray-200" />
                        <MenuItem className='p-0 hover:bg-slate-200 flex justify-center cursor-default'>
                        <Link to="/" className="text-dark text-base hover:text-sky-700 transition-colors" >
                            Todas las notificaciones
                        </Link>
                        </MenuItem>
                    </MenuItems>                   
                </Menu>

                {/* aca comienza el menu desplegable del usuario */}
                <Menu>
                    <MenuButton className="flex items-center gap-x-2 hover:bg-slate-600 p-2 rounded-lg transition-colors">
                        <img 
                            src="https://img.freepik.com/foto-gratis/feliz-optimista-guapo-gerente-ventas-latina-apuntando-lado-mirando-camara_1262-12679.jpg" alt="img-user"
                            className="w-10 h-10 object-cover rounded-full"
                        />
                        <span className="text-gray-100 font-semibold">{user.name} {user.lastName}</span>
                        <RiArrowDownSLine className="text-2xl" />
                    </MenuButton>
                    <MenuItems anchor='bottom' className='bg-secondary mt-1 p-4 rounded-lg'>
                        <MenuItem className='p-0 hover:bg-gray-500'>
                            <Link to='/dashboard/profile' className="rounded-lg transition-colors text-dark hover:bg-gray-200 flex items-center gap-x-4 py-2 px-4">
                                <img 
                                    src="https://img.freepik.com/foto-gratis/feliz-optimista-guapo-gerente-ventas-latina-apuntando-lado-mirando-camara_1262-12679.jpg" alt="img-user"
                                    className="w-10 h-10 object-cover rounded-full"
                                />
                                <div className="flex flex-col gap-1 text-sm">
                                    <span className="text-dark text-sm">{user.name} {user.lastName}</span>
                                    <span className="text-dark text-xm">{user.email}</span>
                                </div>
                            </Link>
                            
                        </MenuItem>
                        <hr className="my-4 border-gray-500" />

                        <MenuItem className='p-0 hover:bg-gray-500'>
                            <Link to='/configuration' className="rounded-lg transition-colors text-dark hover:bg-gray-200 flex items-center gap-x-4 py-2 px-4 flex-1">
                            <RiSettings3Line className="text-2xl" />
                            Configuración
                                                
                            </Link>
                            
                        </MenuItem>
                        <hr className="my-4 border-gray-500" />

                        <MenuItem className='p-0 hover:bg-gray-500'>
                            <Link 
                                onClick={handleLogout}
                                className="rounded-lg transition-colors text-dark hover:bg-gray-200 flex items-centerr gap-x-4 py-2 px-4 flex-1">
                            <RiLogoutCircleRLine />
                            Cerrar Sesión
                                                
                            </Link>
                            
                        </MenuItem>
                    </MenuItems>
                    
                    
                    
                </Menu>

        </nav>        
    );
    
}

export default NavHeader;