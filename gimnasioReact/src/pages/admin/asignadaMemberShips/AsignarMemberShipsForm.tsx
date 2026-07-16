import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from "react-router-dom";
//Estados
import { useEffect, useState, useMemo } from "react";
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

const DISCOUNT_TIERS: Record<number, number> = {
    1: 0, 2: 0, 3: 5, 6: 10, 12: 20
};

interface FormData {
    miembro: string;
    membresia: string;
    multiplier: string;
    dateInitial: string;
}

const MemberShipsForm = () => {
    const [selectedMembresia, setSelectedMembresia] = useState<Membresia | null>(null);
    const [multiplier, setMultiplier] = useState<number>(1);
    const [discountPercent, setDiscountPercent] = useState<number>(0);
    const [membresias, setMembresias] = useState<Membresia[]>([]);
    const [miembros, setMiembros] = useState<Miembro[]>([]);
    const params = useParams<{ id?: string }>();
    const isEditing = !!params.id;
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<FormData>();
    const dateInitial = watch('dateInitial');

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Precio estimado: base * multiplier * (1 - discount/100)
    const estimatedPrice = useMemo(() => {
        if (!selectedMembresia) return 0;
        const base = Number(selectedMembresia.price);
        return base * multiplier * (1 - discountPercent / 100);
    }, [selectedMembresia, multiplier, discountPercent]);

    // Fecha final estimada
    const estimatedDateFinal = useMemo(() => {
        if (!dateInitial || !selectedMembresia) return '';
        const initial = new Date(dateInitial);
        const final = new Date(initial);
        final.setDate(final.getDate() + selectedMembresia.duration * multiplier);
        return final.toLocaleDateString('es-CO', {
            year: 'numeric', month: '2-digit', day: '2-digit'
        });
    }, [dateInitial, selectedMembresia, multiplier]);

    // Auto-sugerir descuento cuando cambia multiplier
    const handleMultiplierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = parseInt(e.target.value);
        setMultiplier(val);
        setDiscountPercent(DISCOUNT_TIERS[val] ?? 0);
    };

    const onSubmit = handleSubmit(async (data: FormData) => {
        try {
            const miembroId = parseInt(data.miembro);
            const membresiaId = parseInt(data.membresia);

            if (isNaN(miembroId) || isNaN(membresiaId)) {
                toast.error('Por favor, selecciona un miembro y una membresía válidos');
                return;
            }

            const selectMembresia = membresias.find((m) => m.id === membresiaId);
            if (!selectMembresia) {
                toast.error('Membresía no encontrada');
                return;
            }

            const initialDate = new Date(data.dateInitial);
            const finalDate = new Date(initialDate);
            finalDate.setDate(finalDate.getDate() + selectMembresia.duration * multiplier);

            const dateInitial = initialDate.toISOString().split('T')[0];
            const dateFinal = finalDate.toISOString().split('T')[0];

            const requestData: CreateAsignarMemberShipsDto = {
                miembro: miembroId,
                membresia: membresiaId,
                multiplier: multiplier,
                discount_percent: discountPercent,
                dateInitial: dateInitial,
                dateFinal: dateFinal,
            };

            if (params.id) {
                await updateAsignarMemberShips(parseInt(params.id), requestData);
                toast.success('Asignación de Membresía Actualizada', {
                    duration: 3000,
                    position: 'bottom-right',
                    style: {
                        background: '#4b5563',
                        color: '#fff',
                        padding: '16px',
                        borderRadius: '8px',
                    },
                });
            } else {
                await createAsignarMemberShips(requestData);
                toast.success('Asignación de Membresía Creada', {
                    duration: 3000,
                    position: 'bottom-right',
                    style: {
                        background: '#4b5563',
                        color: '#fff',
                        padding: '16px',
                        borderRadius: '8px',
                    },
                });
                reset();
                setMultiplier(1);
                setDiscountPercent(0);
            }
            navigate('/dashboard/asignar-membresia-list');

        } catch (error: unknown) {
            let errorMessage = 'Error desconocido al procesar la solicitud';
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosErr = error as { response: { data: Record<string, unknown> } };
                const data = axiosErr.response?.data;
                if (data) {
                    const msgs = Object.values(data).flat().filter(Boolean);
                    if (msgs.length > 0) errorMessage = msgs.join('. ');
                }
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.error('Error:', error);
            toast.error(errorMessage);
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseMemberShips: Membresia[] = await getMemberList();
                const responseMembers: Miembro[] = await getMembers();

                setMembresias(responseMemberShips);
                setMiembros(responseMembers);

                if (params.id) {
                    const responseAsignacion = await getAsignarMemberShips(parseInt(params.id));
                    if (responseAsignacion.dateInitial && responseAsignacion.dateFinal) {
                        responseAsignacion.dateInitial = formatDate(responseAsignacion.dateInitial);
                        responseAsignacion.dateFinal = formatDate(responseAsignacion.dateFinal);
                    }
                    // Cargar multiplier y discount si la asignación los tiene
                    const mult = Number(responseAsignacion.multiplier) || 1;
                    const disc = Number(responseAsignacion.discount_percent) || 0;
                    setMultiplier(mult);
                    setDiscountPercent(disc);

                    reset({
                        miembro: responseAsignacion.miembro.toString(),
                        membresia: responseAsignacion.membresia.toString(),
                        multiplier: responseAsignacion.multiplier?.toString() ?? '1',
                        dateInitial: responseAsignacion.dateInitial,
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
        if (!date) return '';
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
        const found = membresias.find((m) => m.id === membresiaId) || null;
        setSelectedMembresia(found);
        // Reset multiplier to 1 when membership changes
        setMultiplier(1);
        setDiscountPercent(0);
    };

    // Generate multiplier options from 1..max_multiplier (dynamic per membership)
    const multiplierOptions = selectedMembresia
        ? Array.from({ length: selectedMembresia.max_multiplier }, (_, i) => i + 1)
        : [];
    const showMultiplier = selectedMembresia && selectedMembresia.max_multiplier > 1;
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
                                        {membresias.filter(m => m.is_active !== false).map((membresia) => (
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
                                {/* Multiplier — hidden when max_multiplier === 1 */}
                                {showMultiplier && (
                                    <div className="relative pt-5">
                                        <Select
                                            value={multiplier}
                                            onChange={(e) => {
                                                handleMultiplierChange(e);
                                            }}
                                        >
                                            {multiplierOptions.map((val) => (
                                                <option key={val} value={val}>{val}x</option>
                                            ))}
                                        </Select>
                                        <Label>
                                            Periodos
                                        </Label>
                                    </div>
                                )}
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
                                {/* Descuento */}
                                <div className="relative pt-5">
                                    <Input
                                        type="number"
                                        min={0}
                                        max={100}
                                        step={0.1}
                                        value={discountPercent}
                                        onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                                    />
                                    <Label>
                                        Descuento %
                                    </Label>
                                </div>
                            </section>
                            {/* Preview de precio y fecha final */}
                            {selectedMembresia && (
                                <div className="bg-sky-50 border border-sky-200 p-4 rounded-lg space-y-2">
                                    <p className="text-sm text-sky-800 font-semibold">Vista previa</p>
                                    <div className="grid grid-cols-2 gap-2 text-sm text-sky-700">
                                        <span>Precio base:</span>
                                        <span className="font-semibold text-right">{formatCurrency(Number(selectedMembresia.price))}</span>
                                        <span>Periodos:</span>
                                        <span className="font-semibold text-right">{multiplier}x</span>
                                        <span>Descuento:</span>
                                        <span className="font-semibold text-right">{discountPercent}%</span>
                                        <span className="text-base font-bold">Total estimado:</span>
                                        <span className="text-base font-bold text-right">{formatCurrency(estimatedPrice)}</span>
                                        {estimatedDateFinal && (
                                            <>
                                                <span>Fecha final aprox.:</span>
                                                <span className="font-semibold text-right">{estimatedDateFinal}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
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