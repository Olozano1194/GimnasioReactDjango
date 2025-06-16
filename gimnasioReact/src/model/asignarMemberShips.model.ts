import { Membresia } from '../model/memberShips.model';
import { Miembro } from '../model/member.model';


// Interfaz para la respuesta de la API (GET)
export interface AsignarMemberShips {
    id:          number | string;
    miembro:     Miembro;
    membresia:   Membresia;
    dateInitial: string;
    dateFinal:   string;
    price: number | string;
    name?: string;
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