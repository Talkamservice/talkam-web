import { useState } from 'react'
import { PostCardVariants } from '../../helpers/cardanimation';
import Fallback from '../../assets/images/fallback.png'
import * as Icon from 'react-feather'

export const CategoryAccordion = ({ title, children, icon }) => {

    const [openAccordion, setOpenAccordion] = useState(false);

    const toggleAccordion = () => {
        setOpenAccordion((prev) => !prev);
    }

    return (
        <div className="w-full flex flex-col items-start jusitfy-between gap-4 py-2 border-b border-tgray-50 cursor-pointer">
            <header onClick={toggleAccordion} className="w-full flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <img
                        src={icon ?? Fallback}
                        className="w-8 h-8 rounded-full bg-[#888888]"
                        onError={(e) => {
                            e.target.onerror = Fallback;
                            e.target.src = Fallback;
                        }}
                    />
                    <span className='text-sm'>{title}</span>
                </div>

                <div className='flex items-center gap-2 transition-all ease-linear duration-150'>
                    <p className='text-xs text-[#888888] transition-all ease-linear duration-150'>{openAccordion ? "Collapse" : "Expand"}</p>
                    {openAccordion ? <Icon.ChevronUp size={18} /> : <Icon.ChevronDown size={18} />}
                </div>
            </header>
            {
                openAccordion ?
                    <section
                        variants={PostCardVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        className='w-full py-2'
                    >
                        {children}
                    </section>
                    :
                    null
            }
        </div>
    )
}