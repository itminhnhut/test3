import { useTranslation } from 'next-i18next';
import { useRef, useState } from 'react';
import { getInsuranceLoginLink } from 'redux/actions/utils';

const DELAY_TIME = 200;

const useInsuranceLoginLink = ({ params, targetType }) => {
    const timer = useRef();
    const [loading, setLoading] = useState(false);
    const {
        i18n: { language }
    } = useTranslation();
    const onCreatInsuranceLink = (e) => {
        setLoading(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(async () => {
            e.preventDefault();
            await getInsuranceLoginLink({ params, language, targetType });
            setLoading(false);
        }, DELAY_TIME);
    };

    return { onCreatInsuranceLink, loading };
};

export default useInsuranceLoginLink;
