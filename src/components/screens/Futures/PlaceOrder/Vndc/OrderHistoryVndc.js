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
import FuturesOrderDetailModal from 'components/screens/Futures/FuturesModal/FuturesOrderDetailModal';
import FututesShareModal from 'components/screens/Futures/FuturesModal/FututesShareModal';

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
    const [showOrderDetail, setShowOrderDetail] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);

    const columns = useMemo(() => [
        {
            key: 'id',
            dataIndex: 'id',
            title: 'ID / ' + t('common:time'),
            align: 'left',
            width: 192,
            render: (_row, item) => (
                <div className='text-txtPrimary dark:text-gray-4 font-normal text-sm h-full'>
                    <div>{formatTime(item.closed_at, 'HH:mm:ss dd/MM/yyyy')}</div>
                    <div>ID #{item.displaying_id}</div>
                </div>
            ),
            sortable: true,
        },
        {
            key: 'pair',
            dataIndex: 'symbol',
            title: t('common:pair'),
            align: 'left',
            width: 224,
            render: (row, item) => {
                let specialOrder
                if (item?.metadata?.dca_order_metadata) {
                    if (!item?.meta_data?.dca_order_metadata?.is_main_order) {
                        specialOrder = t('futures:mobile:adjust_margin:added_volume')
                    }
                }
                if (item?.metadata?.partial_close_metadata) {
                    if (!item?.meta_data?.partial_close_metadata?.is_main_order) {
                        specialOrder = t('futures:mobile:adjust_margin:close_partially')
                    }
                }

                return (
                    <FuturesRecordSymbolItem
                        onShareModal={() => onHandleClick('share', item)}
                        onSymbolClick={pairConfig?.pair !== item?.symbol ? () => onHandleClick('router', item) : undefined}
                        symbol={item?.symbol}
                        leverage={item?.leverage}
                        type={item?.type}
                        side={item?.side}
                        specialOrder={specialOrder}
                        canShare={true}
                    />
                )
            },
            sortable: true
        },
        {
            key: 'status',
            dataIndex: 'reason_close_code',
            title: t('common:status'),
            align: 'center',
            width: 178,
            render: (_row, item) => <OrderStatusLabel type={item?.reason_close_code} t={t} />,
            sortable: true,
        },
        {
            key: 'sltp',
            title: `${t('futures:stop_loss')} / ${t('futures:take_profit')}`,
            align: 'left',
            width: 224,
            render: (row) => (
                <div className='flex items-center'>
                    <div className='flex flex-col gap-1 font-normal text-sm text-txtSecondary dark:text-darkBlue-5'>
                        <div>SL: <span className='text-red-2 dark:text-red'>{row?.sl ? `${formatNumber(row?.sl, row?.decimalScalePrice, 0, true)}` : '_'}</span></div>
                        <div>TP: <span className='text-green-3 dark:text-teal'>{row?.tp ? `${formatNumber(row?.tp, row?.decimalScalePrice, 0, true)}` : '_'}</span></div>
                    </div>
                </div>
            ),
            sortable: false,
        },
        {
            key: 'pnl',
            title: 'PNL (ROE%)',
            align: 'right',
            width: 148,
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
            width: 148,
            render: (row, item) => formatNumber(item?.order_value, item?.decimalScalePrice, 0, true),
            sortable: false,
        },
        {
            key: 'open_price',
            dataIndex: 'open_price',
            title: t('futures:order_table:open_price'),
            align: 'right',
            width: 148,
            render: (row, item) => formatNumber(item?.open_price, item?.decimalScalePrice, 0, true),
            sortable: false,
        },
        {
            key: 'close_price',
            dataIndex: 'close_price',
            title: t('futures:order_table:close_price'),
            align: 'right',
            width: 148,
            render: (row, item) => formatNumber(item?.close_price, item?.decimalScalePrice, 0, true),
            sortable: false,
        },
        {
            key: 'reason_close',
            title: t('futures:mobile:reason_close'),
            align: 'right',
            width: 148,
            render: (_row, item) => renderReasonClose(item),
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
                return t('futures:order_history:normal');
            case 1:
                return t('futures:order_history:hit_sl');
            case 2:
                return t('futures:order_history:hit_tp');
            case 3:
                return t('futures:order_history:liquidate');
            case 5:
                return t('futures:mobile:adjust_margin:added_volume');
            case 6:
                return t('futures:mobile:adjust_margin:close_partially');
            default:
                return '';
        }
    };


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

    const flag = useRef(false);
    const onHandleClick = (key, data) => {
        rowData.current = data;
        switch (key) {
            case 'share':
                flag.current = true;
                setShowShareModal(true);
                break;
            case 'detail':
                if (flag.current) {
                    flag.current = false;
                    return;
                }
                setShowOrderDetail(true);
                break;
            default:
                break;
        }
    };

    const decimals = useMemo(() => {
        return {
            price: rowData.current?.decimalScalePrice || 0,
            symbol: rowData.current?.decimalSymbol || 0
        };
    }, [showOrderDetail]);

    return (
        <>
            {/* {showDetail && <Adjustmentdetails rowData={rowData.current} onClose={onShowDetail} />} */}
            <ShareFuturesOrder isClosePrice isVisible={!!shareOrder} order={shareOrder} pairPrice={pairPrice} onClose={() => setShareOrder(null)} />
            <FuturesOrderDetailModal
                order={rowData.current}
                isVisible={showOrderDetail}
                onClose={() => setShowOrderDetail(false)}
                decimals={decimals}
            />
              <FututesShareModal
                order={rowData.current}
                isVisible={showShareModal}
                onClose={() => setShowShareModal(false)}
                decimals={decimals}
                // pairTicker={marketWatch[rowData.current?.symbol]}
            />
            <TableV2
                data={loading ? [] : dataSource}
                onRowClick={(e) => onHandleClick('detail', e)}
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
                    headerFontStyle: {
                        height: '68px !important',
                        'padding-top': '0px !important',
                        'padding-bottom': '0px !important',
                    },
                    padding: '14px 16px',
                }}
            />
        </>
    )
}

export default FuturesOrderHistoryVndc
