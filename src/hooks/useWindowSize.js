import { useEffect, useRef, useState } from 'react';

export function useWindowSize() {
    const [windowSize, setWindowSize] = useState({ width: undefined, height: undefined });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return windowSize;
}

export const useRefWindowSize = () => {
    const windowSizeRef = useRef({ width: undefined, height: undefined });

    useEffect(() => {
        function handleResize() {
            windowSizeRef.current.width = window.innerWidth;
            windowSizeRef.current.height = window.innerHeight;
        }

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return windowSizeRef?.current;
};

export default useWindowSize;
