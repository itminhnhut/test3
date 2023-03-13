import React, { useState, useEffect } from 'react';
import useIsomorphicLayoutEffect from 'hooks/useIsomorphicLayoutEffect';

const useLockedBody = (lock = false, rootId = 'root') => {
    const [locked, setLocked] = useState(lock);
    useIsomorphicLayoutEffect(() => {
        if (!locked) {
            return;
        }

        const originalOverflow = document.body.style.overflow;
        const originalPaddingRight = document.body.style.paddingRight;

        document.body.style.overflow = 'hidden';

        const root = document.getElementById(rootId); // or root
        const scrollBarWidth = root ? root.offsetWidth - root.scrollWidth : 0;

        if (scrollBarWidth) {
            document.body.style.paddingRight = `${scrollBarWidth}px`;
        }

        return () => {
            document.body.style.overflow = originalOverflow;

            if (scrollBarWidth) {
                document.body.style.paddingRight = originalPaddingRight;
            }
        };
    }, [locked]);

    useEffect(() => {
        if (locked !== lock) {
            setLocked(lock);
        }
    }, [lock]);

    return [locked, setLocked];
};

export default useLockedBody;
