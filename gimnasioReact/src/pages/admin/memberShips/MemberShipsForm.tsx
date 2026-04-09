import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from "react-router-dom";
//Estados
import { useEffect } from "react";
//Icons
import { RiLoginBoxLine } from "react-icons/ri";
// sections
import BreadCrumbsSection from "../../../components/form/section/BreadCrumbsSection";
//Mensajes
import { toast } from "react-hot-toast";
//ui
import { Input, Label, Button, Select } from '../../../components/ui/index';
//API
import { createMemberShips, updateMemberShips, getMemberShips } from '../../../api/action/memberShips.api';


interface MembresiaForm {
    name: string;
    price: string;
    duration: string;
};


const MemberShipsForm = () => {
    const params = useParams<{ id?: string }>();
    const isEditing = !!params.id;
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<MembresiaForm>();

    const onSubmit = handleSubmit(async (data) => {
        //console.log('Form data:', data);
        try {
            const requestData = {
                name: data.name,
                price: Number(data.price),
                duration: Number(data.duration),
            };

            if (params.id) {
                await updateMemberShips(parseInt(params.id), requestData);
                //console.log('Actualizando miembro:', params.id);
                toast.success('Membresía Actualizada', {
                    duration: 3000,
                    position: 'bottom-right',
                    style: {
                        background: '#4b5563',   // Fondo negro
                        color: '#fff',           // Texto blanco
                        padding: '16px',
                        borderRadius: '8px',
                    },
                });
            } else {
                await createMemberShips(requestData);
                //console.log('Respuesta del servidor:',rest.data);            
                reset();
                toast.success('Membresía Creada', {
                    duration: 3000,
                    position: 'bottom-right',
                    style: {
                        background: '#4b5563',   // Fondo negro
                        color: '#fff',           // Texto blanco
                        padding: '16px',
                        borderRadius: '8px',
                    },
                });
            }
            navigate('/dashboard/memberships-list');

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al registrar la membresía';
            toast.error(errorMessage, {
                duration: 3000,
                position: 'bottom-right',
            });
        }

    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (params.id) {
                    const response = await getMemberShips(parseInt(params.id));
                    reset({
                        name: response.name,
                        price: String(response.price),
                        duration: String(response.duration),
                    });
                }
            } catch (error) {
                console.error('Error al obtener la membresía', error);
            }
        }
        fetchUserData();
    }, [params.id, reset]);

    return (
        <main className="max-w-7xl mx-auto p-6 lg:p-10">
            <BreadCrumbsSection
                isEditing={isEditing}
                title="Gestión de Membresías"
                description="Administre los planes y paquetes disponibles para los atletas"
                entityName="esta membresía"
            />
            <section className="gap-8 grid grid-cols-1 lg:grid-cols-12">
                <div className="space-y-8 lg:col-span-6">
                    <section className="bg-surface-container-lowest overflow-hidden p-8 relative rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                        <div className="absolute p-4 right-0 top-0">
                            <span className="font-black select-none text-[60px] text-slate-50">
                                Identificación
                            </span>
                        </div>
                        <h4 className="font-bold flex gap-2 items-center mb-10 relative text-xl">Detalles de la Membresía</h4>
                        <form onSubmit={onSubmit} className="relative space-y-10 z-10">
                            <section className='gap-y-10 gap-x-8 grid grid-cols-1 md:grid-cols-2'>
                                {/* Name */}
                                <div className="relative pt-5">
                                    <Select
                                        {...register('name', {
                                            required: {
                                                value: true,
                                                message: 'Nombre requerido'
                                            },
                                        })}
                                    >
                                        <option value="">Escoge El Plan</option>
                                        <option value="básico">Básico</option>
                                        <option value="premium">Premium</option>
                                        <option value="VIP">VIP</option>
                                    </Select>
                                    <Label>
                                        Nombre del Plan
                                    </Label>
                                    {
                                        errors.name && <span className='text-red-500 text-sm'>{errors.name.message}</span>
                                    }
                                </div>
                                {/* Price */}
                                <div className="relative pt-5">
                                    <Input
                                        type="text"
                                        placeholder=""
                                        {...register('price', {
                                            required: {
                                                value: true,
                                                message: 'Precio requerido'
                                            },
                                            pattern: {
                                                value: /^[0-9]+$/,
                                                message: 'Precio invalido'
                                            },
                                        })}
                                    />
                                    <Label>
                                        Precio
                                    </Label>
                                    {
                                        errors.price && <span className='text-red-500 text-sm'>{errors.price.message}</span>
                                    }
                                </div>
                                {/* Duration */}
                                <div className="relative pt-5">
                                    <Input
                                        type="text"
                                        placeholder=""
                                        {...register('duration', {
                                            required: {
                                                value: true,
                                                message: 'Duración requerida'
                                            },
                                            validate: (value) => {
                                                const num = Number(value);
                                                return [15, 30, 45].includes(num) || 'Solo se permiten los valores 15, 30 o 45';
                                            },
                                            pattern: {
                                                value: /^[0-9]+$/,
                                                message: 'Duración invalida'
                                            },
                                        })}
                                    />
                                    <Label>
                                        Duración
                                    </Label>
                                    {
                                        errors.duration && <span className='text-red-500 text-sm'>{errors.duration.message}</span>
                                    }
                                </div>                                
                            </section>
                            {/* btn Register */}
                            <div className="w-full flex items-center justify-center">
                                <Button type="submit">
                                    {params.id ? 'Actualizar' : 'Registrar'} <RiLoginBoxLine className='text-surface-container-lowest' />
                                </Button>

                            </div>
                        </form>
                    </section>
                </div>
            </section>
            </main>
    );
};
export default MemberShipsForm;