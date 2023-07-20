import React, { useRef, useState } from 'react';
import { getInsuranceLoginLink } from 'redux/actions/utils';

const DELAY_TIME = 200;

const useInsuranceLoginLink = () => {
    const timer = useRef();
    const [loading, setLoading] = useState(false);
    const onCreatInsuranceLink = (e) => {
        setLoading(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(async () => {
            e.preventDefault();
            await getInsuranceLoginLink();
            setLoading(false);
        }, DELAY_TIME);
    };

    return { onCreatInsuranceLink, loading };
};

export default useInsuranceLoginLink;
