import { useParams } from "react-router-dom";
import { FeaturedFireIcon, LatestEventsIcon, NewBadgeIcon, TrendingIcon } from "../../../assets/icons/generated";
import { RouteTabs } from "../../../components/global/routetabs"
import { Banner } from "../../../components/global/groupbanner";
import { BannerSkeletons, ButtonSkeletonLoader } from "../../../components/global/skeletons";
import { handleError } from "../../../utils/handleError";
import { toast } from "sonner";
import { Button } from "../../../components/forms/button";
import { talkAmRules } from "../../../constants/talkamrules";
import { RuleCard } from "../../../components/global/rulecard";
import { useAddInterestMutation, useGetSingleCategoryQuery } from "../../../services/userApiSlice";
import * as Icon from "react-feather"

const tabs = [
    {
        id: 0,
        title: "Featured",
        text: "featured",
        icon: <FeaturedFireIcon />
    },
    {
        id: 1,
        title: "Trending",
        text: "trending",
        icon: <TrendingIcon />
    },
    {
        id: 2,
        title: "Just In",
        text: "new",
        icon: <NewBadgeIcon />
    },
];

export const Category = () => {

    const { subCategoryId } = useParams();

    const { data: subCategoryDetails, isLoading } = useGetSingleCategoryQuery(subCategoryId, {
        refetchOnMountOrArgChange: true,
    });
    const [addInterest, { isLoading: addLoading }] = useAddInterestMutation();

    const handleFollowcategory = async () => {
        try {
            const res = await addInterest({ category_id: subCategoryId }).unwrap();
            toast.success(res?.message)
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage)
        }
    }

    return (
        <section className="h-full flex divide-x divide-tgray-xlight">
            {/* left content */}
            <div className="w-full flex flex-col gap-2 md:w-4/6 h-full p-2 md:px-6 md:pt-6">
                <section className="w-full flex flex-col gap-2">
                    {
                        isLoading ?
                            <BannerSkeletons />
                            :
                            <Banner
                                groupCategory={subCategoryDetails?.data.parent_category?.name}
                                banner={subCategoryDetails?.data.background_image}
                                groupCategoryIcon={subCategoryDetails?.data?.icon_image ?? <LatestEventsIcon />}
                            />
                    }
                    <section className="w-full flex items-start flex-col gap-2">
                        <div className="w-full flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <img
                                    src={subCategoryDetails?.data?.icon_image}
                                    className="w-8 h-8 rounded-full bg-tgray-100 bg-opacity-10"
                                    loading="lazy"
                                    style={{
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: "100% 100%",
                                        objectFit: 'cover',
                                        objectPosition: "center",
                                        backgroundPosition: "center"
                                    }}
                                    onError={(e) => {
                                        e.target.onerror = Fallback;
                                        e.target.src = Fallback;
                                    }}
                                />
                                <span>{subCategoryDetails?.data?.name}</span>
                            </div>
                            {
                                isLoading ?
                                    <div className="flex items-end justify-end py-1">
                                        <ButtonSkeletonLoader />
                                    </div>
                                    :
                                    <section className="flex items-end justify-end">
                                        {
                                            !subCategoryDetails?.data?.is_following ?
                                                <Button
                                                    children="Follow"
                                                    leftIcon={!addLoading && <Icon.Plus size={18} />}
                                                    className="!rounded-full !text-sm bg-tprimary-50 !px-4 !py-2.5 font-semiboldNunito"
                                                    onClick={handleFollowcategory}
                                                    isLoading={addLoading}
                                                    disabled={addLoading}
                                                />
                                                :
                                                <Button
                                                    children="Unfollow"
                                                    className="!rounded-full !text-sm !px-4 !py-2.5 font-semiboldNunito"
                                                    onClick={handleFollowcategory}
                                                    isLoading={addLoading}
                                                    disabled={addLoading}
                                                    variant="error"
                                                />
                                        }
                                    </section>
                            }
                        </div>

                        <div>Tags here</div>
                    </section>
                </section>

                <section className="relative overflow-y-auto w-full no-scrollbar">
                    <RouteTabs
                        tabs={tabs}
                    />
                </section>
            </div>

            <section className="w-2/6 p-6 hidden md:block py-4 space-y-8 overflow-y-auto no-scrollbar">
                <section className="flex flex-col gap-8">
                    <header className="flex flex-col gap-3">
                        <h2 className="text-base font-boldNunito leading-none border-b border-tgray-50 py-2">TalkAM Rules</h2>
                        <article className="text-tblack-50 text-sm">
                            Our community fosters respectful dialogue.
                            Be kind, avoid hate speech, and refrain from spamming or sharing personal information.
                        </article>
                    </header>
                    <ul className="flex items-start flex-col gap-4">
                        {talkAmRules.map((rule) => (
                            <RuleCard
                                key={rule.id}
                                rule={rule.rule}
                                text={rule.text}
                            />
                        ))}
                    </ul>
                </section>
            </section>
        </section>
    )
} 