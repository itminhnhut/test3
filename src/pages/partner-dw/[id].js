import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import dynamic from 'next/dynamic';
import { PATHS } from 'constants/paths';
import TabStatistic from 'components/screens/WithdrawDeposit/partner/TabStatistic';

const PartnerWD = dynamic(() => import('components/screens/WithdrawDeposit/partner/PartnerWD'), {
    ssr: false
});

const OpenOrderTable = dynamic(() => import('components/screens/WithdrawDeposit/partner/OpenOrderTable'), {
    ssr: false
});
const PartnerDepositWithdraw = ({ id, url }) => {
    return (
        <MaldivesLayout>
            <PartnerWD>
                {url === PATHS.PARNER_WITHDRAW_DEPOSIT.OPEN_ORDER && <OpenOrderTable />}
                {url === PATHS.PARNER_WITHDRAW_DEPOSIT.STATS && <TabStatistic />}
            </PartnerWD>
        </MaldivesLayout>
    );
};

export default PartnerDepositWithdraw;

export const getServerSideProps = async (context) => {
    const { id } = context.params;

    const existedId = Object.values(PATHS.PARNER_WITHDRAW_DEPOSIT).reduce((result, path) => {
        return result || id === path.replace(PATHS.PARNER_WITHDRAW_DEPOSIT.DEFAULT, '');
    }, false);

    const redirectObj = existedId
        ? {}
        : {
              redirect: {
                  destination: PATHS.PARNER_WITHDRAW_DEPOSIT.DEFAULT,
                  permanent: false
              }
          };

    return {
        ...redirectObj,
        props: {
            ...(await serverSideTranslations(context.locale, ['common', 'navbar', 'modal', 'wallet', 'payment-method', 'dw_partner'])),
            id,
            url: context.resolvedUrl
        }
    };
};
