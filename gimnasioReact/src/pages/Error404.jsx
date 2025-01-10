import { useNavigate } from 'react-router-dom';

// Icons
import { FaExclamationTriangle } from 'react-icons/fa';

const Error404 = () => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        //si esta autenticado redirige a la pagina de inicio
        const authenticated = localStorage.getItem('token');
        if (authenticated) {
            navigate('/dashboard');
            
        }
        //si no esta autenticado redirige a la pagina de login
        else {
            navigate('/');
        }

    };
    return (
        <main className="w-full min-h-screen flex flex-col justify-center items-center">
            <div className="text-center text-gray-900 font-bold items-center flex flex-col">
                <span className='w-full flex justify-center items-center gap-4 text-4xl md:w-96'><FaExclamationTriangle className="text-yellow-400" />Error 404</span>
                <h1 className='text-xl font-bold pt-4 pb-4 md:text-2xl xl:text-4xl'>¡Oops! Página no encontrada</h1>
                <p className='text-md font-semibold px-3 pb-3 md:text-lg xl:text-2xl'>
                    Lo sentimos, la página que estás buscando no existe.
                </p>
                <button 
                    className='border-solid border-2 border-sky-600 rounded-lg p-3 text-white text-lg font-semibold bg-sky-700 hover:bg-sky-500 hover:scale-110 cursor-pointer md:mt-3 lg:text-xl'
                    onClick={handleRedirect}
                >
                        Regresar al inicio
                </button>
            </div>
        </main>
    );
}

export default Error404;