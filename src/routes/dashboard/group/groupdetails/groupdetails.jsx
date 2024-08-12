import { Tabs } from "../../../../components/global/tabs";
import { GroupAbout } from "./groupabout";
import { GroupMembers } from "./groupmembers";
import { GroupRules } from "./grouprules";

export const GroupDetails = ({ groupDetails, currentUserRole, isLoading }) => {

    const tabs = [
        {
            id: 0,
            title: "Rules",
            component: <GroupRules groupDetails={groupDetails} isLoading={isLoading} />
        },
        {
            id: 1,
            title: "Members",
            component: <GroupMembers currentUserRole={currentUserRole} />
        },
        {
            id: 2,
            title: "About",
            component: <GroupAbout groupDetails={groupDetails} isLoading={isLoading} />
        },
    ];

    return (
        <div className="w-full flex flex-col h-full">

            <section className="relative overflow-y-auto w-full h-full no-scrollbar">
                <Tabs tabs={tabs} />
            </section>
        </div>
    )
}