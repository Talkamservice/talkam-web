import { useNavigation } from "react-router-dom";

export const useGlobalLoader = () => {
    const { state } = useNavigation();
    const isEnabled = state === 'loading';

    if (isEnabled) {
        return state;
    }

    return null;
};