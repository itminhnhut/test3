import * as React from 'react';

const useIsOverflow = (ref, key, callback) => {
    const [isOverflow, setIsOverflow] = React.useState(undefined);

    React.useLayoutEffect(() => {
        const { current } = ref;

        const trigger = () => {
            console.log('isOverflow', current?.[key].offsetHeight, current?.[key].scrollHeight);

            const hasOverflow = current?.[key].offsetHeight < current?.[key].scrollHeight || current?.[key].offsetWidth < current?.[key].scrollWidth;

            setIsOverflow(hasOverflow);

            if (callback) callback(hasOverflow);
        };

        if (current) {
            trigger();
        }
    }, [callback, ref, key]);

    console.log('isOverflow', isOverflow);
    return isOverflow;
};

export default useIsOverflow;
