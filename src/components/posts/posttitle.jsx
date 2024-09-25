import { forwardRef } from "react"

export const PostTitle = forwardRef(({ isReadingMore, title, side }, ref) => {
    return (
        <p ref={ref}
            className={`${side ? 'text-sm' : 'text-base'} text-tblack-100 font-medium leading-normal transition-all ease-linear duration-300 whitespace-pre-wrap break-words `}
        >
            {title}
        </p>
    )
})