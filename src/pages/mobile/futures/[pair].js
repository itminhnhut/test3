import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { FUTURES_DEFAULT_SYMBOL } from './index';

const FuturesMobileComponent = dynamic(
    () => import('components/screens/Mobile/Futures/Futures'),
    { ssr: false }
);
const FuturesMobile = () => {
    return <FuturesMobileComponent />
};

export const getStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                'common',
                'navbar',
                'trade',
                'futures',
                'wallet',
                'spot',
                'markets'
            ])),
        },
    };
};

export const getStaticPaths = async () => {
    return {
        paths: [{ params: { pair: FUTURES_DEFAULT_SYMBOL } }],
        fallback: true,
    };
};

export default FuturesMobile;
