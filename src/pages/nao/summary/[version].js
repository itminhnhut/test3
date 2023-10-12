import React from 'react';
import YearSummary from 'components/screens/Nao/YearSummary';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Version = () => {
    return <YearSummary version="v1" />;
};

export const getServerSideProps = async (context) => {
    return {
        props: {
            ...(await serverSideTranslations(context.locale, ['common', 'nao', 'error']))
        }
    };
};

export default Version;
