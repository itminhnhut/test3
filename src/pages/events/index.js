import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import LoadingPage from 'components/screens/Nao_futures/LoadingPage';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import React from 'react';
import { NAVBAR_USE_TYPE } from 'src/components/common/NavBar/NavBar';

const Event = dynamic(() => import('components/screens/Events/Home/Event'), {
    loading: () => <LoadingPage />
});

const EventPage = () => {
    return (
        <MaldivesLayout navMode={NAVBAR_USE_TYPE.FLUENT}>
            <Event />
        </MaldivesLayout>
    );
};

export const getStaticProps = async (ctx) => {
    const { locale, query } = ctx;
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'navbar', 'marketing_events'])),
            theme: query?.theme || 'dark',
            language: query?.language || 'en'
        }
    };
};

export default EventPage;
