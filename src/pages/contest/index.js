import React from 'react';
// import Contest from 'components/screens/Nao/Contest/Contest';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { seasons } from 'components/screens/Nao/Contest/Contest';
import dynamic from 'next/dynamic';
const Contest = dynamic(() => import('components/screens/Nao/Contest/Contest'), {
    ssr: false
});

const index = () => {
    const season = seasons.find((season) => season.active);
    return <Contest {...season} />;
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'nao', 'error']))
    }
});

export default index;
