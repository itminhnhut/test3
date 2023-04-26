import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import dynamic from 'next/dynamic';
import { PARTNER_WD_TABS, PATHS } from 'constants/paths';
import Spinner from 'components/svg/Spinner';
import { useSelector } from 'react-redux';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import colors from 'styles/colors';
import Custom404 from 'pages/404';
import Image from 'next/dist/client/image';
import Link from 'next/dist/client/link';
import Button from 'components/common/V2/ButtonV2/Button';
import { useTranslation } from 'next-i18next';
import Error404 from 'components/common/404';

const PartnerWD = dynamic(() => import('components/screens/WithdrawDeposit/partner/PartnerWD'), {
    ssr: false
});

const OpenOrderTable = dynamic(() => import('components/screens/WithdrawDeposit/partner/OpenOrderTable'), {
    ssr: false
});

const TabStatistic = dynamic(() => import('components/screens/WithdrawDeposit/partner/TabStatistic'), {
    ssr: false
});

const HistoryOrders = dynamic(() => import('components/screens/WithdrawDeposit/partner/HistoryOrders'), {
    ssr: false
});

const TabCommissionHistory = dynamic(() => import('components/screens/WithdrawDeposit/partner/TabCommissionHistory'), {
    ssr: false
});

const PartnerProfile = dynamic(() => import('components/screens/WithdrawDeposit/partner/Profile'), {
    ssr: false
});

const PartnerDepositWithdraw = ({ id }) => {
    const { user, loadingUser } = useSelector((state) => state.auth);
    const [currentTheme] = useDarkMode();
    return (
        <MaldivesLayout>
            {loadingUser ? (
                <div className="min-h-[50vh] flex w-full justify-center items-center">
                    <Spinner size={50} color={currentTheme === THEME_MODE.DARK ? colors.darkBlue5 : colors.gray['1']} />
                </div>
            ) : user && user.partner_type === 2 ? (
                <PartnerWD>
                    {id === PARTNER_WD_TABS.OPEN_ORDER && <OpenOrderTable />}
                    {id === PARTNER_WD_TABS.STATS && <TabStatistic />}
                    {id === PARTNER_WD_TABS.HISTORY_ORDER && <HistoryOrders />}
                    {id === PARTNER_WD_TABS.PROFILE && <PartnerProfile />}
                    {id === PARTNER_WD_TABS.HISTORY_REFERRAL && <TabCommissionHistory />}
                </PartnerWD>
            ) : (
                <Error404 />
            )}
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
            ...(await serverSideTranslations(context.locale, [
                'common',
                'navbar',
                'modal',
                'wallet',
                'payment-method',
                'dw_partner',
                'reference',
                'transaction-history',
                'futures',
                'table',
                '404'
            ])),
            id
        }
    };
};
