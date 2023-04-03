import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import dynamic from 'next/dynamic';
import { PATHS } from 'constants/paths';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import { ALLOWED_ASSET, ALLOWED_ASSET_ID } from 'components/screens/WithdrawDeposit/constants';

const UserWD = dynamic(() => import('components/screens/WithdrawDeposit/users/UserWD'), {
    ssr: false
});

const CryptoDeposit = dynamic(() => import('components/screens/WithdrawDeposit/users/Crypto/Deposit'), {
    ssr: false
});

const PartnerDepositWithdraw = ({ type, url, side }) => {
    return (
        <MaldivesLayout>
            <UserWD id={type}>
                {type === 'crypto' && (side === SIDE.BUY ? <CryptoDeposit /> : <>CryptoWithdraw</>)}
                {type === 'partner' && (side === SIDE.BUY ? <>PartnerBuy</> : <>PartnerSell</>)}
                {/* {url === PATHS.WITHDRAW_DEPOSIT.PARTNER && <div>DW partner</div>} */}
            </UserWD>
        </MaldivesLayout>
    );
};

export default PartnerDepositWithdraw;

const redirectFormatting = (side, assetId, baseUrl) => {
    // console.log('____here: ', type);

    // const existedId = Object.values(PATHS.WITHDRAW_DEPOSIT).reduce((result, path) => {
    //     return result || path.includes(type);
    // }, false);

    // const redirectObj = existedId
    //     ? {}
    //     : {
    //           redirect: {
    //               destination: PATHS.WITHDRAW_DEPOSIT.DEFAULT,
    //               permanent: false
    //           }
    //       };

    const defaultDestiny = PATHS.WITHDRAW_DEPOSIT.DEFAULT;
    const defaultSide = SIDE.BUY;
    const defaultAsset = ALLOWED_ASSET_ID['VNDC'];
    const uppercaseSide = side && side?.toUpperCase();
    // let defaultUrl;
    // defaultUrl = existedId
    const defaultUrl = `${baseUrl}?side=${defaultSide}&assetId=${defaultAsset}`;

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
    const { type } = context.params;
    const { side, assetId } = context.query;
    const baseUrl = context.resolvedUrl.split('?')[0];
    console.log('baseUrl: ', baseUrl);

    return {};

    const redirectFormat = redirectFormatting(side, assetId, baseUrl);

    return {
        ...(redirectFormat
            ? {
                  redirect: {
                      ...redirectFormat
                  }
              }
            : {}),
        props: {
            ...(await serverSideTranslations(context.locale, ['common', 'navbar', 'modal', 'wallet', 'payment-method', 'dw_partner'])),
            type,
            url: context.resolvedUrl,
            side,
            context: context
        }
    };
};
