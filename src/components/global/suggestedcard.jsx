import { LockIcon } from "../../assets/icons/generated";
import { AuthWrapper } from "../../utils/authWrapper";
import { Button } from "../forms/button";
import * as Icon from 'react-feather'

export const SuggestedCard = ({ group, members, img, access, isSuspended, ad }) => {

    let membersPluralization;

    if (!members)
        membersPluralization = 'members'
    if (members > 0) {
        const noun = members > 1 ? 'members' : 'member';
        membersPluralization = members + " " + noun
    }

    return (
        <div className="border border-tgray-xlight rounded-xl p-2 w-[280px] min-h-[150px] max-h-[150px]">
            <AuthWrapper>
                <section className="w-full cursor-pointer flex items-center gap-3">
                    <img
                        style={{
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            objectFit: "cover",
                        }}
                        src={img ?? FallBack}
                        className="rounded-xl !w-32 !h-24 bg-[#00000071]"
                        onError={(e) => {
                            e.target.onerror = FallBack;
                            e.target.src = FallBack
                        }}
                    />
                    <div className="flex flex-col items-start gap-1">
                        <div className='flex items-center gap-2'>
                            <p className="font-bold text-sm">{group}</p>
                            {access === "Closed" ? <LockIcon /> : null}
                        </div>
                        <div className='flex items-center gap-2'>
                            <span className="text-sm font-normal whitespace-nowrap">{membersPluralization}</span>
                            <span
                                className={`w-fit ${ad ? "inline" : "hidden"} font-normal text-[8px] px-2 py-1 rounded-full bg-[#FDAC0E] cursor-pointer`}
                            >
                                Ad
                            </span>
                        </div>
                        <Button
                            children="View"
                            className="!rounded-full !py-2 !px-4 font-bold"
                        />
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
        </div>
    )
}