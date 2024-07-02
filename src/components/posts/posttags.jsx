export const PostTags = ({ tag, side }) => {
    return (
        <h6 className={` ${side ? "text-[11px] px-2 py-1" : "text-xs px-3 py-2 "} font-medium text-tblack-100 rounded-full border border-[#D2D2D2]`}>{tag}</h6>
    )
}