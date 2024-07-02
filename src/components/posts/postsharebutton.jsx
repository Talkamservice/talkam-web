import { ShareIcon } from "../../assets/icons/generated"
import { Button } from "../forms/button"

export const PostShareButton = () => {
    return (
        <Button
            variant="outline"
            className="!text-sm !font-medium !text-[#444444] !px-3 !py-2 !rounded-full !border !border-[#D2D2D2]"
            children="Share"
            leftIcon={<ShareIcon />}
        />
    )
}