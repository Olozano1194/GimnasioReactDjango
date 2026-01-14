// Menu
import { SidebarItem } from "./components/SideBarItem";
import { SidebarSubMenu } from "./components/SideBarSubMenu";
import { getSidebarMenusByRole } from "./components/SideBarMenus";
import { useAuth } from "../../context/useAuth";
// Icon
import { MdOutlineSupportAgent } from "react-icons/md";
import { RiMessage3Fill, RiCalendarTodoLine, RiHome8Line } from "react-icons/ri";


export type SubMenuKey = 'menu1' | 'menu2' | 'menu3' | 'menu4' | 'menu5';

export interface SubMenuState {
  menu1: boolean;
  menu2: boolean;
  menu3: boolean;
  menu4: boolean;
  menu5: boolean;
}

interface SidebarAdminProps {
  showSubmenu: SubMenuState;
  handleToggleSubMenu: (submenu: SubMenuKey) => void;
}

const SideBarAdmin = ({ showSubmenu, handleToggleSubMenu }: SidebarAdminProps ) => {
    const { user } = useAuth();
    const filteredMenus = getSidebarMenusByRole(user?.roles);


    return (
        <ul className="flex flex-col gap-2">
            {/* Home */}
            <SidebarItem 
                to='/dashboard' 
                icon={<RiHome8Line />} 
                label='Inicio' 
            />
            {/* Menus desplegables */}
            {filteredMenus.map(menu => (
                <SidebarSubMenu
                    key={menu.key}
                    title={menu.title}
                    icon={menu.icon}
                    isOpen={showSubmenu[menu.key as SubMenuKey ]}
                    onToggle={() => handleToggleSubMenu(menu.key as SubMenuKey)}
                    items={menu.items}
            />
            ))}

            <SidebarItem 
                to='#' 
                icon={<RiMessage3Fill />} 
                label='Mensajes' 
            />
            <SidebarItem 
                to='#' 
                icon={<MdOutlineSupportAgent />} 
                label='Soporte técnico' 
            />
            <SidebarItem 
                to='#' 
                icon={<RiCalendarTodoLine />} 
                label='Calendario' 
            />        
        </ul>
    );
};
export default SideBarAdmin;
