import React from 'react'
import { MailSuccessIcon, TalkamLogo } from '../../../assets/icons/generated';
import { Link } from 'react-router-dom';

export const MailSuccess = () => {

    return (
        <main className='w-full h-[100dvh] flex items-center justify-center m-auto bg-twhite-100 p-2 sm:p-12'>
            <div className='w-full h-full md:h-fit max-w-screen-2xl flex items-center justify-center md:w-2/3 xl:w-5/12 bg-twhite-100 p-4 md:p-12 rounded-2xl flex-col gap-6 rounded-2xl md:shadow-box'>
                <header className='w-full flex items-center justify-center flex-col gap-4'>
                    <div className='flex items-center gap-2'>
                        <TalkamLogo />
                        <p className='flex items-center text-xl'><span className='font-extrabold'>talk</span>AM</p>
                    </div>
                    <div className="flex items-center justify-center flex-col w-full gap-2">
                        <p className='text-lg font-bold text-tblack-100'>Check your mail</p>
                    </div>
                    <p className='text-sm text-tblack-100 text-center'>We&apos;ve sent password reset instructions to your email address</p>
                </header>

                <main className='w-full flex flex-col items-center justify-center gap-3'>
                    <MailSuccessIcon />
                    <p>Back to <Link to="/login" className='text-[#017FC8] text-sm font-bold'>Login</Link></p>
                </main>
            </div>
        </main>
    )
}