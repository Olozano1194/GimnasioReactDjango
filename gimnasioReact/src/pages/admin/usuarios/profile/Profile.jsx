//hooks
import { useState, useEffect } from "react";
//Api
import { getUserProfile, getUsers, updateUser } from "../../../../api/users.api";
//icons
import { RiEdit2Line } from "react-icons/ri";
//form
import {useForm} from 'react-hook-form';

const Profile = () => {
    
    const [user, setUser] = useState([]);
    const [ editingUser, seteditingUser ] = useState(false);
    //const [loading, setLoading] = useState(true);
    const { handleSubmit, setValue } = useForm();
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        roles: '',
        avatar: null,
        id: ''
    });

    //hook para vizualizar los datos de la bd
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getUserProfile();
                console.log('Respuesta del servidor:', userData);
                
                if (userData && userData.user) {
                    setUser(userData.user);
                    //console.log('Datos de usuario:', userData.user);
                    setFormData({
                        name: userData.user.name,
                        lastname: userData.user.lastname,
                        roles: userData.user.roles,
                        avatar: userData.user.avatar,
                        id: userData.user.id,
                    });
                    //setLoading(false);
                                
                }else {
                    console.log('Datos de usuario o estudiante faltantes:', userData);
                }         
                
            }catch (error) {
                console.error('Error fetching data:', error);
                //setLoading(false);
            }
        };
        fetchData();
    }, []);

    //Función donde manejamos los cambios en el formulario
    const handleChanges = (data) => {
        const { name, value } = data.target;
        setFormData((prevData) => ({ 
            ...prevData,
            [name]: value
        }));
    };

    //Función para las imagenes
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                avatar: file  // Guardamos el archivo directamente
            }));
        }
    };

    //Función para guardar los cambios en el formulario
    const handleSave = async () => {
        try {
            // Enviamos solo los campos necesarios
            const dataToUpdate = {
                name: formData.name,
                lastname: formData.lastname,
                roles: formData.roles,
                avatar: formData.avatar instanceof File ? formData.avatar : undefined
            };

            const updatedProfile = await updateUser(formData.id, dataToUpdate);
            
            if (updatedProfile) {
                setUser(updatedProfile);
                seteditingUser(false); // Desactivar modo edición
                // Actualizar el formData con los nuevos datos
                setFormData(prev => ({
                    ...prev,
                    ...updatedProfile,
                }));
            }
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            // Aquí podrías mostrar un mensaje de error al usuario
        }
    };

    return (
        <section className="bg-secondary p-8 rounded-xl">
            <h1 className="text-xl text-dark font-bold md:text-2xl">Profile</h1>
            <hr className="my-8 border-gray-500" />
            <form>
                {/* Avatar */}
                <div className="flex items-center">
                    <div className="w-1/4">
                        <p>Avatar</p>
                    </div>                    
                    <div className="flex-1">
                        <div className="relative mb-2">
                            <img src={formData.avatar instanceof File
                                ? URL.createObjectURL(formData.avatar)
                                : formData.avatar || 'https://img.freepik.com/foto-gratis/negocios-finanzas-empleo-concepto-mujeres-emprendedoras-exitosas-joven-empresaria-segura-anteojos-mostrando-gesto-pulga-arriba-sostenga-computadora-portatil-garantice-mejor-calidad-servicio_1258-59118.jpg'} alt="Avatar" className="w-28 h-28 object-cover rounded-lg" />
                                {editingUser && (
                                    <>
                                        <label htmlFor="avatar" className="absolute bg-secondary p-2 rounded-full hover:cursor-pointer -top-2 left-24"><RiEdit2Line className='text-primary' /></label>
                                        <input type="file" name="avatar" id="avatar"        className="hidden" 
                                            // {...register("avatar")} 
                                            accept='image/*' 
                                            onChange={handleFileChange}
                                        />
                                    </>
                                )}                            
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
                                className="w-full py-2 px-4 outline-none rounded-lg bg-dark text-white"
                                placeholder='Nombre(s)' 
                                id="name"
                                name='name'
                                value={formData.name}
                                onChange={handleChanges}
                                disabled={!editingUser}
                            />                           
                        </div>
                        {/* Apellido */}
                        <div className="w-full">
                            <input 
                                type="text" 
                                className="w-full py-2 px-4 outline-none rounded-lg bg-dark text-white"
                                placeholder='Apellido(s)'
                                id="lastName"
                                name='lastname'
                                value={formData.lastname}
                                onChange={handleChanges}
                                disabled={!editingUser}                                   
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
                                value={formData.roles}
                                onChange={handleChanges}
                                disabled={!editingUser} 
                                className="w-full py-2 px-4 outline-none rounded-lg bg-dark text-white appearance-none"                                   
                            >
                                <option value="">Selecione el Rol</option>
                                <option value='admin'>Administrador</option>
                                <option value='recepcion'>Recepcionista</option>
                            </select>                                   
                        </div>                                                
                    </div>
                </div>
                {/* Botones de acción */}
                <div className='flex justify-end items-center'>
                    {editingUser ? (
                    <button
                        type="button"
                        className="mt-4 py-2 px-4 bg-orange-500 text-white rounded"
                        onClick={handleSave}
                    >
                        Guardar Cambios
                    </button>
                    ) : (
                    <button
                        type="button"
                        className="mt-4 py-2 px-4 bg-primary text-white rounded"
                        onClick={() => seteditingUser(true)}
                    >
                        Editar Perfil
                    </button>
                    )}          
                </div>                                
            </form>
        </section>
    );
};
export default Profile;