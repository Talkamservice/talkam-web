import { forwardRef } from "react"

export const PostComment = forwardRef(({ isReadingMore, comment, side }, ref) => {
    return (
        <p ref={ref}
            className={`
            ${ side ? 'text-xs' : 'text-sm' } text-tblack-100 font-normal leading-normal transition-all ease-linear duration-300
            ${ !isReadingMore && 'line-clamp-3' } whitespace-pre-wrap break-words `}
        >
            {comment}
        </p>
    )
})