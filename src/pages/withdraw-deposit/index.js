import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';

import dynamic from 'next/dynamic';
import { isEmpty } from 'lodash';
import { PATHS } from 'constants/paths';
import { SIDE } from 'redux/reducers/withdrawDeposit';

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
    const redirectObj = isEmpty(context.query)
        ? {
              redirect: {
                  destination: `${PATHS.WITHDRAW_DEPOSIT.DEFAULT}?side=${SIDE.BUY}&assetId=72`,
                  permanent: false
              }
          }
        : {};

    return {
        ...redirectObj,
        props: {
            ...(await serverSideTranslations(context.locale, ['common', 'navbar', 'modal', 'wallet', 'payment-method']))
        }
    };
};
