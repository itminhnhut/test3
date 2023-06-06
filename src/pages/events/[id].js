import { useRouter } from 'next/dist/client/router';
import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import { NAVBAR_USE_TYPE } from 'components/common/NavBar/NavBar';

const EventDetailPage = ({}) => {
    const { query, isFallback } = useRouter();
    console.log({query})

    return (
        <MaldivesLayout navMode={NAVBAR_USE_TYPE.FLUENT}>
            <div className="max-w-screen-v3 2xl:max-w-screen-xxl mx-auto">{isFallback ? 'loading' : `Event id: ${query?.id}`}</div>
        </MaldivesLayout>
    );
}

export async function getStaticPaths() {
    return {
        paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
        fallback: true // can also be true or 'blocking'
    };
}

export const getStaticProps = async ({ locale, params, query }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'navbar', 'marketing_events'])),
            theme: query?.theme || 'dark',
            language: query?.language || 'en',
            params: params
        }
    };
};

export default EventDetailPage;