import { useEffect, useState } from "react"

export const useDebounceValue = (value, time = 250) => {
    const [debounceValue, setDebounceValue] = useState(value)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebounceValue(value)
        }, time)

        return () => {
            clearTimeout(timeout);
        }
    }, [value, time]);

    return debounceValue;
}