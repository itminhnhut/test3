import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import dynamic from 'next/dynamic';
import { PATHS } from 'constants/paths';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import { ALLOWED_ASSET, ALLOWED_ASSET_ID, TYPE_DW } from 'components/screens/WithdrawDeposit/constants';
import { WalletCurrency } from 'utils/reference-utils';

const UserWD = dynamic(() => import('components/screens/WithdrawDeposit/users/UserWD'), {
    ssr: false
});

const CryptoDeposit = dynamic(() => import('components/screens/WithdrawDeposit/users/Crypto/Deposit'), {
    ssr: false
});

const CryptoWithdraw = dynamic(() => import('components/screens/WithdrawDeposit/users/Crypto/Withdraw'), {
    ssr: false
});

const WithdrawDeposit = dynamic(() => import('components/screens/WithdrawDeposit'), {
    ssr: false
});

const DepositToIDEmail = dynamic(() => import('components/screens/WithdrawDeposit/users/DepositToIDEmail'), {
    ssr: false
});

const PartnerDepositWithdraw = ({ type, side, assetId }) => {
    return (
        <MaldivesLayout>
            <UserWD type={type} side={side}>
                {type === TYPE_DW.ID_EMAIL && <DepositToIDEmail assetId={assetId} />}
                {type === TYPE_DW.CRYPTO && (side === SIDE.BUY ? <CryptoDeposit assetId={assetId} /> : <CryptoWithdraw assetId={assetId} />)}
                {type === TYPE_DW.PARTNER && <WithdrawDeposit />}
            </UserWD>
        </MaldivesLayout>
    );
};

export default PartnerDepositWithdraw;

export const getServerSideProps = async (context) => {
    const { type } = context.params;
    const { side, assetId } = context.query;

    const redirectUrl = redirectFormatting(side, assetId, type);

    return {
        ...(redirectUrl ? { redirect: { destination: redirectUrl, permanent: false } } : {}),
        props: {
            ...(await serverSideTranslations(context.locale, [
                'common',
                'navbar',
                'modal',
                'wallet',
                'payment-method',
                'dw_partner',
                'transaction-history',
                'reference',
                'verification'
            ])),
            type,
            side,
            assetId
        }
    };
};

const redirectFormatting = (side = 'BUY', assetId, type) => {

    if (SIDE[side]) {
        if (type === TYPE_DW.PARTNER && ALLOWED_ASSET[+assetId]) {
            return null;
        }
        if (type === TYPE_DW.CRYPTO && WalletCurrency[assetId]) {
            return null;
        }
        if (type === TYPE_DW.ID_EMAIL && WalletCurrency[assetId]) {
            return null;
        }
    }

    let sideFormat = SIDE.BUY;
    let assetIdFormat = type === TYPE_DW.PARTNER ? ALLOWED_ASSET_ID['VNDC'] : 'USDT';

    if (SIDE[side?.toUpperCase()]) {
        sideFormat = side?.toUpperCase();
    }

    if (type === TYPE_DW.PARTNER && ALLOWED_ASSET[+assetId]) {
        assetIdFormat = assetId;
    } else if (type === TYPE_DW.CRYPTO && WalletCurrency[assetId?.toUpperCase()]) {
        assetIdFormat = assetId?.toUpperCase();
    }

    const baseUrl = type === TYPE_DW.CRYPTO ? PATHS.WITHDRAW_DEPOSIT.DEFAULT : PATHS.WITHDRAW_DEPOSIT.PARTNER;

    return type === TYPE_DW.ID_EMAIL ? `${PATHS.WITHDRAW_DEPOSIT.ID_EMAIL}?side=SELL&assetId=${assetIdFormat}` : `${baseUrl}?side=${sideFormat}&assetId=${assetIdFormat}`;
};
