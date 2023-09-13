import { useState, useCallback } from 'react';

// ** NEXT
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';

// ** components
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';

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

// ** iniData
const iniData = {
    tab: 'lending'
};

const TAB_ALLOW = ['lending', 'loan', 'history'];

const CryptoLending = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const [tab, setTab] = useState(iniData.tab);

    const handleTab = (tab) => setTab(tab);

    const renderTabContent = () => {
        return (
            <TabContent className="mt-8" active={TAB_ALLOW.includes(tab)}>
                {CONTENT?.[tab]}
            </TabContent>
        );
    };

    return (
        <>
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
                            {item.value === 'loan' && <span className="ml-1">(2)</span>}
                        </TabItem>
                    ))}
                </div>
                <div className="text-green-3 dark:text-green-2 font-semibold cursor-pointer">{t('lending:tabs:info')}</div>
            </Tabs>
            {renderTabContent()}
        </>
    );
};

const TabContent = styled.div.attrs(({ active, className }) => ({
    className: classnames(className, { hidden: !active })
}))``;

export default CryptoLending;
