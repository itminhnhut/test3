import { Popover, Transition } from '@headlessui/react';
import classNames from 'classnames';
import Divider from 'components/common/Divider';
import ReTable from 'components/common/ReTable';
import RePagination from 'components/common/ReTable/RePagination';
import ListFundingMobile from 'components/screens/Futures/FundingHistoryTabs/components/ListFundingMobile';
import AssetLogo from 'components/wallet/AssetLogo';
import useDarkMode from 'hooks/useDarkMode';
import useWindowSize from 'hooks/useWindowSize';
import { useTranslation } from 'next-i18next';
import React, { Fragment, useCallback, useEffect, useState, useRef } from 'react';
import { load } from 'react-cookies';
import { isMobile } from 'react-device-detect';
import { Search, X } from 'react-feather';
import { useSelector } from 'react-redux';
import { usePrevious } from 'react-use';
import { formatNumber, getS3Url } from 'redux/actions/utils';
import Skeletor from 'components/common/Skeletor';
import { THEME_MODE } from 'hooks/useDarkMode';
import { RETABLE_SORTBY } from 'components/common/ReTable';

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

const sortAscending = (arr, key, isString) => {
    if (isString) return arr.sort((a, b) => a[key].localeCompare(b[key]));
    return arr.sort(function (a, b) {
        return a[key] - b[key];
    });
};
const sortDescending = (arr, key, isString) => {
    if (isString) return arr.sort((a, b) => b[key].localeCompare(a[key]));
    return arr.sort(function (a, b) {
        return b[key] - a[key];
    });
};

const FILTER_OPTS = [
    {
        label: 'futures:funding_history:opt_default',
        placeholder: 'futures:funding_history:opt_default_place',
        index: 0,
        keySort: 'symbol',
        sort: (arr, key) => arr
    },
    {
        label: 'futures:funding_history:opt_contract_a_z',
        placeholder: 'futures:funding_history:opt_contract_a_z_place',
        index: 1,
        keySort: 'symbol',
        sort: (data, key) => {
            return sortAscending(data, key, true);
        }
    },
    {
        label: 'futures:funding_history:opt_contract_z_a',
        placeholder: 'futures:funding_history:opt_contract_z_a_place',
        index: 2,
        keySort: 'symbol',
        sort: (data, key) => {
            return sortDescending(data, key, true);
        }
    },
    {
        label: 'futures:funding_history:opt_rate_inc',
        placeholder: 'futures:funding_history:opt_rate_inc_place',
        index: 3,
        keySort: 'fundingRate',
        sort: (data, key) => {
            return sortAscending(data, key);
        }
    },
    {
        label: 'futures:funding_history:opt_rate_desc',
        placeholder: 'futures:funding_history:opt_rate_desc_place',
        index: 4,
        keySort: 'fundingRate',
        sort: (data, key) => {
            return sortDescending(data, key);
        }
    }
];

export const DEFAULT_FUNDING_TIME_NULL = '00:00:00';

export default function FundingHistory({ currency }) {
    const [currentTheme] = useDarkMode();
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const { width } = useWindowSize();
    const prevCurrency = usePrevious(currency);

    const [isLoading, setIsLoading] = useState(true);

    const marketWatch = useSelector((state) => state.futures?.marketWatch);
    const publicSocket = useSelector((state) => state.socket.publicSocket);
    const allAssetConfig = useSelector((state) => state.utils.assetConfig);

    const [dataTable, setDataTable] = useState([]);
    const [selectedSymbol, setSelectedSymbol] = useState('');
    const [selectedFilter, setSelectedFilter] = useState(FILTER_OPTS[0]);
    const [filteredDataTable, setFilteredDataTable] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const subscribeFuturesSocket = (pair) => {
        publicSocket.emit('subscribe:futures:ticker' + 'all');
        publicSocket.emit('subscribe:futures:mini_ticker', 'all');
    };

    /**
     * It generates the data table for the funding history page.
     */
    const generateDataTable = () => {
        const marketWatchKies = Object.entries(marketWatch || {});
        const res = marketWatchKies.reduce((pre, currentValue) => {
            const [value, data] = currentValue;
            if (data?.quoteAsset === currency) {
                // const config = allAssetConfig?.find((item) => item?.baseAsset === data?.baseAsset);                // console.log("config", config);
                return [
                    ...pre,
                    {
                        asset: (
                            <div className="flex items-center">
                                <AssetLogo assetCode={data?.baseAsset} size={32} />
                                <div className="ml-3 lg:ml-4">
                                    <p className="text-base font-semibold lg:font-medium leading-[22px] lg:leading-6 text-txtPrimary dark:text-txtPrimary-dark">
                                        {`${data?.baseAsset + '/' + data?.quoteAsset} `}
                                        <span className="ml-2 lg:ml-[5px]">
                                            {t('futures:funding_history:perpetual')}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        ),
                        symbol: data?.baseAsset,
                        key: data?.baseAsset,
                        fundingRate: +formatNumber(data?.fundingRate * 100, 0, 4, true),
                        fundingTime: data?.fundingTime,
                        [RETABLE_SORTBY]: {
                            asset: data?.baseAsset,
                            fundingRate: +formatNumber(data?.fundingRate * 100, 0, 4, true)
                        }
                    }
                ];
            } else return pre;
        }, []);
        // setDataTable(res);
        setDataTable(selectedFilter.sort(res, selectedFilter.keySort));
        setIsLoading(false);
    };

    useEffect(() => {
        if (!publicSocket) return;
        subscribeFuturesSocket();
    }, [publicSocket]);

    useEffect(() => {
        const marketWatchKies = Object.entries(marketWatch || {});
        if (dataTable?.length) return;

        if (!marketWatch || !allAssetConfig || marketWatchKies?.length < 20) return;
        if (currency !== prevCurrency) {
            setIsLoading(true);
            setCurrentPage(1);
        }
        generateDataTable();
        // const res = marketWatchKies.reduce((pre, currentValue) => {
        //     const [value, data] = currentValue;
        //     if (data?.quoteAsset === currency) {
        //         // const config = allAssetConfig?.find((item) => item?.baseAsset === data?.baseAsset);                // console.log("config", config);
        //         return [
        //             ...pre,
        //             {
        //                 asset: (
        //                     <div className="flex items-center">
        //                         <AssetLogo assetCode={data?.baseAsset} size={32} />
        //                         <div className="ml-3 lg:ml-4">
        //                             <p className="text-base font-semibold lg:font-medium leading-[22px] lg:leading-6 text-txtPrimary dark:text-txtPrimary-dark">
        //                                 {`${data?.baseAsset + '/' + data?.quoteAsset} `}
        //                                 <span className="ml-2 lg:ml-[5px]">
        //                                     {t('futures:funding_history:perpetual')}
        //                                 </span>
        //                             </p>
        //                         </div>
        //                     </div>
        //                 ),
        //                 symbol: data?.baseAsset,
        //                 key: data?.baseAsset,
        //                 fundingRate: +formatNumber(data?.fundingRate * 100, 0, 4, true),
        //                 fundingTime: data?.fundingTime,
        //                 [RETABLE_SORTBY]: {
        //                     asset: data?.baseAsset,
        //                     fundingRate: +formatNumber(data?.fundingRate * 100, 0, 4, true)
        //                 }
        //             }
        //         ];
        //     } else return pre;
        // }, []);
        // setDataTable(res);
        // // setDataTable(selectedFilter.sort(res, selectedFilter.keySort));
        // setIsLoading(false);
    }, [marketWatch, currency, prevCurrency, dataTable]);

    useEffect(() => {
        if (prevCurrency !== currency && dataTable?.length) {
            setCurrentPage(1);
            generateDataTable();
        }
    }, [dataTable, prevCurrency, currency]);

    /**
     * It takes in an item, sets the selected filter to that item, and then calls the generateDataTable
     * function
     * @param item - The item that was selected from the dropdown.
     */
    const handleChangeFilter = (item) => {
        generateDataTable();
        setSelectedFilter(item);
        setCurrentPage(1);
    };

    /**
     * It takes a search value, sets the selected symbol to the search value, and then filters the data
     * table based on the search value
     * @param searchValue - The value that the user has entered in the search box.
     * @returns The filtered data table is being returned.
     */
    const handleSearch = (searchValue) => {
        setSelectedSymbol(searchValue);
        if (!searchValue) {
            setFilteredDataTable([]);
        } else {
            const filterData = dataTable.filter(function (item) {
                return item?.symbol.toLowerCase().includes(searchValue.toLowerCase());
            });
            setFilteredDataTable(filterData);
        }
        setCurrentPage(1);
    };

    /**
     * It renders a search bar and a link to the overview page
     * @returns A div with a className of "flex flex-col justify-between mb-8 lg:flex-row lg:mb-[40px]
     * px-4 lg:px-0"
     */
    const renderSearch = () => {
        return (
            <div className="flex flex-col justify-between mb-8 lg:flex-row lg:mb-[40px] px-4 lg:px-0">
                <div className="flex items-center justify-between gap-6 mb-6 lg:mb-0 mb:justify-end">
                    <div className="flex items-center w-[165px] lg:w-[224px] order-2 px-3 rounded-md lg:order-1 h-9 lg:mt-0 lg:px-5  bg-gray-5 dark:bg-darkBlue-4">
                        <Search
                            size={width >= 768 ? 16 : 16}
                            className="text-txtSecondary dark:text-txtSecondary-dark"
                        />
                        <input
                            className="text-sm p-[8px] text-txtSecondary dark:text-txtSecondary-dark"
                            value={selectedSymbol}
                            onChange={(e) => handleSearch(e?.target?.value)}
                            placeholder={t('futures:funding_history:find_pair')}
                        />
                        {selectedSymbol && (
                            <X
                                size={width >= 768 ? 16 : 16}
                                className="cursor-pointer"
                                onClick={() => {
                                    setFilteredDataTable([]);
                                    setSelectedSymbol('');
                                    setCurrentPage(1);
                                }}
                            />
                        )}
                    </div>
                    {isMobile ? (
                        <div>
                            <Popover className="relative order-1 lg:order-2">
                                {({ open, close }) => (
                                    <>
                                        <Popover.Button>
                                            <div className="px-2 bg-bgInput dark:bg-bgInput-dark rounded-md flex items-center justify-between w-[170px] lg:w-[210px] h-9">
                                                <p className="text-sm truncate text-txtSecondary dark:text-txtSecondary-dark">
                                                    {t(selectedFilter.placeholder)}
                                                </p>
                                                <img
                                                    alt=""
                                                    src={getS3Url(
                                                        '/images/nao/ic_arrow_bottom.png'
                                                    )}
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
                                            <Popover.Panel className="absolute left-0 z-50 mt-1 rounded-md top-8 bg-bgInput dark:bg-bgInput-dark">
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
                                                                    'cursor-pointer px-3 py-3 w-[170px] lg:min-w-[210px] text-sm shadow-onlyLight font-medium flex flex-col',
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
                    ) : null}
                </div>
                <div
                    className={
                        'underline cursor-pointer flex text-sm leading-6 text-txtBtnSecondary dark:text-txtBtnSecondary-dark'
                    }
                >
                    {t('futures:funding_history:link_overview')}
                </div>
            </div>
        );
    };

    const renderPagination = useCallback(() => {
        if (dataTable?.length === 0) return null;
        return (
            <div className="flex items-center justify-center mt-8">
                <RePagination
                    fromZero
                    total={filteredDataTable?.length || dataTable?.length}
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
            title: t('futures:funding_history:contract'),
            align: 'left',
            width: '50%',
            // sorter: false,
            fixed: width >= 992 ? 'none' : 'left'
        },
        {
            key: 'fundingTime',
            dataIndex: 'fundingTime',
            title: t('futures:funding_history:time_left_to_next_funding'),
            align: 'left',
            width: '20%',
            preventSort: true,
            /* Telling the table to not sort the data in the column. */
            // sorter: false,
            // sorter:  (a, b) => b.fundingTime - a.fundingTime,
            fixed: width >= 992 ? 'none' : 'left',
            render: (data, item) =>
                !item?.isSkeleton ? renderTimeLeft({ targetDate: data }) : '00:00:00'
        },
        {
            key: 'fundingRate',
            dataIndex: 'fundingRate',
            title: t('futures:funding_history:funding_rate'),
            align: 'left',
            width: '20%',
            fixed: width >= 992 ? 'none' : 'left',
            render: (data, item) => (!item?.isSkeleton ? data + '%' : '-%')
        }
    ];

    const skeletons = [];
    for (let i = 0; i < 10; ++i) {
        skeletons.push({ ...ROW_SKELETON, isSkeleton: true, key: `asset__skeleton__${i}` });
    }

    return (
        <div className="lg:px-12">
            {renderSearch()}
            {isMobile ? (
                <ListFundingMobile
                    dataTable={selectedSymbol ? filteredDataTable : dataTable || []}
                    currency={currency}
                />
            ) : (
                <>
                    <ReTable
                        useRowHover
                        data={
                            selectedSymbol ? filteredDataTable : isLoading ? skeletons : dataTable
                        }
                        sort={!isMobile}
                        defaultSort={{ key: 'symbol', direction: 'asc' }}
                        columns={columns}
                        rowKey={(item) => item?.key}
                        loading={!dataTable?.length || isLoading}
                        scroll={{ x: true }}
                        tableStatus={!!isLoading}
                        tableStyle={{
                            paddingHorizontal: width >= 768 ? '1.75rem' : '0.75rem',
                            tableStyle: {
                                minWidth: '1300px !important',
                                borderRadius: '20px !important'
                            },
                            headerStyle: {
                                fontSize: '0.875rem !important'
                            },
                            rowStyle: {},
                            shadowWithFixedCol: width < 1366,
                            noDataStyle: {
                                minHeight: '480px'
                            }
                        }}
                        className="rounded-[20px]"
                        paginationProps={{
                            hide: true,
                            current: currentPage,
                            pageSize: 10,
                            onChange: (currentPage) => setCurrentPage(currentPage)
                        }}
                    />
                    {renderPagination()}
                </>
            )}
        </div>
    );
}

export const renderTimeLeft = ({ targetDate }) => {
    const countDownDate = new Date(targetDate).getTime();

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

const ROW_SKELETON = {
    asset: <Skeletor width={200} />,
    fundingTime: <Skeletor width={65} />,
    fundingRate: <Skeletor width={65} />
};
