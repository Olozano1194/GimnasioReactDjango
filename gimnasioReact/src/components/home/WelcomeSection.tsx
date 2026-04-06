import { MdOutlineFileDownload, MdAdd } from "react-icons/md";

const WelcomeSection = () => {

    return (
        <section className="flex flex-col gap-4 justify-between md:items-end md:flex-row">
            <div>
                <h2 className="font-extrabold mb-1 text-3xl text-on-surface tracking-tight">ControlFit Gallery</h2>
                <p className="font-medium text-on-surface/70">Tu ecosistema fitness está rindiendo <span className="font-bold text-tertiary">+12</span> por encima del objetivo este mes.</p>
            </div>
            <div className="flex gap-3">
                <button className="bg-surface-container-high cursor-pointer font-bold flex gap-2 items-center px-5 py-2.5 rounded-lg text-on-surface text-sm transition-colors hover:bg-surface-container-high/80">
                    <span className="text-sm"><MdOutlineFileDownload /></span>
                    Exportar Reporte
                </button>
                <button className="bg-pulse-gradient cursor-pointer font-bold flex gap-2 items-center px-5 py-2.5 rounded-lg shadow-lg shadow-primary/25 text-white text-sm transition-opacity hover:opacity-90 hover:bg-surface-dim">
                    <span className="text-sm"><MdAdd /></span>
                    Nuevo Miembro
                </button>
            </div>                        
        </section>
    );
};
export default WelcomeSection;