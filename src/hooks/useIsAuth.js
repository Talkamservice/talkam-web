import { useSelector } from "react-redux"
import { selectCurrentToken } from "../services/authSlice"

export const useIsAuth = () => {

    const token = useSelector(selectCurrentToken);

    if (token) {
        return true;
    } else {
        return false
    };
};