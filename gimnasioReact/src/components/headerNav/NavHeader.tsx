import { useAuth } from "../../context/useAuth";
// icons
import { RiArrowDownSLine, RiSettings3Line, RiLogoutCircleRLine } from "react-icons/ri";
//Enlaces
import { Link, useNavigate } from "react-router-dom";
//react-menu
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
//Component
import NotificationMenu from "../../components/headerNav/NotificationMenu"

function NavHeader() {
    const navigate = useNavigate();  
    
    const { user, logout } = useAuth();

    // Esta función nos sirve para cerrar la sesión    
     const handleLogOut = () => {
        logout();
        navigate('/');        
    }

    const defaultAvatar = "https://img.freepik.com/foto-gratis/feliz-optimista-guapo-gerente-ventas-latina-apuntando-lado-mirando-camara_1262-12679.jpg";
    
    return (
        <nav className="flex items-center gap-x-2">
            {/* este seria el menu de las notificaciones */}
            <Menu>                
                <NotificationMenu />
            </Menu>
            {/* aca comienza el menu desplegable del usuario */}
            <Menu>
                <MenuButton className="flex items-center gap-x-2 hover:bg-gray-100 p-2 rounded-lg transition-colors">
                <img 
                    src={user?.avatar || defaultAvatar } alt="img-user"
                    className="w-10 h-10 object-cover rounded-full"
                />
                <span className="text-title font-semibold">{user?.name} {user?.lastname}</span>
                <RiArrowDownSLine className="text-2xl" />
                </MenuButton>
                <MenuItems anchor='bottom' className='bg-surface-container-lowest mt-1 p-4 rounded-lg'>
                    <MenuItem as='div' className='p-0'>
                            <Link to='#' className="rounded-lg transition-colors text-title hover:bg-gray-100 flex items-center gap-x-4 py-2 px-4">
                                <img 
                                    src={user?.avatar || defaultAvatar } alt="img-user"
                                    className="w-10 h-10 object-cover rounded-full"
                                />
                                <div className="flex flex-col gap-1 text-sm">
                                    <span className="font-semibold text-title text-sm">{user?.name} {user?.lastname}</span>
                                    <span className="text-nav text-xm">{user?.email}</span>
                                </div>
                            </Link>
                            
                    </MenuItem>
                    <hr className="my-4 border-nav/20" />

                    <MenuItem as='div' className='p-0'>
                            <Link to='/dashboard/profile' className="rounded-lg transition-colors text-nav hover:bg-gray-100 flex items-center gap-x-4 py-2 px-4 flex-1">
                                <RiSettings3Line className="text-2xl text-primary" />
                                Configuración                                                
                            </Link>
                            
                    </MenuItem>
                    <hr className="my-4 border-nav/20" />

                    <MenuItem as='div' className='p-0'>
                        <button
                            onClick={handleLogOut}
                            className="w-full rounded-lg transition-colors text-nav hover:bg-gray-100 flex items-centerr gap-x-4 py-2 px-4 flex-1">
                            <RiLogoutCircleRLine className="text-xl text-primary" />
                            Cerrar Sesión                                      
                        </button>                            
                    </MenuItem>
                </MenuItems>                   
            </Menu>
        </nav>        
    );    
}
export default NavHeader;