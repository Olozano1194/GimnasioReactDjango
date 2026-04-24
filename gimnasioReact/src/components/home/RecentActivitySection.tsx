import { useState, useEffect, ElementType } from 'react';
import { MdOutlineCheckCircle, MdOutlinePersonAddAlt, MdOutlineLogin, MdWarning } from "react-icons/md";
import { getActivities } from '../../../src/api/action/activities.api';
// Dto
import { Activity } from '../../model/dto/Activity';
import { toast } from "react-hot-toast";

const colorStyles: Record<string, { bg: string; text: string; icon: ElementType }> = {
    primary: { bg: 'bg-primary/10', text: 'text-primary', icon: MdOutlinePersonAddAlt },
    info: { bg: 'bg-blue-500/10', text: 'text-blue-500', icon: MdOutlineLogin },
    success: { bg: 'bg-tertiary/10', text: 'text-tertiary', icon: MdOutlineCheckCircle },
    warning: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', icon: MdWarning },
};

const getTimeAgo = (isoDate: string): string => {
    const diff = Date.now() - new Date(isoDate).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} día${days !== 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hora${hours !== 1 ? 's' : ''}`;
    if (minutes > 0) return `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
    return 'Ahora mismo';
};

const INITIAL_COUNT = 4;

const RecentActivitySection = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const data = await getActivities();
                // Ordena por created_at descendente (el más reciente primero)
                const sorted = [...data].sort(
                    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                );
                setActivities(sorted);
            } catch (error) {
                console.error('Error al cargar actividades:', error);
                toast.error('Error al cargar actividades recientes');
            } finally {
                setLoading(false);
            }
        };
        fetchActivities();
    }, []);

    const visibleActivities = showAll ? activities : activities.slice(0, INITIAL_COUNT);

    if (loading) {
        return (
            <section className="bg-surface-container-lowest border border-outline-variant/10 flex flex-col p-8 rounded-2xl shadow-sm min-h-100">
                <h3 className="font-bold mb-6 text-xl text-on-surface tracking-tight">Actividades Recientes</h3>
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-on-surface/50">Cargando actividades...</p>
                </div>
            </section>
        );
    }

    if (activities.length === 0) {
        return (
            <section className="bg-surface-container-lowest border border-outline-variant/10 flex flex-col p-8 rounded-2xl shadow-sm">
                <h3 className="font-bold mb-6 text-xl text-on-surface tracking-tight">Actividades Recientes</h3>
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-on-surface/50">No hay actividades recientes</p>
                </div>
                <button className="font-bold mt-8 py-3 rounded-lg text-xs text-primary transition-colors tracking-widest uppercase w-full hover:bg-primary/5">
                    Ver todas las actividades
                </button>
            </section>
        );
    }

    return (
        <section className="bg-surface-container-lowest border border-outline-variant/10 flex flex-col p-8 rounded-2xl shadow-sm">
            <h3 className="font-bold mb-6 text-xl text-on-surface tracking-tight">Actividades Recientes</h3>
            <div className="flex-1 space-y-6">
                {visibleActivities.map((activity) => {
                    const style = colorStyles[activity.color] || colorStyles.primary;
                    const IconComponent = style.icon;

                    return (
                        <article key={`${activity.type}-${activity.id}`} className="flex gap-4">
                            <div className={`${style.bg} flex h-10 items-center justify-center rounded-full shrink-0 ${style.text} w-10`}>
                                <span className="text-lg"><IconComponent /></span>
                            </div>
                            <div>
                                <p className="font-bold text-sm text-on-surface">{activity.title}</p>
                                <p className="leading-relaxed text-xs text-secondary">{activity.description}</p>
                                {activity.amount && (
                                    <p className="text-xs font-bold text-green-500">
                                        ${activity.amount.toLocaleString()}
                                    </p>
                                )}
                                {/* ✅ Usa created_at para el tiempo fresco */}
                                <p className="font-bold mt-1 text-[10px] text-nav uppercase">
                                    hace {getTimeAgo(activity.created_at)}
                                </p>
                            </div>
                        </article>
                    );
                })}
            </div>

            {/* ✅ Botón dinámico */}
            {activities.length > INITIAL_COUNT && (
                <button
                    onClick={() => setShowAll(prev => !prev)}
                    className="cursor-pointer font-bold mt-8 py-3 rounded-lg text-xs text-primary transition-colors tracking-widest uppercase w-full hover:bg-primary/5"
                >
                    {showAll ? 'Ver menos' : `Ver todas las actividades (${activities.length})`}
                </button>
            )}
        </section>
    );
};
export default RecentActivitySection;