import FallBack from '../../assets/images/fallback.png'

export const GroupCard = ({ group, members, img }) => {
    return (
        <section className="flex items-center gap-2">
            <img
                style={{
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    objectFit: "cover",
                }}
                src={img ?? FallBack}
                className="rounded-full w-14 h-14"
                onError={(e) => {
                    e.target.onerror = FallBack;
                    e.target.src = FallBack
                }}
            />
            <div className="flex flex-col items-start gap-1">
                <p className="font-bold text-base">{group}</p>
                <span className="text-sm font-normal">{members} members</span>
            </div>
        </section>
    )
}