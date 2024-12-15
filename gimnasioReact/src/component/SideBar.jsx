import { Link } from "react-router-dom";
import { useState } from "react";

// icons
import { RiMenu3Line, RiCloseLine, RiMessage3Fill, RiCalendarTodoLine, RiLogoutCircleLine, RiHome8Line, RiUserLine } from "react-icons/ri";
import { MdOutlineSupportAgent } from "react-icons/md";
import { FaIdCard } from "react-icons/fa";


function SideBar() {
    const [toggleMenu, setToggleMenu] = useState(false);
    return (
        <>
            <div className={`xl:h-[100vh] bg-secondary overflow-y-scroll fixed xl:static w-[60%] md:w-[40%] lg:w-[35%] xl:w-auto h-full top-0 p-8 flex flex-col justify-between z-50 ${toggleMenu ? "left-0" : "-left-full"} transition-all`}>
                <div>
                    <h1 className="text-center text-2xl font-black text-dark mb-10">
                        Admin<span className="text-primary">.</span>
                    </h1>
                    <nav>
                        {/* Home */}
                        <ul className="flex flex-col gap-4">
                            <li>
                                <Link to='/' className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-slate-900 text-dark transition-colors"><RiHome8Line className="text-primary" /> Home</Link>
                            </li>
                            
                        </ul>
                        {/* Member */}
                        <ul className="flex flex-col gap-4">
                            <li>
                                <Link to='/' 
                                    className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-slate-900 text-dark transition-colors">
                                    <RiUserLine className="text-primary" />
                                    Miembros
                            </Link>
                            </li>
                            
                        </ul>
                        {/* Member */}
                        <ul className="flex flex-col gap-4">
                            <li>
                                <Link to='/' 
                                    className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-slate-900 text-dark transition-colors">
                                    <RiUserLine className="text-primary" />
                                    Miembro Diario
                            </Link>
                            </li>
                            
                        </ul>
                        {/* Users */}
                        <ul className="flex flex-col gap-4">
                            <li>
                                <Link to='/' 
                                    className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-slate-900 text-dark transition-colors">
                                    <RiUserLine className="text-primary" />
                                    Usuarios
                            </Link>
                            </li>
                            
                        </ul>
                        {/* MemberShips */}
                        <ul className="flex flex-col gap-4">
                            <li>
                                <Link to='/' 
                                    className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-slate-900 text-dark transition-colors">
                                    <FaIdCard className="text-primary" />
                                    Membresias
                            </Link>
                            </li>
                            
                        </ul>
                        <ul className="flex flex-col gap-4">
                            <li>
                                <Link to='/' 
                                    className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-slate-900 text-dark transition-colors">
                                    <RiMessage3Fill className="text-primary" />
                                    Mensajes
                            </Link>
                            </li>
                            
                        </ul>
                        <ul className="flex flex-col gap-4">
                            <li>
                                <Link to='/dashboard/tickets'
                                    className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-slate-900 text-dark transition-colors">
                                    <MdOutlineSupportAgent className="text-primary" />
                                    Soporte técnico
                                </Link>

                            </li>
                        </ul>
                        <ul className="flex flex-col gap-4">
                            <li>
                                <Link to='/'
                                    className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-slate-900 text-dark transition-colors">
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