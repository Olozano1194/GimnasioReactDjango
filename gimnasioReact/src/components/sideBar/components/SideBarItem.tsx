import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface SidebarItemProps {
  to: string;
  icon: ReactNode;
  label: string;
  isActive?: boolean;
}

export const SidebarItem = ({ to, icon, label, isActive = false }: SidebarItemProps) => (
  <li>
    <Link
      to={to}
      className={`flex items-center gap-3 py-2 px-4 rounded-lg transition-colors ${
        isActive
          ? 'bg-primary/10 text-primary font-bold'
          : 'hover:bg-slate-100 hover:text-nav/80 text-nav font-medium'
      }`}
    >
      <span className={isActive ? 'text-primary' : 'text-primary'}>{icon}</span>
      {label}
    </Link>
  </li>
);
