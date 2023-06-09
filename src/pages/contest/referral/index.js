import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { seasons } from 'components/screens/Contest/Referral';
import dynamic from 'next/dynamic';
const Contest = dynamic(() => import('components/screens/Contest/Referral'), {
    ssr: false
});

const index = ({ season }) => {
    return <Contest {...season} />;
};

export const getStaticProps = async ({ locale }) => {
    const season = seasons.find((season) => season.active);
    return {
        props: {
            season: season,
            ...(await serverSideTranslations(locale, ['common', 'nao', 'common', 'navbar', 'wallet', 'error']))
        }
    };
};

export default index;
