//Interfaz para crear/actualizar (POST/PUT)
export interface CreateMemberDto{
    dateInitial: string;
    dateFinal:   string;
    name:        string;
    lastname:    string;
    phone:       string;
    address:     string;
    price:       number;
};