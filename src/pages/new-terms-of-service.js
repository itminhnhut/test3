import MadivesLayout from 'components/common/layouts/MaldivesLayout';
import GhostArticle from 'components/screens/GhostArticle';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

const PAGE_ARTICLE_ID = {
    [LANGUAGE_TAG.EN]: '64e7338c7022fbae9d5e3997',
    [LANGUAGE_TAG.VI]: '64e732d37022fbae9d5e3986'
};

const index = ({ locale }) => {
    const { t } = useTranslation('');
    return (
        <MadivesLayout>
            <GhostArticle
                title={<h1 className={`w-full txtPri-4 pt-6 md:pt-20`}>{t('common:terms_and_privacy')}</h1>}
                id={PAGE_ARTICLE_ID[locale]}
            />
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
