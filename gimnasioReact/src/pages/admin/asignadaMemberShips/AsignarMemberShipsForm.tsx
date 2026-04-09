import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from "react-router-dom";
//Estados
import { useEffect, useState } from "react";
//Icons
import { RiLoginBoxLine } from "react-icons/ri";
// sections
import BreadCrumbsSection from "../../../components/form/section/BreadCrumbsSection";
//Mensajes
import { toast } from "react-hot-toast";
//ui
import { Input, Label, Button, Select } from '../../../components/ui/index';
//API
//MemberShips
import { getMemberList } from '../../../api/action/memberShips.api';
//Member
import { getMembers } from '../../../api/action/userGym.api';
//Asignación Membresías
import { createAsignarMemberShips, updateAsignarMemberShips, getAsignarMemberShips } from '../../../api/action/asignarMemberShips.api';
//Models
import { Membresia } from '../../../model/memberShips.model';
import { Miembro } from '../../../model/member.model';
import { CreateAsignarMemberShipsDto } from '../../../model/dto/asignarMemberShips.dto';


interface FormData {
    miembro: string;
    membresia: string;
    dateInitial: string;
}

const MemberShipsForm = () => {
    const [miembros, setMiembros] = useState<Miembro[]>([]);
    const [membresias, setMembresias] = useState<Membresia[]>([]);
    const [, setSelectedPrice] = useState<number | null>(null);
    const params = useParams<{ id?: string }>();
    const isEditing = !!params.id;
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

    const onSubmit = handleSubmit(async (data: FormData) => {
        //console.log('Form data:', data);        
        try {
            const miembroId = parseInt(data.miembro);
            const membresiaId = parseInt(data.membresia);

            if (isNaN(miembroId) || isNaN(membresiaId)) {
                toast.error('Por favor, selecciona un miembro y una membresía válidos');
                return;
            }

            //Encontrar la membresía para seleccionar la duración
            const selectMembresia = membresias.find((m) => m.id === membresiaId);
            if (!selectMembresia) {
                toast.error('Membresía no encontrada');
                return;
            }

            //Calculamos la fecha final
            const initialDate = new Date(data.dateInitial);
            const finalDate = new Date(initialDate);
            finalDate.setDate(finalDate.getDate() + selectMembresia.duration);

            //Formateamos la fecha en el formato correcto
            const dateInitial = initialDate.toISOString().split('T')[0];
            const dateFinal = finalDate.toISOString().split('T')[0];

            //Para la creación/actualización solo enviamos los Ids y las fechas
            const requestData: CreateAsignarMemberShipsDto = {
                miembro: miembroId,
                membresia: membresiaId,
                dateInitial: dateInitial,
                dateFinal: dateFinal
            };
            //console.log('Datos que serán enviados:', requestData);

            if (params.id) {
                await updateAsignarMemberShips(parseInt(params.id), requestData);
                //console.log('Actualizando miembro:', params.id);
                toast.success('Asignación de Membresía Actualizada', {
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
                await createAsignarMemberShips(requestData);
                //console.log('Respuesta del servidor:',rest.data);            
                toast.success('Asignación de Membresía Creada', {
                    duration: 3000,
                    position: 'bottom-right',
                    style: {
                        background: '#4b5563',   // Fondo negro
                        color: '#fff',           // Texto blanco
                        padding: '16px',
                        borderRadius: '8px',
                    },
                });
                reset();
            }
            navigate('/dashboard/asignar-membresia-list');

        } catch (error) {
            if (error instanceof Error) {
                console.error('Error detallado:', error);
                toast.error(`Error: ${error.message}`);

            } else {
                console.error('Error desconocido:', error);
                toast.error('Error desconocido al procesar la solicitud');
            }
            // const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            //     toast.error(errorMessage, {
            //         duration: 3000,
            //         position: 'bottom-right',
            //     });                    
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Cargar listas de miembros y membresías
                const responseMemberShips: Membresia[] = await getMemberList(); // Función para obtener la lista de membresías
                const responseMembers: Miembro[] = await getMembers(); // Función para obtener la lista de miembros

                setMembresias(responseMemberShips);
                setMiembros(responseMembers);


                // Si params.id está presente, cargar los datos específicos para actualizar
                if (params.id) {
                    const responseAsignacion = await getAsignarMemberShips(parseInt(params.id)); // Función para obtener una asignación específica
                    //console.log("Datos de la asignación para editar:", responseAsignacion);

                    //formateamos la fecha antes de pasarla al formulario
                    if (responseAsignacion.dateInitial && responseAsignacion.dateFinal) {
                        responseAsignacion.dateInitial = formatDate(responseAsignacion.dateInitial);
                        responseAsignacion.dateFinal = formatDate(responseAsignacion.dateFinal);
                    }

                    // Prellenar los campos del formulario con los datos existentes
                    reset({
                        miembro: responseAsignacion.miembro.toString(),
                        membresia: responseAsignacion.membresia.toString(),
                        dateInitial: responseAsignacion.dateInitial,
                        //dateFinal: responseAsignacion.dateFinal,
                    });
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Error al cargar los datos';
                toast.error(errorMessage);
            }
        };

        fetchData();
    }, [params.id, reset]);

    const formatDate = (date: string): string => {
        if (!date) return ''; // Retorna un valor vacío si la fecha es undefined o null
        try {
            const [day, month, year] = date.split('-');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        } catch (error) {
            console.error('Error al formatear la fecha:', error);
            return '';
        }
    };

    const handleMemberShipsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const membresiaId = parseInt(event.target.value);
        const selectedMembresia = membresias.find((membresia) => membresia.id === membresiaId);

        if (selectedMembresia) {
            setSelectedPrice(selectedMembresia.price);
        } else {
            setSelectedPrice(null);
        }
    };


    return (
        <main className="max-w-7xl mx-auto p-6 lg:p-10">
            <BreadCrumbsSection
                isEditing={isEditing}
                title="Asignar Membresías"
                description="Asocie membresías a los atletas registrados en el sistema"
                entityName="esta asignación"
            />
            <section className="gap-8 grid grid-cols-1 lg:grid-cols-12">
                <div className="space-y-8 lg:col-span-6">
                    <section className="bg-surface-container-lowest overflow-hidden p-8 relative rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                        <div className="absolute p-4 right-0 top-0">
                            <span className="font-black select-none text-[60px] text-slate-50">
                                Identificación
                            </span>
                        </div>
                        <h4 className="font-bold flex gap-2 items-center mb-10 relative text-xl">Asignar Membresía</h4>
                        <form onSubmit={onSubmit} className="relative space-y-10 z-10">
                            <section className='gap-y-10 gap-x-8 grid grid-cols-1 md:grid-cols-2'>
                                {/* Miembro */}
                                <div className="relative pt-5">
                                    <Select
                                        {...register('miembro', {
                                            required: {
                                                value: true,
                                                message: 'Nombre requerido'
                                            },
                                        })}
                                    >
                                        <option value="">Seleccione un Miembro</option>
                                        {miembros.map((miembro) => (
                                            <option key={miembro.id} value={miembro.id?.toString()}>{miembro.name} {miembro.lastname}</option>
                                        ))}
                                    </Select>
                                    <Label>
                                        Miembro
                                    </Label>
                                    {
                                        errors.miembro && <span className='text-red-500 text-sm'>{errors.miembro.message}</span>
                                    }
                                </div>
                                {/* MemberShips */}
                                <div className="relative pt-5">
                                    <Select
                                        {...register('membresia', {
                                            required: {
                                                value: true,
                                                message: 'Membresia requerido'
                                            },
                                        })}
                                        onChange={(e) => {
                                            register('membresia').onChange(e);
                                            handleMemberShipsChange(e);
                                        }}
                                    >
                                        <option value="">Seleccione una Membresía</option>
                                        {membresias.map((membresia) => (
                                            <option key={membresia.id} value={membresia.id?.toString()}>{membresia.name} - ${membresia.price}</option>
                                        ))}
                                    </Select>
                                    <Label>
                                        Membresía
                                    </Label>
                                    {
                                        errors.membresia && <span className='text-red-500 text-sm'>{errors.membresia.message}</span>
                                    }
                                </div>
                                {/* Date Initial */}
                                <div className="relative pt-5">
                                    <Input
                                        type="date"
                                        placeholder=""
                                        {...register('dateInitial', {
                                            required: {
                                                value: true,
                                                message: 'Fecha requerido'
                                            },
                                        })}
                                    />
                                    <Label>
                                        Fecha Inicial
                                    </Label>
                                    {
                                        errors.dateInitial && <span className='text-red-500 text-sm'>{errors.dateInitial.message}</span>
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