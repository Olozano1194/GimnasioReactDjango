export interface PagoMembresia {
    id: number;
    membresia_asignada: number;
    monto: number | string;
    metodo_pago: 'efectivo' | 'transferencia' | 'nequi';
    fecha_pago: string;
    nota?: string;
}

export interface CreatePagoMembresiaDto {
    monto: number;
    metodo_pago: 'efectivo' | 'transferencia' | 'nequi';
    nota?: string;
}
