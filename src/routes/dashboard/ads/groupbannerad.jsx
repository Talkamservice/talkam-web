import { LatestEventsIcon, LockIcon } from "../../../assets/icons/generated";
import { Banner } from "../../../components/global/groupbanner";
import { ColoredLoader } from "../../../components/global/loader";
import { BannerSkeletons } from "../../../components/global/skeletons";
import FallBack from "../../../assets/icons/users.svg"

export const GroupBannerAd = ({ groupDetails, isLoading }) => {

    return (
        <section className="w-full flex flex-col gap-2">
            {
                isLoading ?
                    <BannerSkeletons />
                    :
                    <Banner
                        onRoute={() => navigate(`/category/${groupDetails?.category?.id}`)}
                        groupCategory={groupDetails?.category?.name}
                        banner={groupDetails?.image}
                        groupCategoryIcon={groupDetails?.category?.icon_image ?? <LatestEventsIcon />}
                    />
            }

            <section className="w-full flex flex-col items-start gap-2">
                <section className="w-full flex items-start gap-8">
                    {
                        isLoading ?
                            <section className="w-full flex items-center justify-center py-4">
                                <ColoredLoader />
                            </section>
                            :
                            <section className="w-full flex flex-col gap-2">
                                <header className="flex items-start gap-4">
                                    <section className="flex items-start md:items-center gap-2">
                                        <img
                                            style={{
                                                backgroundSize: "cover",
                                                backgroundRepeat: "no-repeat",
                                                objectFit: "cover",
                                            }}
                                            src={groupDetails?.image ?? FallBack}
                                            className="rounded-full w-12 h-12 bg-tgray-100 bg-opacity-10"
                                            onError={(e) => {
                                                e.target.onerror = FallBack;
                                                e.target.src = FallBack
                                            }}
                                        />
                                        <div className="flex flex-col md:flex-row items-start gap-3">
                                            <div className="flex flex-col items-start">
                                                <div className="flex items-center gap-1">
                                                    <p className="font-medium text-sm md:text-base">{groupDetails?.name}</p>
                                                    {groupDetails?.group_access === "Closed" ? <LockIcon /> : null}
                                                </div>
                                                <span className="text-xs md:text-sm font-bold">
                                                    {groupDetails?.total_members} {!groupDetails?.total_members ? 'members' : groupDetails?.total_members > 1 ? "members" : "member"}
                                                </span>
                                            </div>

                                            <span
                                                className={`w-fit font-normal text-[8px] px-2 py-1 rounded-full bg-[#FDAC0E] cursor-pointer sm:ml-4`}
                                            >
                                                Ad
                                            </span>
                                        </div>
                                    </section>
                                </header>

                                <div className="w-full flex flex-col gap-2">
                                    <article className="w-full text-xs md:text-sm">{groupDetails?.about}</article>
                                </div>
                            </section>
                    }
                </section>
            </section>
        </section>
    )
}