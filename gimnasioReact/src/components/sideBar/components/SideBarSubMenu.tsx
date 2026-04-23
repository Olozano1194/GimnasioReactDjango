import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { RiArrowRightSLine } from "react-icons/ri";

interface SubMenuItem {
  label: string;
  to: string;
}

interface SidebarSubMenuProps {
  title: string;
  icon: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  items: SubMenuItem[];
}

export const SidebarSubMenu = ({
  title,
  icon,
  isOpen,
  onToggle,
  items,
}: SidebarSubMenuProps) => (
  <li>
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-2 px-4 rounded-lg hover:bg-slate-100  text-nav font-semibold transition-colors"
    >
      <span className="flex items-center gap-2 text-primary">
        {icon}
        <span className="text-nav hover:text-nav/80">{title}</span>
      </span>
      <RiArrowRightSLine
        className={`mt-1 transition-all ${isOpen ? "rotate-90" : ""}`}
      />
    </button>

    <ul className={`mt-2 ${!isOpen ? "hidden" : ""}`}>
      {items.map((item) => (
        <li key={item.to}>
          <Link
            to={item.to}
            className="py-2 px-4 border-l border-nav/30 block ml-6 text-nav font-semibold relative
            before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full
            before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2
            before:border-4 before:border-nav hover:text-nav/70 transition-colors"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  </li>
);