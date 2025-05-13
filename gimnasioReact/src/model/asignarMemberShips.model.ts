import { Membresia } from '../model/memberShips.model';
import { Miembro } from '../model/member.model';

// Interfaz para la respuesta de la API (GET)
export interface AsignarMemberShips {
    id:          number;
    miembro:     Miembro;
    membresia:   Membresia;
    dateInitial: string;
    dateFinal:   string;
    miembro_details: {
        id: number;
        name: string;
        lastname: string;        
    };
    membresia_details: {
        id: number;
        name: string;
        price: number;        
    };
}