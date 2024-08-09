import { CalendarPlusIcon, LockIcon } from "../../../../assets/icons/generated"
import { GroupAboutCard } from "../../../../components/global/groupaboutcard"
import * as Icon from 'react-feather'

export const GroupAbout = ({ groupDetails }) => {

    return (
        <section className="w-full h-full flex flex-col gap-4">
                <header className="flex flex-col gap-4">
                    <article className="text-sm font-normal ">
                       {groupDetails.data?.about}
                    </article>

                    <p className="text-sm font-normal">{groupDetails?.data.description}</p>
                </header>

                <ul className="flex flex-col gap-2">
                    <GroupAboutCard
                        title="Inception"
                        text={`The group was created on the 13th Jan, 2024 by ${groupDetails?.data.owner?.username || groupDetails?.data?.owner?.name}`}
                        icon={<CalendarPlusIcon />}
                    />
                    <GroupAboutCard
                        title="Discoverability"
                        text={`The group is publicly ${groupDetails?.data?.group_access ?? "Opened" } to everyone. Members can join without approval`}
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