import ListFundingMobile from 'components/screens/Futures/FundingHistoryTabs/components/ListFundingMobile';
import AssetLogo from 'components/wallet/AssetLogo';
import useWindowSize from 'hooks/useWindowSize';
import { useTranslation } from 'next-i18next';
import { useEffect, useState, useMemo, useRef } from 'react';
import { convertSymbol, formatCurrency, formatFundingRateV2, formatNumber, formatVolFundingRateV2 } from 'redux/actions/utils';
import { RETABLE_SORTBY } from 'components/common/ReTable';
import { Countdown } from 'redux/actions/utils';
import FetchApi from 'utils/fetch-api';
import { API_GET_FUTURES_MARKET_WATCH } from 'redux/actions/apis';
import TableV2 from 'components/common/V2/TableV2';
import SearchInput from 'src/components/markets/SearchInput';
import Tooltip from 'components/common/Tooltip';
import classNames from 'classnames';
import ChevronDown from 'components/svg/ChevronDown';
import PopoverV2 from 'components/common/V2/PopoverV2';
import orderBy from 'lodash/orderBy';

const sortDescending = (arr, key, isString) => {
    if (isString) return arr.sort((a, b) => b[key].localeCompare(a[key]));
    return arr.sort(function (a, b) {
        return a[key] - b[key];
    });
};
const sortAscending = (arr, key, isString) => {
    if (isString) return arr.sort((a, b) => a[key].localeCompare(b[key]));
    return arr.sort(function (a, b) {
        return b[key] - a[key];
    });
};

const FILTER_OPTS = [
    {
        label: 'futures:funding_history_tab:opt_order_default_place',
        placeholder: 'futures:funding_history_tab:opt_default_place',
        index: 0,
        keySort: 'symbol',
        direction: '',
        sort: (arr, key) => arr
    },
    {
        label: 'futures:funding_history_tab:opt_contract_a_z',
        placeholder: 'futures:funding_history_tab:opt_contract_a_z_place',
        index: 1,
        keySort: 'symbol',
        direction: 'asc',
        sort: (data, key) => {
            return sortAscending(data, key, true);
        }
    },
    {
        label: 'futures:funding_history_tab:opt_contract_z_a',
        placeholder: 'futures:funding_history_tab:opt_contract_z_a_place',
        index: 2,
        keySort: 'symbol',
        direction: 'desc',
        sort: (data, key) => {
            return sortDescending(data, key, true);
        }
    },
    {
        label: 'futures:funding_history_tab:opt_rate_inc',
        placeholder: 'futures:funding_history_tab:opt_rate_inc_place',
        index: 3,
        keySort: 'funding_rate',
        direction: 'asc',
        sort: (data, key) => {
            return sortAscending(data, key);
        }
    },
    {
        label: 'futures:funding_history_tab:opt_rate_desc',
        placeholder: 'futures:funding_history_tab:opt_rate_desc_place',
        index: 4,
        keySort: 'funding_rate',
        direction: 'desc',
        sort: (data, key) => {
            return sortDescending(data, key);
        }
    }
];

export const DEFAULT_FUNDING_TIME_NULL = '00:00:00';

export default function FundingHistory({ currency, active }) {
    const { t } = useTranslation();
    const { width } = useWindowSize();
    const isMobile = width <= 992;
    const [isLoading, setIsLoading] = useState(true);
    const [marketWatch, setMarketWatch] = useState([]);
    const [dataTable, setDataTable] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [strSearch, setStrSearch] = useState('');
    const [sort, setSort] = useState({ field: 'symbol', direction: '' });

    useEffect(() => {
        FetchApi({
            url: API_GET_FUTURES_MARKET_WATCH
        })
            .then(({ data = [] }) => {
                setMarketWatch(data);
            })
            .catch((err) => console.error(err));
    }, []);

    /**
     * It generates the data table for the funding history page.
     */
    const generateDataTable = () => {
        const marketWatchKies = Object.entries(marketWatch || {});
        const res = marketWatchKies.reduce((pre, currentValue) => {
            const [value, data] = currentValue;
            if (data?.q === convertSymbol(currency)) {
                return [
                    ...pre,
                    {
                        asset: (
                            <div className="flex items-center">
                                <AssetLogo assetCode={data?.b} size={isMobile ? 30 : 32} />
                                <div className="ml-3 lg:ml-4">
                                    <p className="text-base font-semibold lg:font-medium leading-[22px] lg:leading-6 text-txtPrimary dark:text-txtPrimary-dark">
                                        <span>{data?.b}</span>
                                        <span className="text-darkBlue-5">/{currency}</span>
                                        <span className="ml-3 lg:ml-4">{t('futures:funding_history_tab:perpetual')}</span>
                                    </p>
                                </div>
                            </div>
                        ),
                        symbol: data?.b,
                        key: data?.b,
                        fundingRate: +formatNumber(data?.r * 100, 0, 4, true),
                        fundingTime: data?.ft,
                        sellFundingRate: data?.sr ?? 0,
                        totalSellVolume: data?.sv ?? 0,
                        buyFundingRate: data?.br ?? 0,
                        totalBuyVolume: data?.bv ?? 0,
                        [RETABLE_SORTBY]: {
                            asset: data?.b,
                            fundingRate: +formatNumber(data?.r * 100, 0, 4, true)
                        }
                    }
                ];
            } else return pre;
        }, []);
        setDataTable(res);
    };

    const timer = useRef(null);
    useEffect(() => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            setIsLoading(false);
        }, 200);
    }, [dataTable]);

    useEffect(() => {
        if (dataTable?.length) return;
        setIsLoading(true);
        setCurrentPage(1);
        generateDataTable();
    }, [marketWatch]);

    useEffect(() => {
        setCurrentPage(1);
    }, [active]);

    useEffect(() => {
        if (dataTable?.length > 0) {
            setCurrentPage(1);
            generateDataTable();
        }
    }, [currency, sort]);

    const dataFilter = useMemo(() => {
        const _dataTable = [...dataTable];
        if (strSearch) {
            setCurrentPage(1);
            return _dataTable.filter((item) => item?.symbol.toLowerCase().includes(strSearch.toLowerCase()));
        }
        switch (sort.field) {
            case 'volume':
            case 'funding_rate':
                const buyField = sort.field === 'funding_rate' ? 'buyFundingRate' : 'totalBuyVolume';
                const sellField = sort.field === 'funding_rate' ? 'sellFundingRate' : 'totalSellVolume';
                const dataSort = _dataTable.sort((obj1, obj2) => {
                    const A = Math.max(Math.abs(obj1?.[buyField]), Math.abs(obj1?.[sellField]));
                    const B = Math.max(Math.abs(obj2?.[buyField]), Math.abs(obj2?.[sellField]));
                    if (sort.direction === 'asc') return A - B;
                    return B - A;
                });
                return dataSort;
            default:
                return orderBy(_dataTable, [sort.field], [sort.direction]);
        }
    }, [dataTable, strSearch, currentPage, sort]);

    const columns = useMemo(() => {
        return [
            {
                key: 'symbol',
                dataIndex: 'asset',
                title: t('futures:funding_history_tab:contract'),
                align: 'left',
                width: '50%',
                fixed: width >= 992 ? 'none' : 'left'
            },
            {
                key: 'fundingTime',
                dataIndex: 'fundingTime',
                title: t('futures:funding_history_tab:time_left_to_next_funding'),
                align: 'left',
                width: '30%',
                preventSort: true,
                fixed: width >= 992 ? 'none' : 'left',
                render: (data, item) => (data ? <Countdown date={data} onEnded={generateDataTable} /> : '00:00:00')
            },
            {
                key: 'volume',
                dataIndex: 'volume',
                title: `${t('common:volume')} (Long/Short)`,
                align: 'right',
                width: '30%',
                render: (data, item) => <span>{`${formatVolFundingRateV2(item, 'buy')} / ${formatVolFundingRateV2(item, 'sell')}`}</span>
            },
            {
                key: 'funding_rate',
                dataIndex: 'funding_rate',
                title: `${t('futures:funding_history_tab:funding_rate')} (Long/Short)`,
                align: 'right',
                width: '30%',
                render: (data, item) => (
                    <div className="flex items-center justify-end space-x-1">
                        <span className="text-teal">{formatFundingRateV2(item?.buyFundingRate)}</span>
                        <span>/</span>
                        <span className="text-red">{formatFundingRateV2(item?.sellFundingRate)}</span>
                    </div>
                )
            }
        ];
    }, [dataTable, currency, currentPage]);

    const customSort = (asc, field) => {
        setSort({ field, direction: asc ? 'asc' : 'desc' });
    };

    return (
        <div className={classNames('mt-2 sm:mt-12 sm:border border-divider dark:border-divider-dark rounded-xl', { hidden: !active })}>
            <Tooltip id={'funding'} place="top" effect="solid" isV3 className="max-w-[300px]" />
            <div
                className={classNames('sm:px-6 py-4 sm:border-b border-divider dark:border-divider-dark sm:flex items-center justify-between', {
                    'space-y-6 pb-2': isMobile
                })}
            >
                <div className={classNames('text-txtSecondary dark:text-txtSecondary-dark text-xs sm:text-sm space-x-1')}>
                    <span>Funding Rates =</span>
                    <span
                        data-tip={`${t('futures:funding_history_tab:vol_position')} = ${t('futures:order_table:mark_price')} x ${t(
                            'futures:funding_history_tab:amount_of_asset'
                        )}`}
                        data-for={'funding'}
                        className="border-b border-darkBlue-5 border-dashed cursor-pointer"
                    >
                        {t('futures:funding_history_tab:vol_position')}
                    </span>
                    <span>x {t('futures:funding_history_tab:funding_rate2')}</span>
                </div>
                <div className="flex items-center space-x-4">
                    <SearchInput
                        placeholder={t('futures:funding_history_tab:find_pair')}
                        // parentState={setStrSearch}
                        customWrapperStyle={{ minWidth: isMobile ? 0 : 368 }}
                        handleFilterAssetsList={setStrSearch}
                    />
                    {isMobile && <FilterTable sort={sort} setSort={setSort} />}
                </div>
            </div>
            {isMobile ? (
                <ListFundingMobile dataTable={dataFilter} currency={currency} loading={isLoading} isSearch={strSearch} />
            ) : (
                <TableV2
                    cbSort={customSort}
                    useRowHover
                    sort={!isMobile}
                    data={dataFilter}
                    columns={columns}
                    rowKey={(item) => `${item?.key}`}
                    loading={isLoading}
                    limit={10}
                    skip={0}
                    onChangePage={setCurrentPage}
                    page={currentPage}
                    isSearch={strSearch}
                    pagingClassName="border-none"
                />
            )}
        </div>
    );
}

const FilterTable = ({ sort, setSort }) => {
    const { t } = useTranslation();
    const popover = useRef(null);

    const handleChangeFilter = (item) => {
        if (setSort) setSort({ field: item.keySort, direction: item.direction });
        popover.current?.close();
    };

    const rowData = FILTER_OPTS.find((rs) => rs.keySort === sort.field && rs.direction === sort.direction);
    return (
        <PopoverV2
            ref={popover}
            label={
                <div className="h-11 px-4 py-3 bg-gray-12 dark:bg-dark-2 rounded-md flex items-center justify-between space-x-2 w-[150px]">
                    <p className="text-sm truncate">{t(rowData?.label)}</p>
                    <ChevronDown size={16} />
                </div>
            }
            className="w-full py-2 text-xs !mt-2 z-20"
        >
            <div className="flex flex-col">
                {FILTER_OPTS.map((item) => {
                    const { label, index } = item;
                    return (
                        <>
                            <div
                                key={index}
                                onClick={() => {
                                    handleChangeFilter(item);
                                }}
                                className={classNames(
                                    'cursor-pointer px-4 py-2 text-txtSecondary dark:text-txtSecondary-dark hover:bg-hover dark:hover:bg-hover-dark',
                                    {
                                        '!text-txtPrimary dark:!text-white': rowData.index === index
                                    }
                                )}
                            >
                                {t(label)}
                            </div>
                        </>
                    );
                })}
            </div>
        </PopoverV2>
    );
};
