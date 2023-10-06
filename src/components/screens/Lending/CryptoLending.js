import { useState, useEffect } from 'react';

// ** NEXT
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

// ** components
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';

// ** API Context
import { LendingProvider } from 'components/screens/Lending/Context';

// * constants
import { TABS } from 'components/screens/Lending/constants';

// ** third party
import styled from 'styled-components';
import classnames from 'classnames';

// ** Dynamic
const ContentLending = dynamic(() => import('./components/Lending'), { ssr: false });
const ContentLoan = dynamic(() => import('./components/Loan'), { ssr: false });
const ContentHistory = dynamic(() => import('./components/History'), { ssr: false });

const CONTENT = {
    lending: <ContentLending />,
    loan: <ContentLoan />,
    history: <ContentHistory />
};

// ** initData
const initData = {
    tab: 'loan'
};

const TAB_ALLOW = ['lending', 'loan', 'history'];

const CryptoLending = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    // ** useRouter
    const router = useRouter();

    // ** useState
    const [tab, setTab] = useState(initData.tab);

    // ** useEffect
    useEffect(() => {
        const { tab: tabQuery = initData.tab } = router.query;
        if (tab !== tabQuery) {
            setTab(tabQuery);
        }
    }, [router.query]);

    // ** Handle
    const handleTab = (tab) => {
        const { tab: tabQuery = initData.tab } = router.query;
        if (tabQuery) {
            router.push(
                {
                    pathname: router.pathname,
                    query: { tab }
                },
                router.pathname,
                { scroll: false }
            );
        } else {
            setTab(tab);
        }
    };

    //** Render
    const renderTabContent = () => {
        return (
            <TabContent className="mt-8" active={TAB_ALLOW.includes(tab)}>
                {CONTENT?.[tab]}
            </TabContent>
        );
    };

    return (
        <LendingProvider>
            <Tabs isDark tab={tab} className="mt-8 gap-6 border-b border-divider dark:border-divider-dark justify-between">
                <div className="flex flex-row gap-x-6">
                    {TABS?.map((item) => (
                        <TabItem
                            key={item.label?.[language]}
                            className="!text-left !px-0 !text-base "
                            value={item.value}
                            onClick={(isClick) => isClick && handleTab(item.value)}
                            isActive={item.value === tab}
                        >
                            {item.label?.[language]}
                            {/* {item.value === 'loan' && <span className="ml-1">{count.current}</span>} */}
                        </TabItem>
                    ))}
                </div>
                <div className="text-green-3 dark:text-green-2 font-semibold cursor-pointer">{t('lending:tabs:info')}</div>
            </Tabs>
            {renderTabContent()}
        </LendingProvider>
    );
};

const TabContent = styled.div.attrs(({ active, className }) => ({
    className: classnames(className, { hidden: !active })
}))``;

export default CryptoLending;
