import { useEffect } from 'react';

// Add ref and handler to effect dependencies
// It's worth noting that because passed in handler is a new ...
// ... function on every render that will cause this effect ...
// ... callback/cleanup to run every render. It's not a big deal ...
// ... but to optimize you can wrap handler in useCallback before ...
// ... passing it into this hook.

export function useOnOutsideClick(ref, handler) {
  useEffect(() => {
    ///Close the parent if clicked outside
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        if (!!handler) handler();
      }
    }
    // Bind the event listener
    document.addEventListener('click', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('click', handleClickOutside);
    };
  }, [ref, handler]);
}