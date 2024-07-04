import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { GroupAddIcon, HumourIcon, InboxIcon, LatestEventsIcon, NotificationIcon, ProfileIcon, TalkamLogo, UsersIcon } from '../../assets/icons/generated';
import { Modal } from '../global/modal';
import { SideBarItem } from '../global/sidebarItem';
import { Button } from '../forms/button';
import { NavSearch } from '../forms/navsearchbar';
import * as Icon from 'react-feather'

const followingItems = [
    {
        id: 1,
        name: 'Latest Events',
        url: '',
        icon: <LatestEventsIcon />
    },
    {
        id: 2,
        name: 'Dating Advice',
        url: '',
        icon: <UsersIcon />
    },
    {
        id: 3,
        name: 'Humour',
        url: '',
        icon: <HumourIcon />
    },
    {
        id: 4,
        name: 'Real Madrid',
        url: '',
        icon: <UsersIcon />
    },
    {
        id: 5,
        name: 'Plants & Gardens',
        url: '',
        icon: <UsersIcon />
    }
]

export const MainAppLayout = ({ children }) => {

    let isMobile = useMediaQuery("(max-width: 1024px)");
    let isLogoMobile = useMediaQuery("(max-width: 425px)");

    const navigate = useNavigate();
    const [showPanel, setShowPanel] = useState(false);

    const toggleShowPanel = () => {
        setShowPanel((prev) => !prev);
    };
  
    return (
        <section className='w-full flex items-center justify-center no-scrollbar'>
            <main className='w-full relative h-screen no-scrollbar max-w-screen-2xl'>
                {/* Mobile header */}
                <header className={`sticky w-full flex items-center justify-between gap-4 border-b border-tgray-light bg-white z-40 px-4 md:px-24 py-7 h-[7dvh] top-0`}>
                    <div onClick={() => navigate('/home')} className="flex items-center gap-2 cursor-pointer">
                        <TalkamLogo width={35} height={40} />
                        <p className={` ${ !isLogoMobile ? 'block' : 'hidden' } flex items-center text-xl font-regularNunito` }><span className='font-extraboldNunito'>talk</span>AM</p>
                    </div>
                    <section className='w-10/12 md:w-9/12 flex items-center justify-between md:justify-end gap-3 sm:gap-5 md:gap-8'>
                        <section className={`${isMobile ? "" : "flex-1"} flex items-center gap-8 md:gap-8`}>
                            { isMobile ? <Icon.Search /> : <NavSearch /> }
                            <NotificationIcon className = "cursor-pointer w-6 h-6 md:w-8 md:h-8" />
                            <InboxIcon className = "cursor-pointer w-6 h-6 md:w-8 md:h-8" />
                        </section>
                        <Button
                            children={isMobile ? "" : "Post"}
                            leftIcon={< Icon.Plus size={ isMobile ? 18 : 20 } />}
                            className={ isMobile ? "!rounded-full !text-base bg-tprimary-50 !p-1" : "!rounded-full !text-base bg-tprimary-50 !px-4 !py-2.5" }
                            onClick={() => navigate('/create-post')}
                        />
                        <ProfileIcon className = "cursor-pointer w-7 h-7" />
                        <Icon.Menu
                            className={`${ isMobile ? 'block' : 'hidden' }`}
                            width={24}
                            height={24}
                            color="black"
                            onClick={toggleShowPanel}
                        />
                    </section>
                </header>

                <div className="flex no-scrollbar h-[93dvh]">
                    <div
                        className={`fixed inset-0 z-30 backdrop-blur-sm bg-tgray-300 lg:hidden`}
                        style={{
                        opacity: 0.8,
                        display: isMobile && showPanel ? "block" : "none",
                        }}
                        aria-hidden="true"
                        onClick={toggleShowPanel}
                    ></div>

                    <aside
                        className={`fixed border-r border-tgray-light inset-y-0 z-30 lg:absolute w-80 sm:w-96 no-scrollbar bg-white sm:pl-20 pr-6
                        ${ isMobile && !showPanel && "hidden"}`}
                    >
                        <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
                            <nav className="flex-1 pt-14 no-scrollbar">
                                <section className='flex flex-col items-start gap-3 border-b border-tgray-200 py-6 pl-4 pb-4'>
                                    <h1 className='text-base font-bold'>Following</h1>
                                    <ul className='flex flex-col gap-2'>
                                        {
                                            followingItems?.map((item) => (
                                                <SideBarItem
                                                    key={item.id}
                                                    children={item.name}
                                                    icon={item.icon}
                                                    url={item.url}
                                                />
                                            ))
                                        }
                                    </ul>
                                </section>

                                <section className='flex flex-col items-start gap-3 border-b border-tgray-200 py-6 pl-4 pb-4'>
                                    <h1 className='text-base font-bold'>Groups</h1>
                                    <Button
                                        variant="outline"
                                        fullWidth
                                        children="Create group"
                                        rightIcon={<GroupAddIcon />}
                                        className="flex items-center justify-between text-sm !p-2 !px-3"
                                    />
                                    <Button
                                        variant="link"
                                        fullWidth
                                        children="See all groups"
                                        rightIcon={<Icon.ArrowRight />}
                                        className="flex items-center justify-between !text-sm !py-0 !px-0"
                                    />
                                </section>

                                <section className='flex flex-col items-start gap-3 border-b border-tgray-200 py-6 pl-4 pb-4'>
                                    <h1 className='text-base font-bold'>Popular categories</h1>
                                    <ul className='flex flex-col gap-2'>
                                        {
                                            followingItems?.map((item) => (
                                                <SideBarItem
                                                    key={item.id}
                                                    children={item.name}
                                                    icon={item.icon}
                                                    url={item.url}
                                                />
                                            ))
                                        }
                                    </ul>
                                    <Button
                                        variant="link"
                                        fullWidth
                                        children="See all categories"
                                        rightIcon={<Icon.ArrowRight />}
                                        className="flex items-center justify-between !text-sm !py-0 !px-0"
                                    />
                                </section>

                                <section className='flex flex-col items-start gap-3 border-b border-tgray-200 py-6 pl-4 pb-4'>
                                    <Button
                                        variant="link"
                                        fullWidth
                                        children="Help & Support"
                                        className="flex items-center justify-between !text-sm !py-0 !px-0"
                                    />
                                    <Button
                                        variant="link"
                                        fullWidth
                                        children="Content policy"
                                        className="flex items-center justify-between !text-sm !py-0 !px-0"
                                    />
                                    <Button
                                        variant="link"
                                        fullWidth
                                        children="About"
                                        className="flex items-center justify-between !text-sm !py-0 !px-0"
                                    />
                                    <Button
                                        variant="link"
                                        fullWidth
                                        children="Report a problem"
                                        className="flex items-center justify-between !text-sm !py-0 !px-0"
                                    />
                                </section>
                            </nav>
                        </div>
                    </aside>

                    <main className={`flex-1 w-full ${!isMobile && " pl-80 sm:pl-96"} no-scrollbar`}>
                        {/* main content */}
                        <div className="flex flex-col flex-1 h-full overflow-x-hidden overflow-y-auto no-scrollbar body-font font-normal text-tblack-100">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </main>
        
        {/* <Modal
            show={true}
            shouldCloseOnEscPress={false}
            shouldCloseOnOverlayClick={false}
            onClose={false}
            position='center'
            contentWidth='w-full md:w-3/4 xl:w-3/5'
        >
            <section className='p-12 space-y-6'>
                <p>Modal content here for test</p>       
            </section>
        </Modal> */}

        </section>
    );
};

