import { AuthWrapper } from '../../utils/authWrapper';
import { LockIcon } from '../../assets/icons/generated';
import FallBack from '../../assets/icons/groupicon.svg'
import * as Icon from "react-feather"

export const GroupCard = ({ group, members, img, access, onClick, isSuspended }) => {

    let membersPluralization;

    if (!members)
        membersPluralization = 'members'
    if (members > 0) {
        const noun = members > 1 ? 'members' : 'member';
        membersPluralization = members + " " + noun
    }

    return (
        <AuthWrapper onClick={onClick}>
            <section className="cursor-pointer flex items-center gap-2">
                <img
                    style={{
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        objectFit: "cover",
                    }}
                    src={img ?? FallBack}
                    className="rounded-full w-14 h-14 bg-[#00000071]"
                    onError={(e) => {
                        e.target.onerror = FallBack;
                        e.target.src = FallBack
                    }}
                />
                <div className="flex flex-col items-start gap-1">
                    <div className='flex items-center gap-2'>
                        <p className="font-bold text-base">{group}</p>
                        {access === "Closed" ? <LockIcon /> : null}
                    </div>
                    <span className="text-sm font-normal">{membersPluralization}</span>
                    {
                        isSuspended ?
                            <p className='flex items-center gap-1 rounded-full'>
                                <Icon.AlertCircle color='#FF0000' size={10} />
                                <span className="text-[10px] font-normal text-[#FF0000]">Suspended</span>
                            </p>
                            : null
                    }
                </div>
            </section>
        </AuthWrapper>
    )
}