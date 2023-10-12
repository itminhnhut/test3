import { useEffect } from 'react';
import useIsFirstRender from 'hooks/useIsFirstRender';

const useUpdateEffect = (effect, deps) => {
    const isFirst = useIsFirstRender();
    useEffect(() => {
        if (!isFirst) {
            return effect();
        }
    }, deps);
};

export default useUpdateEffect;
