import classNames from 'classnames';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import Tab from 'components/common/Tab';
import FundingTab from 'components/screens/Futures/FundingHistoryTabs/FundingTab';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { useTranslation } from 'next-i18next';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import colors from 'styles/colors';
import FundingHistoryTable from 'components/screens/Futures/FundingHistoryTabs/FundingHistoryTable';
import useApp from 'hooks/useApp';

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

    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0].value);

    useEffect(() => {
        if (isApp) {
            document.body.classList.add('hidden-scrollbar');
        }
        return () => {
            document.body.classList.remove('hidden-scrollbar');
        };
    }, [isApp]);

    const renderTabContent = () => {
        return (
            <>
                <FundingTab currency={selectedCurrency} active={selectedTab === 0} />
                <FundingHistoryTable currency={selectedCurrency} active={selectedTab === 1} />
            </>
        );
    };
    return (
        <MaldivesLayout>
            <Background isDark={currentTheme === THEME_MODE.DARK}>
                <div className={''}>
                    <div className="text-xl sm:text-[2rem] sm:leading-[2.375rem] font-semibold">{t('futures:information')} Funding Rates</div>
                    <div className="sm:space-x-3 mt-4 sm:mt-6 mb-6 sm:mb-[3.75rem] flex flex-wrap text-sm sm:text-base">
                        <span>{t('futures:funding_history_tab:to_learn_funding')}:</span>
                        <a
                            href={
                                language === 'en'
                                    ? 'https://nami.exchange/en/support/announcement/announcement/apply-funding-rates-on-nami-futures-and-onus-futures'
                                    : 'https://nami.exchange/vi/support/announcement/thong-bao/thong-bao-ra-mat-co-che-funding-rate-tren-nami-futures-va-onus-futures'
                            }
                            className={'cursor-pointer flex text-sm sm:text-base font-semibold text-teal'}
                            target="_blank"
                        >
                            {t('futures:funding_history_tab:link_overview')}
                        </a>
                    </div>
                    <div className="sm:space-x-12 flex flex-col-reverse sm:flex-row justify-between">
                        <Tab
                            series={SCREEN_TAB_SERIES}
                            currentIndex={selectedTab}
                            onChangeTab={(screenIndex) => {
                                setSelectedTab(screenIndex);
                            }}
                            className="flex items-center justify-center w-full sm:w-max sm:justify-start"
                        />
                        <div className="flex items-center space-x-4 text-sm sm:text-base mb-4 sm:mb-0">
                            {CURRENCIES.map((rs) => (
                                <div
                                    className={classNames('text-txtSecondary-dark px-4 py-2 sm:py-3 border border-divider-dark rounded-full cursor-pointer', {
                                        '!border-teal !text-teal font-semibold bg-teal/[0.1]': selectedCurrency === rs.value
                                    })}
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
        </MaldivesLayout>
    );
}

const Background = styled.div.attrs({ className: 'w-full h-full px-4 pt-10 sm:pt-20 pb-20 sm:pb-[7.5rem] max-w-screen-v3 m-auto' })`
    background-color: ${({ isDark }) => (isDark ? colors.dark.dark : '#F8F9FA')};
`;

const SCREEN_TAB_SERIES = [
    {
        key: 0,
        localized: 'futures:funding_history_tab:tab_ratio_realtime'
    },
    {
        key: 1,
        localized: 'futures:funding_history_tab:tab_history'
    }
];
