import { useMemo } from "react";
import { randomId } from "../helpers/randomid";

export const useTimeOptions = () => {
    const timeLists = useMemo(() => Array(24).fill(null).map((_,i) => i).map(h => {
        return {
            id: randomId(),
            name: `${h < 10 ? '0'+h : h }:00`,
            value: `${h < 10 ? '0'+h : h }:00`
        }
    }).flat(), []);

    return timeLists
}

// ${h < 10 ? '0'+h : h }:30
// ${h < 10 ? '0'+h : h }:30