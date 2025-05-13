// Interfaz para la respuesta de la API (GET)
export interface Miembro {
    id:         number;
    dateInitial: string;
    dateFinal:   string;
    name:        string;
    lastname:    string;
    phone:       string;
    address:     string;
    price:       number;
}