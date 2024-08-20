import moment from "moment"
import { CalendarPlusIcon, LockIcon } from "../../../../assets/icons/generated"
import { GroupAboutCard } from "../../../../components/global/groupaboutcard"
import * as Icon from 'react-feather'

export const GroupAbout = ({ groupDetails }) => {

    const Discoverability = groupDetails?.data?.group_access === "Opened" ? `The group is Opened to everyone. Members can join without approval`
        :
        groupDetails?.data?.group_access === "Closed" ?
            `The group is Closed. Members cannot join without approval and would need to make a request to join`
            :
            null


    return (
        <section className="w-full h-full flex flex-col gap-4">
            <header className="flex flex-col gap-4">
                <article className="text-sm font-normal ">
                    {groupDetails?.data?.about}
                </article>

                <p className="text-sm font-normal">{groupDetails?.data.description}</p>
            </header>

            <ul className="flex flex-col gap-2">
                <GroupAboutCard
                    title="Inception"
                    text={`The group was created on the ${moment(groupDetails?.data?.created_at).format("Do MMMM, YYYY")} by ${groupDetails?.data.owner?.username || groupDetails?.data?.owner?.name}`}
                    icon={<CalendarPlusIcon />}
                />
                <GroupAboutCard
                    title="Discoverability"
                    text={Discoverability}
                    icon={<LockIcon />}
                />
                <GroupAboutCard
                    title="Posts"
                    text={`Only members who have joined can post to this group.`}
                    icon={<Icon.Plus />}
                />
            </ul>
        </section>
    )
}