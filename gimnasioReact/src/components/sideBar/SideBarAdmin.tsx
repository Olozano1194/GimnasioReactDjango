import { Link } from "react-router-dom";
// Menu
import type { SubMenuState } from "../SideBar";
// Icon
import { MdOutlineSupportAgent } from "react-icons/md";
import { RiMessage3Fill, RiCalendarTodoLine, RiHome8Line, RiUserLine, RiArrowRightSLine } from "react-icons/ri";
import { FaCreditCard } from 'react-icons/fa';

interface SidebarAdminProps {
  showSubmenu: SubMenuState;
  handleToggleSubMenu: (submenu: keyof SubMenuState) => void;
}

const SideBarAdmin: React.FC<SidebarAdminProps> = ({ showSubmenu, handleToggleSubMenu }) => {
    
    return (
        <ul className="">
        {/* Home */}
        <ul className="flex flex-col gap-2">
            <li>
            <Link
                to="/dashboard"
                className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-slate-200 text-dark font-semibold transition-colors"
            >
                <RiHome8Line className="text-primary" /> Inicio
            </Link>
            </li>
        </ul>
        {/* Member */}
        <ul className="flex flex-col gap-2">
            <li>
            <button
                onClick={() => handleToggleSubMenu("menu1")}
                className="w-full flex items-center justify-between py-2 px-4 rounded-lg hover:bg-slate-200 text-dark font-semibold transition-colors"
            >
                {" "}
                <span className="flex items-center gap-2">
                <RiUserLine className="text-primary" />
                Miembro
                </span>
                <RiArrowRightSLine
                className={`mt-1 ${
                    showSubmenu.menu1 ? "rotate-90" : ""
                } transition-all`}
                />
            </button>
            <ul className={`mt-2 ${!showSubmenu.menu1 ? "hidden" : ""}`}>
                <li>
                <Link
                    to="registrar-miembro/"
                    className="py-2 px-4 border-l border-slate-400 block ml-6 text-dark font-semibold relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-secondary hover:text-white transition-colors"
                >
                    Registrar miembro
                </Link>
                </li>
                <li>
                <Link
                    to="miembros"
                    className="py-2 px-4 border-l border-slate-400 block ml-6 text-dark font-semibold relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-secondary hover:text-white transition-colors"
                >
                    Ver miembros
                </Link>
                </li>
            </ul>
            </li>
        </ul>
        {/* Member Day */}
        <ul className="flex flex-col gap-2">
            <li>
            <button
                onClick={() => handleToggleSubMenu("menu2")}
                className="w-full flex items-center justify-between py-2 px-4 rounded-lg hover:bg-slate-200 text-dark font-semibold transition-colors"
            >
                {" "}
                <span className="flex items-center gap-2">
                <RiUserLine className="text-primary" />
                Miembro Diario
                </span>
                <RiArrowRightSLine
                className={`mt-1 ${
                    showSubmenu.menu2 ? "rotate-90" : ""
                } transition-all`}
                />
            </button>
            <ul className={`mt-2 ${!showSubmenu.menu2 ? "hidden" : ""}`}>
                <li>
                <Link
                    to="registrar-miembro-day"
                    className="py-2 px-4 border-l border-slate-400 block ml-6 text-dark font-semibold relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-secondary hover:text-white transition-colors"
                >
                    Registrar miembro
                </Link>
                </li>
                <li>
                <Link
                    to="miembros-day"
                    className="py-2 px-4 border-l border-slate-400 block ml-6 text-dark font-semibold relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-secondary hover:text-white transition-colors"
                >
                    Ver miembros
                </Link>
                </li>
            </ul>
            </li>
        </ul>
        {/* Users */}
        <ul className="flex flex-col gap-2">
            <li>
            <button
                onClick={() => handleToggleSubMenu("menu3")}
                className="w-full flex items-center justify-between py-2 px-4 rounded-lg hover:bg-slate-200 text-dark font-semibold transition-colors"
            >
                <span className="flex items-center gap-2">
                <RiUserLine className="text-primary" />
                Usuario
                </span>
                <RiArrowRightSLine
                className={`mt-1 ${
                    showSubmenu.menu3 ? "rotate-90" : ""
                } transition-all`}
                />
            </button>
            <ul
                className={`mt-2 ${
                !showSubmenu.menu3 ? "hidden" : ""
                } transition-all`}
            >
                <li>
                <Link
                    to="register"
                    className="py-2 px-4 border-l border-slate-400 block ml-6 text-dark font-semibold relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-secondary hover:text-white transition-colors"
                >
                    Registrar Usuario
                </Link>
                </li>
                <li>
                <Link
                    to="listUser"
                    className="py-2 px-4 border-l border-slate-400 block ml-6 text-dark font-semibold relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-secondary hover:text-white transition-colors"
                >
                    Ver Usuarios
                </Link>
                </li>
            </ul>
            </li>
        </ul>
        {/* MemberShips */}
        <ul className="flex flex-col gap-2">
            <button
            onClick={() => handleToggleSubMenu("menu4")}
            className="w-full flex items-center justify-between py-2 px-4 rounded-lg hover:bg-slate-200 text-dark font-semibold transition-colors"
            >
            <span className="flex items-center gap-2">
                <FaCreditCard className="text-primary" />
                Membresía
            </span>
            <RiArrowRightSLine
                className={`mt-1 ${
                showSubmenu.menu4 ? "rotate-90" : ""
                } transition-all`}
            />
            </button>
            <ul
            className={`mt-2 ${
                !showSubmenu.menu4 ? "hidden" : ""
            } transition-all`}
            >
            <li>
                <Link
                to="registrar-membresia"
                className="py-2 px-4 border-l border-slate-400 block ml-6 text-dark font-semibold relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-secondary hover:text-white transition-colors"
                >
                Registrar Membresía
                </Link>
            </li>
            <li>
                <Link
                to="memberships-list"
                className="py-2 px-4 border-l border-slate-400 block ml-6 text-dark font-semibold relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-secondary hover:text-white transition-colors"
                >
                Ver Membresías
                </Link>
            </li>
            </ul>
        </ul>
        {/* Asignar MemberShips */}
        <ul className="flex flex-col gap-2">
            <button
            onClick={() => handleToggleSubMenu("menu5")}
            className="w-full flex items-center justify-between py-2 px-4 rounded-lg hover:bg-slate-200 text-dark font-semibold transition-colors"
            >
            <span className="flex items-center gap-2">
                <FaCreditCard className="text-primary" />
                Asignar Membresía
            </span>
            <RiArrowRightSLine
                className={`mt-1 ${
                showSubmenu.menu5 ? "rotate-90" : ""
                } transition-all`}
            />
            </button>
            <ul
            className={`mt-2 ${
                !showSubmenu.menu5 ? "hidden" : ""
            } transition-all`}
            >
            <li>
                <Link
                to="asignar-membresia"
                className="py-2 px-4 border-l border-slate-400 block ml-6 text-dark font-semibold relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-secondary hover:text-white transition-colors"
                >
                Asignar Membresía
                </Link>
            </li>
            <li>
                <Link
                to="asignar-membresia-list"
                className="py-2 px-4 border-l border-slate-400 block ml-6 text-dark font-semibold relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-secondary hover:text-white transition-colors"
                >
                Ver Asignaciones de Membresías
                </Link>
            </li>
            </ul>
        </ul>
        {/* Message */}
        <ul className="flex flex-col gap-2">
            <li>
            <Link
                to="#"
                className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-slate-200 text-dark font-semibold transition-colors"
            >
                <RiMessage3Fill className="text-primary" />
                Mensajes
            </Link>
            </li>
        </ul>
        {/* Support */}
        <ul className="flex flex-col gap-4">
            <li>
            <Link
                to="#"
                className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-slate-200 text-dark font-semibold transition-colors"
            >
                <MdOutlineSupportAgent className="text-primary" />
                Soporte técnico
            </Link>
            </li>
        </ul>
        {/* Calendar */}
        <ul className="flex flex-col gap-4">
            <li>
            <Link
                to="#"
                className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-slate-200 text-dark font-semibold transition-colors"
            >
                <RiCalendarTodoLine className="text-primary" />
                Calendario
            </Link>
            </li>
        </ul>
        </ul>
    );
};
export default SideBarAdmin;
