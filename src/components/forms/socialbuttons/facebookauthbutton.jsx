import { FacebookIcon } from "../../../assets/icons/generated"
import { Button } from "../button"

export const FacebookAuthButton = ({ onClick }) => {
    return (
        <Button
            type="button"
            children="Continue with Faceboook"
            fullWidth
            leftIcon={<FacebookIcon />}
            variant="outline"
            className="font-semibold bg-[#1877F2] text-twhite-100"
            onClick={onClick}
        />
    )
}