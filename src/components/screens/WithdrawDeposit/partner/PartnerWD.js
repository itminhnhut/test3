import React, { useState } from 'react';
import Container from '../components/common/Container';
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';
import OpenOrderTable from './OpenOrderTable';
import { PATHS } from 'constants/paths';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

const getTabIdFromHref = (path) => path.replace(PATHS.PARNER_WITHDRAW_DEPOSIT.DEFAULT, '');

const TABS = [
    {
        localized: 'Lệnh đang mở',
        key: 1,
        href: PATHS.PARNER_WITHDRAW_DEPOSIT.OPEN_ORDER
    },
    {
        localized: 'Lịch sử lệnh',
        key: 2,
        href: PATHS.PARNER_WITHDRAW_DEPOSIT.HISTORY_ORDER
    },
    {
        localized: 'Thành tựu',
        key: 3,
        href: PATHS.PARNER_WITHDRAW_DEPOSIT.STATS
    },
    {
        localized: 'Thông tin',
        key: 4,
        href: PATHS.PARNER_WITHDRAW_DEPOSIT.PROFILE
    },
    {
        localized: 'Lịch sử chi trả hoa hồng',
        key: 5,
        href: PATHS.PARNER_WITHDRAW_DEPOSIT.HISTORY_REFERRAL
    }
];

const PartnerWD = ({ children }) => {
    const { t } = useTranslation();
    const router = useRouter();
    const { id } = router.query;

    return (
        <div className="px-4 my-20">
            <div className="max-w-screen-v3 mx-auto 2xl:max-w-screen-xxl">
                <h1 className="mb-8 font-semibold text-[32px] leading-[38px] text-gray-15 dark:text-gray-4 tracking-normal">{t('dw_partner:partner')}</h1>
                <Tabs tab={id} className="space-x-6 border-b border-divider dark:border-divider-dark mb-12">
                    {TABS.map((tab) => {
                        const tabId = getTabIdFromHref(tab.href);

                        return (
                            <TabItem
                                isActive={tabId === id}
                                key={tab.href}
                                className={`text-left !px-0 !text-base !w-auto first:ml-4 md:first:ml-0`}
                                value={tabId}
                                onClick={() => {
                                    router.push(tab.href);
                                }}
                            >
                                {tab.localized}
                            </TabItem>
                        );
                    })}
                </Tabs>
                {children}
            </div>
        </div>
    );
};

export default PartnerWD;
