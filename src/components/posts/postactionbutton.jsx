import { Button } from "../forms/button"
import * as Icon from 'react-feather'

export const PostActionButton = ({ count, handleReaction, reaction }) => {

    return (
        <Button
            variant="outline"
            className="flex items-center gap-2 !text-sm !font-semiboldNunito !text-[#444444] !px-3 !py-2 !rounded-full !border !border-[#D2D2D2]"
            children={count?.toString() ?? '0'}
            leftIcon={<Icon.ThumbsUp fill={reaction === "Like" ? "#017FC8" : "#FFFFFF"} onClick={() => handleReaction("Like")} size={20} />}
            rightIcon={<Icon.ThumbsDown fill={reaction === "Dislike" ? "#FF0000" : "#FFFFFF"} onClick={() => handleReaction("Dislike")} size={20} />}
        />
    )
}