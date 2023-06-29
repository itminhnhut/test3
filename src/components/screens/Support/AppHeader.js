import useApp from 'hooks/useApp';
import useUpdateEffect from 'hooks/useUpdateEffect';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { ChevronLeft } from 'react-feather';

const AppHeader = ({ topic, title }) => {
    const router = useRouter();
    const isApp = useApp();
    const [history, setHistory] = useState(router.asPath);

    // useUpdateEffect(() => {
    //     setHistory(router.asPath);
    // }, [router?.query]);

    if ((!isApp || history === router.asPath) && !router.query?.alb) return null;
    return (
        <div onClick={router?.back} className="active:text-dominant flex items-center px-4 pt-4 pb-2 text-sm font-medium">
            <ChevronLeft size={16} className="mr-2.5" />
            {topic}
            {topic && <span className="mx-2">|</span>}
            {title}
        </div>
    );
};

export default AppHeader;
