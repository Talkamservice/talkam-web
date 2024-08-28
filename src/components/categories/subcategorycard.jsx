import { Link } from "react-router-dom"

export const SubCategoryCard = ({ name, followercount, id, type }) => {
    return (
        <Link to={type === "Category" ? `/category/${id}` : `/group/${id}`} className="w-full flex flex-col gap-2 border border-[#E0F1FE] bg-[#F0F9FF] px-3 py-3 rounded-md cursor-pointer">
            <p className="text-sm font-medium whitespace-nowrap truncate">{name}</p>
            <p className="flex items-center gap-1 text-[#888888] text-xs font-medium">
                {followercount} {!followercount ? 'Followers' : followercount > 1 ? "Followers" : "Follower"}
            </p>
        </Link>
    )
}