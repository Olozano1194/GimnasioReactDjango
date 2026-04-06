// icons
import { FaUserGroup } from "react-icons/fa6";
import { MdTrendingUp } from "react-icons/md";

const StatsOverviewSection = () => {
    return (
        <section className="gap-6 grid grid-cols-1 mb-10 md:grid-cols-4">
            <article className="bg-primary-container flex flex-col justify-between min-h-40 overflow-hidden p-6 relative rounded-xl shadow-lg text-white md:col-span-2">
                <div className="relative z-10">
                    <p className="font-bold text-white/70 text-xs tracking-widest uppercase">Total de Miembros Activos</p>
                    <h3 className="font-black mt-2 text-5xl tracking-tighter">1,284</h3>
                </div>
                <div className="flex gap-2 items-center relative text-sm z-10">
                    <span className="bg-white/20 px-2 py-0.5 rounded-full">
                        +12 from last month
                    </span>
                </div>
                <div className="absolute -bottom-1 opacity-10 -right-10">
                    <span className="text-[160px]"><FaUserGroup /></span>
                </div>
            </article>
            <article className="bg-surface-container-lowest border-b-2 border-primary/10 flex flex-col justify-between p-6 rounded-xl shadow-sm">
                <p className="font-bold text-on-surface text-xs tracking-widest uppercase">Retention Rate</p>
                <h3 className="font-black text-3xl text-on-surface tracking-tighter">
                    94.2%
                </h3>
                <div className="bg-surface-container-lowest h-1.5 mt-4 rounded-full w-full">
                    <div className="bg-tertiary h-full rounded-full w-[94%]"></div>
                </div>
            </article>
            <article className="bg-surface-container-lowest border-b-2 border-primary/10 flex flex-col justify-between p-6 rounded-xl shadow-sm">
                <p className="font-bold text-on-surface text-xs tracking-widest uppercase">New Today</p>
                <h3 className="font-black text-3xl text-on-surface tracking-tighter">
                    24
                </h3>
                <div className="font-bold flex gap-1 items-center mt-4 text-xs text-tertiary">
                    <span className="text-xs"><MdTrendingUp /></span> Rising trend                    
                </div>
            </article>
        </section>
    );
};
export default StatsOverviewSection;