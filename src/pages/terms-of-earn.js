import MadivesLayout from 'components/common/layouts/MaldivesLayout';
import GhostArticle from 'components/screens/GhostArticle';
import { PATH_WITH_GHOST_ARTICLE_ID } from 'constants/constants';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

const index = ({ locale }) => {
    return (
        <MadivesLayout>
            <GhostArticle id={PATH_WITH_GHOST_ARTICLE_ID[locale]['terms-of-earn']} />
        </MadivesLayout>
    );
};

export const getStaticProps = async ({ locale }) => {
    return {
        props: {
            locale,
            ...(await serverSideTranslations(locale, ['404', 'footer', 'navbar', 'common']))
        }
    };
};
export default index;
