import React, { useState } from 'react';
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';
import { PATHS } from 'constants/paths';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import HrefButton from 'components/common/V2/ButtonV2/HrefButton';

const getTabIdFromHref = (path) => path.replace(PATHS.WITHDRAW_DEPOSIT.DEFAULT, '');

const TABS = [
    {
        localized: 'Crypto',
        key: 1,
        href: PATHS.WITHDRAW_DEPOSIT.DEFAULT,
        value: 'crypto'
    },
    {
        localized: 'dw_partner:partner',
        key: 2,
        href: PATHS.WITHDRAW_DEPOSIT.PARTNER,
        value: 'partner'
    }
];

const UserWD = ({ id, children }) => {
    const { t } = useTranslation();
    const router = useRouter();

    return (
        // Set up Container styled: max-w, text, background
        <div className="px-4 pt-20 pb-[120px] bg-gray-13 dark:bg-dark font-normal text-base text-gray-15 dark:text-gray-4 tracking-normal">
            <div className="max-w-screen-v3 mx-auto 2xl:max-w-screen-xxl">
                <h1 className="mb-8 font-semibold text-[32px] leading-[38px]">{t('dw_partner:Rút tài sản On chain - Qua đối tác')}</h1>

                <div className="relative flex tracking-normal mb-8">
                    <Tabs tab={id} className="gap-8 border-b border-divider dark:border-divider-dark">
                        {TABS?.map((item) => (
                            <TabItem V2 className="!text-left !px-0 !text-base" value={item.value} onClick={(isClick) => isClick && router.push(item.href)}>
                                {t(item.localized)}
                            </TabItem>
                        ))}
                    </Tabs>
                    <div className="absolute right-0">
                        <HrefButton variants="blank" className="w-auto !text-base" href={`/`}>
                            Hướng dẫn Nạp/Rút tài sản
                        </HrefButton>
                    </div>
                </div>
                {children}
            </div>
        </div>
    );
};

export default UserWD;
