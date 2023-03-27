import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';

import dynamic from 'next/dynamic';

const PartnerWD = dynamic(() => import('components/screens/WithdrawDeposit/partner/PartnerWD'), {
    ssr: false
});

const index = () => {
    return (
        <MaldivesLayout>
            <PartnerWD />
        </MaldivesLayout>
    );
};

export default index;

export const getServerSideProps = async (context) => {
    return {
        props: {
            ...(await serverSideTranslations(context.locale, ['common', 'navbar', 'modal', 'wallet', 'payment-method', 'dw_partner']))
        }
    };
};
