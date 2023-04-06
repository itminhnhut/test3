import React, { useEffect, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import dynamic from 'next/dynamic';
import { PARTNER_WD_TABS, PATHS } from 'constants/paths';
import TabStatistic from 'components/screens/WithdrawDeposit/partner/TabStatistic';
import Spinner from 'components/svg/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { getPartnerProfile } from 'redux/actions/withdrawDeposit';
import PartnerProfile from 'components/screens/WithdrawDeposit/partner/Profile';

const PartnerWD = dynamic(() => import('components/screens/WithdrawDeposit/partner/PartnerWD'), {
    ssr: false
});

const OpenOrderTable = dynamic(() => import('components/screens/WithdrawDeposit/partner/OpenOrderTable'), {
    ssr: false
});

const HistoryOrders = dynamic(() => import('components/screens/WithdrawDeposit/partner/HistoryOrders'), {
    ssr: false
});

const PartnerDepositWithdraw = ({ id }) => {
    const { user, loadingUser } = useSelector((state) => state.auth);
    console.log('user:', user);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPartnerProfile());
    }, []);

    return (
        <MaldivesLayout>
            {loadingUser ? (
                <div className="min-h-[50vh] flex w-full justify-center items-center">
                    <Spinner size={50} />
                </div>
            ) : user && user.partner_type > 0 ? (
                <PartnerWD>
                    {id === PARTNER_WD_TABS.OPEN_ORDER && <OpenOrderTable />}
                    {id === PARTNER_WD_TABS.STATS && <TabStatistic />}
                    {id === PARTNER_WD_TABS.HISTORY_ORDER && <HistoryOrders />}
                    {id === PARTNER_WD_TABS.PROFILE && <PartnerProfile />}
                </PartnerWD>
            ) : (
                <div className="text-3xl font-semibold text-center">Please login on partner account!</div>
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
            ...(await serverSideTranslations(context.locale, ['common', 'navbar', 'modal', 'wallet', 'payment-method', 'dw_partner'])),
            id
        }
    };
};
