import React from 'react';
import YearSummary from 'components/screens/Nao/YearSummary';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const index = () => {
    return <YearSummary version="v1" />;
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'nao']))
    }
});

export default index;
