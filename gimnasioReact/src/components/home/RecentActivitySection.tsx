import { MdOutlineCheckCircle, MdOutlineReport, MdOutlinePersonAddAlt } from "react-icons/md";


const RecentActivitySection = () => {

    return (
        <section className="bg-surface-container-lowest border border-outline-variant/10 flex flex-col p-8 rounded-2xl shadow-sm">
            <h3 className="font-bold mb-6 text-xl text-on-surface tracking-tight">Actividades Recientes</h3>
            <div className="flex-1 space-y-6">
                {/* activity 1 */}
                <article className="flex gap-4">
                    <div className="bg-tertiary/10 flex h-10 items-center justify-center rounded-full shrink-0 text-tertiary w-10">
                        <span className="text-lg"><MdOutlineCheckCircle /></span>
                    </div>
                    <div>
                        <p className="font-bold text-sm text-on-surface">Payment Successful</p>
                        <p className="leading-relaxed text-xs text-secondary">Member Sofia Chen renewed Premium Plan.</p>
                        <p className="font-bold mt-1 text-[10px] text-nav uppercase">2 Mins ago</p>
                    </div>
                </article>
                {/* activity 2 */}
                <article className="flex gap-4">
                    <div className="bg-text-error/10 flex h-10 items-center justify-center rounded-full shrink-0 text-text-error w-10">
                        <span className="text-lg"><MdOutlineReport /></span>
                    </div>
                    <div>
                        <p className="font-bold text-sm text-on-surface">Equipment Alert</p>
                        <p className="leading-relaxed text-xs text-secondary">Treadmill #04 reported a motor fault sensor alert.</p>
                        <p className="font-bold mt-1 text-[10px] text-nav uppercase">45 Mins ago</p>
                    </div>
                </article>
                {/* activity 3 */}
                <article className="flex gap-4">
                    <div className="bg-primary/10 flex h-10 items-center justify-center rounded-full shrink-0 text-primary w-10">
                        <span className="text-lg"><MdOutlinePersonAddAlt /></span>
                    </div>
                    <div>
                        <p className="font-bold text-sm text-on-surface">New Registration</p>
                        <p className="leading-relaxed text-xs text-secondary">Mark Thompson joined thorough the summer referral program.</p>
                        <p className="font-bold mt-1 text-[10px] text-nav uppercase">2 hours ago</p>
                    </div>
                </article>
            </div>
            <button className="font-bold mt-8 py-3 rounded-lg text-xs text-primary transition-colors tracking-widest uppercase w-full hover:bg-primary/5">
                Ver todas las actividades
            </button>
        </section>
    );
};
export default RecentActivitySection;