import React from 'react';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import dynamic from 'next/dynamic';
import { MODE } from 'components/screens/WithdrawDeposit/constants';
import DetailOrder from 'components/screens/WithdrawDeposit/DetailOrder';

const DetailPartnerOrder = ({ id }) => {
    return (
        <MaldivesLayout>
            <DetailOrder id={id} mode={MODE.PARTNER} />
        </MaldivesLayout>
    );
};
export default DetailPartnerOrder;

export const getServerSideProps = async ({ locale, params }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                'common',
                'navbar',
                'wallet',
                'payment-method',
                'profile',
                'dw_partner',
                '404',
                'footer',
                'transaction-history'
            ])),
            id: params?.id
        }
    };
};
