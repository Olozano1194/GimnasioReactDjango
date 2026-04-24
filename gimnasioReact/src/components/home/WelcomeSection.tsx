import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdOutlineFileDownload, MdAdd } from "react-icons/md";
import { axiosPrivate } from "../../../src/api/axios/axios.private";
import { toast } from "react-hot-toast";
// models
// dtos
import { HomeStats } from "../../model/dto/home.dto";
// api
import { getHome } from "../../api/action/userGymDay.api";

const WelcomeSection = () => {
    const [exporting, setExporting] = useState(false);
    const [stats, setStats] = useState<HomeStats | null>(null);

    const handleExportReport = async () => {
        setExporting(true);
        try {
            const response = await axiosPrivate.get("/export-report/", {
                responseType: "blob",
            });

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;

            const contentDisposition = response.headers["content-disposition"];
            let fileName = "reporte_gimnasio.xlsx";

            if (contentDisposition) {
                const match = contentDisposition.match(/filename="(.+)"/);
                if (match?.[1]) fileName = match[1];
            }

            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();

            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("Reporte descargado correctamente");
        } catch (error) {
            console.error("Error al exportar:", error);
            toast.error("Error al generar el reporte");
        } finally {
            setExporting(false);
        }
    };

    useEffect(() => {
        getHome().then(setStats).catch(console.error);
    }, []);

    // Helper para formatear el diff
    const formatDiff = (diff: number) => {
        if (diff > 0) return `+${diff}`;
        if (diff < 0) return `${diff}`;
        return '=';
    };

    const diffColor = (diff: number) => {
        if (diff > 0) return 'text-tertiary';   // verde
        if (diff < 0) return 'text-red-500';
        return 'text-on-surface/50';
    };

    return (
        <section className="flex flex-col gap-4 justify-between md:items-end md:flex-row">
            <div>
                <h2 className="font-extrabold mb-1 text-3xl text-on-surface tracking-tight">
                    ControlFit Gallery
                </h2>
                <p className="font-medium text-on-surface/70">
                    Tu ecosistema fitness está rindiendo{" "}
                    <span className={`font-bold ${diffColor(stats?.diff_miembros ?? 0)}`}>
                        {formatDiff(stats?.diff_miembros ?? 0)} miembros
                    </span>{" "}
                    {(stats?.diff_miembros ?? 0) >= 0
                        ? "por encima"
                        : "por debajo"}{" "}
                    del mes anterior.
                </p>
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
                    {exporting ? "Exportando..." : "Exportar Reporte"}
                </button>
                <Link to='/dashboard/registrar-miembro' className="bg-pulse-gradient cursor-pointer font-bold flex gap-2 items-center px-5 py-2.5 rounded-lg shadow-lg shadow-primary/25 text-white text-sm transition-opacity hover:opacity-90 hover:bg-surface-dim">
                    <span className="text-sm">
                        <MdAdd />
                    </span>
                    Nuevo Miembro
                </Link>
            </div>
        </section>
    );
};
export default WelcomeSection;