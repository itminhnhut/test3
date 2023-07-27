import * as React from 'react';

export const useIsOverflow = (ref, key, callback) => {
    const [isOverflow, setIsOverflow] = React.useState(undefined);

    React.useEffect(() => {
        const { current } = ref;

        const trigger = () => {
            const hasOverflow = current?.[key].offsetHeight < current?.[key].scrollHeight || current?.[key].offsetWidth < current?.[key].scrollWidth;

            setIsOverflow(hasOverflow);

            if (callback) callback(hasOverflow);
        };

        if (current) {
            trigger();
        }
    }, [callback, ref, key]);

    return isOverflow;
};
