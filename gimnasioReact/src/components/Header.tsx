//Components
import NavHeader from "./headerNav/NavHeader";

const Header = () => {
    return (
        <header className="h-[7vh] md:h-[10vh] border-b border-gray-600 p-8 flex items-center justify-end">
            <NavHeader />
        </header>
    );

};
export default Header;