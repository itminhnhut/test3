import { useEffect, useRef } from 'react';
import { isEmpty, isEqual, xorWith } from 'lodash';

const useMemoizeArgs = (args) => {
    const ref = useRef();
    const prevArgs = ref.current;
    const isXorWith = (x, y) => isEmpty(xorWith(x, y, isEqual));

    let argsAreEqual = prevArgs?.length !== undefined && args.length === prevArgs.length && isXorWith(prevArgs, args);

    useEffect(() => {
        if (!argsAreEqual) {
            ref.current = args;
        }
    });

    return argsAreEqual ? JSON.stringify(prevArgs) : JSON.stringify(args);
};
export default useMemoizeArgs;
