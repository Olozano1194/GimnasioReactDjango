import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface SidebarItemProps {
  to: string;
  icon: ReactNode;
  label: string;
}

export const SidebarItem = ({ to, icon, label }: SidebarItemProps) => (
  <li>
    <Link
      to={to}
      className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-slate-200 text-dark font-semibold transition-colors"
    >
      <span className="text-primary">{icon}</span>
      {label}
    </Link>
  </li>
);
