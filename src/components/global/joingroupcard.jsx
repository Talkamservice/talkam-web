import { Button } from "../forms/button"
import FallBack from '../../assets/images/fallback.png'

export const JoinGroupCard = ({ avatar }) => {
    return (
        <div className="w-full flex items-center justify-between gap-4">
            
            <section className="flex items-center gap-2">
                <img
                    style={{
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        objectFit: "cover",
                    }}
                    src={avatar ?? FallBack}
                    className="rounded-full w-14 h-14"
                    onError={(e) => {
                        e.target.onerror = FallBack;
                        e.target.src = FallBack
                    }}
                />
                <div className="flex flex-col items-start gap-1">
                    <p className="font-bold text-base">Cooking</p>
                    <span className="text-sm font-normal">328 members</span>
                </div>
            </section>

            <Button
                children="Join"
                className="!rounded-full !py-2 !px-4 font-bold "
            />
        </div>
    )
}