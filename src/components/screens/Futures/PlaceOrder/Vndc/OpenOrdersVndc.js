import React, { useEffect, useMemo, useRef, useState } from 'react';
import { formatNumber, formatTime, getLoginUrl, countDecimals } from 'redux/actions/utils';
import { customTableStyles } from 'components/screens/Futures/TradeRecord/index';
import { ChevronDown, Edit } from 'react-feather';

import FuturesRecordSymbolItem from 'components/screens/Futures/TradeRecord/SymbolItem';
import DataTable from 'react-data-table-component';
import showNotification from 'utils/notificationService';
import { renderCellTable, VndcFutureOrderType } from './VndcFutureOrderType';
import OrderProfit from 'components/screens/Futures/TradeRecord/OrderProfit';
import FuturesTimeFilter2 from 'components/screens/Futures/TradeRecord/FuturesTimeFilter2';
import { FilterTradeOrder } from 'components/screens/Futures/FilterTradeOrder';

import { useSelector } from 'react-redux';
import { API_GET_FUTURES_ORDER } from 'redux/actions/apis';
import { ApiStatus, DefaultFuturesFee } from 'redux/actions/const';

import { useTranslation } from 'next-i18next';
import fetchApi from 'utils/fetch-api';
import Big from 'big.js';
import { isArray } from 'lodash';
import FuturesEditSLTPVndc from 'components/screens/Futures/PlaceOrder/Vndc/EditSLTPVndc';
import ShareFuturesOrder from 'components/screens/Futures/ShareFuturesOrder';
import CloseAllOrders from 'components/screens/Futures/PlaceOrder/Vndc/CloseAllOrders';
import TableNoData from 'components/common/table.old/TableNoData';
import Link from 'next/link';
import OrderClose from './OrderClose';
import TableV2 from 'components/common/V2/TableV2';
import EditSLTPV2 from 'components/screens/Futures/PlaceOrder/EditOrderV2/EditSLTPV2';
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';
import EditVolV2 from 'components/screens/Futures/PlaceOrder/EditOrderV2/EditVolV2';

const FuturesOpenOrdersVndc = ({ pairConfig, onForceUpdate, hideOther, isAuth, isVndcFutures, pair }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const ordersList = useSelector((state) => state?.futures?.ordersList);
    const marketWatch = useSelector((state) => state.futures.marketWatch);
    const assetConfig = useSelector((state) => state.utils.assetConfig);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const rowData = useRef(null);
    const allPairConfigs = useSelector((state) => state.futures.pairConfigs);
    const [showEditSLTP, setShowEditSLTP] = useState(false);
    const [showEditVol, setShowEditVol] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const message = useRef({
        status: '',
        title: '',
        message: '',
        notes: ''
    });
    const [shareOrder, setShareOrder] = useState(null);
    const [filters, setFilters] = useState({
        timeRange: [],
        symbol: '',
        status: '',
        side: ''
    });

    const TimeFilterRef = useRef(null);

    const symbolOptions = useMemo(() => {
        return allPairConfigs?.map((e) => ({ value: e.symbol, label: e.baseAsset + '/' + e.quoteAsset }));
    }, [allPairConfigs]);

    const getDecimalPrice = (config) => {
        const decimalScalePrice = config?.filters.find((rs) => rs.filterType === 'PRICE_FILTER') ?? 1;
        return countDecimals(decimalScalePrice?.tickSize);
    };

    // { key: 'pair', dataIndex: 'pair', title: 'Coin', fixed: 'left', align: 'left', width: pairColumnsWidth },
    const columns = useMemo(
        () => [
            // {
            //     key: 'pair',
            //     dataIndex: 'symbol',
            //     name: t('futures:order_table:id'),
            //     selector: (row) => row?.status !== 3 ? row?.displaying_id : t('futures:requesting'),
            //     sortable: true,
            //     minWidth: '50px',
            // },
            // {
            //     name: t('futures:order_table:created_time'),
            //     selector: (row) => row?.created_at,
            //     cell: (row) => (
            //         <span className='text-txtSecondary dark:text-txtSecondary-dark'>
            //             {formatTime(row?.created_at, 'yyyy-MM-dd HH:mm:ss')}
            //         </span>
            //     ),
            //     sortable: true,
            //     minWidth: '150px',
            // },
            {
                key: 'pair',
                dataIndex: 'symbol',
                title: t('common:pair'),
                align: 'left',
                width: 128,
                selector: (row) => row?.symbol,
                render: (row, item) =>
                    pairConfig?.pair !== item?.symbol ? (
                        <Link href={`/futures/${item?.symbol}`}>
                            <a className="dark:text-white text-darkBlue">
                                <FuturesRecordSymbolItem symbol={item?.symbol} leverage={item?.leverage} type={item?.type} side={item?.side} />
                            </a>
                        </Link>
                    ) : (
                        <FuturesRecordSymbolItem symbol={item?.symbol} leverage={item?.leverage} type={item?.type} side={item?.side} />
                    ),
                sortable: true
            },
            {
                key: 'volume-margin',
                dataIndex: 'order_value',
                title: `${t('futures:order_table:volume')}/${t('futures:margin')}`,
                align: 'left',
                width: 184,
                selector: (row) => row?.order_value,
                render: (row, item) =>
                    item?.order_value ? (
                        <div onClick={() => onOpenModify('vol', item)} className="flex flex-col gap-1">
                            <div>{formatNumber(item?.order_value, 8, 0, true)}</div>
                            <div>{formatNumber(item?.margin, 8, 0, true)}</div>
                        </div>
                    ) : (
                        '-'
                    ),
                sortable: true
            },
            {
                key: 'sltp',
                title: 'SL/TP',
                align: 'left',
                width: 224,
                render: (row) => (
                    <div className="flex items-center">
                        <div className="text-txtSecondary dark:text-txtSecondary-dark">
                            <div>{formatNumber(row?.sl, row?.decimalScalePrice, 0, true)}</div>
                            <div>{formatNumber(row?.tp, row?.decimalScalePrice, 0, true)}/</div>
                        </div>
                        {row.status !== VndcFutureOrderType.Status.CLOSED && (
                            <Edit onClick={() => onOpenModify('sltp', row)} className="ml-2 !w-4 !h-4 cursor-pointer hover:opacity-60" />
                        )}
                    </div>
                ),
                minWidth: '150px',
                sortable: false
            },
            {
                key: 'pnl',
                title: 'PNL (ROE%)',
                align: 'right',
                width: 138,
                selector: (row) => row?.pnl?.value,
                render: (row) => {
                    const isVndc = row?.symbol.indexOf('VNDC') !== -1;
                    return (
                        <OrderProfit
                            className="w-full"
                            key={row.displaying_id}
                            order={row}
                            initPairPrice={marketWatch[row?.symbol]}
                            setShareOrderModal={() => setShareOrder(row)}
                            decimal={isVndc ? row?.decimalSymbol : row?.decimalSymbol + 2}
                        />
                    );
                },
                sortable: false
            },
            {
                name: t('futures:order_table:type'),
                selector: (row) => row?.type,
                cell: (row) => renderCellTable('type', row, t, language),
                sortable: false
            },
            {
                name: t('futures:side'),
                selector: (row) => row?.side,
                cell: (row) => (
                    <span className={row?.side === VndcFutureOrderType.Side.BUY ? 'text-dominant' : 'text-red'}>
                        {renderCellTable('side', row, t, language)}
                    </span>
                ),
                sortable: false
            },
            {
                name: t('futures:leverage:leverage'),
                selector: (row) => row?.leverage,
                cell: (row) => row?.leverage + 'x',
                sortable: true
            },
            {
                name: t('futures:order_table:volume'),
                selector: (row) => row?.quantity,
                cell: (row) => (row?.quantity ? formatNumber(row?.quantity, 8, 0, true) : '-'),
                sortable: true
            },
            {
                name: t('futures:order_table:open_price'),
                selector: (row) => getSelectorOpenPrice(row),
                cell: (row) => renderOpenPrice(row),
                minWidth: '150px',
                sortable: true
            },
            {
                name: t('futures:order_table:last_price2'),
                selector: (row) => marketWatch[row?.symbol]?.lastPrice ?? 0,
                cell: (row) => marketWatch[row?.symbol] && formatNumber(marketWatch[row?.symbol]?.lastPrice, row?.decimalScalePrice, 0, true),
                minWidth: '150px',
                sortable: true
            },
            {
                name: t('futures:calulator:liq_price'),
                selector: (row) => renderLiqPrice(row, true),
                cell: (row) => renderLiqPrice(row, false),
                minWidth: '150px',
                sortable: true
            },

            {
                name: 'TP/SL',
                cell: (row) => (
                    <div className="flex items-center">
                        <div className="text-txtSecondary dark:text-txtSecondary-dark">
                            <div>{formatNumber(row?.tp, row?.decimalScalePrice, 0, true)}/</div>
                            <div>{formatNumber(row?.sl, row?.decimalScalePrice, 0, true)}</div>
                        </div>
                        {row.status !== VndcFutureOrderType.Status.CLOSED && (
                            <Edit onClick={() => onOpenModify(row)} className="ml-2 !w-4 !h-4 cursor-pointer hover:opacity-60" />
                        )}
                    </div>
                ),
                minWidth: '150px',
                sortable: false
            },
            {
                name: '',
                cell: (row) => (
                    <div
                        onClick={() => onDelete(row)}
                        className="cursor-pointer hover:opacity-80 px-[28px] py-1 font-medium text-xs text-txtSecondary bg-gray-5 dark:text-txtSecondary-dark dark:bg-darkBlue-3 rounded-[4px]"
                    >
                        {t('common:close')}
                    </div>
                )
            }
        ],
        [marketWatch, pair, dataFilter]
    );

    const fetchOrder = async (method = 'GET', params, cb) => {
        try {
            const { status, data, message } = await fetchApi({
                url: API_GET_FUTURES_ORDER,
                options: { method },
                params: params
            });
            if (status === ApiStatus.SUCCESS) {
                if (cb) cb(data?.orders);
            } else {
                setShowEditSLTP(false);
                setShowAlert(true);
                message.current = {
                    status: 'error',
                    title: t('common:failed'),
                    message: message
                };
            }
        } catch (e) {
            if (cb) cb(e?.message);
        } finally {
            setTimeout(() => {
                onForceUpdate();
            }, 2000);
        }
    };

    useEffect(() => {
        onForceUpdate();
    }, [ordersList]);

    const onDelete = (item) => {
        rowData.current = item;
        setShowModalDelete(true);
    };

    const onConfirm = () => {
        const params = {
            displaying_id: rowData.current.displaying_id,
            special_mode: 1
        };
        fetchOrder('DELETE', params, () => {
            setShowModalDelete(false);
            setShowEditSLTP(false);
            setShowAlert(true);
            message.current = {
                status: 'success',
                title: t('futures:close_order:modal_title', { value: rowData.current?.displaying_id }),
                message: t('futures:close_order:request_successfully', { value: rowData.current?.displaying_id })
            };
        });
    };

    const renderLiqPrice = (row, returnNumber) => {
        const size = row?.side === VndcFutureOrderType.Side.SELL ? -row?.quantity : row?.quantity;
        const number = row?.side === VndcFutureOrderType.Side.SELL ? -1 : 1;
        const swap = row?.swap || 0;
        // const funding = row?.funding_fee?.margin ? Math.abs(row?.funding_fee?.margin) : 0
        const liqPrice = (size * row?.open_price + row?.fee + swap - row?.margin) / (row?.quantity * (number - DefaultFuturesFee.Nami));
        if (returnNumber) row?.status === VndcFutureOrderType.Status.ACTIVE ? liqPrice : 0;
        return row?.status === VndcFutureOrderType.Status.ACTIVE && liqPrice > 0 ? formatNumber(liqPrice, row?.decimalScalePrice, 0, false) : '-';
    };

    const getSelectorOpenPrice = (row) => {
        switch (row.status) {
            case VndcFutureOrderType.Status.PENDING:
                return row?.price;
            case VndcFutureOrderType.Status.ACTIVE:
                return row?.open_price;
            case VndcFutureOrderType.Status.CLOSED:
                return row?.close_price;
            default:
                return 0;
        }
    };

    const renderOpenPrice = (row) => {
        let text = row?.price ? formatNumber(row?.price, 8, 0, true) : 0;
        switch (row.status) {
            case VndcFutureOrderType.Status.PENDING:
                let bias = null;
                const value = row['price'];

                const pairPrice = marketWatch?.[row.symbol];
                if (!pairPrice) return null;
                const openPrice = row.side === VndcFutureOrderType.Side.BUY ? pairPrice?.ask : pairPrice?.bid;
                const closePrice = row.side === VndcFutureOrderType.Side.BUY ? pairPrice?.bid : pairPrice?.ask;
                if (pairPrice?.lastPrice > 0 && value > 0) {
                    let biasValue = +Big(value).minus(openPrice);
                    const formatedBias = formatNumber(biasValue, 8, 0, true);
                    bias =
                        biasValue > 0 ? (
                            <span>
                                (<span className="text-mint">+{formatedBias}</span>)
                            </span>
                        ) : (
                            <span>
                                (<span className="text-pink">{formatedBias}</span>)
                            </span>
                        );
                }
                text = row.price ? formatNumber(row.price, row?.decimalScalePrice) : '';
                return (
                    <div className="flex items-center ">
                        <div>
                            {text}
                            <br />
                            {bias}
                        </div>
                        <Edit onClick={() => onOpenModify(row)} className="ml-2 !w-4 !h-4 cursor-pointer hover:opacity-60" />
                    </div>
                );
            case VndcFutureOrderType.Status.ACTIVE:
                text = row.open_price ? formatNumber(row.open_price, row?.decimalScalePrice) : '';
                return <div>{text}</div>;
            case VndcFutureOrderType.Status.CLOSED:
                text = row.close_price ? formatNumber(row.close_price, row?.decimalScalePrice) : '';
                return <div>{text}</div>;
            default:
                return <div>{text}</div>;
        }
    };

    const onOpenModify = (key, data) => {
        rowData.current = data;
        switch (key) {
            case 'vol':
                setShowEditVol(true);
                break;
            case 'sltp':
                setShowEditSLTP(true);
                break;
            default:
                break;
        }
    };

    const onConfirmEdit = (params) => {
        fetchOrder('PUT', params, () => {
            localStorage.setItem('edited_id', params.displaying_id);
            setShowEditSLTP(false);
            setShowAlert(true);
            message.current = {
                status: 'success',
                title: t('common:success'),
                message: t('futures:modify_order_success')
            };
        });
    };

    const dataSource = useMemo(() => {
        return ordersList.map((item) => {
            const symbol = allPairConfigs.find((rs) => rs.symbol === item.symbol);
            const decimalSymbol = assetConfig.find((rs) => rs.id === symbol?.quoteAssetId)?.assetDigit ?? 0;
            const decimalScalePrice = getDecimalPrice(symbol);
            item['decimalSymbol'] = decimalSymbol;
            item['decimalScalePrice'] = decimalScalePrice;
            return item;
        });
    }, [ordersList]);

    const dataFilter = useMemo(() => {
        const items = dataSource.filter((o) => {
            const conditions = [];
            if (hideOther) {
                conditions.push(o.symbol === pairConfig?.symbol);
            }
            if (filters.side) {
                conditions.push(o.side === filters.side);
            }
            if (Object.values(VndcFutureOrderType.Status).includes(filters.status)) {
                conditions.push(parseInt(o.status) === filters.status);
            }

            const createdAt = new Date(o.created_at).valueOf();

            if (isArray(filters.timeRange) && filters.timeRange.length > 0) {
                conditions.push(createdAt > filters.timeRange[0].valueOf() && createdAt < filters.timeRange[1].valueOf());
            }

            return conditions.every((e) => e);
        });

        return filters.symbol ? items.filter((item) => item?.symbol === filters.symbol) : items;
    }, [hideOther, dataSource, filters, pair]);

    const decimals = useMemo(() => {
        return {
            price: rowData.current?.decimalScalePrice || 0,
            symbol: rowData.current?.decimalSymbol || 0
        };
    }, [showEditSLTP]);

    if (!isAuth)
        return (
            <div className="cursor-pointer flex items-center justify-center h-full">
                <Link href={getLoginUrl('sso', 'login')} locale={false}>
                    <a className="w-[200px] bg-dominant !text-white font-medium text-center py-2.5 rounded-lg cursor-pointer hover:opacity-80">
                        {t('futures:order_table:login_to_continue')}
                    </a>
                </Link>
            </div>
        );

    return (
        <>
            <AlertModalV2
                isVisible={showAlert}
                onClose={() => setShowAlert(false)}
                type={message.current.status}
                title={message.current.title}
                message={message.current.message}
                className="max-w-[448px]"
            />
            <OrderClose open={showModalDelete} onClose={() => setShowModalDelete(false)} onConfirm={onConfirm} data={rowData.current} />
            <ShareFuturesOrder isVisible={!!shareOrder} order={shareOrder} pairPrice={marketWatch[shareOrder?.symbol]} onClose={() => setShareOrder(null)} />
            <EditSLTPV2
                isVisible={showEditSLTP}
                order={rowData.current}
                onClose={() => setShowEditSLTP(false)}
                status={rowData.current?.status}
                onConfirm={onConfirmEdit}
                pairConfig={pairConfig}
                decimals={decimals}
                pairTicker={marketWatch}
            />
            <EditVolV2
                isVisible={showEditVol}
                order={rowData.current}
                onClose={() => setShowEditVol(false)}
                status={rowData.current?.status}
                onConfirm={() => console.log(232323)}
                pairConfig={pairConfig}
                decimals={decimals}
                pairTicker={marketWatch}
            />
            {/* <div className='flex flex-row items-center flex-wrap'>
                <FuturesTimeFilter2
                    currentTimeRange={filters.timeRange}
                    onChange={(value) => {
                        setFilters({ ...filters, timeRange: value })
                    }}
                    ref={TimeFilterRef}
                />
                <FilterTradeOrder
                    label={t('futures:order_table:symbol')}
                    options={symbolOptions}
                    value={filters.symbol}
                    onChange={(value) => {
                        setFilters({ ...filters, symbol: value })
                    }}
                    allowSearch
                />
                <FilterTradeOrder
                    label={t('futures:side')}
                    options={[{ value: 'Buy', label: t('common:buy') }, { value: 'Sell', label: t('common:sell') }]}
                    value={filters.side}
                    onChange={(value) => {
                        setFilters({ ...filters, side: value })
                    }}
                />
                <FilterTradeOrder
                    label={t('common:status')}
                    options={[
                        {
                            value: VndcFutureOrderType.Status.PENDING,
                            label: t('common:pending')
                        },
                        {
                            value: VndcFutureOrderType.Status.ACTIVE,
                            label: t('futures:order_table:opening_title')
                        }
                    ]}
                    value={filters.status}
                    onChange={(value) => {
                        setFilters({ ...filters, status: value })
                    }}
                />
                <div
                    onClick={() => {
                        setFilters({
                            timeRange: [],
                            symbol: '',
                            status: '',
                            side: '',
                        })
                        TimeFilterRef.current.onReset([]);
                    }}
                    className="px-[8px] flex py-[1px] mr-2 text-xs font-medium bg-bgSecondary dark:text-txtSecondary-dark dark:bg-darkBlue-3 cursor-pointer hover:opacity-80 rounded-md">
                    {t('common:reset')}
                </div>
                <CloseAllOrders />
            </div> */}
            {/* <DataTable
                responsive
                fixedHeader
                sortIcon={<ChevronDown size={8} strokeWidth={1.5} />}
                data={dataFilter}
                columns={columns}
                customStyles={customTableStyles}
                noDataComponent={<TableNoData title={t('futures:order_table:no_opening_order')} />}
            /> */}
            <TableV2 data={dataFilter} columns={columns} />
        </>
    );
};

export default FuturesOpenOrdersVndc;
