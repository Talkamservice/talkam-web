import { ChatSquareIcon } from "../../assets/icons/generated"
import { Button } from "../forms/button"

export const PostCommentCount = ({ count }) => {
    return (
        <Button 
            variant="outline"
            className="!text-sm !font-semiboldNunito !text-[#444444] !px-3 !py-2 !rounded-full !border !border-[#D2D2D2]"
            children={`${ count ?? 0 } Comments`}
            leftIcon={<ChatSquareIcon />}
        />
    )
}