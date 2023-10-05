import { useEffect, useRef } from 'react';
import { isEmpty, isEqual as isEqualLodash, xorWith } from 'lodash';

const useMemoizeArgs = (args) => {
    const ref = useRef();
    const prevArgs = ref.current;

    const isArrayEqual = (x, y) => isEmpty(xorWith(x, y, isEqualLodash));
    const isEqual = isArrayEqual(prevArgs, args);
    useEffect(() => {
        if (!isEqual) {
            ref.current = args;
        }
    });
    return isEqual ? prevArgs : args;
};
export default useMemoizeArgs;
