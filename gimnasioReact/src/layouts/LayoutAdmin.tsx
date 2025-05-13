import { Outlet } from "react-router-dom"; //el outlet nos sirve para agregarle un componente dentro de este componente

import SideBar from "../components/SideBar";
import Header from "../components/Header";

function LayoutAdmin() {
    return (
        <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
            <SideBar />
            
            <div className="xl:col-span-5">
                <Header />
                <div className="h-[90vh] overflow-y-scroll p-8">
                    <Outlet />
                </div> 
                
            </div>
        </div>
    );
}
export default LayoutAdmin;