import { ChatSquareIcon } from "../../assets/icons/generated"
import { Button } from "../forms/button"

export const PostCommentCount = ({ count, routeChange }) => {

    let countPluralization;

    if (!count)
        countPluralization = 'Comments'
    if (count > 0) {
        const noun = count > 1 ? 'Comments' : 'Comment';
        countPluralization = noun
    }

    return (
        <Button
            variant="outline"
            className="!text-sm !font-semiboldNunito !text-[#444444] !px-3 !py-2 !rounded-full !border !border-[#D2D2D2]"
            children={`${count ?? 0} ${countPluralization}`}
            leftIcon={<ChatSquareIcon />}
            onClick={routeChange}

        />
    )
}