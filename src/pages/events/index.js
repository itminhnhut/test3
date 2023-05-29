import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import { NAVBAR_USE_TYPE } from 'src/components/common/NavBar/NavBar';

const EventPage = () => {
    return (
        <MaldivesLayout navMode={NAVBAR_USE_TYPE.FLUENT}>
            <div className="max-w-screen-v3 2xl:max-w-screen-xxl mx-auto">Event page</div>
        </MaldivesLayout>
    );
};

export const getStaticProps = async ({ locale, params, query }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'navbar'])),
            theme: query?.theme || 'dark',
            language: query?.language || 'en',
            params: params
        }
    };
};

export default EventPage;
