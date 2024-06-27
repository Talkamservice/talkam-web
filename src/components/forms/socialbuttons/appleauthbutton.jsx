import { AppleIcon } from "../../../assets/icons/generated"
import { Button } from "../button"

export const AppleAuthButton = () => {
    return (
        <Button 
            children="Continue with Apple"
            fullWidth
            leftIcon={<AppleIcon />}
            variant="outline"
            className="font-semibold bg-[#000000] text-twhite-100"
        />
    )
}