import { useEffect } from 'react';

const useOnClickOutside = (ref, cb, loading) => {
    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target) || loading) {
                return;
            }
            cb(event);
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, cb, loading]);
};

export default useOnClickOutside;
