import { axiosPrivate } from '../axios/axios.private';
import { PagoMembresia, CreatePagoMembresiaDto } from '../../model/pagoMembresia.model';

export const createPago = async (
    membresiaAsignadaId: number,
    pago: CreatePagoMembresiaDto
): Promise<PagoMembresia> => {
    const { data } = await axiosPrivate.post<PagoMembresia>(
        `/MemberShipsAsignada/${membresiaAsignadaId}/pagos/`,
        pago
    );
    return data;
};

export const getPagosByMembresia = async (
    membresiaAsignadaId: number
): Promise<PagoMembresia[]> => {
    const { data } = await axiosPrivate.get<PagoMembresia[]>(
        `/MemberShipsAsignada/${membresiaAsignadaId}/pagos/`
    );
    return data;
};
