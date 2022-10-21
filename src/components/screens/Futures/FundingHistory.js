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
import FundingHistoryTable from 'components/screens/Futures/FundingHistoryTabs/FundingHistoryTable';
import { TAB_TYPE } from '../../common/Tab';
import { isMobile } from 'react-device-detect';
import LayoutMobile from 'components/common/layouts/LayoutMobile';

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
                type={TAB_TYPE.TYPE1}
                isBorderBottom={false}
                itemClassName='!font-semibold '
            />
        );
    }, [selectedTab]);

    const renderHeading = () => {
        const selectedClassName = 'text-white bg-primary-500 bg-dominant font-semibold';
        const unselectedClassName =
            'text-txtSecondary dark:text-txtSecondary-dark bg-bgButtonDisabled dark:bg-bgButtonDisabled-dark font-normal';
        const defaultClassName =
            'h-[36px] text-center py-[6px] px-4 rounded-lg cursor-pointer hover:opacity-80 text-[12px] lg:text-sm font-normal !leading-6';
        return (
            <div className="flex justify-between mb-[40px] px-4 items-center">
                <div>
                    <p
                        className={
                            'text-txtPrimary  dark:text-txtPrimary-dark font-semibold leading-[40px] text-[20px] lg:text-[26px]'
                        }
                    >
                        {t('futures:funding_history_tab:information')}
                    </p>
                </div>
                <div className={'flex lg:gap-[6px] gap-3'}>
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

    const Wrapper = isMobile ? MaldivesLayout : MaldivesLayout;

    return (
            <Wrapper>
                <Background isDark={currentTheme === THEME_MODE.DARK}>
                    <div className={'lg:pt-10 pt-[34px]'}>
                        {renderHeading()}
                        <div className="px-4">{renderScreenTab()}</div>
                        {/* Content Tab */}
                        <div
                            className="rounded-[20px] pt-[2rem] lg:pt-[3rem] lg:mx-4 pb-12  lg:pb-8"
                            style={{
                                backgroundColor:
                                    currentTheme === THEME_MODE.DARK ? '#071026' : '#FCFCFC'
                            }}
                        >
                            {selectedTab === 0 ? <FundingTab currency={selectedCurrency} /> : <FundingHistoryTable currency={selectedCurrency} />}                        </div>
                    </div>
                </Background>
            </Wrapper>
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
    font-family: "Barlow", sans-serif;
`;

const SCREEN_TAB_SERIES = [
    {
        key: 0,
        code: WALLET_SCREENS.OVERVIEW,
        title: 'Overview',
        localized: 'futures:funding_history_tab:tab_ratio_realtime'
    },
    {
        key: 1,
        code: WALLET_SCREENS.EXCHANGE,
        title: 'Exchange',
        localized: 'futures:funding_history_tab:tab_history'
    }
];
