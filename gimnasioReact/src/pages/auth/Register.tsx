import {useForm} from 'react-hook-form';
import { useNavigate } from "react-router-dom";
//Icons
import { RiLoginBoxLine, RiMailFill, RiLockFill,  RiUserLine } from "react-icons/ri";
//Mensajes
import { toast } from 'react-hot-toast';
//ui
import { Input, Label, Button } from '../../components/ui/index';
//api
import { CreateUsers } from '../../api/action/users.api';
//Models
import { User } from '../../model/user.model';
//img
import Logo from '../../../public/favicon-32x32.png';

const Register = () => {
    const { register, handleSubmit, formState: {errors}, watch, reset } = useForm<User>();
    const navigate = useNavigate();

    const onSubmit = handleSubmit(async (data: User) => {
        //console.log('Form data:', data);
        try {
            const requestData = {
                name: data.name,
                lastname: data.lastname,
                email: data.email,
                password: data.password,
                roles: data.roles,                
            };

            await CreateUsers(requestData);
            //console.log('Respuesta del servidor:',rest.data);            
            reset();
            toast.success('Usuario Creado', {
                duration: 3000,
                position: 'bottom-right',
                style: {
                    background: '#4b5563',   // Fondo negro
                    color: '#fff',           // Texto blanco
                    padding: '16px',
                    borderRadius: '8px',
                },

            });
            navigate('/dashboard/listUser');
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al registrar el miembro';
            toast.error(errorMessage, {
                duration: 3000,
                position: 'bottom-right',
            });            
        }
        
    });

    return (
        <main className="w-full min-h-screen flex flex-col justify-center items-center">
            {/* formulario */}
            <form onSubmit={onSubmit} className="formRegister w-[85%] bg-slate-300 flex flex-col justify-center items-center text-slate-600 gap-8 p-3 rounded-md m-7 md:w-[55%] md:gap-6 lg:w-[47%] lg:px-8 xl:max-w-[43%]">
                <div className='w-full flex justify-center'>
                    <h1 className="text-2xl font-bold flex justify-center items-center pb-2 md:pt-3 md:text-3xl"><img className='w-9 h-7 rounded-lg mr-1' src={Logo} alt="" />Registrarse</h1>
                </div>
                {/* Name */}
                <Label htmlFor="name"><span className='flex items-center'><RiUserLine className='lg:text-2xl xl:text-xl' />Nombre</span><Input type='text' placeholder='Escribe el nombre'
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
                    pattern: {
                            value: /^[A-Za-z]+(?:\s[A-Za-z]+)?$/,
                            message: 'Nombre invalido'
                    },
                })} 
                />                
                </Label>
                {
                    errors.name && <span className='text-red-500 text-sm'>{errors.name.message}</span>
                }
                {/* LastName */}
                <Label htmlFor="lastname"><span className='flex gap-2 items-center'><RiUserLine className='lg:text-2xl xl:text-xl' />Apellido</span><Input type="text" placeholder='Escribe el apellido'
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
                    pattern: {
                        value: /^[A-Za-z]+(?:\s[A-Za-z]+)?$/,
                        message: 'Apellido invalido'
                    },
                })}
                />
                </Label>
                {
                    errors.lastname && <span className='text-red-500 text-sm'>{errors.lastname.message}</span>
                }
                {/* Roles */}
                <Label htmlFor="roles"><span className='flex gap-2 items-center'><RiUserLine className='lg:text-2xl xl:text-xl' />Roles</span><select className='w-64 bg-slate-300 border-solid border-b-2 border-slate-100 cursor-pointer outline-none text-dark text-lg placeholder:text-gray-500'
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
                </Label>
                {
                    errors.roles && <span className='text-red-500 text-sm'>{errors.roles.message}</span>
                }
                {/* Email */}
                <Label htmlFor="email"><span className='flex gap-2 items-center'><RiMailFill className='lg:text-2xl xl:text-xl' />Correo</span><Input type="email" placeholder='Escribe el correo'
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
                </Label>
                {
                    errors.email && <span className='text-red-500 text-sm'>{errors.email.message}</span>
                }
                {/* Password */}
                <Label htmlFor="password"><span className='flex gap-2 items-center'><RiLockFill className='lg:text-2xl xl:text-xl' />Contraseña</span><Input type="password" placeholder='Escribe la contraseña'
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
                        message: 'La contraseña debe tener como maximo 20 caracteres'
                    },
                })} 
                />
                </Label>
                {
                    errors.password && <span className='text-red-500 text-center text-sm'>{errors.password.message}</span>
                }
                {/* RepeatPass */}
                <Label htmlFor="repeatPass"><span className='flex gap-2 items-center'><RiLockFill className='lg:text-2xl' />Confirmar Contraseña</span><Input type="password" placeholder='Repetir la contraseña'
                {...register('repeatPass',{
                    required: {
                        value: true,
                        message: 'Confirmar contraseña requerido'
                    },
                    validate: (value) => value === watch('password') || 'Las contraseñas no coinciden',
                })} 
                />
                </Label>
                {
                    errors.repeatPass && <span className='text-red-500 text-sm'>{errors.repeatPass.message}</span>
                }
                {/* btn Register */}
                <Button type='submit'><RiLoginBoxLine className='text-purple-800' />Registrarse</Button>
                {/* Regresar al login*/}
                {/* <div className='flex flex-col gap-2 text-center pb-3 md:flex-row md:gap-4'>
                    <p className='text-dark text-base'>¿No tienes cuenta? 
                        <Link
                            to='/login'
                            className='text-primary hover:text-sky-400 lg:text-base'> Iniciar Sesión
                        </Link>
                    </p>
                </div> */}
            </form>
        </main>

    );
}
export default Register;