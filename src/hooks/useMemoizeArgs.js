import { useEffect, useRef } from 'react';

const useMemoizeArgs = (args) => {
    const ref = useRef();
    const prevArgs = ref.current;
    const isEqual = JSON.stringify(prevArgs) === JSON.stringify(args);
    useEffect(() => {
        if (!isEqual) {
            ref.current = args;
        }
    });
    return isEqual ? prevArgs : args;
};
export default useMemoizeArgs;
