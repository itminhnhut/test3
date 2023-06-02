import React from 'react';
import dynamic from 'next/dynamic';
const MarketComponent = dynamic(() => import('components/screens/MarketV2/Market'),
    { ssr: false })
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Market = () => {
    return <MarketComponent />
};

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...await serverSideTranslations(locale, ['common', 'navbar', 'table', 'futures', 'markets']),
        },
    };
}

export default Market;