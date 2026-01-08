//hooks
import { useState, useEffect } from "react";
//Api
import { getUserProfile, updateUser } from "../../../../api/action/users.api";
//icons
import { RiEdit2Line } from "react-icons/ri";
//models
import { User } from "../../../../model/user.model";
//Mensajes
import { toast } from "react-hot-toast";

interface FormData {
    name: string;
    lastname: string;
    roles: string[];
    avatar: string | File | undefined;
    id: string;
};

const Profile = () => {    
    const [, setUser] = useState<User>();
    const [ editingUser, seteditingUser ] = useState(false);    
    const [formData, setFormData] = useState<FormData>({
        name: '',
        lastname: '',
        roles: [],
        avatar: undefined,
        id: ''
    });

    //hook para vizualizar los datos de la bd
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getUserProfile();
                //console.log('Respuesta del servidor:', userData);

                const avatarUrl = userData.user.avatar instanceof File ? URL.createObjectURL(userData.user.avatar) : userData.user.avatar ?? '';

                const rolesArray = Array.isArray(userData.user.roles) ? userData.user.roles : [userData.user.roles];
                
                if (userData && userData.user) {
                    setUser(userData.user);
                    //console.log('Datos de usuario:', userData.user);
                    setFormData({
                        name: userData.user.name,
                        lastname: userData.user.lastname,
                        roles: rolesArray,
                        avatar: avatarUrl,
                        id: userData.user.id.toString(),
                    });
                    //setLoading(false);
                                
                }else {
                    console.log('Datos de usuario faltantes:', userData);
                }         
                
            }catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Error al mostrar el perfil del usuario';
                toast.error(errorMessage, {
                    duration: 3000,
                    position: 'bottom-right',
                });  
            }
        };
        fetchData();
    }, []);

    //Función donde manejamos los cambios en el formulario
    const handleChanges = (data: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const { name, value } = data.target;
        setFormData((prevData) => ({ 
            ...prevData,
            [name]: value
        }));
    };

    //Función para las imagenes
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
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
            const rolesArray = Array.isArray(formData.roles) ? formData.roles : [formData.roles];
            // Enviamos solo los campos necesarios
            const dataToUpdate = {
                name: formData.name,
                lastname: formData.lastname,
                roles: rolesArray,
                avatar: formData.avatar instanceof File ? formData.avatar : undefined,
            };

            //console.log('Datos a actualizar', dataToUpdate);
            const updatedProfile = await updateUser(parseInt(formData.id), dataToUpdate);
            
            if (updatedProfile) {
                setUser(updatedProfile);
                seteditingUser(false); // Desactivar modo edición
                // Actualizar el formData con los nuevos datos
                setFormData(prev => ({
                    ...prev,
                    name: updatedProfile.name,
                    lastname: updatedProfile.lastname,
                    roles: updatedProfile.roles,
                    avatar: updatedProfile.avatar,
                }));
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el Usuario';
            toast.error(errorMessage, {
                    duration: 3000,
                    position: 'bottom-right',
            });            
        }
    };

    const avatarSrc = formData.avatar 
        ? (formData.avatar instanceof File
            ? URL.createObjectURL(formData.avatar)
            : formData.avatar.startsWith('http') 
                ? formData.avatar
                :  `${import.meta.env.MODE === 'development' ? import.meta.env.VITE_API_URL_DEV : import.meta.env.VITE_API_URL_PROD}${formData.avatar}`)
        : 'https://img.freepik.com/foto-gratis/negocios-finanzas-empleo-concepto-mujeres-emprendedoras-exitosas-joven-empresaria-segura-anteojos-mostrando-gesto-pulga-arriba-sostenga-computadora-portatil-garantice-mejor-calidad-servicio_1258-59118.jpg';

    return (
        <section className="bg-secondary p-8 rounded-xl">
            <h1 className="text-xl text-dark font-bold md:text-2xl">Perfil</h1>
            <hr className="my-8 border-gray-500" />
            <form>
                {/* Avatar */}
                <div className="flex items-center">
                    <div className="w-1/4">
                        <p>Avatar</p>
                    </div>                    
                    <div className="flex-1">
                        <div className="relative mb-2">
                            <img src={avatarSrc} 
                                alt="Avatar" 
                                className="w-28 h-28 object-cover rounded-lg" 
                            />
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
                                id="lastname"
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