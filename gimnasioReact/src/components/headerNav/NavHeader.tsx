import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
// icons
import { RiArrowDownSLine, RiSettings3Line, RiLogoutCircleRLine } from "react-icons/ri";
//Enlaces
import { Link, useNavigate } from "react-router-dom";
//react-menu
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
//API
import { getUserProfile } from "../../api/action/users.api";
//Mensajes
import { toast } from 'react-hot-toast';
//Component
import NotificationMenu from "../../components/headerNav/NotificationMenu"

function NavHeader() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: '', lastName: '', email: '', avatar: ''});
    const auth = useContext(AuthContext);    

    useEffect(() => {
        const axiosUserData = async () => {
            try {
                const data = await getUserProfile();
                //console.log('User data received:', data);

                const avatarUrl = data.user.avatar instanceof File ? URL.createObjectURL(data.user.avatar) : data.user.avatar ?? '';
                
                setUser({
                    name: data.user.name,
                    lastName: data.user.lastname,
                    email: data.user.email,
                    avatar: avatarUrl
                });
            }catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Error al registrar el miembro';
                toast.error(errorMessage, {
                    duration: 3000,
                    position: 'bottom-right',
                });  
            }
        };
        axiosUserData();
    }, []);

    if (!auth) return null;
    
    const { logout } = auth;

    // Esta función nos sirve para cerrar la sesión    
     const handleLogOut = () => {
        logout();
        navigate('/');        
    }
    
    return (
        <nav className="flex items-center gap-x-2">
            {/* este seria el menu de las notificaciones */}
            <Menu>                
                <NotificationMenu />
            </Menu>
            {/* aca comienza el menu desplegable del usuario */}
            <Menu>
                <MenuButton className="flex items-center gap-x-2 hover:bg-slate-600 p-2 rounded-lg transition-colors">
                <img 
                    src={user.avatar || "https://img.freepik.com/foto-gratis/feliz-optimista-guapo-gerente-ventas-latina-apuntando-lado-mirando-camara_1262-12679.jpg"} alt="img-user"
                    className="w-10 h-10 object-cover rounded-full"
                />
                <span className="text-gray-100 font-semibold">{user.name} {user.lastName}</span>
                <RiArrowDownSLine className="text-2xl" />
                </MenuButton>
                <MenuItems anchor='bottom' className='bg-secondary mt-1 p-4 rounded-lg'>
                    <MenuItem as='div' className='p-0'>
                            <Link to='#' className="rounded-lg transition-colors text-dark hover:bg-gray-200 flex items-center gap-x-4 py-2 px-4">
                                <img 
                                    src={user.avatar || "https://img.freepik.com/foto-gratis/feliz-optimista-guapo-gerente-ventas-latina-apuntando-lado-mirando-camara_1262-12679.jpg"} alt="img-user"
                                    className="w-10 h-10 object-cover rounded-full"
                                />
                                <div className="flex flex-col gap-1 text-sm">
                                    <span className="text-dark text-sm">{user.name} {user.lastName}</span>
                                    <span className="text-dark text-xm">{user.email}</span>
                                </div>
                            </Link>
                            
                    </MenuItem>
                    <hr className="my-4 border-gray-900/10" />

                    <MenuItem as='div' className='p-0'>
                            <Link to='/dashboard/profile' className="rounded-lg transition-colors text-dark hover:bg-gray-200 flex items-center gap-x-4 py-2 px-4 flex-1">
                                <RiSettings3Line className="text-2xl" />
                                Configuración                                                
                            </Link>
                            
                    </MenuItem>
                    <hr className="my-4 border-gray-900/10" />

                    <MenuItem as='div' className='p-0'>
                        <button
                            onClick={handleLogOut}
                            className="w-full rounded-lg transition-colors text-dark hover:bg-gray-200 flex items-centerr gap-x-4 py-2 px-4 flex-1">
                            <RiLogoutCircleRLine />
                            Cerrar Sesión                                      
                        </button>                            
                    </MenuItem>
                </MenuItems>                   
            </Menu>
        </nav>        
    );
    
}
export default NavHeader;