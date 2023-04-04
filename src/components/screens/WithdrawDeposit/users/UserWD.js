import React, { useState } from 'react';
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';
import { PATHS } from 'constants/paths';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import HrefButton from 'components/common/V2/ButtonV2/HrefButton';
import NeedLoginV2 from 'components/common/NeedLoginV2';
import ModalNeedKyc from 'components/common/ModalNeedKyc';
import { useSelector } from 'react-redux';
import { BxsBookIcon } from 'components/svg/SvgIcon';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { TYPE_DW } from '../constants';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import { dwLinkBuilder } from 'redux/actions/utils';

const getLinkSupport = (isVi) =>
    isVi ? 'https://nami.exchange/vi/support/faq/nap-rut-tien-ma-hoa' : 'https://nami.exchange/support/faq/crypto-deposit-withdrawal';

const TABS = [
    {
        localized: 'Crypto',
        key: 1,
        href: PATHS.WITHDRAW_DEPOSIT.DEFAULT,
        value: TYPE_DW.CRYPTO
    },
    {
        localized: 'dw_partner:partner',
        key: 2,
        href: PATHS.WITHDRAW_DEPOSIT.PARTNER,
        value: TYPE_DW.PARTNER
    }
];

const getTitle = (type, side, t) => {
    switch (type) {
        case TYPE_DW.CRYPTO:
            return side === SIDE.BUY ? `${t('common:deposit')} Crypto` : `${t('common:withdraw')} Crypto`;
        case TYPE_DW.PARTNER:
            return side === SIDE.BUY ? t('dw_partner:buy_title') : t('dw_partner:sell_title');
        default:
            return `${t('common:deposit')} Crypto`;
    }
};

const UserWD = ({ type, children, side }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const router = useRouter();
    const auth = useSelector((state) => state.auth.user) || null;

    return (
        // Set up Container styled: max-w, text, background
        <div className="px-4 pt-20 pb-[120px] bg-gray-13 dark:bg-dark font-normal text-base text-gray-15 dark:text-gray-4 tracking-normal">
            {auth && auth?.kyc_status === 2 ? (
                <div className="max-w-screen-v3 mx-auto 2xl:max-w-screen-xxl">
                    <h1 className="mb-8 font-semibold text-[32px] leading-[38px]">{side === SIDE.BUY ? t('common:buy') : t('common:sell')}</h1>

                    <div className="relative flex tracking-normal mb-8">
                        <Tabs tab={type} className="gap-8 border-b border-divider dark:border-divider-dark">
                            {TABS?.map((item) => (
                                <TabItem
                                    V2
                                    className="!text-left !px-0 !text-base select-none"
                                    value={item.value}
                                    onClick={(isClick) => isClick && router.push(dwLinkBuilder(item?.value, side))}
                                >
                                    {t(item.localized)}
                                </TabItem>
                            ))}
                        </Tabs>
                        <div className="absolute right-0">
                            <HrefButton variants="blank" className="w-auto !text-base" href={getLinkSupport(language === 'vi')}>
                                <BxsBookIcon size={16} isButton={true} className="mr-2" />
                                {t('dw_partner:deposit_withdraw_guide')}
                            </HrefButton>
                        </div>
                    </div>
                    {children}
                </div>
            ) : auth && auth?.kyc_status !== 2 ? (
                <></>
            ) : (
                <div className="h-[480px] flex items-center justify-center">
                    <NeedLoginV2 addClass="flex items-center justify-center" />
                </div>
            )}

            <ModalNeedKyc isOpenModalKyc={auth && auth?.kyc_status !== 2} />
        </div>
    );
};

export default UserWD;
