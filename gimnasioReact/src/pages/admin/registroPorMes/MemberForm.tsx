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
import { Input, Label, Button, Select } from '../../../components/ui/index';
//API
import { createMember, updateMember, getMember } from '../../../api/action/userGym.api';
import { getMemberList } from '../../../api/action/memberShips.api';
//Models
import { Miembro } from "../../../model/member.model";
import { Membresia } from "../../../model/memberShips.model";

const DISCOUNT_TIERS: Record<number, number> = {
    1: 0, 2: 0, 3: 5, 6: 10, 12: 20
};

type MemberRequest = {
    name: string;
    lastname: string;
    phone: string;
    address: string;
    initial_membership_id?: number;
    dateInitial?: string;
    multiplier?: number;
    discount_percent?: number;
};



const RegisterMiembro = () => {
    const params = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<Miembro>();
    const isEditing = !!params.id;
    const [memberships, setMemberships] = useState<Membresia[]>([]);
    const [selectedMembershipId, setSelectedMembershipId] = useState<number | undefined>();
    const [initialDate, setInitialDate] = useState<string>('');
    const [multiplier, setMultiplier] = useState<number>(1);
    const [discountPercent, setDiscountPercent] = useState<number>(0);

    const selectedMembership = memberships.find(m => m.id === selectedMembershipId);
    const basePrice = selectedMembership ? Number(selectedMembership.price) : 0;
    const totalPrice = basePrice * multiplier * (1 - discountPercent / 100);
    const totalDays = selectedMembership ? selectedMembership.duration * multiplier : 0;

    const handleMultiplierChange = (value: string) => {
        const m = Number(value);
        setMultiplier(m);
        setDiscountPercent(DISCOUNT_TIERS[m] || 0);
    };

    const onSubmit = handleSubmit(async (data: Miembro) => {
        try {
            const requestData: MemberRequest = {
                name: data.name,
                lastname: data.lastname,
                phone: data.phone,
                address: data.address,
            }

            if (selectedMembershipId) {
                requestData.initial_membership_id = selectedMembershipId;
                requestData.multiplier = multiplier;
                requestData.discount_percent = discountPercent;
            }
            if (initialDate) {
                requestData.dateInitial = initialDate;
            }

            if (params.id) {
                await updateMember(parseInt(params.id), requestData);
                toast.success('Miembro Actualizado', {
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
                await createMember(requestData);
                reset();
                setSelectedMembershipId(undefined);
                setInitialDate('');
                setMultiplier(1);
                setDiscountPercent(0);
                toast.success('Miembro Creado', {
                    duration: 3000,
                    position: 'bottom-right',
                    style: {
                        background: '#4b5563',
                        color: '#fff',
                        padding: '16px',
                        borderRadius: '8px',
                    },

                });
            }
            navigate('/dashboard/miembros');

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

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

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
                                    <Select
                                        value={selectedMembershipId || ''}
                                        onChange={(e) => {
                                            setSelectedMembershipId(e.target.value ? Number(e.target.value) : undefined);
                                            setMultiplier(1);
                                            setDiscountPercent(0);
                                        }}  
                                    >
                                        <option value="">Sin membresía inicial</option>
                                        {memberships.map(m => (
                                            <option key={m.id} value={m.id}>
                                                {m.name} - ${m.price}
                                            </option>
                                        ))}
                                    </Select>
                                    <Label>
                                        Membresía Inicial
                                    </Label>                                    
                                </div>
                                {/* Date */}
                                <div className="relative pt-5">
                                    <Input
                                        type="date"
                                        value={initialDate}
                                        onChange={(e) => setInitialDate(e.target.value)}
                                    />
                                    <Label>Fecha Inicial</Label>
                                </div>
                            </section>

                            {/* Periodos y Descuento — solo si hay membresia seleccionada */}
                            {selectedMembershipId && (
                                <>
                                    <section className='gap-y-10 gap-x-8 grid grid-cols-1 md:grid-cols-2'>
                                        <div className="relative pt-5">
                                            <Select
                                                value={multiplier}
                                                onChange={(e) => handleMultiplierChange(e.target.value)}
                                            >
                                                <option value={1}>1 mes</option>
                                                <option value={2}>2 meses</option>
                                                <option value={3}>3 meses</option>
                                                <option value={6}>6 meses</option>
                                                <option value={12}>12 meses</option>
                                            </Select>
                                            <Label>Periodos</Label>
                                        </div>
                                        <div className="relative pt-5">
                                            <Input
                                                type="number"
                                                value={discountPercent}
                                                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                                                min={0}
                                                max={100}
                                                step={0.5}
                                            />
                                            <Label>Descuento (%)</Label>
                                        </div>
                                    </section>

                                    {/* Preview de precio */}
                                    {basePrice > 0 && (
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-2">Resumen del pago</p>
                                            <div className="space-y-1 text-sm">
                                                <div className="flex justify-between">
                                                    <span>Valor unitario:</span>
                                                    <span>{formatCurrency(basePrice)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Periodos:</span>
                                                    <span>{multiplier}x</span>
                                                </div>
                                                {discountPercent > 0 && (
                                                    <div className="flex justify-between text-green-600">
                                                        <span>Descuento ({discountPercent}%):</span>
                                                        <span>-{formatCurrency(basePrice * multiplier * discountPercent / 100)}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200 mt-2">
                                                    <span>Total a pagar:</span>
                                                    <span>{formatCurrency(totalPrice)}</span>
                                                </div>
                                                <div className="flex justify-between text-gray-500 text-xs pt-1">
                                                    <span>Días totales:</span>
                                                    <span>{totalDays} días</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
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
}
export default RegisterMiembro;
