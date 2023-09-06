import MadivesLayout from 'components/common/layouts/MaldivesLayout';
import InsuranceRules from 'components/screens/Insurance/InsuranceRules';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

const index = () => {
    return (
        <MadivesLayout>
            <InsuranceRules />
        </MadivesLayout>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['navbar', 'footer', 'common', 'futures']))
    }
});

export default index;
