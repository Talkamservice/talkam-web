import { NewsIcon } from "../../assets/icons/generated"

export const AnnouncementCard = ({ title, subtitle, duration }) => {
    return (
        <div className="w-full py-4 text-white items-center bg-gradient-to-r from-[#FDFFFF] to-[#D1F2F7] px-12">
            <div className="w-full flex flex-row items-start justify-between gap-4">
                <section className="flex items-center gap-2 flex-1 w-3/4">
                    <NewsIcon className="w-8 h-8" />
                    <div>
                        <span className="text-xs font-bold text-tblack-100 whitespace-nowrap">{title}</span>
                        <p className="text-xs text-[#858585]">{subtitle}</p>
                    </div>
                </section>

                <span className="text-[10px] text-[#858585] italic flex-none">Expires in 2 days</span>
            </div>
        </div>
    )
}
