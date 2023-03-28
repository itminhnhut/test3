import React from 'react';
// import OrderDetailComponent from 'components/screens/Mobile/Futures/OrderDetail';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';

import dynamic from 'next/dynamic';
import { MODE } from 'components/screens/WithdrawDeposit/constants';

const DetailOrder = dynamic(() => import('components/screens/WithdrawDeposit/DetailOrder'), { ssr: false });

const OrderDetail = ({ id }) => {
    return (
        <MaldivesLayout>
            <DetailOrder id={id} mode={MODE.USER} />
        </MaldivesLayout>
    );
};

export const getServerSideProps = async ({ locale, params }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'navbar', 'wallet', 'payment-method', 'profile', 'dw_partner', '404', 'footer'])),
            id: params?.id
        }
    };
};
export default OrderDetail;
