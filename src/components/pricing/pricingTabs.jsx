import React, { useState } from 'react'
import { motion } from 'framer-motion'

export const PricingTabs = ({ tabs, onTabChange }) => {

    const [activeTab, setActiveTab] = useState(tabs[1]?.text ?? "")

    const handleTabClick = (tab) => {
        setActiveTab(tab)
        onTabChange(tab)
    }

    return (
        <div className='flex items-start flex-col space-y-6 w-full overflow-auto no-scrollbar'>
            <div className='flex items-center justify-between gap-6 overflow-x-auto w-full rounded-full p-1 bg-white border border-[#E5E5E5]'>
                {tabs?.map((item, index) => (
                    <TabButton
                        key={index}
                        text={item.title}
                        node={item.node}
                        currentTab={item.text === activeTab}
                        onClick={() => handleTabClick(item.text)}
                    />
                ))
                }
            </div>
        </div>
    )
}

export const TabButton = ({ text, node, onClick, currentTab }) => {
    return (
        <div onClick={onClick}
            className={`
                relative rounded-lg cursor-pointer
                flex flex-1 items-center justify-center p-2 transition-all ease-linear duration-300
            `}
        >
            {currentTab ? <motion.div style={{ borderRadius: 9999 }} layoutId='active-price-pill' className='bg-tprimary-50 absolute inset-0 rounded-full' /> : null}
            {node && <p className={`relative z-10 whitespace-nowrap ${currentTab ? 'text-white' : ''} transition-all ease-linear duration-300`}>{node}</p>}
            {text && <span className={`relative z-10 whitespace-nowrap ${currentTab ? 'text-white' : ''} transition-all ease-linear duration-300 text-sm font-medium text-tblack-100 px-2`}>{text}</span>}
        </div>
    )
}