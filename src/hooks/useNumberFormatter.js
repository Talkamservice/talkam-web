import { useMemo } from "react";

export const useNumberFormatter = (number) => {
    return useMemo(() => {
        const formatter = new Intl.NumberFormat('en-US', {
            useGrouping: true,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        return formatter.format(number);
    }, [number]);
};