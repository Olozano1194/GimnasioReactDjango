//icons
import { RiShieldCheckLine } from "react-icons/ri";

//Api
import { getUserProfile } from "../../../../api/users.api";

//hooks
import { useState, useEffect } from "react";


function UserPass() {
    const [user, setUser] = useState({ email: ''});

    useEffect(() => {
        const axiosUserData = async () => {
            try {
                const data = await getUserProfile();
                setUser({
                    email: data.user.email,                    
                });
            }catch (error) {
                console.error(error);
            }
        };
        axiosUserData();
    }, []);

    return (
        <>
             {/* Usuario y contraseña */}
        <div className="bg-secondary p-8 rounded-xl mt-10">
            <h1 className="text-xl text-gray-100">Usuario y Contraseña</h1>
            <hr className="my-8 border-gray-500/30" />

            <form action="">
                {/* Email */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div className="mb-4">
                        <h5 className="text-gray-100 text-xl">Corre Electrónico</h5>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                        <button className="py-2 px-4 rounded-lg bg-slate-900 hover:bg-slate-950 hover:text-gray-200 transition-colors" >Cambiar Correo</button>
                </div>

                {/* Contraseña */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div className="mb-3">
                        <h5 className="text-gray-100 text-xl">Contraseña</h5>
                        <p className="text-gray-400 text-sm">***************</p>
                    </div>
                        <button className="py-2 px-4 rounded-lg bg-slate-900 hover:bg-slate-950 hover:text-gray-200 transition-colors" >Cambiar Contraseña</button>
                </div>
            </form>

            <div className="grid grid-cols-1 items-center gap-y-4 md:grid-cols-8 bg-blue-300/10 p-4 rounded-lg border border-dashed border-sky-300 ">
                <div className="flex justify-center">
                    <RiShieldCheckLine className="text-4xl text-sky-400" />
                </div>

                <div className="px-4 md:col-span-6">
                    <h4 className="font-bold text-gray-100 text-xl sm:text-base mb-2">Secure Your Account</h4>
                    <p className="text-gray-400 text-xl md:text-sm md: ">Two-factor authentication adds an extra layer od security to your account.To log in, in addition you'll need to provide a 6 digit code</p>
                </div>

                <div className="flex md:justify-end justify-center">
                    <button className="bg-sky-500/90 py-2 px-3
                    rounded-lg text-gray-100 hover:bg-sky-400 transition-colors">Activar</button>
                </div>
            </div>
        </div>
        </>
    );
}
export default UserPass;