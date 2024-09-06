import { useEffect, useState } from "react"
import { TextCheckBox } from "../../../components/forms/textcheckbox"
import { TextRadioButton } from "../../../components/forms/textradiobutton"
import { handleError } from "../../../utils/handleError";
import { toast } from "sonner";
import { useGetNotificationSettingsQuery, useNotificationSettingsMutation } from "../../../services/settingsApiSlice";
import { Button } from "../../../components/forms/button";

const updateLoader = ["#017FC8", "#017FC8", "#017FC8", "#017FC8", "#017FC8"];

export const ProfileNotificationSettings = () => {

    const { data: preference } = useGetNotificationSettingsQuery();
    const [talkAmNews, setTalkAmNews] = useState({
        talkam_news: 0,
        talkam_research: 0
    });
    const [comments, setComments] = useState("");
    const [moderation, setModeration] = useState(null);
    const [activity, setActivity] = useState(null);
    const [notificationSettings, { isLoading }] = useNotificationSettingsMutation();

    const UpdateNotificationSettings = async () => {
        try {
            const notificationBody = {
                talkam_news: talkAmNews.talkam_news,
                talkam_research: talkAmNews.talkam_research,
                moderation_activities: moderation,
                user_activities: activity,
                comments: comments
            }
            const res = await notificationSettings({ ...notificationBody }).unwrap();
            toast.success(res?.message)

        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage)
        }
    }

    const handleTalkAMNews = async (event) => {
        const { name, checked } = event.target;
        const checkedState = {
            ...talkAmNews,
            [name]: 1
        }
        const uncheckedState = {
            ...talkAmNews,
            [name]: 0
        }

        if (checked) {
            setTalkAmNews(checkedState)
        }
        if (!checked) {
            setTalkAmNews(uncheckedState)
        }
    }

    const handleComments = (event) => {
        setComments(() => event.target.value);
    }
    const handleModeration = (event) => {
        setModeration(event.target.value);
    }
    const handleActivities = (event) => {
        setActivity(event.target.value);
    }

    useEffect(() => {
        setTalkAmNews({ ...talkAmNews, talkam_news: preference?.data?.talkam_news, talkam_research: preference?.data?.talkam_research })
        setActivity(preference?.data?.user_activities)
        setModeration(preference?.data?.moderation_activities)
        setComments(preference?.data?.comments)
    }, [preference]);

    console.log(talkAmNews, preference)

    return (
        <div className="flex flex-col p-1">
            <header className="flex items-start gap-2 border-b border-tgray-xlight py-4">
                <p className="ext-sm text-[#475467]">Get notified to find out what&apos;s going on when you&apos;re not online. You can turn them off anytime.</p>
                <Button
                    variant="link"
                    className="!text-tprimary-50"
                    isLoading={isLoading}
                    disabled={isLoading}
                    loadColor={updateLoader}
                    onClick={UpdateNotificationSettings}
                >
                    Update
                </Button>
            </header>

            <main className="flex flex-col divide-y divide-tgray-xlight">

                <section className="flex flex-col gap-8 md:flex-row items-start justify-between py-4">
                    <div className="w-full md:w-1/2 flex items-start flex-col gap-2">
                        <h4 className="font-semibold text-sm text-[#344054]">Notifications from us</h4>
                        <p className="text-[#475467] font-normal text-sm">Receive the latest news, updates and industry tutorials from us.</p>
                    </div>

                    <section className="w-full md:w-1/2 flex flex-col gap-4">
                        <TextCheckBox
                            onChange={handleTalkAMNews}
                            value="talkam_news"
                            name="talkam_news"
                            node={
                                <div className="flex flex-col">
                                    <h5 className="text-sm font-medium text-[#344054]">News and updates</h5>
                                    <span className="text-sm font-normal text-[#475467]">News about product and feature updates.</span>
                                </div>
                            }
                            checked={talkAmNews.talkam_news}
                        />
                        <TextCheckBox
                            onChange={handleTalkAMNews}
                            value="talkam_research"
                            name="talkam_research"
                            node={
                                <div className="flex flex-col">
                                    <h5 className="text-sm font-medium text-[#344054]">User reasearch</h5>
                                    <span className="text-sm font-normal text-[#475467]">Get involved in our beta testing program or participate in paid product user reaserch</span>
                                </div>
                            }
                            checked={talkAmNews.talkam_research}
                        />
                    </section>
                </section>

                <section className="flex flex-col gap-8 md:flex-row items-start justify-between py-4">
                    <div className="w-full md:w-1/2 flex items-start flex-col gap-2">
                        <h4 className="font-semibold text-sm text-[#344054]">Comments</h4>
                        <p className="text-[#475467] font-normal text-sm">These are notifications for coments on your posts and replies to your comments.</p>
                    </div>

                    <section className="w-full md:w-1/2 flex flex-col gap-4">
                        <TextRadioButton
                            label="Do not notify me"
                            name="comments"
                            onChange={handleComments}
                            value="off"
                            checked={comments === "off"}
                        />
                        <TextRadioButton
                            onChange={handleComments}
                            value="mentions"
                            checked={comments === "mentions"}
                            node={
                                <div className="flex flex-col">
                                    <h5 className="text-sm font-medium text-[#344054]">Mentions only</h5>
                                    <span className="text-sm font-normal text-[#475467]">Only notify me if i am mentioned in a comment</span>
                                </div>
                            }
                            name="comments"
                        />
                        <TextRadioButton
                            onChange={handleComments}
                            value="all"
                            node={
                                <div className="flex flex-col">
                                    <h5 className="text-sm font-medium text-[#344054]">All comments</h5>
                                    <span className="text-sm font-normal text-[#475467]">Notify me for all comments on my post</span>
                                </div>
                            }
                            name="comments"
                            checked={comments === "all"}
                        />
                    </section>
                </section>

                <section className="flex flex-col gap-8 md:flex-row items-start justify-between py-4">
                    <div className="w-full md:w-1/2 flex items-start flex-col gap-2">
                        <h4 className="font-semibold text-sm text-[#344054]">Moderation Activities</h4>
                        <p className="text-[#475467] font-normal text-sm">These are notifications for group moderation activities</p>
                    </div>

                    <section className="w-full md:w-1/2 flex flex-col gap-4">
                        <TextRadioButton
                            label="Do not notify me"
                            name="activites"
                            onChange={handleModeration}
                            value={0}
                            checked={moderation}
                        />
                        <TextRadioButton
                            node={
                                <div className="flex flex-col">
                                    <h5 className="text-sm font-medium text-[#344054]">All reminders</h5>
                                    <span className="text-sm font-normal text-[#475467]">Notify me for all reminders</span>
                                </div>
                            }
                            name="activites"
                            onChange={handleModeration}
                            value={1}
                            checked={moderation}
                        />
                    </section>
                </section>

                <section className="flex flex-col gap-8 md:flex-row items-start justify-between py-4">
                    <div className="w-full md:w-1/2 flex items-start flex-col gap-2">
                        <h4 className="font-semibold text-sm text-[#344054]">More ativity about you</h4>
                        <p className="text-[#475467] font-normal text-sm">These are notifications for posts on your profile, upvotes and other reactions to your posts and more.</p>
                    </div>

                    <section className="w-full md:w-1/2 flex flex-col gap-4">
                        <TextRadioButton
                            label="Do not notify me"
                            name="more"
                            onChange={handleActivities}
                            value={0}
                            checked={activity}
                        />
                        <TextRadioButton
                            node={
                                <div className="flex flex-col">
                                    <h5 className="text-sm font-medium text-[#344054]">All reminders</h5>
                                    <span className="text-sm font-normal text-[#475467]">Notify me for all other activity</span>
                                </div>
                            }
                            onChange={handleActivities}
                            value={1}
                            name="more"
                            checked={activity}
                        />
                    </section>
                </section>
            </main>
        </div>
    )
}