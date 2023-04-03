import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';

import dynamic from 'next/dynamic';
import { isEmpty } from 'lodash';
import { PATHS } from 'constants/paths';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import { ALLOWED_ASSET, ALLOWED_ASSET_ID } from 'components/screens/WithdrawDeposit/constants';

const index = () => {
    return null;
};

export default index;

export const getServerSideProps = async (context) => {
    return {
        redirect: {
            destination: PATHS.WITHDRAW_DEPOSIT.DEFAULT,
            permanent: false
        }
    };
};
