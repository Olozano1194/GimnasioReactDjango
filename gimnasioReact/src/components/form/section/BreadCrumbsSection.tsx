interface Props {
    isEditing: boolean;
    title: string;
    description: string;
    entityName?: string; // Opcional, para el texto de edición
};

const BreadCrumbsSection = ({ isEditing, title, description, entityName }: Props) => {
    return (
        <section className="mb-10">
            <h3 className="font-black leading-none text-4xl text-on-surface tracking-tighter">
                <span className="text-primary"></span>
                {isEditing ? `Editar: ${title}` : title}
            </h3>
            <p className="font-light mt-3 max-w-2xl text-lg text-secondary">
                {isEditing 
                    ? `Actualice los datos de ${entityName || 'este registro'}.`
                    : description
                }
            </p>
        </section>
    );
};
export default BreadCrumbsSection;
