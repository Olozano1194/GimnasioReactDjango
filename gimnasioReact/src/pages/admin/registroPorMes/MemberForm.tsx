//Estados
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from "react-router-dom";
//Icons
import { RiLoginBoxLine } from "react-icons/ri";
// sections
import BreadCrumbsSection from "../../../components/form/section/BreadCrumbsSection";
//Mensajes
import { toast } from "react-hot-toast";
//ui
import { Input, Label, Button } from '../../../components/ui/index';
//API
import { createMember, updateMember, getMember } from '../../../api/action/userGym.api';
import { getMemberList } from '../../../api/action/memberShips.api';
//Models
import { Miembro } from "../../../model/member.model";
import { Membresia } from "../../../model/memberShips.model";

type MemberRequest = {
  name: string;
  lastname: string;
  phone: string;
  address: string;
  initial_membership_id?: number;
  dateInitial?: string;
};



const RegisterMiembro = () => {
    const params = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<Miembro>();
    const isEditing = !!params.id;
    const [memberships, setMemberships] = useState<Membresia[]>([]);
    const [selectedMembershipId, setSelectedMembershipId] = useState<number | undefined>();
    const [initialDate, setInitialDate] = useState<string>('');


    const onSubmit = handleSubmit(async (data: Miembro) => {
        //console.log('Form data:', data);
        try {
            //preparamos datos para el back
            const requestData: MemberRequest = {
                name: data.name,
                lastname: data.lastname,
                phone: data.phone,
                address: data.address,
            }

            if (selectedMembershipId) {
                requestData.initial_membership_id = selectedMembershipId;
            }
            if (initialDate) {
                requestData.dateInitial = initialDate;
            }

            if (params.id) {
                await updateMember(parseInt(params.id), requestData);
                //console.log('Actualizando miembro:', params.id);
                toast.success('Miembro Actualizado', {
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
                await createMember(requestData);
                //console.log('Respuesta del servidor:',rest.data);
                reset();
                setSelectedMembershipId(undefined);
                setInitialDate('');
                toast.success('Miembro Creado', {
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
            //Se retrasa la navegación para que se muestre la notificación
            //setTimeout(() => {
            navigate('/dashboard/miembros');
            //}, 1000);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al registrar el miembro';
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
                    const response = await getMember(parseInt(params.id));
                    reset(response);
                }
            } catch (error) {
                console.error('Error al obtener el miembro', error);
            }
        }
        const fetchMemberships = async () => {
            try {
                const data = await getMemberList();
                setMemberships(data);
            } catch (error) {
                console.error('Error al obtener membresías', error);
            }
        }
        fetchUserData();
        fetchMemberships();
    }, [params.id, reset]);
   

    return (
        <main className="max-w-7xl mx-auto p-6 lg:p-10">
            <BreadCrumbsSection
                isEditing={isEditing}
                title="Registro de Atletas Mensuales"
                description="Ingrese los datos del nuevo atleta con membresía mensual"
                entityName="este atleta mensual"
            />
            <section className="gap-8 grid grid-cols-1 lg:grid-cols-12">
                <div className="space-y-8 lg:col-span-6">
                    <section className="bg-surface-container-lowest overflow-hidden p-8 relative rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                        <div className="absolute p-4 right-0 top-0">
                            <span className="font-black select-none text-[60px] text-slate-50">
                                Identificación
                            </span>
                        </div>
                        <h4 className="font-bold flex gap-2 items-center mb-10 relative text-xl">Información Personal</h4>
                        <form onSubmit={onSubmit} className="relative space-y-10 z-10">
                            <section className='gap-y-10 gap-x-8 grid grid-cols-1 md:grid-cols-2'>
                                {/* Name */}
                                <div className="relative pt-5">
                                    <Input
                                        type="text"                                        
                                        placeholder=""
                                        {...register('name', {
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
                                                value: /^[a-zA-Z]+$/,
                                                message: 'Nombre invalido'
                                            },
                                        })}
                                    />
                                    <Label>
                                        Nombres
                                    </Label>
                                    {
                                        errors.name && <span className='text-red-500 text-sm'>{errors.name.message}</span>
                                    }
                                </div>
                                {/* LastName */}
                                <div className="relative pt-5">
                                    <Input
                                        type="text"                                        
                                        placeholder=""
                                        {...register('lastname', {
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
                                                value: /^[a-zA-Z]+$/,
                                                message: 'Apellido invalido'
                                            },
                                        })}
                                    />
                                    <Label>
                                        Apellidos
                                    </Label>
                                    {
                                        errors.lastname && <span className='text-red-500 text-sm'>{errors.lastname.message}</span>
                                    }
                                </div>
                                {/* Phone */}
                                <div className="relative pt-5">
                                    <Input
                                        type="tel"
                                        placeholder=""
                                        {...register('phone', {
                                            required: {
                                                value: true,
                                                message: 'Celular requerido'
                                            },
                                            minLength: {
                                                value: 10,
                                                message: 'El Celular debe tener como minimo 10 números'
                                            },
                                            maxLength: {
                                                value: 10,
                                                message: 'El Celular debe tener como maximo 10 número'
                                            },
                                            pattern: {
                                                value: /^[0-9]+$/,
                                                message: 'Numero celular invalido'
                                            },
                                        })}
                                    />
                                    <Label>
                                        Celular
                                    </Label>
                                    {
                                        errors.phone && <span className='text-red-500 text-sm'>{errors.phone.message}</span>
                                    }
                                </div>
                                {/* Adress */}
                                <div className="relative pt-5">
                                    <Input
                                        type="text"
                                        placeholder=""
                                        {...register('address', {
                                            required: {
                                                value: true,
                                                message: 'Dirección requerido'
                                            },
                                            maxLength: {
                                                value: 50,
                                                message: 'La dirección debe tener como maximo 50 letras'
                                            },
                                        })}
                                    />
                                    <Label>
                                        Dirección
                                    </Label>
                                    {
                                        errors.address && <span className='text-red-500 text-sm'>{errors.address.message}</span>
                                    }
                                </div>
                            </section>
                            {/* Membership Selector */}
                            <section className='gap-y-10 gap-x-8 grid grid-cols-1 md:grid-cols-2'>
                                <div className="relative pt-5">
                                    <select
                                        value={selectedMembershipId || ''}
                                        onChange={(e) => setSelectedMembershipId(e.target.value ? Number(e.target.value) : undefined)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                                    >
                                        <option value="">Sin membresía inicial</option>
                                        {memberships.map(m => (
                                            <option key={m.id} value={m.id}>
                                                {m.name} - ${m.price}
                                            </option>
                                        ))}
                                    </select>
                                    <Label>Membresía Inicial</Label>
                                </div>
                                <div className="relative pt-5">
                                    <Input
                                        type="date"
                                        value={initialDate}
                                        onChange={(e) => setInitialDate(e.target.value)}
                                    />
                                    <Label>Fecha Inicial</Label>
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
}
export default RegisterMiembro;