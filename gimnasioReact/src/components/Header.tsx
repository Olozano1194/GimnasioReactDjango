//Components
import NavHeader from "./headerNav/NavHeader";

const Header = () => {
    return (
        <header className="bg-(--glass-bg) backdrop-blur-(--glass-blur) border-b border-slate-200/20 flex  items-center justify-end px-8 py-4 top-0 shadow-sm">
            <NavHeader />
        </header>
    );
};
export default Header;