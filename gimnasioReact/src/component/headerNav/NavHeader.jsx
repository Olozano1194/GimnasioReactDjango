import { RiNotification3Line, RiArrowDownSLine, RiSettings3Line, RiLogoutCircleRLine, RiThumbUpLine, RiChat3Line } from "react-icons/ri";

//Enlaces
import { Link, useNavigate } from "react-router-dom";

//react-menu
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';


function NavHeader() {      

    return (
        <nav className="flex items-center gap-x-2">
            {/* este seria el menu de las notificaciones */}
                <Menu menuButton={
                    <MenuButton className="relative hover:bg-slate-700 p-2 rounded-lg transition-colors">
                        <RiNotification3Line className="text-2xl" />
                        <span className="absolute -top-0.5 right-0 bg-sky-500 py-0.5 px-[5px] box-content text-black rounded-full text-[8px] font-bold">2</span>
                    </MenuButton>
                }
                align="end"
                arrow
                transition
                menuClassName='bg-slate-700 p-4 custom-menu'
                >
                    <h1 className="text-gray-300 text-center font-medium">Notificaciones</h1>
                    <hr className="my-6 border-gray-500" />
                    <MenuItem className='p-0 hover:bg-transparent'>
                        <Link to="/notifications" 
                            className="flex flex-1 items-center gap-x-2 py-2 px-4 hover:bg-slate-900 transition-colors rounded-lg text-gray-300">
                            <img src="https://img.freepik.com/foto-gratis/feliz-optimista-guapo-gerente-ventas-latina-apuntando-lado-mirando-camara_1262-12679.jpg" alt="" className="w-8 h-8 object-cover rounded-full" />
                            <div className="text-sm flex flex-col">
                                <div className="flex items-center justify-between gap-2">
                                    <span>Fulanito de Tal</span> <span className="text-[11px]">2/07/2024</span>
                                </div>
                                <p className="text-gray-400">Lorem ipsum dolor sit amet...</p>
                                
                            </div>
                        </Link>
                    </MenuItem>
                    <hr className="my-6 border-gray-500" />
                    <MenuItem className='p-0 hover:bg-transparent'>
                        <Link to="/notifications" 
                            className="flex flex-1 items-center gap-x-2 py-2 px-4 hover:bg-slate-900 transition-colors rounded-lg text-gray-300">
                            <RiThumbUpLine className="p-2 bg-blue-100 text-blue-700 box-content rounded-full" />
                            <div className="text-sm flex flex-col">
                                <div className="flex items-center justify-between gap-2">
                                    <span>Nuevo Like</span> <span className="text-[11px]">2/07/2024</span>
                                </div>
                                <p className="text-gray-400">A Fulanito le gusta tu publ...</p>
                                
                            </div>
                        </Link>
                    </MenuItem>
                    <hr className="my-6 border-gray-500" />
                    <MenuItem className='p-0 hover:bg-transparent'>
                        <Link to="/notifications" 
                            className="flex items-center gap-x-2 py-2 px-4 hover:bg-slate-900 transition-colors rounded-lg text-gray-300">
                            <RiChat3Line className="p-2 bg-yellow-100 text-yellow-500 box-content rounded-full" />
                            <div className="text-sm flex flex-col">
                                <div className="flex items-center justify-between gap-2">
                                    <span>Nuevo Comentario</span> <span className="text-[11px]">2/07/2024</span>
                                </div>
                                <p className="text-gray-400">Fulanito ha comentado tu ta...</p>
                                
                            </div>
                        </Link>
                    </MenuItem>
                    <hr className="my-6 border-gray-500" />
                    <MenuItem className='p-0 hover:bg-transparent flex justify-center cursor-default'>
                    <Link to="/" className="text-gray-500 text-base hover:text-sky-700 transition-colors" >
                        Todas las notificaciones
                    </Link>
                    </MenuItem>
                </Menu>

                {/* aca comienza el menu desplegable del usuario */}
                <Menu  menuButton={
                    <MenuButton className="flex items-center gap-x-2 hover:bg-slate-600 p-2 rounded-lg transition-colors">
                        <img 
                            src="https://img.freepik.com/foto-gratis/feliz-optimista-guapo-gerente-ventas-latina-apuntando-lado-mirando-camara_1262-12679.jpg" alt="img-user"
                            className="w-10 h-10 object-cover rounded-full"
                        />
                        <span>Anacleto Rupertino</span>
                        <RiArrowDownSLine className="text-2xl" />
                    </MenuButton>}
                    arrow
                    transition
                    menuClassName='bg-slate-700 p-4 custom-menu'  >
                    
                    <MenuItem className='p-0 hover:bg-transparent'>
                        <Link to='/dashboard/profile' className="rounded-lg transition-colors text-gray-300 hover:bg-gray-900 flex items-center gap-x-4 py-2 px-4">
                            <img 
                                src="https://img.freepik.com/foto-gratis/feliz-optimista-guapo-gerente-ventas-latina-apuntando-lado-mirando-camara_1262-12679.jpg" alt="img-user"
                                className="w-10 h-10 object-cover rounded-full"
                            />
                            <div className="flex flex-col gap-1 text-sm"></div>
                        </Link>
                        
                    </MenuItem>
                    <hr className="my-4 border-gray-500" />

                    <MenuItem className='p-0 hover:bg-transparent'>
                        <Link to='/configuration' className="rounded-lg transition-colors text-gray-300 hover:bg-gray-900 flex items-center gap-x-4 py-2 px-4 flex-1">
                        <RiSettings3Line className="text-2xl" />
                        Configuración
                                               
                        </Link>
                        
                    </MenuItem>
                    <hr className="my-4 border-gray-500" />

                    <MenuItem className='p-0 hover:bg-transparent'>
                        <Link 
                            
                            className="rounded-lg transition-colors text-gray-300 hover:bg-gray-900 flex items-centerr gap-x-4 py-2 px-4 flex-1">
                        <RiLogoutCircleRLine />
                        Cerrar Sesión
                                               
                        </Link>
                        
                    </MenuItem>
                    
                </Menu>

            </nav>
    );
    
}

export default NavHeader;