import React from 'react'

export const ListSkeleton = () => {
    return(
        <div role="status" className="w-full flex flex-col gap-1 animate-pulse">
            <div className="h-2 bg-tgray-100 opacity-10 rounded-full mb-.5"></div>
            <div className="h-2 bg-tgray-100 opacity-10 rounded-full mb-.5"></div>
            <div className="h-2 bg-tgray-100 opacity-10 rounded-full"></div>
        </div>
    )
}

export const GallerySkeletons = ({num = 3, direction='flex-col', side}) => {
    return (
        <div className={`w-full flex ${direction} gap-6 animate-pulse `}>
            {
                [...Array(num)].map((_, index) => (
                    <div key={index} className='w-full flex flex-col gap-2 items-center'>
                        <header className="w-full flex items-center justify-between gap-3">
                            <section className="w-full flex items-center gap-3">
                                <div className='flex items-center justify-center w-12 h-12 rounded-full p-3 bg-tgray-100 opacity-10 animate-pulse'></div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 bg-tgray-100 opacity-10 rounded-full w-[30px] mb-.5"></div>
                                        <div className="h-2 bg-tgray-100 opacity-10 rounded-full w-[30px] mb-.5"></div>
                                    </div>
                                    <div className="h-2 bg-tgray-100 opacity-10 rounded-full mb-.5"></div>
                                </div>
                            </section>

                            <>
                            </>
                        </header>
                        <div className="w-full flex flex-col gap-1">
                            <div className="h-2 bg-tgray-100 opacity-10 rounded-full mb-.5"></div>
                            <div className="h-2 bg-tgray-100 opacity-10 rounded-full mb-.5"></div>
                            <div className="h-2 bg-tgray-100 opacity-10 rounded-full"></div>
                        </div>
                        <div className={` flex items-center justify-center m-auto w-full ${ side ? 'h-32' : 'h-64' } rounded-md p-3 bg-tgray-100 opacity-10 animate-pulse `}></div>
                    </div>
                ))
            }
        </div>
    )
}

const ShimmerWrapper = ({ children }) => {
    return(
        <div className='relative 
            before:absolute before:inset-0
            before:-translate-x-full
            before:animate-[skeleton_2s_infinite]
            before:bg-gradient-to-r
            before:from-transparent before:via-rose-100/10 before:to-transparent
            isolate
            overflow-hidden
            shadow-xl shadow-black/5
            before:border-t before:border-rose-100/10'
        >
            {children}
        </div>
    )
}