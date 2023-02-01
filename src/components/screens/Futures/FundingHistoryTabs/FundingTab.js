import ListFundingMobile from 'components/screens/Futures/FundingHistoryTabs/components/ListFundingMobile';
import AssetLogo from 'components/wallet/AssetLogo';
import useWindowSize from 'hooks/useWindowSize';
import { useTranslation } from 'next-i18next';
import { useEffect, useState, useMemo, useRef } from 'react';
import { formatNumber } from 'redux/actions/utils';
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
        sort: (arr, key) => arr
    },
    {
        label: 'futures:funding_history_tab:opt_contract_a_z',
        placeholder: 'futures:funding_history_tab:opt_contract_a_z_place',
        index: 1,
        keySort: 'symbol',
        sort: (data, key) => {
            return sortAscending(data, key, true);
        }
    },
    {
        label: 'futures:funding_history_tab:opt_contract_z_a',
        placeholder: 'futures:funding_history_tab:opt_contract_z_a_place',
        index: 2,
        keySort: 'symbol',
        sort: (data, key) => {
            return sortDescending(data, key, true);
        }
    },
    {
        label: 'futures:funding_history_tab:opt_rate_inc',
        placeholder: 'futures:funding_history_tab:opt_rate_inc_place',
        index: 3,
        keySort: 'fundingRate',
        sort: (data, key) => {
            return sortAscending(data, key);
        }
    },
    {
        label: 'futures:funding_history_tab:opt_rate_desc',
        placeholder: 'futures:funding_history_tab:opt_rate_desc_place',
        index: 4,
        keySort: 'fundingRate',
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
    const [selectedFilter, setSelectedFilter] = useState(FILTER_OPTS[0]);

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
            if (data?.q === currency) {
                return [
                    ...pre,
                    {
                        asset: (
                            <div className="flex items-center">
                                <AssetLogo assetCode={data?.b} size={isMobile ? 30 : 32} />
                                <div className="ml-3 lg:ml-4">
                                    <p className="text-base font-semibold lg:font-medium leading-[22px] lg:leading-6 text-txtPrimary dark:text-txtPrimary-dark">
                                        <span>{data?.b}</span>
                                        <span className="text-darkBlue-5">/{data?.q}</span>
                                        <span className="ml-3 lg:ml-4">{t('futures:funding_history_tab:perpetual')}</span>
                                    </p>
                                </div>
                            </div>
                        ),
                        symbol: data?.b,
                        key: data?.b,
                        fundingRate: +formatNumber(data?.r * 100, 0, 4, true),
                        fundingTime: data?.ft,
                        [RETABLE_SORTBY]: {
                            asset: data?.b,
                            fundingRate: +formatNumber(data?.r * 100, 0, 4, true)
                        }
                    }
                ];
            } else return pre;
        }, []);
        setDataTable(selectedFilter.sort(res, selectedFilter.keySort));
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
    }, [currency, selectedFilter]);

    const dataFilter = useMemo(() => {
        if (strSearch) {
            setCurrentPage(1);
            return dataTable.filter((item) => item?.symbol.toLowerCase().includes(strSearch.toLowerCase()));
        }
        return dataTable;
    }, [dataTable, strSearch, currentPage]);

    const columns = useMemo(() => {
        return [
            {
                key: 'asset',
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
                key: 'fundingRate',
                dataIndex: 'fundingRate',
                title: t('futures:funding_history_tab:funding_rate'),
                align: 'right',
                width: '20%',
                fixed: width >= 992 ? 'none' : 'left',
                render: (data, item) => (!item?.isSkeleton ? data + '%' : item?.fundingRate)
            }
        ];
    }, [dataTable, currency, currentPage]);

    return (
        <div className={classNames('mt-2 sm:mt-12 sm:border border-divider-dark rounded-xl', { hidden: !active })}>
            <Tooltip id={'funding'} place="top" effect="solid" isV3 />
            <div className={classNames('sm:px-6 py-4 sm:border-b border-divider-dark sm:flex items-center justify-between', { 'space-y-6 pb-2': isMobile })}>
                <div className={classNames('text-txtSecondary-dark text-xs sm:text-sm space-x-1')}>
                    <span>Funding Rates =</span>
                    <span
                        data-tip={`${t('futures:funding_history_tab:vol_position')} = ${t('furures:order_table:mark_price')} x Số lượng tài sản giao dịch`}
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
                    {isMobile && <FilterTable selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />}
                </div>
            </div>
            {isMobile ? (
                <ListFundingMobile dataTable={dataFilter} currency={currency} loading={isLoading} isSearch={strSearch} />
            ) : (
                <TableV2
                    defaultSort={{ key: 'asset', direction: 'desc' }}
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

const FilterTable = ({ selectedFilter, setSelectedFilter }) => {
    const { t } = useTranslation();
    const popover = useRef(null);

    const handleChangeFilter = (item) => {
        if (setSelectedFilter) setSelectedFilter(item);
        popover.current?.close();
    };

    return (
        <PopoverV2
            ref={popover}
            label={
                <div className="h-11 px-4 py-3 bg-dark-2 rounded-md flex items-center justify-between space-x-2 w-[150px]">
                    <p className="text-sm truncate">{t(selectedFilter.label)}</p>
                    <ChevronDown size={16} />
                </div>
            }
            className="w-max py-2 text-xs !mt-2 z-20"
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
                                    close();
                                }}
                                className={classNames('cursor-pointer px-4 py-2 text-txtSecondary-dark hover:bg-hover-dark', {
                                    '!text-white': selectedFilter.index === index
                                })}
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
