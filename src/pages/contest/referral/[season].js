import React from 'react';
import dynamic from 'next/dynamic';
import { seasons } from 'components/screens/Contest/Referral';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Contest = dynamic(() => import('components/screens/Contest/Referral'), {
    ssr: false
});
const Season = ({ season }) => {
    return <Contest {...season} />;
};

export const getServerSideProps = async (context) => {
    const season = seasons?.find((e) => e.season === Number(context?.params?.season));
    if (!season) return { notFound: true };
    return {
        props: {
            season: season,
            ...(await serverSideTranslations(context.locale, ['common', 'nao', 'common', 'navbar', 'wallet', 'error']))
        }
    };
};

export default Season;
