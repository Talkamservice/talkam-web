import { useParams } from "react-router-dom";
import { useGetUserMediaQuery } from "../../../services/posts/postsApiSlice"
import { EmptyState } from "../../../components/global/emptystate";
import { ImageGridItem } from "../../../components/global/imagegriditem";
import { ImageGridLoader } from "../../../components/global/skeletons";
import EmptyListIcon from "../../../assets/images/emptylist.png"

export const ProfileMedia = () => {

    const { userId } = useParams();
    const { data: media, isLoading } = useGetUserMediaQuery(userId);

    return (
        <section className="w-full md:px-6">
            {
                isLoading ?
                    <ImageGridLoader />
                    :
                    !media?.data.data.length ?
                        <section className="w-full flex items-center justify-center m-auto py-1">
                            <EmptyState
                                icon={EmptyListIcon}
                                height="h-[30px]"
                                width="h-[30px]"
                                text="No media"
                                subtext="When media is added they would appear here"
                            />
                        </section>
                        :
                        <section className="w-full grid grid-cols-3 lg:grid-cols-3 gap-1">
                            {media?.data?.data?.map((item) => (
                                <ImageGridItem
                                    key={item?.id}
                                    src={item.url}
                                />
                            ))}
                        </section>
            }
        </section>
    )
}