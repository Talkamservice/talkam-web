import { useParams } from "react-router-dom";
import { useGetUserMediaQuery } from "../../../services/posts/postsApiSlice"

export const ProfileMedia = () => {

    const { userId } = useParams();
    const { data: media, isLoading } = useGetUserMediaQuery(userId);

    console.log(media)

    return (
        <div>Media</div>
    )
}