import { PostCard } from '../posts/postcard'
import { ChatSquareIcon, ShareIcon } from '../../assets/icons/generated'
import { Button } from '../forms/button'
import { useState } from 'react'
import { Modal } from './modal'
import { CloseAdModal } from '../../routes/dashboard/ads/modals/closeadmodal'
import { DeleteAdModal } from '../../routes/dashboard/ads/modals/deleteadmodal'
import { useDeletePromotionMutation, useRestartPromotionMutation, useUpdatePromotionMutation } from '../../services/paymentApiSlice'
import { handleError } from '../../utils/handleError'
import { toast } from 'sonner'
import { closePaymentModal, useFlutterwave } from "flutterwave-react-v3"
import { PromotionModal } from '../../routes/dashboard/userprofile/promotion/promotion'
import { Link, useNavigate } from 'react-router-dom'
import { GroupBannerAd } from '../../routes/dashboard/ads/groupbannerad'
import { Tooltip } from './tooltip'
import * as Icon from 'react-feather'

export const AdCard = ({
    id,
    type,
    post,
    group,
    status,
    stats,
    page
}) => {

    const navigate = useNavigate();
    const [closeAdModal, setCloseAdModal] = useState(false);
    const [deleteAdmodal, setDeleteAdModal] = useState(false);
    const [promotionModal, setPromotionModal] = useState(false);

    const [updatePromotion, { isLoading: closeLoading }] = useUpdatePromotionMutation();
    const [deletePromotion, { isLoading: deleteloading }] = useDeletePromotionMutation();
    const [restartPromotion, { isLoading: restartLoading }] = useRestartPromotionMutation();

    const handleCloseAdHandler = async () => {
        const updateDetails = {
            status: "Inactive"
        }
        try {
            const res = await updatePromotion({ ad: id, body: { ...updateDetails } }).unwrap();
            toast.success(res?.message)
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage);
        }
    }

    const handleDeleteAdHandler = async () => {
        try {
            const res = await deletePromotion(id).unwrap();
            toast.success(res?.message)
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage);
        }
    }

    const handleRestartAdHandler = async () => {
        try {
            const res = await restartPromotion(id).unwrap();
            toast.success(res?.message)
            if (res?.data) {
                const config = {
                    public_key: import.meta.env.VITE_FLUTTERWAVE_KEY,
                    tx_ref: res?.data?.reference,
                    amount: res?.data?.amount,
                    currency: res?.data?.currency,
                    payment_options: 'card,mobilemoney,ussd',
                    payment_plan: res?.data?.metadata?.flutterwave_data_id,
                    customer: {
                        email: res?.data?.user?.email,
                        phone_number: res?.data?.user?.phone,
                        name: res?.data?.user?.name ?? res?.data?.user?.username,
                    },
                    customizations: {
                        title: res?.data?.activity ?? "TalkAM Subscription",
                        description: res?.data?.description ?? "TalkAM Subscription",
                        // logo: Logo,
                    },
                    meta: { ...res?.data?.metadata }
                };

                const handleFlutterPayment = useFlutterwave(config);
                handleFlutterPayment({
                    callback: async (response) => {
                        closePaymentModal();
                        navigate("/ads", { replace: true });
                    },
                    onClose: () => {
                        navigate("/ads");
                    },
                });
            } else {
                toast.error('Payment details missing. Please try again.');
            }
        } catch (err) {
            const errorMessage = handleError(err);
            toast.error(errorMessage);
        }
    }

    const handleCloseAdModal = () => {
        setCloseAdModal(prev => !prev)
    }

    const handleDeleteAdModal = () => {
        setDeleteAdModal(prev => !prev)
    }

    const handlePromotionModal = () => {
        setPromotionModal(prev => !prev)
    }

    const statusMap = {
        "Active": "Running Ad",
        "Pending": "Pending Ad"
    }

    return (
        <div className="w-full flex flex-col p-3 border border-tgray-xlight rounded-xl divide-y divide-tgray-xlight">
            <section className="w-full flex flex-col xl:flex-row items-start justify-center gap-3">
                <section className="w-full flex flex-col gap-4">
                    {
                        post ?
                            <PostCard
                                key={post?.id}
                                type={post?.type}
                                user={post?.user}
                                polls={post?.polls}
                                avatar={post?.user?.avatar}
                                category={post?.category?.name}
                                author={post?.user?.username ?? post?.user?.name}
                                title={post?.title}
                                comment={post?.body}
                                image={post?.attachments?.[0]?.url}
                                commentcount={post?.comments_count}
                                likes={post?.likes_count}
                                tags={post?.tags}
                                time={post?.created_at}
                                id={post?.id}
                                isAnon={post?.is_anonymous}
                                side
                            />
                            :
                            <GroupBannerAd
                                groupId={group.id}
                                groupDetails={group}
                            />
                    }
                </section>

                <section className="w-full flex flex-col gap-4">
                    {
                        post ?
                            <section className='rounded-xl px-5 py-3 flex items-center justify-between flex-wrap bg-[#F1FAFF] border border-[#E5F6FF]'>
                                <div className='flex items-center gap-1'>
                                    <ChatSquareIcon />
                                    <span>{stats?.comments ?? 0}</span>
                                </div>
                                <div className='flex items-center gap-1'>
                                    <Icon.ThumbsUp />
                                    <span>{stats?.likes ?? 0}</span>
                                </div>
                                <div className='flex items-center gap-1'>
                                    <Icon.ThumbsDown />
                                    <span>{stats?.dislikes ?? 0}</span>
                                </div>
                                <div className='flex items-center gap-1'>
                                    <ShareIcon />
                                    <span>{stats?.shares ?? 0}</span>
                                </div>
                            </section>
                            :
                            null
                    }

                    <section className='px-5 py-3 flex items-center justify-between flex-wrap border-b border-tgray-xlight'>
                        <div className='flex items-start flex-col gap-1'>
                            <header className='flex items-center gap-1 text-[#858585] relative'>
                                <p>Impressions</p>
                                <Tooltip text="This is gotten directly from your target audience">
                                    <Icon.AlertCircle />
                                </Tooltip>
                            </header>
                            <p className='text-base'>{stats.impressions ?? 0}</p>
                        </div>
                        <div className='flex items-start flex-col gap-1'>
                            <header className='flex items-center gap-1 text-[#858585] relative'>
                                <p>Engagement Rate</p>
                                <Tooltip position='left' text="This is gotten directly from your target audience">
                                    <Icon.AlertCircle />
                                </Tooltip>
                            </header>
                            <p className='text-base'>{stats.engagements ?? '0%'}</p>
                        </div>
                        <div className='flex items-start flex-col gap-1'>
                            <header className='flex items-center gap-1 text-[#858585]'>
                                <p>Clicks</p>
                                <Tooltip
                                    position='left'
                                    text="This is gotten directly from your target audience"
                                >
                                    <Icon.AlertCircle />
                                </Tooltip>
                            </header>
                            <p className='text-base'>{stats?.clicks ?? 0}</p>
                        </div>
                    </section>


                    <section className='px-5 py-3 flex items-center justify-between flex-wrap border-b border-tgray-xlight'>
                        <div className='flex items-start flex-col gap-1'>
                            <header className='flex items-center gap-1 text-[#858585]'>
                                <p>Profile Visits</p>
                                <Tooltip
                                    text="This is gotten directly from your target audience"
                                >
                                    <Icon.AlertCircle />
                                </Tooltip>
                            </header>
                            <p className='text-base'>{stats?.profile_visits ?? 0}</p>
                        </div>
                        {group && (
                            <div className='flex items-start flex-col gap-1'>
                                <header className='flex items-center gap-1 text-[#858585] relative'>
                                    <p>New Followers</p>
                                    <Tooltip
                                        position='left'
                                        text="This is gotten directly from your target audience">
                                        <Icon.AlertCircle />
                                    </Tooltip>
                                </header>
                                <p className='text-base'>{stats?.followers ?? 0}</p>
                            </div>
                        )}
                    </section>

                    {
                        page ?
                            <>
                                <section className='px-5 py-3 flex items-center justify-between flex-wrap border-b border-tgray-xlight'>
                                    <div className='flex items-start flex-col gap-1'>
                                        <header className='flex items-center gap-1 text-[#858585]'>
                                            <p>Min time spent on post</p>
                                            <Tooltip
                                                text="This is gotten directly from your target audience"
                                            >
                                                <Icon.AlertCircle />
                                            </Tooltip>
                                        </header>
                                        <p className='text-base'>{stats?.min_time_spent ?? '0 secs'}</p>
                                    </div>
                                    <div className='flex items-start flex-col gap-1'>
                                        <header className='flex items-center gap-1 text-[#858585]'>
                                            <p>Max time spent on post</p>
                                            <Tooltip
                                                position='left'
                                                text="This is gotten directly from your target audience"
                                            >
                                                <Icon.AlertCircle />
                                            </Tooltip>
                                        </header>
                                        <p className='text-base'>{stats?.max_time_spent ?? "0 secs"}</p>
                                    </div>
                                </section>

                                <section className='px-5 flex items-center'>
                                    <p>Country engagements</p>
                                </section>

                                <section className='px-5 py-3 flex items-center justify-between flex-wrap border-b border-tgray-xlight'>
                                    {
                                        stats?.countries?.map(country => (
                                            <div className='flex items-center gap-1'>
                                                <p className='text-base'>{country?.name}:</p>
                                                <span className='text-base text-[#858585]'>{country.percentage}%</span>
                                            </div>
                                        ))
                                    }
                                </section>
                            </>
                            :
                            <div className=''>
                                <Link className='text-sm flex items-center gap-2 text-tprimary-50 underline underline-offset-2' to={`/promo/${id}`}>
                                    View Promotion Details
                                    <Icon.ArrowRight size={18} />
                                </Link>
                            </div>
                    }

                </section>
            </section>

            {
                type === "running" ?
                    <footer className='w-full flex items-center justify-between gap-4 p-4'>
                        <p className={` ${status === "Active" ? "bg-[#F1FAFF] border border-[#E5F6FF]" : "bg-[#fffdf1] border border-[#fff6e5]"} rounded-full px-3 py-1.5  text-[10px]`}>{statusMap[status]}</p>

                        <Button
                            variant="link"
                            className="!text-error-500"
                            onClick={handleCloseAdModal}
                        >
                            Close Ad
                        </Button>
                    </footer>
                    :
                    <footer className='w-full flex md:items-center justify-between gap-4 p-4'>
                        <p className='rounded-full px-3 py-1.5 bg-[#FADDDD] border border-[#F4D4D4] text-[10px] text-[#AC4242] h-fit'>Closed Ad</p>


                        <section className='flex flex-col items-start md:flex-row md:items-center gap-4 md:gap-12'>
                            <Button
                                variant="link"
                                className="!text-error-500"
                                onClick={handleDeleteAdModal}
                            >
                                Delete Ad
                            </Button>

                            <Button
                                className="!rounded-full !py-2 !px-4"
                                onClick={handleRestartAdHandler}
                                isLoading={restartLoading}
                            >
                                Restart Ad
                            </Button>
                        </section>

                    </footer>
            }

            {
                type === "running" ?
                    <Modal
                        show={closeAdModal}
                        shouldCloseOnEscPress={false}
                        shouldCloseOnOverlayClick={false}
                        onClose={handleCloseAdModal}
                        position='center'
                        contentWidth='w-full sm:w-3/5 md:w-5/12 xl:w-3/12'
                    >
                        <CloseAdModal
                            onClose={handleCloseAdModal}
                            handleCloseAdHandler={handleCloseAdHandler}
                            isLoading={closeLoading}
                        />
                    </Modal>
                    :
                    <Modal
                        show={deleteAdmodal}
                        shouldCloseOnEscPress={false}
                        shouldCloseOnOverlayClick={false}
                        onClose={handleDeleteAdModal}
                        position='center'
                        contentWidth='w-full sm:w-3/5 md:w-5/12 xl:w-3/12'
                    >
                        <DeleteAdModal
                            onClose={handleDeleteAdModal}
                            handleDeleteAd={handleDeleteAdHandler}
                            isLoading={deleteloading}
                        />
                    </Modal>
            }


            <Modal
                show={promotionModal}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={handlePromotionModal}
                position='center'
                contentWidth='w-full md:w-3/4 xl:w-2/5'
            >
                <PromotionModal
                    onClose={handlePromotionModal}
                    postId={post ? id : null}
                    groupId={group ? id : null}
                />
            </Modal>

        </div>
    )
}