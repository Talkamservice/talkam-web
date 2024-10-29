import { useEffect } from 'react';

export function useOnOutsideClick(ref, handler) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        if (!!handler) handler();
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => {

      document.removeEventListener('click', handleClickOutside);
    };
  }, [ref, handler]);
}