import { useEffect, useState } from "react";

/** Current timestamp, re-rendering every `intervalMs` — for a "join opens
 *  at X" style gate that needs to flip on its own once the clock reaches a
 *  known time, without waiting on the next unrelated data refetch. */
export const useNow = (intervalMs = 15000) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
};
