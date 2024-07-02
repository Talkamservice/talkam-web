import React, { useState } from 'react'
import { Button } from '../../components/forms/button';
import { TalkamLogo } from '../../assets/icons/generated';
import { SelectPill } from '../../components/forms/selectpill';
import { useGetCategoriesQuery, useUpdateProfileMutation } from '../../services/userApiSlice';
import { toast } from 'sonner';
import { ColoredLoader } from '../../components/global/loader';
import { CardVariants } from '../../helpers/cardanimation';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Protected from '../../utils/protected';

export const Interests = () => {

    const navigate = useNavigate();
    const [ selectedItems, setSelectedItems ] = useState([]);

    const { data: categories, isLoading } = useGetCategoriesQuery();
    const [ updateProfile, { isLoading:addLoading } ] = useUpdateProfileMutation();

    const itemCount = selectedItems.length < 3 ? selectedItems.length : 3
    let isValid = false;

    if(selectedItems.length >= 3){
        isValid = true
    }

    const handleAddInterests = async() => {
        try {
            await updateProfile({ interests: selectedItems }).unwrap();
            toast.success("Your interests have been saved")
            navigate('/get-started/save-profile', { replace: true })
        } catch(err){
            toast.error(err?.data?.message)
        }
    }

    return (
        <Protected>
            <main className='w-full min-h-[100dvh] flex items-center justify-center m-auto bg-twhite-100 p-2 sm:p-12'>
                <motion.div
                    key="chatbox"
                    variants={CardVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    className='w-full h-full md:h-fit max-w-screen-2xl flex items-center justify-center md:w-2/3 xl:w-5/12 bg-twhite-100 flex-col gap-8 rounded-2xl md:shadow-box'
                >
                    <header className='w-full flex items-center justify-center flex-col gap-12 pt-4 px-4 md:pt-9 md:px-9'>
                        <div className='flex items-center gap-2'>
                            <TalkamLogo />
                            <p className='flex items-center text-xl font-regularNunito'><span className='font-extraboldNunito'>talk</span>AM</p>
                        </div>
                        <div className="flex items-center justify-center flex-col w-full gap-2 text-center">
                            <p className='text-lg font-bold text-tblack-100'>What are some of your interests</p>
                            <p className='text-sm text-tblack-100'>
                                We&apos;ll use this to recommend groups you can join.
                            </p>
                        </div>
                    </header>

                    <section className='w-full flex items-center justify-center gap-y-3 gap-2 flex-wrap p-4'>
                        {
                            isLoading ?
                            <ColoredLoader />
                            :
                            <SelectPill 
                                options={categories?.data ?? []}
                                selectedItems={selectedItems}
                                setSelectedItems={setSelectedItems}
                            />
                        }
                    </section>
                    <footer className='w-full flex flex-col md:flex-row items-center justify-between border-t border-tgray-75 p-4 md:p-8 gap-3'>
                        <div className='w-full md:w-1/2 flex flex-col'>
                            <p className='text-lg text-tgray-100 font-medium'>{itemCount}/3</p>
                            <p className='text-sm text-tgray-100'>Select at least 3</p>
                        </div>

                        <section className='w-full md:w-1/2'>
                            <Button
                                children="Next"
                                variant="primary"
                                fullWidth
                                isLoading={addLoading}
                                disabled={!isValid || addLoading || isLoading}
                                onClick={handleAddInterests}
                            />
                        </section>
                    </footer>
                </motion.div>
            </main>
        </Protected>
    )
}