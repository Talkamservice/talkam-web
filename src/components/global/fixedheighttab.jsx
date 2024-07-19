import React, { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

// BUILT THIS HACKY COMPONENT NOT TO MESS WITH THE OTHER ONES ALREADY USED, LATER SOME REFACTORING CAN BE DONE LET THE HEIGHT FIX WORK FOR THE OTHER
// DUPLICATED COMPONENTS OF THIS TYPE SO WE HAVE ONE ACROSS THE ENTIRE PROJECT FOR ALL USE-CASE

export const FixedHeightRouteTabs = ({tabs, data, top, paddingTop, width="w-full"}) => {
    // console.log("top:", top, paddingTop)

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const activePath = pathname.split('/').splice(-1)[0]
    const [activeTab, setActiveTab] = useState("")
    
    const handleTabClick = (id) => {
        setActiveTab(id)
        navigate(`${id}`, {replace: true})
    }

  return (
    <div className='overflow-hidden w-full'>
        <div
            style={{
                top: `${top}px`,
                // width: 'inherit'
            }}
            className={` w-[inherit] z-[12] fixed flex items-center justify-start gap-8 overflow-hidden border-b border-[#DCDCDC] no-scrollbar mb-2 bg-red-200`}>
            {   tabs?.map(item => (
                    <TabButton
                        key={item.title}
                        text={item.title}
                        type={item.text === activePath ? "" : "text"}
                        onClick={() => handleTabClick(item.text)}
                        icon={item.icon}
                    />
                ))
            }
        </div>
        <div style={{ paddingTop: `${paddingTop}px` }} className={`w-full overflow-hidden no-scrollbar`}>
            <Outlet context={data} />
        </div>
    </div>
  )
}

export const TabButton = ({ text, onClick, type, icon }) => {
    return (
        <div onClick={onClick} 
            className={`
                text-sm font-medium text-tblack-100 cursor-pointer relative
                flex items-center justify-center transition-all ease-linear duration-150`
            }
        >
            <div className='flex items-center justify-center gap-1 py-2'>
                <span>
                    {icon && icon}
                </span>
                <span className='w-full text-sm font-medium z-10 whitespace-nowrap'>{text}</span>
            </div>
            { 
                    type !== 'text' ?
                    <motion.div 
                        layoutId='active-pill' 
                        className='border-b-4 border-tprimary-50 absolute inset-0 w-full' 
                    /> 
                    : 
                    null
            }
        </div>
    )
}