import { Button } from "../forms/button"
import * as Icon from 'react-feather'

export const PostActionButton = ({ count }) => {
    return (
        <Button
            variant="outline"
            className="flex items-center gap-2 !text-sm !font-semiboldNunito !text-[#444444] !px-3 !py-2 !rounded-full !border !border-[#D2D2D2]"
            children={count ?? '0'}
            leftIcon={<Icon.ThumbsUp size={20} />}
            rightIcon={<Icon.ThumbsDown size={20} />}
        />
    )
}