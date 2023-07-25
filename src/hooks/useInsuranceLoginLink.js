import { useTranslation } from 'next-i18next';
import React, { useRef, useState } from 'react';
import { getInsuranceLoginLink } from 'redux/actions/utils';

const DELAY_TIME = 200;

const useInsuranceLoginLink = ({ params, targetType }) => {
    const timer = useRef();
    const [loading, setLoading] = useState(false);
    const onCreatInsuranceLink = (e) => {
        setLoading(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(async () => {
            e.preventDefault();
            await getInsuranceLoginLink({ params, targetType });
            setLoading(false);
        }, DELAY_TIME);
    };

    return { onCreatInsuranceLink, loading };
};

export default useInsuranceLoginLink;
