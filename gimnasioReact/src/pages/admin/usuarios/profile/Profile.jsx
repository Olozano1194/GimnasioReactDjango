//hooks
import { useState, useEffect } from "react";
//Api
import { getUserProfile } from "../../../../api/users.api";
//icons
import { RiEdit2Line } from "react-icons/ri";
//form
import {useForm} from 'react-hook-form';

const Profile = () => {
    
    const [user, setUser] = useState([]);
    const { handleSubmit, setValue } = useForm();

    //hook para vizualizar los datos de la bd
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getUserProfile();
                if (userData.user) {
                    setUser(userData.user);
                    console.log('Datos de usuario:', userData.user);
                    setValue('name', userData.user.name);
                    setValue('lastName', userData.user.lastName);
                    setValue('roles', userData.user.roles);
                                
                }else {
                    console.log('Datos de usuario o estudiante faltantes:', userData);
                }         
                
            }catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [setValue]);

    return (
        <section className="bg-secondary p-8 rounded-xl">
            <h1 className="text-xl text-gray-100">Profile</h1>
            <hr className="my-8 border-gray-500" />
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Avatar */}
                <div className="flex items-center">
                    <div className="w-1/4">
                        <p>Avatar</p>
                    </div>                    
                    <div className="flex-1">
                        <div className="relative mb-2">
                            <img src={'https://img.freepik.com/foto-gratis/negocios-finanzas-empleo-concepto-mujeres-emprendedoras-exitosas-joven-empresaria-segura-anteojos-mostrando-gesto-pulga-arriba-sostenga-computadora-portatil-garantice-mejor-calidad-servicio_1258-59118.jpg'} alt="Avatar" className="w-28 h-28 object-cover rounded-lg" />
                            <label htmlFor="avatar" className="absolute bg-slate-700 p-2 rounded-full hover:cursor-pointer -top-2 left-24"><RiEdit2Line /></label>
                            <input type="file" name="avatar" id="avatar" className="hidden" 
                                // {...register("avatar")} 
                                accept='image/*' 
                            />
                        </div>
                        <p className="text-gray-500 text-sm mb-5">Allowed file types: png, jpg, jpeg.</p>
                    </div>                       
                </div>
                {/* Nombre y apellidos */}
                <div className="flex flex-col items-center mb-8 md:flex-row">
                    <div className="mb-4 md:w-1/4 md:mb-0">
                        <p>Nombre Completo <span className="text-red-500">*</span></p>
                    </div>
                    <div className="flex-1 flex items-center gap-4">
                        {/* Nombre */}
                        <div className="w-full">
                            <input 
                                type="text"
                                className="w-full py-2 px-4 outline-none rounded-lg bg-slate-900"
                                placeholder='Nombre(s)' 
                                id="name"
                                name='name'
                            />                           
                        </div>
                        {/* Apellido */}
                        <div className="w-full">
                            <input 
                                type="text" 
                                className="w-full py-2 px-4 outline-none rounded-lg bg-slate-900"
                                placeholder='Apellido(s)'
                                id="lastName"
                                name='lastName'                                   
                            />                                   
                        </div>
                    </div>                                      
                </div>
                {/* Rol */}
                <div className="flex flex-col items-center md:flex-row">                    
                    <div className="mb-4 md:w-1/4 md:mb-0">
                        <p>Rol <span className="text-red-500">*</span></p>
                    </div>
                    <div className="w-full flex-1 flex items-center gap-4">
                        <div className="w-full md:w-1/2">
                            <select 
                                name="roles" 
                                id="" 
                                className="w-full py-2 px-4 outline-none rounded-lg bg-slate-900 appearance-none text-slate-500"                                   
                            >
                                <option value="">Selecione el Rol</option>
                                <option value='admin'>Administrador</option>
                                <option value='recepcion'>Recepcionista</option>
                            </select>                                   
                        </div>                                                
                    </div>
                </div>                                          
            </form>
        </section>
    );
};
export default Profile;