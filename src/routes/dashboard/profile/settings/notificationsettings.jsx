import { TextCheckBox } from "../../../../components/forms/textcheckbox"
import { TextRadioButton } from "../../../../components/forms/textradiobutton"

export const ProfileNotificationSettings = () => {
    return (
        <div className="flex flex-col p-1">
            <header className="border-b border-tgray-xlight py-4">
                <p className="text-sm text-[#475467]">Get notified to find out what&apos;s going on when you&apos;re not online. You can turn them off anytime.</p>
            </header>

            <main className="flex flex-col divide-y divide-tgray-xlight">

                <section className="flex flex-col gap-8 md:flex-row items-start justify-between py-4">
                    <div className="w-full md:w-1/2 flex items-start flex-col gap-2">
                        <h4 className="font-semibold text-sm text-[#344054]">Notifications from us</h4>
                        <p className="text-[#475467] font-normal text-sm">Receive the latest news, updates and industry tutorials from us.</p>
                    </div>

                    <section className="w-full md:w-1/2 flex flex-col gap-4">
                        <TextCheckBox
                            node={
                                <div className="flex flex-col">
                                    <h5 className="text-sm font-medium text-[#344054]">News and updates</h5>
                                    <span className="text-sm font-normal text-[#475467]">News about product and feature updates.</span>
                                </div>
                            }
                        />
                        <TextCheckBox
                            node={
                                <div className="flex flex-col">
                                    <h5 className="text-sm font-medium text-[#344054]">User reasearch</h5>
                                    <span className="text-sm font-normal text-[#475467]">Get involved in our beta testing program or participate in paid product user reaserch</span>
                                </div>
                            }
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
                        />
                        <TextRadioButton
                            node={
                                <div className="flex flex-col">
                                    <h5 className="text-sm font-medium text-[#344054]">Mentions only</h5>
                                    <span className="text-sm font-normal text-[#475467]">Only notify me if i am mentioned in a comment</span>
                                </div>
                            }
                            name="comments"
                        />
                        <TextRadioButton
                            node={
                                <div className="flex flex-col">
                                    <h5 className="text-sm font-medium text-[#344054]">All comments</h5>
                                    <span className="text-sm font-normal text-[#475467]">Notify me for all comments on my post</span>
                                </div>
                            }
                            name="comments"
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
                        />
                        <TextRadioButton
                            node={
                                <div className="flex flex-col">
                                    <h5 className="text-sm font-medium text-[#344054]">All reminders</h5>
                                    <span className="text-sm font-normal text-[#475467]">Notify me for all reminders</span>
                                </div>
                            }
                            name="activites"
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
                        />
                        <TextRadioButton
                            node={
                                <div className="flex flex-col">
                                    <h5 className="text-sm font-medium text-[#344054]">All reminders</h5>
                                    <span className="text-sm font-normal text-[#475467]">Notify me for all other activity</span>
                                </div>
                            }
                            name="more"
                        />
                    </section>
                </section>
            </main>
        </div>
    )
}