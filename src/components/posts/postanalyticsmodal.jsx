import { X } from "react-feather"
import { ChatSquareIcon, ShareIcon } from "../../assets/icons/generated"
import { useGetAnalyticsQuery } from "../../services/posts/postsApiSlice"
import * as Icon from "react-feather"

export const PostAnalyticsModal = ({ onClose, postId, groupId }) => {

    const { data: analytics, isLoading } = useGetAnalyticsQuery({
        postId: postId,
        groupId: groupId
    });

    return (
        <div className="w-full flex flex-col gap-4">
            <header className="flex items-center justify-between border-b border-tgray-50 gap-3 p-6">
                <p className="text-xl font-bold">{postId ? "Post" : "Group"} analytics</p>
                <X className="cursor-pointer" onClick={onClose} size={20} strokeWidth={2} />
            </header>
            <section className="w-full flex flex-col px-6 gap-3">
                <p className="font-medium text-[#858585] text-sm">Get more insights into how well your {postId ? "Post" : "Group"} is doing.</p>
            </section>
            <section className="flex flex-col gap-4 p-6">

                {
                    postId ?
                        <section className='rounded-xl px-4 flex flex-col items-start justify-between flex-wrap bg-[#F1FAFF] border border-[#E5F6FF] divide-y divide-[#E5F6FF]'>
                            <div className="w-full flex items-center justify-between py-4">
                                <div className='flex items-start flex-col gap-1'>
                                    <ChatSquareIcon className="w-6 h-6" />
                                    <span className="text-[10px] text-[#858585]">Comments</span>
                                </div>

                                <span>{analytics?.data?.comments ?? 0}</span>
                            </div>
                            <div className="w-full flex items-center justify-between py-4">
                                <div className='flex items-start flex-col gap-1'>
                                    <Icon.ThumbsUp color="#444444" />
                                    <span className="text-[10px] text-[#858585]">Likes</span>
                                </div>

                                <span>{analytics?.data?.likes ?? 0}</span>
                            </div>
                            <div className="w-full flex items-center justify-between py-4">
                                <div className='flex items-start flex-col gap-1'>
                                    <Icon.ThumbsDown color="#444444" />
                                    <span className="text-[10px] text-[#858585]">Dislikes</span>
                                </div>

                                <span>{analytics?.data?.dislikes ?? 0}</span>
                            </div>
                            <div className="w-full flex items-center justify-between py-4">
                                <div className='flex items-start flex-col gap-1'>
                                    <ShareIcon className="w-6 h-6" />
                                    <span className="text-[10px] text-[#858585]">Shares</span>
                                </div>

                                <span>{analytics?.data?.shares ?? 0}</span>
                            </div>
                        </section>
                        :
                        null
                }


                <section>
                    <section className='py-5 flex items-center justify-between flex-wrap border-b border-tgray-xlight'>
                        <div className='flex items-center flex-col gap-1'>
                            <header className='flex items-center gap-1 text-[#858585]'>
                                <p>Impressions</p>
                                <Icon.AlertCircle />
                            </header>
                            <p className='text-base'>{analytics?.data?.impressions ?? 0}</p>
                        </div>
                        <div className='flex items-center flex-col gap-1'>
                            <header className='flex items-center gap-1 text-[#858585]'>
                                <p>Engagement rates</p>
                                <Icon.AlertCircle />
                            </header>
                            <p className='text-base'>{Number(analytics?.data?.engagement_rates).toFixed(0) ?? 0}%</p>
                        </div>
                        {
                            groupId ?
                                <div className='flex items-center flex-col gap-1'>
                                    <header className='flex items-center gap-1 text-[#858585]'>
                                        <p>New Followers</p>
                                        <Icon.AlertCircle />
                                    </header>
                                    <p className='text-base'>{analytics?.data?.followers ?? 0}</p>
                                </div>
                                :
                                null
                        }
                    </section>

                    <section className='py-5 flex items-center justify-between flex-wrap border-b border-tgray-xlight'>
                        <div className='flex items-center flex-col gap-1'>
                            <header className='flex items-center gap-1 text-[#858585]'>
                                <p>Profile visits</p>
                                <Icon.AlertCircle />
                            </header>
                            <p className='text-base'>{analytics?.data?.profile_visits ?? 0}</p>
                        </div>
                        <div className='flex items-center flex-col gap-1'>
                            <header className='flex items-center gap-1 text-[#858585]'>
                                <p>Engagements</p>
                                <Icon.AlertCircle />
                            </header>
                            <p className='text-base'>{analytics?.data?.engagements ?? 0}</p>
                        </div>
                        <div className='flex items-center flex-col gap-1'>
                            <header className='flex items-center gap-1 text-[#858585]'>
                                <p>Clicks</p>
                                <Icon.AlertCircle />
                            </header>
                            <p className='text-base'>{analytics?.data?.clicks ?? 0}</p>
                        </div>
                    </section>

                    <section className='py-5 flex items-center justify-between flex-wrap border-b border-tgray-xlight'>
                        <div className='flex items-center flex-col gap-1'>
                            <header className='flex items-center gap-1 text-[#858585]'>
                                <p>Min time spent on post</p>
                                <Icon.AlertCircle />
                            </header>
                            <p className='text-base'>{analytics?.data?.min_time_spent ?? '0'} secs</p>
                        </div>
                        <div className='flex items-center flex-col gap-1'>
                            <header className='flex items-center gap-1 text-[#858585]'>
                                <p>Max time spent on post</p>
                                <Icon.AlertCircle />
                            </header>
                            <p className='text-base'>{analytics?.data?.max_time_spent ?? "0"} secs</p>
                        </div>
                    </section>

                    <section className='py-5 flex items-center justify-between flex-wrap border-b border-tgray-xlight'>
                        <p>Country engagements</p>
                    </section>

                    <section className='py-5 flex items-center justify-between flex-wrap border-b border-tgray-xlight'>
                        {
                            !analytics?.data?.countries?.length ?
                                "No Countries"
                                :
                                analytics?.data?.countries?.map(country => (
                                    <div className='flex items-center gap-1'>
                                        <p className='text-base'>{country?.name}:</p>
                                        <span className='text-base text-[#858585]'>{country?.percentage}%</span>
                                    </div>
                                ))
                        }
                    </section>

                </section>
            </section>
        </div>
    )
}