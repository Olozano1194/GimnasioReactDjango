//icon
import { RiMailFill, RiLoginBoxLine } from "react-icons/ri";
//enlaces
import { Link } from "react-router-dom";

const ForgetPassword = () => {
    return (
        <main className="w-full min-h-screen flex flex-col justify-center items-center">               
                <form className="w-[85%] bg-slate-300 flex flex-col justify-center items-center text-slate-600 gap-6 p-3 rounded-md m-7 md:w-[55%] md:gap-8 lg:w-[47%] lg:px-8 xl:max-w-[30%]">
                    <h1 className="text-2xl font-bold pb-2 md:pt-3">Recuperar <span className="text-sky-600">Contraseña</span></h1>

                    {/* Email */}
                    <label htmlFor="" className="w-full flex flex-col justify-center items-center gap-3 font-semibold text-xl md:gap-5 lg:flex-row lg:justify-between"><span className='flex gap-2 items-center'><RiMailFill className='lg:text-2xl' />Correo</span><input type="email" className='w-64 bg-slate-300 border-solid border-b-2 border-slate-100 cursor-pointer outline-none text-gray-500 text-lg placeholder:text-gray-500' placeholder='Escribe el correo' />
                    </label>
                    <button 
                        type="button" 
                        className="bg-sky-600 cursor-pointer flex gap-2 items-center rounded-lg p-4 text-slate-100 text-base font-bold mb-2 hover:scale-105 hover:bg-sky-400 hover:text-slate-800">
                        <RiLoginBoxLine className="text-purple-800 font-black text-2xl" /> 
                        Enviar Instrucciones
                    </button>
                    <div className='flex flex-col gap-2 text-center pb-3 md:flex-row md:gap-4'>
                        <p className='text-gray-500 text-base'>¿No tienes cuenta? 
                            <Link
                                to='/login'
                                className='text-sky-600 hover:text-sky-400 lg:text-base'> Iniciar Sesión
                            </Link>
                        </p>
                    </div>
                </form>

                          
        </main>
    );
};

export default ForgetPassword;