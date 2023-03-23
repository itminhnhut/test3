import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';

import dynamic from 'next/dynamic';

const WithdrawDeposit = dynamic(() => import('components/screens/WithdrawDeposit'), {
    ssr: false
});
const index = () => {
    return (
        <MaldivesLayout>
            <WithdrawDeposit />
        </MaldivesLayout>
    );
};

export default index;

export const getServerSideProps = async (context) => {
    return {
        props: {
            ...(await serverSideTranslations(context.locale, ['common', 'navbar', 'modal', 'wallet','payment-method']))
        }
    };
};
