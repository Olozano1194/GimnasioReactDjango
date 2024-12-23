import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

// icons
import { RiMenu3Line, RiCloseLine, RiMessage3Fill, RiCalendarTodoLine, RiLogoutCircleLine, RiHome8Line, RiUserLine, RiArrowRightSLine } from "react-icons/ri";
import { MdOutlineSupportAgent } from "react-icons/md";
import { FaIdCard } from "react-icons/fa";

//API
import { getUserProfile } from '../api/users.api';


function SideBar() {
    const [toggleMenu, setToggleMenu] = useState(false);
    const [showSubMenu, setShowSubMenu ] = useState({
        menu1: false,
        menu2: false,
        menu3: false,
    });

    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const obtenerRol = async () => {
            try {
                const data = await getUserProfile();
                console.log('User data received:', data);
                
                setUserRole({
                    roles: data.user.roles
                });
            }catch (error) {
                console.error('No se pudo obtener el rol', error);
            }
        };
        obtenerRol();
    }, []);

    const handleToggleSubMenu = (submenu) => {
        setShowSubMenu(prevState => ({
            //se cierran los demás submenus
            ...Object.keys(prevState).reduce((acc, key) => ({
                ...acc,
                [key]: key === submenu ? !prevState[submenu] : false
            }), {}),
            //Alternamos el submenu seleccionado
            [submenu]: !prevState[submenu],
        }));                
    };
       
    return (
        <>
            <div className={`xl:h-[100vh] bg-secondary overflow-y-scroll fixed xl:static w-[60%] md:w-[40%] lg:w-[35%] xl:w-auto h-full top-0 p-3 flex flex-col justify-between z-50 ${toggleMenu ? "left-0" : "-left-full"} transition-all`}>
                <div>
                    <h1 className="text-center text-2xl font-black text-dark mb-10">
                    {userRole.roles ? userRole.roles.charAt(0).toUpperCase() + userRole.roles.slice(1) : ''}
                    <span className="text-primary">.</span>
                    </h1>
                    <nav>
                        {/* Home */}
                        <ul className="flex flex-col gap-4">
                            <li>
                                <Link to='#' className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-slate-200 text-dark transition-colors"><RiHome8Line className="text-primary" /> Home</Link>
                            </li>
                            
                        </ul>
                        {/* Member */}
                        <ul className="flex flex-col gap-4">
                            <li>
                                <button onClick={() => handleToggleSubMenu('menu1')} 
                                            className="w-full flex items-center justify-between py-2 px-4 rounded-lg hover:bg-slate-200 text-dark transition-colors">      <span className="flex items-center gap-2"><RiUserLine className="text-primary" />Miembro</span>
                                            <RiArrowRightSLine className={`mt-1 ${showSubMenu.menu1 ? 'rotate-90': ''} transition-all`} />
                                </button>
                                <ul className={`mt-2 ${!showSubMenu.menu1 ? 'hidden' : ''}`}>
                                    <li>
                                        <Link to='registrar-miembro/' className="py-2 px-4 border-l border-slate-400 block ml-6 text-dark relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-secondary hover:text-white transition-colors">Registrar miembro</Link>
                                    </li>
                                    <li>
                                        <Link to='miembros' className="py-2 px-4 border-l border-slate-400 block ml-6 text-dark relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-secondary hover:text-white transition-colors">Ver  miembros</Link>
                                    </li>
                                </ul>
                            </li>                            
                        </ul>
                        {/* Member Day */}
                        <ul className="flex flex-col gap-4">
                            <li>
                                <button onClick={() => handleToggleSubMenu('menu2')} to='/' 
                                        className="w-full flex items-center justify-between py-2 px-4 rounded-lg hover:bg-slate-200 text-dark transition-colors">      <span className="flex items-center gap-2"><RiUserLine className="text-primary" />Miembro Diario</span>
                                        <RiArrowRightSLine className={`mt-1 ${showSubMenu.menu2 ? 'rotate-90' : ''} transition-all`} />
                                </button>
                                <ul className={`mt-2 ${!showSubMenu.menu2 ? 'hidden' : ''}`}>
                                    <li>
                                        <Link to='registrar-miembro-day' className="py-2 px-4 border-l border-slate-400 block ml-6 text-dark relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-secondary hover:text-white transition-colors">Registrar miembro</Link>
                                    </li>
                                    <li>
                                        <Link to='miembros-day' className="py-2 px-4 border-l border-slate-400 block ml-6 text-dark relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-secondary hover:text-white transition-colors">Ver  miembros</Link>
                                    </li>
                                </ul>
                            </li>                           
                        </ul>                       
                        {/* Users */}                        
                        <ul className="flex flex-col gap-4">
                            <li>
                                <button onClick={() => handleToggleSubMenu('menu3')} to='/' 
                                        className="w-full flex items-center justify-between py-2 px-4 rounded-lg hover:bg-slate-200 text-dark transition-colors">      <span className="flex items-center gap-2"><RiUserLine className="text-primary" />Usuario</span>
                                        <RiArrowRightSLine className={`mt-1 ${showSubMenu.menu3 ? 'rotate-90' : ''} transition-all`} />
                                </button>
                                <ul className={`mt-2 ${!showSubMenu.menu3 ? 'hidden' : ''} transition-all`} >
                                    <li>
                                        <Link to='register' className="py-2 px-4 border-l border-slate-400 block ml-6 text-dark relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-secondary hover:text-white transition-colors">Registrar Usuario</Link>
                                    </li>
                                    <li>
                                        <Link to='listUser' className="py-2 px-4 border-l border-slate-400 block ml-6 text-dark relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-secondary hover:text-white transition-colors">Ver Usuarios</Link>
                                    </li>
                                </ul>
                            </li>                           
                        </ul>                       
                        {/* MemberShips */}
                        <ul className="flex flex-col gap-4">
                            <li>
                                <Link to='/' 
                                    className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-slate-200 text-dark transition-colors">
                                    <FaIdCard className="text-primary" />
                                    Membresias
                            </Link>
                            </li>
                            
                        </ul>
                        {/* Message */}
                        <ul className="flex flex-col gap-4">
                            <li>
                                <Link to='/' 
                                    className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-slate-200 text-dark transition-colors">
                                    <RiMessage3Fill className="text-primary" />
                                    Mensajes
                            </Link>
                            </li>
                            
                        </ul>
                        {/* Support */}
                        <ul className="flex flex-col gap-4">
                            <li>
                                <Link to='/dashboard/tickets'
                                    className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-slate-200 text-dark transition-colors">
                                    <MdOutlineSupportAgent className="text-primary" />
                                    Soporte técnico
                                </Link>

                            </li>
                        </ul>
                        {/* Calendar */}
                        <ul className="flex flex-col gap-4">
                            <li>
                                <Link to='/'
                                    className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-slate-200 text-dark transition-colors">
                                    <RiCalendarTodoLine className="text-primary" />
                                    Calendario
                                </Link>

                            </li>
                        </ul>
                    </nav>
                </div>

                <nav>
                    <ul className="flex flex-col gap-4">
                        <li>
                            <Link to='/'
                                className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-slate-900 text-dark transition-colors">
                                <RiLogoutCircleLine className="text-primary" />
                                Cerrar Sesión
                            </Link>

                        </li>
                        
                    </ul>
                </nav>
            </div>
            <button 
                onClick={() => setToggleMenu(!toggleMenu)} 
                className="xl:hidden fixed bottom-4 right-4 bg-primary text-black p-3 rounded-full z-50">
                    {
                        toggleMenu ? <RiCloseLine /> : <RiMenu3Line />
                    }
                    
            </button>
        </>
    );

    

}
export default SideBar;