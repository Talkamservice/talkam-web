import React, { useState } from 'react'
import { motion } from 'framer-motion'

export const Tabs = ({ tabs, headerPadding }) => {

    const [activeTab, setActiveTab] = useState(0)

    const handleTabClick = (tab) => {
        setActiveTab(tab)
    }

    return (
        <div className='z-10 space-y-4'>
            <div className={`z-[12] sticky top-0 flex items-center justify-start gap-8 overflow-x-auto w-full border-b border-[#DCDCDC] no-scrollbar bg-white ${headerPadding ? headerPadding : null} `}>
                {tabs?.map(item => (
                    <TabButton
                        key={item.id}
                        text={item.title}
                        active={item.id === activeTab}
                        onClick={() => handleTabClick(item.id)}
                        icon={item.icon}
                        rightIcon={item.rightIcon}
                    />
                ))
                }
            </div>
            <motion.div
                className='w-full h-full no-scrollbar p-1'>
                {tabs[activeTab].component}
            </motion.div>
        </div>
    )
}

export const TabButton = ({ text, onClick, active, icon, rightIcon }) => {
    return (
        <div onClick={onClick}
            className={`
                text-sm font-medium text-tblack-100 cursor-pointer relative
                flex items-center justify-center transition-all ease-linear duration-150`
            }
        >
            <div className='flex items-center justify-center gap-1'>
                {
                    icon ?
                        <span>
                            {icon}
                        </span>
                        :
                        null
                }
                <span className='w-full text-sm font-medium px-1.5 py-2 pt-4 z-10 whitespace-nowrap'>{text}</span>
            </div>
            {
                rightIcon ?
                    <div className='flex items-center justify-center gap-1 pt-2'>
                        <span>
                            {rightIcon}
                        </span>
                    </div>
                    :
                    null
            }
            {
                active ?
                    <motion.div
                        layoutId='active-pillTab'
                        className='border-b-4 border-tprimary-50 absolute inset-0 p-3 w-full'
                    />
                    :
                    null
            }
        </div>
    )
}