import { useState } from 'react';
import { MdOutlineFileDownload, MdAdd } from "react-icons/md";
import { axiosPrivate } from '../../../api/axios/axios.private';
import { toast } from "react-hot-toast";

const WelcomeSection = () => {
    const [exporting, setExporting] = useState(false);

    const handleExportReport = async () => {
        setExporting(true);
        try {
            const response = await axiosPrivate.get('/export-report/', {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'reporte_gimnasio.csv');
            document.body.appendChild(link);
            link.click();
            
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            toast.success('Reporte descargado correctamente');
        } catch (error) {
            console.error('Error al exportar:', error);
            toast.error('Error al generar el reporte');
        } finally {
            setExporting(false);
        }
    };

    return (
        <section className="flex flex-col gap-4 justify-between md:items-end md:flex-row">
            <div>
                <h2 className="font-extrabold mb-1 text-3xl text-on-surface tracking-tight">ControlFit Gallery</h2>
                <p className="font-medium text-on-surface/70">Tu ecosistema fitness está rindiendo <span className="font-bold text-tertiary">+12</span> por encima del objetivo este mes.</p>
            </div>
            <div className="flex gap-3">
                <button 
                    onClick={handleExportReport}
                    disabled={exporting}
                    className="bg-surface-container-high cursor-pointer font-bold flex gap-2 items-center px-5 py-2.5 rounded-lg text-on-surface text-sm transition-colors hover:bg-surface-container-high/80 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="text-sm">
                        <MdOutlineFileDownload />
                    </span>
                    {exporting ? 'Exportando...' : 'Exportar Reporte'}
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
