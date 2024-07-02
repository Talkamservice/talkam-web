import React, { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export const RouteTabs = ({tabs, data}) => {

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const activePath = pathname.split('/').splice(-1)[0]
    const [activeTab, setActiveTab] = useState("")
    
    const handleTabClick = (id) => {
        setActiveTab(id)
        navigate(`${id}`, {replace: true})
    }

  return (
    <div className=''>
        <div className='z-10 sticky top-0 flex items-center justify-start gap-5 overflow-x-auto w-full border-b border-[#DCDCDC] no-scrollbar bg-white mb-2'>
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
        <div className='w-full overflow-auto no-scrollbar'>
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
            <div className='flex items-center gap-1'>
                {icon && icon}
                <span className='w-full text-sm font-medium py-2 pt-4 z-10 whitespace-nowrap'>{text}</span>
            </div>
            { 
                    type !== 'text' ? 
                    <motion.div 
                        layoutId='active-pill' 
                        className='border-b-4 border-tprimary-50 absolute inset-0 p-3 w-full' 
                    /> 
                    : 
                    null
            }
        </div>
    )
}