import classNames from 'classnames';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import FundingTab from 'components/screens/Futures/FundingHistoryTabs/FundingTab';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { useTranslation } from 'next-i18next';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import colors from 'styles/colors';
import FundingHistoryTable from 'components/screens/Futures/FundingHistoryTabs/FundingHistoryTable';
import useApp from 'hooks/useApp';
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';
import { ChevronLeft } from 'react-feather';
import router from 'next/router';

export const CURRENCIES = [
    {
        name: 'VNDC',
        value: 'VNDC'
    },
    {
        name: 'USDT',
        value: 'USDT'
    }
];

export default function FundingHistory(props) {
    const [currentTheme] = useDarkMode();
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const isApp = useApp();

    const [selectedTab, setSelectedTab] = useState(SCREEN_TAB_SERIES[0].key);
    const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0].value);

    useEffect(() => {
        if (isApp) {
            document.body.classList.add('hidden-scrollbar');
        }
        return () => {
            document.body.classList.remove('hidden-scrollbar');
        };
    }, [isApp]);

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const symbol = urlParams.get('symbol');
        if (symbol && symbol.indexOf(CURRENCIES[1].value) !== -1) setSelectedCurrency(CURRENCIES[1].value);
    }, []);

    const renderTabContent = () => {
        return (
            <>
                <FundingTab currency={selectedCurrency} active={selectedTab === SCREEN_TAB_SERIES[0].key} />
                <FundingHistoryTable isDark={currentTheme === THEME_MODE.DARK} currency={selectedCurrency} active={selectedTab === SCREEN_TAB_SERIES[1].key} />
            </>
        );
    };

    const urlPost =
        language === 'en'
            ? `${process.env.NEXT_PUBLIC_WEB_V1}/support/announcement/announcement/apply-funding-rates-on-nami-futures-and-nao-futures`
            : `${process.env.NEXT_PUBLIC_WEB_V1}/vi/support/faq/noti-vi-thong-bao/ra-mat-co-che-funding-rate-tren-nami-futures-va-nao-futures`;

    return (
        <MaldivesLayout>
            <div className="flex flex-col relative overflow-auto sm_only:max-h-screen">
                {isApp && !router.query?.head && (
                    <div className="p-4 border-b border-divider dark:border-divider-dark sticky top-0 w-full bg-white dark:bg-dark z-20">
                        <ChevronLeft onClick={() => router.back()} className="text-txtPrimary dark:text-white" />
                    </div>
                )}
                <Background isDark={currentTheme === THEME_MODE.DARK}>
                    <div className={'max-w-screen-v3 2xl:max-w-screen-xxl m-auto'}>
                        <div className="text-xl sm:text-[2rem] sm:leading-[2.375rem] font-semibold">{t('futures:information')}</div>
                        <div className="sm:space-x-3 mt-4 sm:mt-6 mb-6 sm:mb-[3.75rem] flex flex-wrap text-sm sm:text-base">
                            <span>{t('futures:funding_history_tab:to_learn_funding')}:</span>
                            <a
                                href={urlPost + (isApp ? '?source=app' : '')}
                                className={'cursor-pointer flex text-sm sm:text-base font-semibold text-teal'}
                                target={isApp ? '_self' : '_blank'}
                            >
                                {t('futures:funding_history_tab:link_overview')}
                            </a>
                        </div>
                        <div className="sm:space-x-12 flex flex-col-reverse sm:flex-row justify-between">
                            <Tabs tab={selectedTab} className="gap-6 border-b border-divider dark:border-divider-dark sm:w-max">
                                {SCREEN_TAB_SERIES?.map((rs) => (
                                    <TabItem key={rs.key} V2 className="!px-0" value={rs.key} onClick={(isClick) => isClick && setSelectedTab(rs.key)}>
                                        {t(rs.localized)}
                                    </TabItem>
                                ))}
                            </Tabs>
                            <div className="flex items-center space-x-4 text-sm sm:text-base mb-4 sm:mb-0">
                                {CURRENCIES.map((rs) => (
                                    <div
                                        key={rs.value}
                                        className={classNames(
                                            'text-txtSecondary dark:text-txtSecondary-dark px-4 py-2 sm:py-3 border border-divider dark:border-divider-dark rounded-full cursor-pointer',
                                            {
                                                '!border-teal !text-teal font-semibold bg-teal/[0.1]': selectedCurrency === rs.value
                                            }
                                        )}
                                        onClick={() => setSelectedCurrency(rs.value)}
                                    >
                                        {rs.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {renderTabContent()}
                    </div>
                </Background>
            </div>
        </MaldivesLayout>
    );
}

const Background = styled.div.attrs({ className: 'w-full h-full px-4 pt-10 sm:pt-20 pb-20 sm:pb-[7.5rem]' })`
    background-color: ${({ isDark }) => (isDark ? colors.dark.dark : '#fff')};
`;

const SCREEN_TAB_SERIES = [
    {
        key: 'funding_rate',
        localized: 'futures:funding_history_tab:tab_ratio_realtime'
    },
    {
        key: 'funding_history',
        localized: 'futures:funding_history_tab:tab_history'
    }
];
