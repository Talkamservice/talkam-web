import { useMemo } from "react";

export const useNumberFormatter = (number, decimal = 2) => {
    return useMemo(() => {
        const formatter = new Intl.NumberFormat('en-US', {
            useGrouping: true,
            minimumFractionDigits: decimal,
            maximumFractionDigits: decimal,
        });
        return formatter.format(number);
    }, [number]);
};