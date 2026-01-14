import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/useAuth";
// icons
import { RiMenu3Line, RiCloseLine, RiLogoutCircleLine,  } from "react-icons/ri";
// Components
import SideBarAdmin from "./sideBar/SideBarAdmin";
import SideBarUser from "./sideBar/SideBarUser";


export interface SubMenuState {
    menu1: boolean,
    menu2: boolean,
    menu3: boolean,
    menu4: boolean,
    menu5: boolean,
};

const SideBar = () => {
    const navigate = useNavigate();
    const [toggleMenu, setToggleMenu] = useState(false);
    const [showSubMenu, setShowSubMenu ] = useState<SubMenuState>({
        menu1: false,
        menu2: false,
        menu3: false,
        menu4: false,
        menu5: false,        
    });
    const { user, logout } = useAuth();

    //este useEfect es para obtener el rol del usuario
    const userRoles = user?.roles ?? [];
    const firstRole = userRoles[0] ?? ''; 

    //Funcion para mostrar y ocultar los submenus
    const handleToggleSubMenu = (submenu: keyof SubMenuState) => {
        setShowSubMenu(prev => ({
          ...prev,
          [submenu]: !prev[submenu],
        }));
    };

    // Esta función nos sirve para cerrar la sesión    
    const handleLogOut = () => {
        logout();
        navigate('/');        
    }

    //función para capitalizar
    const formatRole = (role: string): string => role.charAt(0).toUpperCase() + role.slice(1);
       
    return (
        <>
            <div className={`xl:h-[100vh] bg-secondary overflow-y-scroll fixed xl:static w-[60%] md:w-[40%] lg:w-[35%] xl:w-auto h-full top-0 p-3 flex flex-col justify-between z-50 ${toggleMenu ? "left-0" : "-left-full"} transition-all`}>
                {/* Menu */}
                <div>
                    <h1 className="text-center text-2xl font-black text-dark mb-10">
                    {firstRole && formatRole(firstRole)}
                    <span className="text-primary">.</span>
                    </h1>
                    <nav>
                        {userRoles.includes('admin') ? (
                            <SideBarAdmin
                                handleToggleSubMenu={handleToggleSubMenu}
                                showSubmenu={showSubMenu} 
                            />                            
                        ) : (
                            <SideBarUser
                                handleToggleSubMenu={handleToggleSubMenu}
                                showSubmenu={showSubMenu} 
                            />
                        )}                        
                    </nav>
                </div>
                {/* Cerrar Sesión */}
                <nav>
                    <ul className="flex flex-col gap-4">
                        <li>
                            <button                                
                                onClick={handleLogOut}
                                className="w-full flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-slate-200 text-dark font-semibold transition-colors">
                                <RiLogoutCircleLine className="text-primary" />
                                    Cerrar Sesión
                            </button>
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