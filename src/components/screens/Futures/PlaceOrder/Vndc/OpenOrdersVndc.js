import React, { useEffect, useMemo, useRef, useState } from 'react';
import { formatNumber, formatTime, getLoginUrl, countDecimals, formatPrice } from 'redux/actions/utils';
import { Edit } from 'react-feather';

import FuturesRecordSymbolItem from 'components/screens/Futures/TradeRecord/SymbolItem';
import showNotification from 'utils/notificationService';
import { getRatioProfit, renderCellTable, VndcFutureOrderType } from './VndcFutureOrderType';
import OrderProfit from 'components/screens/Futures/TradeRecord/OrderProfit';

import { useSelector } from 'react-redux';
import { API_GET_FUTURES_ORDER } from 'redux/actions/apis';
import { ApiStatus, DefaultFuturesFee } from 'redux/actions/const';

import { useTranslation } from 'next-i18next';
import fetchApi from 'utils/fetch-api';
import Big from 'big.js';
import { isArray } from 'lodash';
import FuturesEditSLTPVndc from 'components/screens/Futures/PlaceOrder/Vndc/EditSLTPVndc';
import CloseAllOrders from 'components/screens/Futures/PlaceOrder/Vndc/CloseAllOrders';
import Link from 'next/link';
import OrderClose from './OrderClose';
import TableV2 from 'components/common/V2/TableV2'
import ShareFuturesOrder from 'components/screens/Futures/ShareFuturesOrder';
import classNames from 'classnames';

const FuturesOpenOrdersVndc = ({ pairConfig, onForceUpdate, hideOther, isAuth, isVndcFutures, pair, status }) => {
    const { t, i18n: { language } } = useTranslation()
    const ordersList = useSelector(state => state?.futures?.ordersList)
    const marketWatch = useSelector((state) => state.futures.marketWatch)
    const isPosition = status === VndcFutureOrderType.Status.ACTIVE
    const assetConfig = useSelector(state => state.utils.assetConfig);
    const [showModalDelete, setShowModalDelete] = useState(false)
    const rowData = useRef(null);
    const allPairConfigs = useSelector((state) => state.futures.pairConfigs);
    const [showModalEdit, setShowModalEdit] = useState(false)
    const [shareOrder, setShareOrder] = useState(null)
    const [filters, setFilters] = useState({
        timeRange: [],
        symbol: '',
        status: '',
        side: '',
    })

    const getDecimalPrice = (config) => {
        const decimalScalePrice = config?.filters.find(rs => rs.filterType === 'PRICE_FILTER') ?? 1;
        return countDecimals(decimalScalePrice?.tickSize);
    };

    // { key: 'pair', dataIndex: 'pair', title: 'Coin', fixed: 'left', align: 'left', width: pairColumnsWidth },
    const columns = useMemo(
        () => [
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
                key: 'pnl',
                visible: isPosition,
                title: 'PNL (ROE%)',
                align: 'right',
                width: 138,
                render: (row) => {
                    if (!isPosition) return undefined
                    const isVndc = row?.symbol.indexOf('VNDC') !== -1
                    return <OrderProfit
                        className='w-full'
                        key={row.displaying_id} order={row}
                        initPairPrice={marketWatch[row?.symbol]} setShareOrderModal={() => setShareOrder(row)}
                        decimal={isVndc ? row?.decimalSymbol : row?.decimalSymbol + 2} />
                },
                sortable: false,
            },
            {
                key: 'volume_margin',
                visible: isPosition,
                dataIndex: 'order_value',
                title: `${t('futures:order_table:volume')}/${t('futures:margin')}`,
                align: 'left',
                width: 184,
                render: (row, item) => item?.order_value ?
                    <div className='flex flex-col gap-1 font-normal text-sm text-darkBlue-5'>
                        <div>
                            {t('futures:volume')}: <span className='text-gray-4'>{formatNumber(item?.order_value, item?.decimalScalePrice, 0, true)}</span>
                        </div>
                        <div>
                            {t('futures:margin')}: <span className='text-gray-4'>{formatNumber(item?.margin, item?.decimalScalePrice, 0, true)}</span>
                        </div>
                    </div>
                    : '-',
                sortable: true,
            },
            {
                key: 'market_price-open_price',
                visible: !isPosition,
                title: `${t('futures:mobile.market_price')} / ${t('futures:order_table:open_price')}`,
                align: 'left',
                width: 200,
                render: (row) =>
                    <div className='flex flex-col gap-1 font-normal text-sm text-darkBlue-5'>
                        <div>
                            {t('common:market')}: <span className='text-gray-4'> {marketWatch[row?.symbol] && formatNumber(marketWatch[row?.symbol]?.lastPrice, row?.decimalScalePrice, 0, true)}</span>
                        </div>
                        <div>
                            {t('futures:order_table.open')}: <span className='text-gray-4'>{renderOpenPrice(row)}</span>
                        </div>
                    </div>,
                sortable: false,
            },
            {
                key: 'sltp',
                title: `${t('futures:stop_loss')} / ${t('futures:take_profit')}`,
                align: 'left',
                width: 224,
                render: (row) => (
                    <div className='flex items-center'>
                        <div className='flex flex-col gap-1 font-normal text-sm text-darkBlue-5'>
                            <div>SL: <span className='text-red'>{row?.sl ? `${formatNumber(row?.sl, row?.decimalScalePrice, 0, true)} (${getRatioProfit(row?.sl, row)})` : '_'}</span></div>
                            <div>TP: <span className='text-teal'>{row?.tp ? `${formatNumber(row?.tp, row?.decimalScalePrice, 0, true)} (${getRatioProfit(row?.tp, row)})` : '_'}</span></div>
                        </div>
                        {row.status !== VndcFutureOrderType.Status.CLOSED &&
                            <Edit onClick={() => onOpenModify(row)}
                                className='ml-2 !w-4 !h-4 cursor-pointer hover:opacity-60' />
                        }
                    </div>
                ),
                sortable: false,
            },
            {
                key: 'open_price',
                visible: isPosition,
                title: t('futures:order_table:open_price'),
                align: 'right',
                width: 118,
                render: (row) => <div className='text-gray-4 text-sm font-normal'>{renderOpenPrice(row)}</div>,
                sortable: false,
            },
            {
                key: 'market_price',
                visible: isPosition,
                title: t('futures:mobile.market_price'),
                align: 'right',
                width: 140,
                render: (row) => marketWatch[row?.symbol] && formatNumber(marketWatch[row?.symbol]?.lastPrice, row?.decimalScalePrice, 0, true),
                sortable: false,
            },
            {
                key: 'volume',
                visible: !isPosition,
                title: t('futures:order_table:volume'),
                align: 'left',
                width: 120,
                render: (row, item) => <div className='text-gray-4 text-sm font-normal'>{formatNumber(item?.order_value, item?.decimalScalePrice, 0, true)}</div>,
                sortable: false,
            },
            {
                key: 'last_price',
                title: t('futures:order_table:last_price'),
                align: 'right',
                width: 140,
                render: (row) => marketWatch[row?.symbol] && formatNumber(marketWatch[row?.symbol]?.[row?.side === VndcFutureOrderType.Side.BUY ? 'bid' : 'ask'], row?.decimalScalePrice, 0, true),
                sortable: true,
            },
            {
                key: 'liq_price',
                visible: isPosition,
                title: t('futures:calulator:liq_price'),
                align: 'right',
                width: 140,
                render: (row) => renderLiqPrice(row, false),
                sortable: true,
            },
            {
                key: 'margin',
                visible: !isPosition,
                title: t('futures:margin'),
                align: 'right',
                width: 120,
                render: (row) => formatNumber(row?.margin, row?.decimalScalePrice, 0, true),
                sortable: true,
            },
            {
                key: 'status',
                visible: !isPosition,
                title: t('common:status'),
                align: 'right',
                width: 178,
                render: (row) => <div className='px-4 py-1 bg-yellow-100/[0.15] text-yellow-100 font-normal text-sm rounded-[80px] text-center'>{t('futures:mobile.pending_order')}</div>,
                sortable: true,
            },
            {
                key: 'operator',
                title: <CloseButton>{t('common:close_all_orders')}</CloseButton>,
                align: 'center',
                fixed: 'right',
                width: 160,
                render: (row) => (
                    <CloseButton onClick={() => onDelete(row)}>
                        {t('common:close')}
                    </CloseButton>
                ),
            },
        ],
        [marketWatch, pair, dataFilter]
    )

    const fetchOrder = async (method = 'GET', params, cb) => {
        try {
            const { status, data, message } = await fetchApi({
                url: API_GET_FUTURES_ORDER,
                options: { method },
                params: params,
            })
            if (status === ApiStatus.SUCCESS) {
                if (cb) cb(data?.orders);
            } else {
                showNotification(
                    {
                        message: message,
                        title: t('common:failed'),
                        type: 'failure'
                    },
                    1800,
                    'bottom',
                    'bottom-right'
                )
            }
        } catch (e) {
            console.log(e)
        } finally {
            setTimeout(() => {
                onForceUpdate()
            }, 2000)
        }
    }

    useEffect(() => {
        onForceUpdate()
    }, [ordersList])

    const onDelete = (item) => {
        rowData.current = item;
        setShowModalDelete(true)
    }

    const onConfirm = () => {
        const params = {
            displaying_id: rowData.current.displaying_id,
            special_mode: 1
        }
        fetchOrder('DELETE', params, () => {
            setShowModalDelete(false);
            showNotification(
                {
                    message: t('futures:close_order:request_successfully', { value: rowData.current?.displaying_id }),
                    title: t('futures:close_order:modal_title', { value: rowData.current?.displaying_id }),
                    type: 'success',
                },
                1800,
                'bottom',
                'bottom-right'
            )
        });
    }

    const renderLiqPrice = (row, returnNumber) => {
        const size = (row?.side === VndcFutureOrderType.Side.SELL ? -row?.quantity : row?.quantity)
        const number = (row?.side === VndcFutureOrderType.Side.SELL ? -1 : 1);
        const swap = row?.swap || 0
        // const funding = row?.funding_fee?.margin ? Math.abs(row?.funding_fee?.margin) : 0
        const liqPrice = (size * row?.open_price + row?.fee + swap - row?.margin) / (row?.quantity * (number - DefaultFuturesFee.Nami))
        if (returnNumber) row?.status === VndcFutureOrderType.Status.ACTIVE ? liqPrice : 0;
        return row?.status === VndcFutureOrderType.Status.ACTIVE && liqPrice > 0 ? formatNumber(liqPrice, row?.decimalScalePrice, 0, false) : '-'
    }


    const renderOpenPrice = (row) => {
        let text = row?.price ? formatNumber(row?.price, 8, 0, true) : 0;
        switch (row.status) {
            case VndcFutureOrderType.Status.PENDING:
                let bias = null;
                const value = row['price'];

                const pairPrice = marketWatch?.[row.symbol]
                if (!pairPrice) return null
                const openPrice = row.side === VndcFutureOrderType.Side.BUY ? pairPrice?.ask : pairPrice?.bid;
                const closePrice = row.side === VndcFutureOrderType.Side.BUY ? pairPrice?.bid : pairPrice?.ask;
                if (pairPrice?.lastPrice > 0 && value > 0) {
                    let biasValue = +Big(value).minus(openPrice);
                    const formatedBias = formatNumber(biasValue, 8, 0, true);
                    bias =
                        biasValue > 0 ? (
                            <span className="text-mint">(+{formatedBias})</span>
                        ) : (
                            <span className="text-pink">({formatedBias})</span>
                        );
                }
                text = row.price ? formatNumber(row.price, row?.decimalScalePrice) : '';
                return text
            case VndcFutureOrderType.Status.ACTIVE:
                text = row.open_price ? formatNumber(row.open_price, row?.decimalScalePrice) : '';
                return <div>{text}</div>;
            case VndcFutureOrderType.Status.CLOSED:
                text = row.close_price ? formatNumber(row.close_price, row?.decimalScalePrice) : '';
                return <div>{text}</div>;
            default:
                return <div>{text}</div>;
        }
    }

    const onOpenModify = (data) => {
        rowData.current = data;
        setShowModalEdit(true);
    }

    const onConfirmEdit = (params) => {
        fetchOrder('PUT', params, () => {
            localStorage.setItem('edited_id', params.displaying_id);
            setShowModalEdit(false);
            showNotification(
                {
                    message: t('futures:modify_order_success'),
                    title: t('common:success'),
                    type: 'success'
                },
                1800,
                'bottom',
                'bottom-right'
            )
        });
    }

    const dataSource = useMemo(() => {
        const filteredData = [0, 1, 2].includes(status) ? ordersList.filter(e => e.status === status) : ordersList
        return filteredData.map(item => {
            const symbol = allPairConfigs.find(rs => rs.symbol === item.symbol);
            const decimalSymbol = assetConfig.find(rs => rs.id === symbol?.quoteAssetId)?.assetDigit ?? 0;
            const decimalScalePrice = getDecimalPrice(symbol);
            item['decimalSymbol'] = decimalSymbol;
            item['decimalScalePrice'] = decimalScalePrice;
            return item;
        })
    }, [ordersList, status])


    const dataFilter = useMemo(() => {
        const items = dataSource.filter(o => {
            const conditions = []
            if (hideOther) {
                conditions.push(o.symbol === pairConfig?.symbol)
            }
            if (filters.side) {
                conditions.push(o.side === filters.side)
            }
            if (Object.values(VndcFutureOrderType.Status).includes(filters.status)) {
                conditions.push(parseInt(o.status) === filters.status)
            }

            const createdAt = new Date(o.created_at).valueOf()

            if (isArray(filters.timeRange) && filters.timeRange.length > 0) {
                conditions.push(createdAt > filters.timeRange[0].valueOf() && createdAt < filters.timeRange[1].valueOf())
            }

            return conditions.every(e => e)
        });

        return filters.symbol ? items.filter(item => item?.symbol === filters.symbol) : items;
    }, [hideOther, dataSource, filters, pair, status])

    if (!isAuth) return <div className="cursor-pointer flex items-center justify-center h-full">
        <Link href={getLoginUrl('sso', 'login')} locale={false}>
            <a className='w-[200px] bg-dominant !text-white font-medium text-center py-2.5 rounded-lg cursor-pointer hover:opacity-80'>
                {t('futures:order_table:login_to_continue')}
            </a>
        </Link>
    </div>
    return (
        <>
            <OrderClose open={showModalDelete} onClose={() => setShowModalDelete(false)} onConfirm={onConfirm} data={rowData.current} />
            <ShareFuturesOrder isVisible={!!shareOrder} order={shareOrder} pairPrice={marketWatch[shareOrder?.symbol]} onClose={() => setShareOrder(null)} />
            {showModalEdit &&
                <FuturesEditSLTPVndc
                    isVisible={showModalEdit}
                    order={rowData.current}
                    onClose={() => setShowModalEdit(false)}
                    status={rowData.current.status}
                    onConfirm={onConfirmEdit}
                    pairConfig={pairConfig}
                    pairTicker={marketWatch}
                />
            }
            <TableV2
                data={dataFilter}
                columns={columns}
                scroll={{ x: true }}
                height={'300px'}
            />
        </>
    )
}

const CloseButton = ({ children, onClick }) => {
    return (
        <div
            className='w-[112px] h-[36px] flex items-center justify-center font-semibold text-sm text-darkBlue-5 bg-dark-2 cursor-pointer rounded-md'
            onClick={onClick}
        >
            {children}
        </div>
    )
}

export default FuturesOpenOrdersVndc
