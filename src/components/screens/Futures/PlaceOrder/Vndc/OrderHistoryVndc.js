import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Share2 } from 'react-feather';

import DataTable from 'react-data-table-component';
import fetchApi from 'utils/fetch-api';
import { API_GET_FUTURES_ORDER, API_GET_FUTURES_ORDER_HISTORY } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import Skeletor from 'src/components/common/Skeletor';
import { formatNumber, formatTime, getLoginUrl, getPriceColor, getS3Url, countDecimals } from 'redux/actions/utils';
import { getRatioProfit, renderCellTable, VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import FuturesTimeFilter2 from 'components/screens/Futures/TradeRecord/FuturesTimeFilter2';
import { FilterTradeOrder } from 'components/screens/Futures/FilterTradeOrder';
import { tableStyle } from 'config/tables';
import { useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';
import ShareFuturesOrder from 'components/screens/Futures/ShareFuturesOrder';
import Adjustmentdetails from 'components/screens/Futures/PlaceOrder/Vndc/Adjustmentdetails';
import TableNoData from 'components/common/table.old/TableNoData';
import Link from 'next/link';
import TableV2 from 'components/common/V2/TableV2'
import FuturesRecordSymbolItem from 'components/screens/Futures/TradeRecord/SymbolItem';
import OrderProfit from 'components/screens/Futures/TradeRecord/OrderProfit';
import OrderStatusLabel from 'components/screens/Futures/OrderStatusLabel'
import _ from 'lodash';

const FuturesOrderHistoryVndc = ({ pairPrice, pairConfig, onForceUpdate, hideOther, isAuth, onLogin, pair }) => {
    const { t, i18n: { language } } = useTranslation()
    const assetConfig = useSelector(state => state.utils.assetConfig);
    const allPairConfigs = useSelector((state) => state.futures.pairConfigs);
    const [dataSource, setDataSource] = useState([])
    const [loading, setLoading] = useState(false)
    const [shareOrder, setShareOrder] = useState(null)
    const [resetPage, setResetPage] = useState(false);
    const darkMode = useSelector(state => state.user.theme === 'dark');
    const [showDetail, setShowDetail] = useState(false);
    const rowData = useRef(null);
    const hasNext = useRef(true);

    const columns = useMemo(() => [
        {
            key: 'pair',
            dataIndex: 'symbol',
            title: t('common:pair'),
            align: 'left',
            width: 192,
            render: (row, item) => (
                pairConfig?.pair !== item?.symbol ?
                    <Link href={`/futures/${item?.symbol}`}>
                        <a className='dark:text-white text-darkBlue'>
                            <FuturesRecordSymbolItem symbol={item?.symbol} leverage={item?.leverage} type={item?.type} side={item?.side} />
                        </a>
                    </Link>
                    : <FuturesRecordSymbolItem symbol={item?.symbol} leverage={(item?.leverage)} type={item?.type} side={item?.side} />
            ),
            sortable: true,
        },
        {
            key: 'status',
            dataIndex: 'reason_close_code',
            title: t('common:status'),
            align: 'center',
            width: 178,
            render: (row) => <OrderStatusLabel type={row?.reason_close_code} t={t} />,
            sortable: true,
        },
        {
            key: 'sltp',
            title: `${t('futures:stop_loss')} / ${t('futures:take_profit')}`,
            align: 'left',
            width: 224,
            render: (row) => (
                <div className='flex items-center'>
                    <div className='flex flex-col gap-1 font-normal text-sm text-darkBlue-5'>
                        <div>SL: <span className='text-red'>{row?.sl ? `${formatNumber(row?.sl, row?.decimalScalePrice, 0, true)} (${getRatioProfit(row?.sl, row)}%)` : '_'}</span></div>
                        <div>TP: <span className='text-teal'>{row?.tp ? `${formatNumber(row?.tp, row?.decimalScalePrice, 0, true)} (${getRatioProfit(row?.tp, row)}%)` : '_'}</span></div>
                    </div>
                </div>
            ),
            sortable: false,
        },
        {
            key: 'pnl',
            title: 'PNL (ROE%)',
            align: 'right',
            width: 118,
            render: (row) => {
                const isVndc = row?.symbol.indexOf('VNDC') !== -1
                return <OrderProfit
                    className='w-full'
                    key={row.displaying_id} order={row}
                    initPairPrice={row.close_price} setShareOrderModal={() => setShareOrder(row)}
                    decimal={isVndc ? row?.decimalSymbol : row?.decimalSymbol + 2} />
            },
            sortable: false,
        },
        {
            key: 'volume',
            dataIndex: 'order_value',
            title: t('futures:order_table:volume'),
            align: 'right',
            width: 118,
            render: (row, item) => <div className='text-gray-4 text-sm font-normal'>{formatNumber(item?.order_value, item?.decimalScalePrice, 0, true)}</div>,
            sortable: false,
        },
        {
            key: 'open_price',
            dataIndex: 'open_price',
            title: t('futures:order_table:open_price'),
            align: 'right',
            width: 118,
            render: (row, item) => <div className='text-gray-4 text-sm font-normal'>{formatNumber(item?.open_price, item?.decimalScalePrice, 0, true)}</div>,
            sortable: false,
        },
        {
            key: 'close_price',
            dataIndex: 'close_price',
            title: t('futures:order_table:close_price'),
            align: 'right',
            width: 118,
            render: (row, item) => <div className='text-gray-4 text-sm font-normal'>{formatNumber(item?.close_price, item?.decimalScalePrice, 0, true)}</div>,
            sortable: false,
        },
        {
            key: 'reason_close',
            title: t('futures:mobile:reason_close'),
            align: 'right',
            width: 118,
            render: (row) => <div className='text-gray-4 text-sm font-normal'>{renderReasonClose(row)}</div>,
            sortable: false,
        },
    ], [loading, pair])

    const [filters, setFilters] = useState({
        timeFrom: null,
        timeTo: null,
        symbol: '',
        side: '',
    })

    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        pageSize: 10
    })

    useEffect(() => {
        setFilters({ ...filters, symbol: hideOther ? pairConfig?.symbol : '' })
    }, [hideOther])


    useEffect(() => {
        getOrders();
    }, [pagination.page, pagination.pageSize])

    const getDecimalPrice = (config) => {
        const decimalScalePrice = config?.filters.find(rs => rs.filterType === 'PRICE_FILTER') ?? 1;
        return countDecimals(decimalScalePrice?.tickSize);
    };

    const getOrders = _.debounce(async () => {
        setLoading(true)
        try {
            const { status, data } = await fetchApi({
                url: API_GET_FUTURES_ORDER_HISTORY,
                options: { method: 'GET' },
                params: {
                    status: 1,
                    // pageSize: pagination.pageSize,
                    page: pagination.page - 1,
                    pageSize: pagination.pageSize
                    // ...filters,
                    // timeFrom: filters.timeFrom?.valueOf(),
                    // timeTo: filters.timeTo?.valueOf(),
                },
            })

            if (status === ApiStatus.SUCCESS) {
                data?.orders.map(item => {
                    const symbol = allPairConfigs.find(rs => rs.symbol === item.symbol);
                    const decimalSymbol = assetConfig.find(rs => rs.id === symbol?.quoteAssetId)?.assetDigit ?? 0;
                    const decimalScalePrice = getDecimalPrice(symbol);
                    item['decimalSymbol'] = decimalSymbol;
                    item['decimalScalePrice'] = decimalScalePrice;
                    item['quoteAsset'] = symbol?.quoteAsset;
                    return item;
                })
                setDataSource(data?.orders)
                setPagination({ ...pagination, total: data?.total })
                hasNext.current = data?.hasNext
            } else {
                setDataSource([])
            }
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
            onForceUpdate()
            setResetPage(false);
        }
    }, 300)

    const cellRenderRevenue = (row) => {
        const isVndc = row?.symbol.indexOf('VNDC') !== -1
        const profit = formatNumber(row?.profit, isVndc ? row?.decimalSymbol : row?.decimalSymbol + 2, 0, true)
        const percent = formatNumber(((row?.profit / row?.margin) * 100), 2, 0, true);
        if (!row?.profit) return '-'
        return <div className='flex flex-row'>
            <div className={getPriceColor(Number(row?.profit))}>
                <div>
                    {profit} {row?.quoteAsset}
                </div>
                <div>
                    ({percent > 0 ? '+' : ''}
                    {percent + '%'})
                </div>
            </div>
            <Share2 size={16} onClick={() => setShareOrder(row)} className='ml-1 cursor-pointer hover:opacity-60' />
        </div>
    }

    const renderReasonClose = (row) => {
        switch (row?.reason_close_code) {
            case 0:
                return t('futures:order_history:normal')
            case 1:
                return t('futures:order_history:hit_sl')
            case 2:
                return t('futures:order_history:hit_tp')
            case 3:
                return t('futures:order_history:liquidate')
            default:
                return '';
        }
    }

    if (!isAuth) return <div className="cursor-pointer flex items-center justify-center h-full">
        <Link href={getLoginUrl('sso', 'login')} locale={false}>
            <a className='w-[200px] bg-dominant !text-white font-medium text-center py-2.5 rounded-lg cursor-pointer hover:opacity-80'>
                {t('futures:order_table:login_to_continue')}
            </a>
        </Link>
    </div>

    const onShowDetail = (row) => {
        rowData.current = row;
        setShowDetail(!showDetail);
    }

    return (
        <>
            {showDetail && <Adjustmentdetails rowData={rowData.current} onClose={onShowDetail} />}
            <ShareFuturesOrder isClosePrice isVisible={!!shareOrder} order={shareOrder} pairPrice={pairPrice} onClose={() => setShareOrder(null)} />
            <TableV2
                data={loading ? [] : dataSource}
                loading={loading}
                columns={columns}
                pagingPrevNext={{
                    language,
                    page: pagination.page - 1,
                    hasNext: hasNext.current,
                    onChangeNextPrev: (e) => setPagination({ ...pagination, page: pagination.page + e })
                }}
                scroll={{ x: true }}
                height={'300px'}
                tableStyle={{
                    tableStyle: { paddingBottom: '24px !important' },
                    padding: '14px 16px',
                    headerStyle: {
                        padding: '0px'
                    }
                }}
            />
        </>
    )
}

export default FuturesOrderHistoryVndc
