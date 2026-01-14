import { useAuth } from "../../context/useAuth";
// Menu
import { SidebarItem } from "./components/SideBarItem";
import { SidebarSubMenu } from "./components/SideBarSubMenu";
import { getSidebarMenusByRole } from "./components/SideBarMenus";
// Icon
import { RiMessage3Fill, RiCalendarTodoLine, RiHome8Line } from "react-icons/ri";
import { MdOutlineSupportAgent } from "react-icons/md";

export type SubMenuKey = 'menu1' | 'menu2' | 'menu3' | 'menu4' | 'menu5';

export interface SubMenuState {
  menu1: boolean;
  menu2: boolean;
  menu3: boolean;
  menu4: boolean;
  menu5: boolean;
}

interface SidebarUserProps {
  showSubmenu: SubMenuState;
  handleToggleSubMenu: (submenu: keyof SubMenuState) => void;
}

const SideBarUser: React.FC<SidebarUserProps> = ({ showSubmenu, handleToggleSubMenu }) => {
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
export default SideBarUser;