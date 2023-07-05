import React from 'react';
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';
import { PATHS } from 'constants/paths';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const getTabIdFromHref = (path) => path.replace(PATHS.PARTNER_WITHDRAW_DEPOSIT.DEFAULT, '');

const TABS = [
    {
        localized: 'dw_partner:pending_transaction',
        key: 1,
        href: PATHS.PARTNER_WITHDRAW_DEPOSIT.OPEN_ORDER
    },
    {
        localized: 'dw_partner:transaction_history',
        key: 2,
        href: PATHS.PARTNER_WITHDRAW_DEPOSIT.HISTORY_ORDER
    },
    {
        localized: 'dw_partner:achievement',
        key: 3,
        href: PATHS.PARTNER_WITHDRAW_DEPOSIT.STATS
    },
    {
        localized: 'dw_partner:information',
        key: 4,
        href: PATHS.PARTNER_WITHDRAW_DEPOSIT.PROFILE
    },
    {
        localized: 'dw_partner:commission_history',
        key: 5,
        href: PATHS.PARTNER_WITHDRAW_DEPOSIT.HISTORY_REFERRAL
    }
];

const PartnerWD = ({ children }) => {
    const { t } = useTranslation();
    const router = useRouter();
    const { id } = router.query;

    return (
        // Set up Container styled: max-w, text, background
        <div className="px-4 pt-20 pb-[120px] bg-gray-13 dark:bg-dark font-normal text-base text-gray-15 dark:text-gray-4 tracking-normal">
            <div className="max-w-screen-v3 mx-auto 2xl:max-w-screen-xxl">
                <h1 className="mb-8 font-semibold text-[32px] leading-[38px] text-gray-15 dark:text-gray-4 tracking-normal">{t('dw_partner:partner_title')}</h1>
                <Tabs tab={id} className="space-x-6 border-b border-divider dark:border-divider-dark mb-8">
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
                                {t(tab.localized)}
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
