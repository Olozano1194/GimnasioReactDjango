import { useState, useEffect } from 'react';
import { MdOutlineCheckCircle, MdOutlinePersonAddAlt, MdOutlineLogin, MdWarning } from "react-icons/md";
import { getActivities } from '../../../src/api/action/activities.api';
// Dto
import { Activity } from '../../model/dto/Activity';
import { toast } from "react-hot-toast";

const colorStyles: Record<string, { bg: string; text: string; icon: any }> = {
    primary: { bg: 'bg-primary/10', text: 'text-primary', icon: MdOutlinePersonAddAlt },
    info: { bg: 'bg-blue-500/10', text: 'text-blue-500', icon: MdOutlineLogin },
    success: { bg: 'bg-tertiary/10', text: 'text-tertiary', icon: MdOutlineCheckCircle },
    warning: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', icon: MdWarning },
};

const RecentActivitySection = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const data = await getActivities();
                setActivities(data);
            } catch (error) {
                console.error('Error al cargar actividades:', error);
                toast.error('Error al cargar actividades recientes');
            } finally {
                setLoading(false);
            }
        };
        fetchActivities();
    }, []);

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
                {activities.map((activity) => {
                    const style = colorStyles[activity.color] || colorStyles.primary;
                    const IconComponent = style.icon;

                    return (
                        <article key={`${activity.type}-${activity.id}`} className="flex gap-4">
                            <div className={`${style.bg} flex h-10 items-center justify-center rounded-full shrink-0 ${style.text} w-10`}>
                                <span className="text-lg">
                                    <IconComponent />
                                </span>
                            </div>
                            <div>
                                <p className="font-bold text-sm text-on-surface">{activity.title}</p>
                                <p className="leading-relaxed text-xs text-secondary">{activity.description}</p>
                                {activity.amount && (
                                    <p className="text-xs font-bold text-green-500">
                                        ${activity.amount.toLocaleString()}
                                    </p>
                                )}
                                <p className="font-bold mt-1 text-[10px] text-nav uppercase">{activity.time_ago}</p>
                            </div>
                        </article>
                    );
                })}
            </div>
            <button className="font-bold mt-8 py-3 rounded-lg text-xs text-primary transition-colors tracking-widest uppercase w-full hover:bg-primary/5">
                Ver todas las actividades
            </button>
        </section>
    );
};
export default RecentActivitySection;