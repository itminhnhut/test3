import React, { Fragment, useCallback, useEffect, useState } from 'react';
import FuturesPageTitle from 'components/screens/Futures/FuturesPageTitle';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import DynamicNoSsr from 'components/DynamicNoSsr';
import { NAVBAR_USE_TYPE } from 'components/common/NavBar/NavBar';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import styled from 'styled-components';
import colors from 'styles/colors';
import { Button } from 'antd';
import { useTranslation } from 'next-i18next';
import Tab from 'components/common/Tab';
import { PATHS } from 'constants/paths';
import { WALLET_SCREENS } from 'pages/wallet';
import { getS3Url, renderName } from 'redux/actions/utils';
import { Column, renderPnl, Table } from '../../Nao/NaoStyle';
import useWindowSize from 'hooks/useWindowSize';
import classNames from 'classnames';
import { Search, X } from 'react-feather';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import Emitter from 'redux/actions/emitter';
import { PublicSocketEvent } from 'redux/actions/const';
import FuturesMarketWatch from 'models/FuturesMarketWatch';
import { useCountdown } from 'hooks/useCountdown';
import ReTable from 'components/common/ReTable';
import AssetLogo from 'components/wallet/AssetLogo';
import { Popover, Transition } from '@headlessui/react';
import Divider from 'components/common/Divider';
import RePagination from 'components/common/ReTable/RePagination';

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

const sortAscending = (arr, key) =>
    arr.sort(function (a, b) {
        return a[key] - b[key];
    });
const sortDescending = (arr, key) =>
    arr.sort(function (a, b) {
        return b[key] - a[key];
    });

const FILTER_OPTS = [
    {
        label: 'futures:funding_history:opt_default',
        index: 0,
        keySort: 'symbol',
        sort: (arr, key) => arr
    },
    {
        label: 'futures:funding_history:opt_contract_a_z',
        index: 1,
        keySort: 'symbol',
        sort: (data, key) => {
            return sortAscending(data, key);
        }
    },
    {
        label: 'futures:funding_history:opt_contract_z_a',
        index: 2,
        keySort: 'symbol',
        sort: (data, key) => {
            return sortDescending(data, key);
        }
    },
    {
        label: 'futures:funding_history:opt_rate_inc',
        index: 3,
        keySort: 'fundingRate',
        sort: (data, key) => {
            return sortAscending(data, key);
        }
    },
    {
        label: 'futures:funding_history:opt_rate_desc',
        index: 4,
        keySort: 'fundingRate',
        sort: (data, key) => {
            return sortDescending(data, key);
        }
    }
];

export default function FundingHistory(props) {
    const [currentTheme] = useDarkMode();
    const { t } = useTranslation();
    const { width } = useWindowSize();

    const marketWatch = useSelector((state) => state.futures?.marketWatch);
    const publicSocket = useSelector((state) => state.socket.publicSocket);
    const allAssetConfig = useSelector((state) => state.utils.assetConfig);
    const allPairConfig = useSelector((state) => state.futures.pairConfigs);

    const [dataTable, setDataTable] = useState([]);
    const [selectedTab, setSelectedTab] = React.useState(0);
    const [selectedCurrency, setSelectedCurrency] = React.useState(CURRENCIES[0].value);
    const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
    const [selectedFilter, setSelectedFilter] = useState(FILTER_OPTS[0]);

    const subscribeFuturesSocket = (pair) => {
        publicSocket.emit('subscribe:futures:ticker' + 'all');
        publicSocket.emit('subscribe:futures:mini_ticker', 'all');
    };

    useEffect(() => {
        if (!publicSocket) return;
        // ? Get Pair Ticker
        subscribeFuturesSocket();
        Emitter.on(PublicSocketEvent.FUTURES_TICKER_UPDATE + 'all', async (data) => {
            console.log('data', data);
        });
        return () => {
            Emitter.off(PublicSocketEvent.FUTURES_TICKER_UPDATE);
        };
    }, [publicSocket]);

    useEffect(() => {
        if (!marketWatch || !allAssetConfig) return;
        const res = Object.entries(marketWatch).map(([value, data]) => {
            const config = allAssetConfig?.find((item) => item.baseAsset === value.assetCode);
            return {
                asset: (
                    <div className="flex items-center">
                        <AssetLogo assetCode={config?.assetCode} size={32} />
                        <div className="ml-2 text-sm">
                            <div className="font-medium text-txtPrimary dark:text-txtPrimary-dark">
                                {data?.baseAsset + '/' + data?.quoteAsset}
                            </div>
                        </div>
                    </div>
                ),
                symbol: data?.baseAsset,
                key: value,
                fundingRate: data.fundingRate,
                fundingTime: data.fundingTime
            };
        });
        const sorted = selectedFilter.sort(res, selectedFilter.keySort);
        setDataTable(sorted);
    }, [marketWatch, selectedFilter]);

    // const allPairConfig =

    const renderScreenTab = useCallback(() => {
        return (
            <Tab
                series={SCREEN_TAB_SERIES}
                currentIndex={selectedTab}
                onChangeTab={(screenIndex) => {
                    const current = SCREEN_TAB_SERIES.find((o) => o?.key === screenIndex);
                    setSelectedTab(current.key);
                    setCurrentPage(1);
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

    const handleChangeFilter = (item) => {
        setSelectedFilter(item);
        setCurrentPage(1);
    };

    const renderSearch = () => {
        return (
            <div className="flex justify-between mb-[40px]">
                <div className="flex gap-6">
                    <div className="flex items-center px-3 py-2 mt-4 rounded-md h-9 lg:mt-0 lg:py-3 lg:px-5 bg-gray-5 dark:bg-darkBlue-4">
                        <Search
                            size={width >= 768 ? 20 : 16}
                            className="text-txtSecondary dark:text-txtSecondary-dark"
                        />
                        <input
                            className="text-sm w-full px-2.5 text-txtSecondary dark:text-txtSecondary-dark"
                            value={selectedSymbol}
                            onChange={(e) => setSelectedSymbol(e?.target?.value)}
                            placeholder={t('common:search')}
                        />
                        {selectedSymbol && (
                            <X
                                size={width >= 768 ? 20 : 16}
                                className="cursor-pointer"
                                onClick={() => setSelectedSymbol('')}
                            />
                        )}
                    </div>
                    <div>
                        <Popover className="relative">
                            {({ open, close }) => (
                                <>
                                    <Popover.Button>
                                        <div className="text-sm px-2 py-1 bg-bgInput dark:bg-bgInput-dark rounded-md flex items-center justify-between min-w-[169px] h-9 text-txtSecondary dark:text-txtSecondary-dark">
                                            {t(selectedFilter.label)}
                                            <img
                                                alt=""
                                                src={getS3Url('/images/nao/ic_arrow_bottom.png')}
                                                height="16"
                                                width="16"
                                            />
                                        </div>
                                    </Popover.Button>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-200"
                                        enterFrom="opacity-0 translate-y-1"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in duration-150"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 translate-y-1"
                                    >
                                        <Popover.Panel className="absolute left-0 z-50 mt-1 rounded-md top-8 bg-nao-bg3">
                                            {FILTER_OPTS.map((item) => {
                                                const { label, index } = item;
                                                return (
                                                    <>
                                                        <div
                                                            key={index}
                                                            onClick={() => {
                                                                handleChangeFilter(item);
                                                                close();
                                                            }}
                                                            className={classNames(
                                                                'cursor-pointer px-3 py-3 min-w-[169px] text-sm shadow-onlyLight font-medium flex flex-col',
                                                                {
                                                                    'text-dominant':
                                                                        selectedFilter.index ===
                                                                        index
                                                                }
                                                            )}
                                                        >
                                                            {t(label)}
                                                        </div>
                                                        <Divider />
                                                    </>
                                                );
                                            })}
                                        </Popover.Panel>
                                    </Transition>
                                </>
                            )}
                        </Popover>
                    </div>
                </div>

                <div>
                    <Link to={''} href={''} className={'underline'}>
                        {t('futures:funding_history:link_overview')}
                    </Link>
                </div>
            </div>
        );
    };

    const [currentPage, setCurrentPage] = useState(1);

    const renderPagination = useCallback(() => {
        if (dataTable?.length === 0) return null;
        return (
            <div className="flex items-center justify-center mt-10 mb-20">
                <RePagination
                    total={dataTable?.length}
                    current={currentPage}
                    pageSize={10}
                    onChange={(currentPage) => setCurrentPage(currentPage)}
                    name="market_table___list"
                />
            </div>
        );
    }, [dataTable, currentPage]);

    const columns = [
        {
            key: 'asset',
            dataIndex: 'asset',
            title: t('futures:funding_history:pair'),
            align: 'left',
            width: 200,
            sorter: false,
            fixed: width >= 992 ? 'none' : 'left'
        },
        {
            key: 'fundingTime',
            dataIndex: 'fundingTime',
            title: t('futures:funding_history:time_left_to_next_funding'),
            align: 'left',
            width: 120,
            sorter: false,
            fixed: width >= 992 ? 'none' : 'left',
            render: (data) => <TimeLeft targetDate={data} />
        },
        {
            key: 'fundingRate',
            dataIndex: 'fundingRate',
            title: t('futures:funding_history:funding_rate'),
            align: 'left',
            width: 120,
            sorter: false,
            fixed: width >= 992 ? 'none' : 'left',
            render: (data, item) => data + '%'
        }
    ];

    return (
        <>
            {renderSearch()}
            <>
                <ReTable
                    // defaultSort={{ key: 'btc_value', direction: 'desc' }}
                    useRowHover
                    data={dataTable || []}
                    columns={columns}
                    rowKey={(item) => item?.key}
                    loading={!dataTable?.length}
                    scroll={{ x: true }}
                    // tableStatus={}
                    tableStyle={{
                        paddingHorizontal: width >= 768 ? '1.75rem' : '0.75rem',
                        tableStyle: { minWidth: '1300px !important' },
                        headerStyle: {},
                        rowStyle: {},
                        shadowWithFixedCol: width < 1366,
                        noDataStyle: {
                            minHeight: '480px'
                        }
                    }}
                    paginationProps={{
                        hide: true,
                        current: currentPage,
                        pageSize: 10,
                        onChange: (currentPage) => setCurrentPage(currentPage)
                    }}
                />
            </>
            {renderPagination()}
        </>
    );
}

export const TimeLeft = ({ targetDate }) => {
    const countDownDate = new Date(targetDate).getTime();
    // const intervalRef = useRef()
    const stopTimer = () => {
        // if (intervalRef.current) clearInterval(intervalRef.current)
    };

    const [countDown, setCountDown] = useState(countDownDate - new Date().getTime());

    useEffect(() => {
        const interval = setInterval(() => {
            setCountDown(countDownDate - new Date().getTime());
        }, 1000);

        return () => clearInterval(interval);
    }, [countDownDate]);

    const getReturnValues = (countDown) => {
        const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
        const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
    };
    const result = getReturnValues(countDown);

    const addPaddingString = (number) => (number.toString().length === 1 ? '0' + number : number);

    return `${addPaddingString(result?.hours)}:${addPaddingString(
        result?.minutes
    )}:${addPaddingString(result?.seconds)}`;
};

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
