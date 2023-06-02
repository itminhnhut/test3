import { useEffect } from 'react';

const useOnClickOutside = (ref, cb, loading, container) => {
    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target) || loading) {
                return;
            }
            cb(event);
        };
        if (container?.current) {
            container.current.addEventListener('mousedown', listener);
            container.current.addEventListener('touchstart', listener);
        }

        return () => {
            if (container?.current) {
                container.current.removeEventListener('mousedown', listener);
                container.current.removeEventListener('touchstart', listener);
            }
        };
    }, [ref, cb, loading]);
};

export default useOnClickOutside;
