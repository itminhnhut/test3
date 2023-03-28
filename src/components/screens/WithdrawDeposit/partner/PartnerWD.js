import React, { useState } from 'react';
import Container from '../components/common/Container';
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';
import OpenOrderTable from './OpenOrderTable';
import { PATHS } from 'constants/paths';
import { useRouter } from 'next/router';
import Link from 'next/link';

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
    const router = useRouter();
    const { id } = router.query;

    return (
        <Container className="max-w-screen-v3 mx-auto px-4 md:px-0 2xl:max-w-screen-xxl my-20">
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
        </Container>
    );
};

export default PartnerWD;
