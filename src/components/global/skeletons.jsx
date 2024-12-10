import React from 'react'

const randomPillWidth = () => Math.floor(Math.random() * (105 - 80 + 1)) + 80;

export const ListSkeleton = () => {
    return (
        <div role="status" className="w-full flex flex-col gap-2 animate-pulse">
            <div className="h-8 bg-tgray-100 opacity-10 rounded-full mb-.5"></div>
            <div className="h-8 bg-tgray-100 opacity-10 rounded-full mb-.5"></div>
            <div className="h-8 bg-tgray-100 opacity-10 rounded-full mb-.5"></div>
            <div className="h-8 bg-tgray-100 opacity-10 rounded-full mb-.5"></div>
            <div className="h-8 bg-tgray-100 opacity-10 rounded-full"></div>
        </div>
    )
}

export const AnalyticsLoader = () => {
    return (
        <div role="status" className="w-full flex flex-col gap-2 animate-pulse">
            <div className="h-20 bg-tgray-100 opacity-10 rounded-xl mb-.5"></div>
            <div className="h-20 bg-tgray-100 opacity-10 rounded-xl mb-.5"></div>
            <div className="h-20 bg-tgray-100 opacity-10 rounded-xl mb-.5"></div>
            <div className="h-20 bg-tgray-100 opacity-10 rounded-xl"></div>
        </div>
    )
}

export const BannerSkeletons = () => {
    return (
        <div className="w-full min-h-[180px] max-h-[180px] bg-tgray-100 opacity-10 rounded-sm animate-pulse" />
    )
}

export const PillSkeletonLoader = ({ num = 20 }) => {
    return (
        <div className="flex items-center flex-wrap gap-1">
            {
                [...Array(num)].map((_, index) => (
                    <span style={{ width: `${randomPillWidth()}px` }} key={index} className={`py-3 px-6 border bg-tgray-100 opacity-10 rounded-full h-8`} />
                ))
            }
        </div>
    )
}

export const GroupSkeletonLoader = ({ num = 4, button = true }) => {
    return (
        <div className='flex flex-col gap-3'>
            {
                [...Array(num)].map((_, index) => (
                    <div key={index} className="w-full flex items-center justify-between gap-4 animate-pulse">
                        <section className="flex items-center gap-2">
                            <div className='flex items-center justify-center w-16 h-16 rounded-full p-3 bg-tgray-100 opacity-10 animate-pulse'></div>
                            <div className="flex flex-col items-start gap-2">
                                <div className='bg-tgray-100 opacity-10 rounded-full h-4 w-[90px]' />
                                <div className='bg-tgray-100 opacity-10 rounded-full h-3 w-[45px]' />
                            </div>
                        </section>

                        {
                            button ?
                                <span
                                    children="Join"
                                    className="!rounded-full !py-2 !px-4 font-bold bg-tgray-100 opacity-10"
                                />
                                :
                                null
                        }
                    </div>
                ))
            }
        </div>
    )
}

export const CategorySkeletonLoader = ({ num = 5 }) => {
    return (
        <div className='w-full flex flex-col animate-pulse gap-4'>
            {
                [...Array(num)].map((_, index) => (
                    <div key={index} className="w-full flex items-center justify-between gap-4 border-b border-tgray-50 py-2">
                        <section className="w-full flex items-center gap-2">
                            <div className='flex items-center justify-center w-10 h-10 rounded-full p-3 bg-tgray-100 opacity-10'></div>
                            <div className="flex flex-col items-start gap-2">
                                <div className='bg-tgray-100 opacity-10 rounded-full h-2 w-[90px]' />
                            </div>
                        </section>

                        <div>
                            <div className='bg-tgray-100 opacity-10 rounded-full h-2 w-[40px]' />
                        </div>
                    </div>

                ))
            }

        </div>
    )
}

export const SubCategorySkeletonLoader = ({ num = 8 }) => {
    return (
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 animate-pulse gap-4'>
            {
                [...Array(num)].map((_, index) => (
                    <div key={index} className='w-full min-w-[200px] h-[70px] bg-tgray-100 opacity-10 rounded-md' />
                ))
            }
        </div>
    )
}

export const ButtonSkeletonLoader = () => {
    return (
        <span
            className="!rounded-full !py-6 !px-14 font-bold bg-tgray-100 opacity-10 animate-pulse"
        />
    )
}

export const GallerySkeletons = ({ num = 3, direction = 'flex-col', side }) => {
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
                        <div className={` flex items-center justify-center m-auto w-full ${side ? 'h-52' : 'h-96'} rounded-xl p-3 bg-tgray-100 opacity-10 animate-pulse `}></div>
                    </div>
                ))
            }
        </div>
    )
}

export const OverflowLoader = ({ num = 8 }) => {
    return (
        <div className='w-full overflow-x-auto flex gap-3'>
            {
                [...Array(num)].map((_, index) => (
                    <div key={index} className="w-full flex items-center justify-between min-w-52 h-32 rounded-xl p-3 bg-tgray-100 opacity-10 animate-pulse">
                    </div>
                ))
            }
        </div>
    )
}

export const ConversationSkeletonLoader = ({ num = 4 }) => {
    return (
        <div className='flex flex-col gap-3'>
            {
                [...Array(num)].map((_, index) => (
                    <div key={index} className="w-full flex items-center justify-between gap-4 animate-pulse">
                        <section className="flex items-center gap-2">
                            <div className='flex items-center justify-center w-12 h-12 rounded-full p-3 bg-tgray-100 opacity-10 animate-pulse'></div>
                            <div className="flex flex-col items-start gap-2">
                                <div className='bg-tgray-100 opacity-10 rounded-full h-3 w-[100px]' />
                                <div className='bg-tgray-100 opacity-10 rounded-full h-3 w-[150px]' />
                            </div>
                        </section>

                        <div className="flex flex-col items-end gap-2">
                            <div className='bg-tgray-100 opacity-10 rounded-full h-3 w-[45px]' />
                            <div className='bg-tgray-100 opacity-10 rounded-full h-3 w-3' />
                        </div>
                    </div>
                ))
            }
        </div>
    )
};

export const ImageGridLoader = ({ num = 15 }) => {
    return (
        <div className='w-full grid grid-cols-3 lg:grid-cols-3 gap-1 animate-pulse'>
            {
                [...Array(num)].map((_, index) => (
                    <div
                        key={index}
                        className="w-full h-[100px] sm:h-[200px] overflow-hidden bg-tgray-100 opacity-10 animate-pulse"
                    />
                ))
            }

        </div>
    )
}

export const NotificationLoader = ({ num = 8 }) => {
    return (
        <div className='w-full flex flex-col gap-2 animate-pulse'>
            {
                [...Array(num)].map((_, index) => (
                    <div className="flex items-start justify-between w-full gap-2">
                        <section className="flex gap-2">
                            <div className="w-10 h-10 rounded-full p-1 bg-tgray-100 opacity-10" />
                            <section className="flex flex-col gap-3">
                                <div className='bg-tgray-100 opacity-10 rounded-full h-3 w-[200px]' />
                                <div className='bg-tgray-100 opacity-10 rounded-full h-3 w-[150px]' />
                                <span className="h-2 bg-tgray-100 rounded-full opacity-10 w-2/5" />
                            </section>
                        </section>

                        <div
                            className="w-[200px] cursor-pointer h-[50px] sm:h-[100px] rounded-lg bg-tgray-100 opacity-10"
                        />
                    </div>
                ))
            }
        </div>
    )
}

export const CommentsLoader = ({ num = 9 }) => {
    return (
        <div className='w-full flex flex-col gap-3 animate-pulse'>
            {
                [...Array(num)].map((_, index) => (
                    <div className="flex items-start justify-between w-full gap-2">
                        <section className="w-full flex gap-2">
                            <section className=" w-full flex flex-col gap-3">
                                <div className='w-full flex flex-col gap-1'>
                                    <div className='bg-tgray-100 opacity-10 rounded-full h-2 w-2/3' />
                                    <div className='bg-tgray-100 opacity-10 rounded-full h-2 w-2/3' />
                                    <div className='bg-tgray-100 opacity-10 rounded-full h-2 w-2/3' />
                                </div>
                                <span className="h-2 bg-tgray-100 rounded-full opacity-10 w-1/4" />
                            </section>
                        </section>

                        <div
                            className="w-1/3 cursor-pointer h-[50px] md:h-[100px] rounded-lg bg-tgray-100 opacity-10"
                        />
                    </div>
                ))
            }
        </div>
    )
}

export const AdSkeletonLoader = ({ num = 3 }) => {
    return (
        <div className='flex flex-col gap-6'>
            {
                [...Array(num)].map((_, index) => (
                    <div key={index} className='w-full flex flex-col items-center xl:items-start xl:flex-row gap-2'>
                        <GallerySkeletons side num={1} />
                        <AnalyticsLoader />
                    </div>
                ))
            }
        </div>
    )
}

const ShimmerWrapper = ({ children }) => {
    return (
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