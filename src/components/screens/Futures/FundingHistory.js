import classNames from 'classnames';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import Tab from 'components/common/Tab';
import FundingTab from 'components/screens/Futures/FundingHistoryTabs/FundingTab';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import useWindowSize from 'hooks/useWindowSize';
import { useTranslation } from 'next-i18next';
import { WALLET_SCREENS } from 'pages/wallet';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import colors from 'styles/colors';

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
    const { t } = useTranslation();
    const { width } = useWindowSize();

    const [selectedTab, setSelectedTab] = React.useState(0);
    const [selectedCurrency, setSelectedCurrency] = React.useState(CURRENCIES[0].value);

    const renderScreenTab = useCallback(() => {
        return (
            <Tab
                series={SCREEN_TAB_SERIES}
                currentIndex={selectedTab}
                onChangeTab={(screenIndex) => {
                    const current = SCREEN_TAB_SERIES.find((o) => o?.key === screenIndex);
                    setSelectedTab(current.key);
                }}
                tArr={['common']}
            />
        );
    }, [selectedTab]);

    const renderHeading = () => {
        const selectedClassName = 'text-white bg-primary-500 bg-dominant';
        const unselectedClassName = 'text-primary-500 bg-white bg-opacity-10';
        const defaultClassName =
            'h-[36px] text-center py-[6px] px-4 rounded-lg cursor-pointer hover:opacity-80 text-sm font-normal leading-6';
        return (
            <div className="flex justify-between mb-[40px]">
                <div>
                    <p
                        className={
                            'text-txtPrimary  dark:text-txtPrimary-dark font-semibold leading-[40px] text-[26px]'
                        }
                    >
                        Thông tin
                    </p>
                </div>
                <div className={'flex gap-[6px]'}>
                    {CURRENCIES.map(({ name, value }, index) => {
                        return (
                            <div
                                key={value}
                                onClick={() => setSelectedCurrency(value)}
                                className={classNames(defaultClassName, {
                                    [selectedClassName]: selectedCurrency === value,
                                    [unselectedClassName]: selectedCurrency !== value
                                })}
                            >
                                {name}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <>
            <MaldivesLayout>
                <Background isDark={currentTheme === THEME_MODE.DARK}>
                    <div className={'px-[20px] pt-[40px]'}>
                        {renderHeading()}
                        <div className="mb-[2rem] lg:mb-[3rem]">{renderScreenTab()}</div>
                        {/* Content Tab */}
                        {selectedTab === 0 ? <FundingTab currency={selectedCurrency} /> : null}
                    </div>
                </Background>
            </MaldivesLayout>
        </>
    );
}

const CustomContainer = styled.div.attrs({ className: 'mal-container px-4' })`
    @media (min-width: 1024px) {
        max-width: 1000px !important;
    }

    @media (min-width: 1280px) {
        max-width: 1260px !important;
    }

    @media (min-width: 1440px) {
        max-width: 1400px !important;
    }

    @media (min-width: 1920px) {
        max-width: 1440px !important;
    }
`;

const Background = styled.div.attrs({ className: 'w-full h-full pt-5' })`
    background-color: ${({ isDark }) => (isDark ? colors.darkBlue1 : '#F8F9FA')};
`;

const SCREEN_TAB_SERIES = [
    {
        key: 0,
        code: WALLET_SCREENS.OVERVIEW,
        title: 'Overview',
        localized: 'futures:funding_history:tab_ratio_realtime'
    },
    {
        key: 1,
        code: WALLET_SCREENS.EXCHANGE,
        title: 'Exchange',
        localized: 'futures:funding_history:tab_history'
    }
];
