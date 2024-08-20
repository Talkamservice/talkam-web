import { useState } from "react";
import { Members } from "./members";
import { GroupRequests } from "../grouprequests.jsx/grouprequests";
import { AllGroupMembers } from "../allgroupmembers.jsx/allmembers";

export const GroupMembers = ({ currentUserRole, requestCount }) => {

    const [memberView, setMemberView] = useState("members");

    const membersViewMap = {
        "members":
            <Members
                setMemberView={setMemberView}
                currentUserRole={currentUserRole}
                requestCount={requestCount}
            />,
        "requests":
            <GroupRequests
                setMemberView={setMemberView}
                currentUserRole={currentUserRole}
            />,
        "allmembers":
            <AllGroupMembers
                setMemberView={setMemberView}
                currentUserRole={currentUserRole}
            />
    }

    return (
        <>
            {membersViewMap[memberView]}
        </>
    )
}