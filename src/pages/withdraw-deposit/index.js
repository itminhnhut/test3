import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import WithdrawDeposit from 'components/screens/WithdrawDeposit';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';

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
            ...(await serverSideTranslations(context.locale, ['common', 'navbar', 'modal', 'wallet']))
        }
    };
};
