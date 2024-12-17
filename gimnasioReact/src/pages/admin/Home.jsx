import { useEffect, useState } from "react";
//import { getStudent } from "../../api/users.api";

function Home() {
    const [users, setUsers] = useState([]);

    return (
        <>            
            <main className="cards bg-secondary w-full flex flex-col justify-center items-center gap-y-4 p-4 rounded-xl">
                {/* dinero del mes */}
                <div className="bg-white flex flex-col justify-center items-center p-4 w-52 h-28 rounded-md">
                    <h2 className="text-xl text-dark font-bold pb-3">$500.000</h2>
                    <p className="text-base text-dark font-semibold">Dinero del mes</p>
                </div>
                {/* Miembros del gym */}
                <div className="bg-white flex flex-col justify-center items-center p-4 w-52 h-28 rounded-md">
                    <h2 className="text-xl text-dark font-bold pb-3">15</h2>
                    <p className="text-base text-dark font-semibold">Miembros</p>
                </div>
                {/* miembros registrados este mes */}
                <div className="bg-white flex flex-col justify-center items-center p-4 w-52 h-28 rounded-md">
                    <h2 className="text-xl text-dark font-bold pb-3">5</h2>
                    <p className="text-base text-dark font-semibold text-center">Miembros registrados este mes</p>
                </div>
                {/* Dinero Total */}
                <div className="bg-white flex flex-col justify-center items-center p-4 w-52 h-28 rounded-md">
                    <h2 className="text-xl text-dark font-bold pb-3">$800.000</h2>
                    <p className="text-base text-dark font-semibold">Dinero Total</p>
                </div>
                {/* Membresias */}
                <div className="bg-white flex flex-col justify-center items-center p-4 w-52 h-28 rounded-md">
                    <h2 className="text-xl text-dark font-bold pb-3">2</h2>
                    <p className="text-base text-dark font-semibold">Membresías</p>
                </div>                            
        </main>
        </>
        
    )
   
};
export default Home;