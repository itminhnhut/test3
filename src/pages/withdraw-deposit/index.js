import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';

import dynamic from 'next/dynamic';
import { isEmpty } from 'lodash';
import { PATHS } from 'constants/paths';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import { ALLOWED_ASSET, ALLOWED_ASSET_ID } from 'components/screens/WithdrawDeposit/constants';

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

const redirectFormatting = (side, assetId) => {
    const defaultDestiny = PATHS.WITHDRAW_DEPOSIT.DEFAULT;
    const defaultSide = SIDE.BUY;
    const defaultAsset = ALLOWED_ASSET_ID['VNDC'];
    const uppercaseSide = side && side?.toUpperCase();
    const defaultUrl = `${defaultDestiny}?side=${defaultSide}&assetId=${defaultAsset}`;

    let redirectObj = { permanent: false };

    // invalid side & invalid assetId
    if (!SIDE[uppercaseSide] && !ALLOWED_ASSET[+assetId])
        return {
            ...redirectObj,
            destination: defaultUrl
        };

    // invalid side
    if (!SIDE[side]) {
        // invalid side but uppercase side valid => redirect to uppercaseSide
        if (SIDE[uppercaseSide]) {
            return {
                ...redirectObj,
                destination: `${defaultDestiny}?side=${uppercaseSide}&assetId=${assetId}`
            };
        }

        // invalid side and uppercase side => redirect to defaultSide
        return {
            ...redirectObj,
            destination: `${defaultDestiny}?side=${defaultSide}&assetId=${assetId}`
        };
    }

    // invalid assetId
    if (!ALLOWED_ASSET[+assetId])
        return {
            ...redirectObj,
            destination: `${defaultDestiny}?side=${uppercaseSide}&assetId=${defaultAsset}`
        };

    return null;
};

export const getServerSideProps = async (context) => {
    const { side, assetId } = context.query;

    const redirectFormat = redirectFormatting(side, assetId);

    return {
        ...(redirectFormat
            ? {
                  redirect: {
                      ...redirectFormat
                  }
              }
            : {}),
        props: {
            ...(await serverSideTranslations(context.locale, ['common', 'navbar', 'modal', 'wallet', 'payment-method', 'dw_partner', 'transaction-history']))
        }
    };
};
