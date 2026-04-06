// icons
import { LuDownload } from "react-icons/lu";

const HeaderSection = () => {
    return (
        <section className="flex flex-col gap-4 justify-betweenmb-8 md:flex-row md:items-end">
                <div>
                    <h2 className='font-black pb-4 text-3xl text-on-surface tracking-tight md:text-2xl md:pt-2'>Listado de Miembros</h2>
                    <p className="mt-1 text-secondary">Administre y supervise el estado y el rendimiento de su comunidad de gimnasios.</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-surface-container-high cursor-pointer flex font-semibold gap-2 items-center px-4 py-2 rounded-lg text-sm text-on-surface transition-colors hover:bg-surface-container-high"><span className="text-sm"><LuDownload /></span>Exportar</button>
                </div>
            </section>
    );
};
export default HeaderSection;