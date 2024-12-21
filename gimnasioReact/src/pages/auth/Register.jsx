import {useForm} from 'react-hook-form';
import { Link } from 'react-router-dom';
//Icons
import { RiLoginBoxLine, RiMailFill, RiLockFill,  RiUserLine } from "react-icons/ri";

//api
import { CreateUsers } from "../../api/users.api";

const Register = () => {
    const { register, handleSubmit, formState: {errors}, watch, reset } = useForm();

    const onSubmit = handleSubmit(async (data) => {
        //console.log('Form data:', data);
        try {
            const rest = await CreateUsers(data);
            //console.log('Respuesta del servidor:',rest.data);            
            reset();
            
        } catch (error) {
            console.error("Error al registrar el usuario:", error.response ? error.response.data : error.message);            
        }
        
    });

    return (
        <main className="w-full min-h-screen flex flex-col justify-center items-center">
            {/* formulario */}
            <form onSubmit={onSubmit} className="formRegister w-[85%] bg-slate-300 flex flex-col justify-center items-center text-slate-600 gap-6 p-3 rounded-md m-7 md:w-[55%] md:gap-8 lg:w-[47%] lg:px-8 xl:max-w-[30%]">
                <h1 className="text-2xl font-bold pb-2 md:pt-3">Registrarse</h1>

                {/* Name */}
                <label htmlFor="name" className="w-full flex flex-col justify-center items-center gap-3 font-semibold text-xl md:gap-5 lg:flex-row lg:justify-between"><span className='flex gap-2 items-center'><RiUserLine className='lg:text-2xl' />Nombre</span><input type="text" name='name' className='w-64 bg-slate-300 border-solid border-b-2 border-slate-100 cursor-pointer outline-none text-dark text-lg placeholder:text-gray-500' placeholder='Escribe el nombre'
                {...register('name',{
                    required: {
                        value: true,
                        message: 'Nombre requerido'
                    },
                    minLength: {
                        value: 4,
                        message: 'El nombre debe tener como minimo 4 letras'
                    },
                    maxLength: {
                        value: 20,
                        message: 'El nombre debe tener como maximo 20 letras'
                    },
                })}
                />
                </label>
                {
                    errors.name && <span className='text-red-500 text-sm'>{errors.name.message}</span>
                }
                {/* LastName */}
                <label htmlFor="lastname" className="w-full flex flex-col justify-center items-center gap-3 font-semibold text-xl md:gap-5 lg:flex-row lg:justify-between"><span className='flex gap-2 items-center'><RiUserLine className='lg:text-2xl' />Apellido</span><input type="text" name='lastname' className='w-64 bg-slate-300 border-solid border-b-2 border-slate-100 cursor-pointer outline-none text-dark text-lg placeholder:text-gray-500' placeholder='Escribe el apellido'
                {...register('lastname',{
                    required: {
                        value: true,
                        message: 'Apellido requerido'
                    },
                    minLength: {
                        value: 5,
                        message: 'El apellido debe tener como minimo 5 letras'
                    },
                    maxLength: {
                        value: 20,
                        message: 'El apellido debe tener como maximo 20 letras'
                    },
                })}
                />
                </label>
                {
                    errors.lastname && <span className='text-red-500 text-sm'>{errors.lastname.message}</span>
                }
                {/* Roles */}
                <label htmlFor="roles" className="w-full flex flex-col justify-center items-center gap-3 font-semibold text-xl md:gap-5 lg:flex-row lg:justify-between"><span className='flex gap-2 items-center'><RiUserLine className='lg:text-2xl' />Roles</span><select name='roles' className='w-64 bg-slate-300 border-solid border-b-2 border-slate-100 cursor-pointer outline-none text-dark text-lg placeholder:text-gray-500'
                {...register('roles',{
                    required: {
                        value: true,
                        message: 'Roles requerido'
                    },
                })}>
                        <option value="">Escoge un rol</option>
                        <option value="admin">Administrador</option>
                        <option value="recepcion">Recepcionista</option>

                    </select>
                </label>
                {
                    errors.roles && <span className='text-red-500 text-sm'>{errors.roles.message}</span>
                }
                {/* Email */}
                <label htmlFor="email" className="w-full flex flex-col justify-center items-center gap-3 font-semibold text-xl md:gap-5 lg:flex-row lg:justify-between"><span className='flex gap-2 items-center'><RiMailFill className='lg:text-2xl' />Correo</span><input type="email" name='email' className='w-64 bg-slate-300 border-solid border-b-2 border-slate-100 cursor-pointer outline-none text-dark text-lg placeholder:text-gray-500' placeholder='Escribe el correo'
                {...register('email',{
                    required: {
                        value: true,
                        message: 'Correo requerido'
                        },
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: 'Correo invalido'
                        },
                })}
                />
                </label>
                {
                    errors.email && <span className='text-red-500 text-sm'>{errors.email.message}</span>
                }
                {/* Password */}
                <label htmlFor="password" className="w-full flex flex-col justify-center items-center gap-3 font-semibold text-xl md:gap-5 lg:flex-row lg:justify-between"><span className='flex gap-2 items-center'><RiLockFill className='lg:text-2xl' />Contraseña</span><input type="password" name='password' className='w-64 bg-slate-300 border-solid border-b-2 border-slate-100 cursor-pointer outline-none text-dark text-lg placeholder:text-gray-500' placeholder='Escribe la contraseña'
                {...register('password',{
                    required: {
                        value: true,
                        message: 'Contraseña requerido'
                    },
                    minLength: {
                        value: 5,
                        message: 'La contraseña debe tener al menos 5 caracteres'
                    },
                    maxLength: {
                        value: 20,
                        message: 'La contraseña debe tener como maximo 20 letras'
                    },
                })} 
                />
                </label>
                {
                    errors.password && <span className='text-red-500 text-center text-sm'>{errors.password.message}</span>
                }
                {/* RepeatPass */}
                <label htmlFor="repeatPass" className="w-full flex flex-col justify-center items-center gap-3 font-semibold text-xl md:gap-5 lg:flex-row lg:justify-between"><span className='flex gap-2 items-center'><RiLockFill className='lg:text-4xl' />Confirmar Contraseña</span><input type="password" className='w-64 bg-slate-300 border-solid border-b-2 border-slate-100 cursor-pointer outline-none text-dark text-lg placeholder:text-gray-500 lg:w-96' placeholder='Repetir la contraseña'
                {...register('repeatPass',{
                    required: {
                        value: true,
                        message: 'Confirmar contraseña requerido'
                    },
                    validate: (value) => value === watch('password') || 'Las contraseñas no coinciden',
                })} 
                />
                </label>
                {
                    errors.repeatPass && <span className='text-red-500 text-sm'>{errors.repeatPass.message}</span>
                }
                {/* btn Register */}
                <button type="submit" className="bg-sky-600 cursor-pointer flex gap-2 items-center rounded-lg p-4 text-slate-100 text-lg font-bold mb-2 hover:scale-105 hover:bg-sky-400 hover:text-slate-800">
                    <RiLoginBoxLine className='text-purple-800' />
                    Registrarse
                </button>
                {/* Regresar al login*/}
                <div className='flex flex-col gap-2 text-center pb-3 md:flex-row md:gap-4'>
                    <p className='text-dark text-base'>¿No tienes cuenta? 
                        <Link
                            to='/login'
                            className='text-primary hover:text-sky-400 lg:text-base'> Iniciar Sesión
                        </Link>
                    </p>
                </div>
            </form>
        </main>

    );
}
export default Register;