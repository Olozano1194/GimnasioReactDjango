//Interfaz para crear/actualizar (POST/PUT)
export interface CreateAsignarMemberShipsDto{
    membresia: number;
    miembro: number;
    multiplier?: number;
    dateInitial: string;
    dateFinal: string;
};
