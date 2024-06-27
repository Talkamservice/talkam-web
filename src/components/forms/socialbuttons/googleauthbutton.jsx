import { GoogleIcon } from "../../../assets/icons/generated"
import { Button } from "../button"

export const GoogleAuthButton = ({ onClick }) => {
    return (
        <Button 
            children="Continue with Google"
            fullWidth
            leftIcon={<GoogleIcon />}
            variant="outline"
            className="font-semibold"
            onClick={onClick}
            type="button"
        />
    )
}