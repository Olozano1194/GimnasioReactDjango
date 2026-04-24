export interface HomeStats {
    id: string;
    num_miembros: number;
    total_month: number;
    miembros_mes: number;
    total: number;
    miembros_mes_anterior: number;
    diff_miembros: number; // puede ser negativo
}