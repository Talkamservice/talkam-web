
// import { AppleIcon } from "../../../assets/icons/generated"
import { Button } from "../button"

export const TiktokAuthButton = ({ onClick }) => {
    return (
        <Button
            type="button"
            children="Continue with TikTok"
            fullWidth
            // leftIcon={<AppleIcon />}
            variant="outline"
            className="font-semibold bg-[#000000] text-twhite-100"
            onClick={onClick}
        />
    )
}