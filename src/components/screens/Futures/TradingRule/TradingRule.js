import React, { useState, useCallback, useMemo, useEffect, useRef, memo } from 'react';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import { Search, X } from 'react-feather';
import { useSelector } from 'react-redux';
import ReTable from 'components/common/ReTable';
import RePagination from 'components/common/ReTable/RePagination';
import useWindowSize from 'hooks/useWindowSize';
import AssetLogo from "components/wallet/AssetLogo";
import { formatNumber, formatPrice, getFilter, getS3Url } from 'redux/actions/utils';
import Tooltip from 'components/common/Tooltip';
import { ExchangeOrderEnum } from 'redux/actions/const';
import TableNoData from 'components/common/table.old/TableNoData';
import Head from 'next/head';

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


const initColumns = [
    {
        title: 'min_order_size',
        tooltip: 'min_order_size_tooltips',
        width: 200,
    },
    {
        title: 'max_order_size_limit',
        tooltip: 'max_order_size_limit_tooltip',
        width: 200,
    },
    {
        title: 'max_order_size_market',
        tooltip: 'max_order_size_market_tooltip',
        width: 250,
    },
    {
        title: 'max_number_order',
        tooltip: 'max_number_order_tooltips',
        width: 200,
    },
    {
        title: 'min_limit_order_price',
        tooltip: 'min_limit_order_price_tooltips',
        width: 200,
    },
    {
        title: 'max_limit_order_price',
        tooltip: 'max_limit_order_price_tooltips',
        width: 200,
    },
    {
        title: 'max_leverage',
        tooltip: 'max_leverage_tooltips',
        width: 180,
    },
    {
        title: 'liq_fee_rate',
        tooltip: 'liq_fee_rate_tooltips',
        width: 180,
    }
]

const limit = 10
const TradingRule = () => {
    const { t } = useTranslation()
    const { width } = useWindowSize()
    const isMobile = width < 820
    const pairConfigs = useSelector((state) => state.futures.pairConfigs);
    const assetConfig = useSelector(state => state.utils.assetConfig);
    const marketWatch = useSelector(state => state.futures.marketWatch);
    const publicSocket = useSelector((state) => state.socket.publicSocket);

    const [tab, setTab] = useState('VNDC');
    const [keyword, setKeyWord] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1)
    }, [tab])

    useEffect(() => {
        if (!publicSocket) return;
        publicSocket.emit('subscribe:futures:ticker', 'all');
        return () => {
            if (publicSocket) publicSocket?.emit('unsubscribe:futures:ticker', 'all');
        };
    }, [publicSocket]);

    const pairConfigsFilter = useMemo(() => {
        return pairConfigs.filter(i => i.quoteAsset === tab)
    }, [tab, pairConfigs])

    const dataSource = useMemo(() => {
        let dataFilter = pairConfigsFilter
        if (keyword) {
            dataFilter = dataFilter?.filter((i) => i?.pair?.toLowerCase().includes(keyword?.toLowerCase()));
        }
        return dataFilter
    }, [pairConfigsFilter, keyword])


    const renderPagination = useCallback(() => {
        if (dataSource?.length === 0) return null;
        return (
            <div className="flex items-center justify-center mt-10 mb-20">
                <RePagination
                    total={dataSource?.length}
                    current={currentPage}
                    pageSize={limit}
                    onChange={(page) => setCurrentPage(page)}
                    name="market_table___list"
                />
            </div>
        );
    }, [dataSource, currentPage]);

    const renderHead = useCallback((title, tooltip) => {
        return (
            <>
                {!isMobile && <Tooltip id={title} place="top" effect="solid" backgroundColor="bg-darkBlue-4"
                    className={`!mx-7 !px-3 !py-5 shadow-onlyLight !bg-white dark:!bg-onus-bg2 !opacity-100 !rounded-lg dark:after:!border-t-onus-bg2 max-w-[200px]`}
                    overridePosition={(e) => ({
                        left: isMobile ? e.left - 20 : e.left - 50,
                        top: e.top
                    })}
                    arrowColor={'transparent'}
                >
                    <div>
                        <label
                            className="font-medium dark:!text-white !text-txtPrimary text-sm leading-[18px]">{t(title)}</label>
                        <div
                            className="mt-3 text-3 font-normal dark:!text-white !text-txtPrimary leading-[18px]">{t(tooltip)}</div>
                    </div>
                </Tooltip>
                }
                <div className="text-sm flex items-center space-x-1 md:space-x-3">
                    <span>{t(title)}</span>
                    {!isMobile && <div className="min-w-[1rem]" data-tip="" data-for={title} id={tooltip}>
                        <img src={getS3Url('/images/icon/ic_help.png')} height={14} width={14} />
                    </div>}
                </div>
            </>
        )
    }, [isMobile])

    const general = (item) => {
        const priceFilter = getFilter(ExchangeOrderEnum.Filter.PRICE_FILTER, item || []);
        const percentPriceFilter = getFilter(ExchangeOrderEnum.Filter.PERCENT_PRICE, item || []);
        const minNotionalFilter = getFilter(ExchangeOrderEnum.Filter.MIN_NOTIONAL, item || []);
        const quantityFilterMarket = getFilter(ExchangeOrderEnum.Filter.MARKET_LOT_SIZE, item || []);
        const maxNumOrderFilter = getFilter(ExchangeOrderEnum.Filter.MAX_NUM_ORDERS, item || []);
        const quantityFilter = getFilter(ExchangeOrderEnum.Filter.LOT_SIZE, item || []);
        return {
            priceFilter, percentPriceFilter, minNotionalFilter, quantityFilterMarket, maxNumOrderFilter, quantityFilter
        }
    }

    const renderContent = (key, item) => {
        const quoteAsset = item?.quoteAsset || '';
        const currentAssetConfig = assetConfig?.find(i => i.assetCode === quoteAsset);
        const lastPrice = marketWatch?.[item?.symbol]?.lastPrice ?? 0
        const {
            priceFilter, percentPriceFilter, minNotionalFilter,
            quantityFilterMarket, maxNumOrderFilter, quantityFilter
        } = general(item)
        const decimal = currentAssetConfig?.assetDigit || 0
        switch (key) {
            case 'min_order_size':
                return formatPrice(minNotionalFilter?.notional,) + ' ' + quoteAsset;
            case 'max_order_size_limit':
                return lastPrice ? formatNumber(quantityFilter?.maxQty * lastPrice, decimal) + ' ' + quoteAsset : '-';
            case 'max_order_size_market':
                return lastPrice ? formatNumber(quantityFilterMarket?.maxQty * lastPrice, decimal) + ' ' + quoteAsset : '-';
            case 'max_number_order':
                return (maxNumOrderFilter?.limit || 0) + ' ' + t('futures:order');
            case 'min_limit_order_price':
                const _minPrice = priceFilter?.minPrice;
                return lastPrice ? formatPrice(Math.max(_minPrice, lastPrice * percentPriceFilter?.multiplierDown), decimal) + ' ' + quoteAsset : '-';
            case 'max_limit_order_price':
                const _maxPrice = priceFilter?.maxPrice;
                return lastPrice ? formatPrice(Math.min(_maxPrice, lastPrice * percentPriceFilter?.multiplierUp), decimal) + ' ' + quoteAsset : '-';
            case 'max_leverage':
                return (item?.leverageConfig?.max || '-') + 'x';
            case 'liq_fee_rate':
                return '1%';
            default:
                return '-';
        }
    };

    const renderLogo = (item) => (
        <div className="flex items-center space-x-3 md:space-x-4 whitespace-nowrap font-semibold md:font-medium">
            <AssetLogo assetId={item?.baseAssetId} size={32} />
            <div>{item?.baseAsset}/{item?.quoteAsset}&nbsp;{t('futures:funding_history_tab:perpetual')}</div>
        </div>
    )

    const onChangeInput = useCallback((e) => {
        setKeyWord(e)
        if (!isMobile) setCurrentPage(1)
    }, [keyword, isMobile])

    const columns = useMemo(() => {
        const cls = [
            {
                key: 'symbol',
                dataIndex: 'symbol',
                title: <span className="text-sm">{t('futures:funding_history_tab:contract')}</span>,
                align: 'left',
                width: 250,
                sorter: false,
                fixed: width >= 992 ? 'none' : 'left',
                render: (data, item) => renderLogo(item)
            }].concat(initColumns.map(c => {
                return {
                    key: c.title,
                    dataIndex: c.title,
                    title: renderHead(`futures:${c.title}`, `futures:${c.tooltip}`),
                    align: 'left',
                    width: c?.width ?? 180,
                    sorter: false,
                    render: (data, item) => <span className="text-sm">{renderContent(c.title, item)}</span>
                }
            }))

        return cls
    }, [dataSource, marketWatch])

    const totalPage = useMemo(() => {
        return Math.ceil(dataSource.length / limit);
    }, [dataSource]);


    return (
        <>
            <Head>
                <meta name="viewport"
                    content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"></meta>
            </Head>
            <MaldivesLayout>
                <div className={'md:pt-10 pt-8'}>
                    <div className="flex items-center justify-between px-4 md:px-5 mb-8">
                        <div className="md:text-[1.625rem] text-xl leading-10 font-semibold">{t('futures:trading_rules')}</div>
                        <div className="flex items-center space-x-3">
                            {CURRENCIES.map((item, index) => (
                                <div key={index}
                                    onClick={() => setTab(item.value)}
                                    className={classNames('rounded-md text-sm leading-6 font-medium cursor-pointer px-4 py-[6px] text-white',
                                        { 'bg-teal ': tab === item.value, 'bg-gray-3 dark:bg-darkBlue-3 text-gray dark:text-darkBlue-5': tab !== item.value })}>
                                    {item.name}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="md:mx-5 px-4 py-8 sm:p-8 lg:p-12 dark:bg-[#071026] rounded-[20px] shadow-funding">
                        <CSearch t={t} onChange={onChangeInput} />
                        <div className="mt-8 md:mt-6">
                            {isMobile ?
                                dataSource.length > 0 ?
                                    <>
                                        <div className='divide-y divide-darkBlue-3'>
                                            {dataSource.map((item, index) => {
                                                const hidden = index + 1 > currentPage * limit
                                                return (
                                                    <div key={index} className={`space-y-2 flex flex-col ${index !== 0 ? 'py-6' : 'pb-6'} ${hidden ? 'hidden' : ''}`}>
                                                        <div>{renderLogo(item)}</div>
                                                        <div className="text-sm font-medium space-y-2 flex flex-col ">
                                                            {initColumns.map(c => (
                                                                <div className="flex items-center justify-between leading-7">
                                                                    <div className="text-darkBlue-5">{renderHead(`futures:${c.title}`, `futures:${c.tooltip}`)}</div>
                                                                    <div>{renderContent(c.title, item)} </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        {totalPage > currentPage &&
                                            <div onClick={() => setCurrentPage(currentPage + 1)}
                                                className="text-teal text-sm font-medium underline text-center cursor-pointer">
                                                {t('futures:load_more')}
                                            </div>
                                        }
                                    </>
                                    :
                                    <TableNoData title={t('common:no_data')} />
                                :
                                <>
                                    <ReTable
                                        // defaultSort={{ key: 'btc_value', direction: 'desc' }}
                                        className="funding-table"
                                        useRowHover
                                        data={dataSource || []}
                                        columns={columns}
                                        rowKey={(item) => item?.key}
                                        loading={!dataSource.length}
                                        scroll={{ x: true }}
                                        // tableStatus={}
                                        tableStyle={{
                                            paddingHorizontal: width >= 768 ? '1.75rem' : '0.75rem',
                                            tableStyle: { minWidth: '1300px !important' },
                                            headerStyle: { paddingTop: '8px' },
                                            rowStyle: {},
                                            shadowWithFixedCol: width < 1366,
                                            noDataStyle: {
                                                minHeight: '480px'
                                            }
                                        }}
                                        paginationProps={{
                                            hide: true,
                                            current: currentPage,
                                            pageSize: limit,
                                            onChange: (currentPage) => setCurrentPage(currentPage)
                                        }}
                                    />
                                    {renderPagination()}
                                </>
                            }
                        </div>
                    </div>
                </div>
            </MaldivesLayout>
        </>
    );
};

const CSearch = memo(({ t, onChange }) => {
    const [keyword, setKeyWord] = useState('');
    const timer = useRef(null)
    const inputRef = useRef(null)

    const onChangeKeyword = (e) => {
        const value = e.target?.value.trim()
        clearTimeout(timer.current)
        timer.current = setTimeout(() => {
            setKeyWord(value)
        }, 500)
    }

    useEffect(() => {
        onChange(keyword)
    }, [keyword])

    return (
        <div className="px-2 py-1.5 rounded-md flex items-center bg-gray-5 dark:bg-darkBlue-3 max-w-[224px]">
            <Search
                size={16}
                strokeWidth={1.2}
                className="text-txtBtnSecondary dark:text-txtSecondary-dark"
            />
            <input
                // value={keyword}
                ref={inputRef}
                onChange={onChangeKeyword}
                placeholder={t('futures:funding_history_tab:find_pair')}
                className="mx-2.5 text-xs flex-grow"
            />
            {keyword && (
                <div className="px-1">
                    <X
                        size={16}
                        strokeWidth={1.2}
                        onClick={() => {
                            inputRef.current?.value = ''
                            setKeyWord('')
                        }}
                        className="text-txtBtnSecondary dark:text-txtSecondary-dark"
                    />
                </div>
            )}
        </div>
    )
})

export default TradingRule;