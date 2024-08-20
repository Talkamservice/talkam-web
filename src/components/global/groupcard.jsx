import FallBack from '../../assets/icons/groupicon.svg'

export const GroupCard = ({ group, members, img, onClick }) => {

    let membersPluralization;

    if (!members)
        membersPluralization = 'members'
    if (members > 0) {
        const noun = members > 1 ? 'members' : 'member';
        membersPluralization = members + " " + noun
    }

    return (
        <section onClick={onClick} className="cursor-pointer flex items-center gap-2">
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
                <p className="font-bold text-base">{group}</p>
                <span className="text-sm font-normal">{membersPluralization}</span>
            </div>
        </section>
    )
}