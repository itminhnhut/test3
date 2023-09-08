import React, { useEffect, useMemo, useRef, useState } from 'react';
import { formatNumber, formatTime, getLoginUrl, countDecimals, getS3Url, convertSymbol } from 'redux/actions/utils';
import FuturesRecordSymbolItem from 'components/screens/Futures/TradeRecord/SymbolItem';
import { getRatioProfit, VndcFutureOrderType, fees_futures } from './VndcFutureOrderType';
import OrderProfit from 'components/screens/Futures/TradeRecord/OrderProfit';
import { useSelector } from 'react-redux';
import { API_GET_FUTURES_ORDER } from 'redux/actions/apis';
import { ApiStatus, DefaultFuturesFee } from 'redux/actions/const';
import { useTranslation } from 'next-i18next';
import fetchApi from 'utils/fetch-api';
import { isArray } from 'lodash';
import Link from 'next/link';
import OrderClose from './OrderClose';
import TableV2 from 'components/common/V2/TableV2';
import ShareFuturesOrder from 'components/screens/Futures/ShareFuturesOrder';
import classNames from 'classnames';
import EditSLTPV2 from 'components/screens/Futures/PlaceOrder/EditOrderV2/EditSLTPV2';
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';
import ModifyOrder from 'components/screens/Futures/PlaceOrder/EditOrderV2/ModifyOrder';
import FuturesOrderDetailModal from 'components/screens/Futures/FuturesModal/FuturesOrderDetailModal';
import FututesShareModal from 'components/screens/Futures/FuturesModal/FututesShareModal';
import FuturesCloseOrder from 'components/screens/Futures/FuturesModal/FuturesCloseOrder';
import Edit from 'components/svg/Edit';
import { useRouter } from 'next/router';
import FuturesCloseAllOrder from 'components/screens/Futures/FuturesModal/FuturesCloseAllOrder';
import PopoverV2 from 'components/common/V2/PopoverV2';
import SortIcon from 'components/screens/Nao_futures/SortIcon';
import FuturesFeeModal from 'components/screens/Futures/PlaceOrder/EditFee/FuturesFeeModal';

const FuturesOpenOrdersVndc = ({ pairConfig, onForceUpdate, hideOther, isAuth, isVndcFutures, pair, status }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const ordersList = useSelector((state) => state?.futures?.ordersList);
    const marketWatch = useSelector((state) => state.futures.marketWatch);
    const isPosition = status === VndcFutureOrderType.Status.ACTIVE;
    const assetConfig = useSelector((state) => state.utils.assetConfig);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const rowData = useRef(null);
    const allPairConfigs = useSelector((state) => state.futures.pairConfigs);
    const [showEditSLTP, setShowEditSLTP] = useState(false);
    const [showEditVol, setShowEditVol] = useState(false);
    const [showOrderDetail, setShowOrderDetail] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showCloseModal, setShowCloseModal] = useState(false);
    const [showCloseAll, setShowCloseAll] = useState(false);
    const [showFees, setShowFees] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        if (ordersList.length > 0) {
            setLoading(false);
            return;
        }
        const timeOutLoading = setTimeout(() => {
            setLoading(false);
        }, 700);
        return () => clearTimeout(timeOutLoading);
    }, []);

    const [closeType, setCloseType] = useState();
    const btnCloseAll = useRef();

    const router = useRouter();

    const getDecimalPrice = (config) => {
        const decimalScalePrice = config?.filters.find((rs) => rs.filterType === 'PRICE_FILTER') ?? 1;
        return countDecimals(decimalScalePrice?.tickSize);
    };

    const [page, setPage] = useState(0);
    const LIMIT = 10;
    const hasNext = useRef(true);

    useEffect(() => {
        setPage(0);
    }, [status]);

    const dataSource = useMemo(() => {
        const filteredData = [0, 1, 2].includes(status) ? ordersList.filter((e) => e.status === status) : ordersList;

        return filteredData.map((item) => {
            const symbol = allPairConfigs.find((rs) => rs.symbol === item.symbol);
            const decimalSymbol = assetConfig.find((rs) => rs.id === symbol?.quoteAssetId)?.assetDigit ?? 0;
            const decimalScalePrice = getDecimalPrice(symbol);
            item['decimalSymbol'] = decimalSymbol;
            item['decimalScalePrice'] = decimalScalePrice;
            return item;
        });
    }, [ordersList, status]);

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

        let result = filters.symbol ? items.filter((item) => item?.symbol === filters.symbol) : items;
        if (result.length <= (page + 1) * LIMIT) {
            hasNext.current = false;
        } else {
            hasNext.current = true;
        }
        result = result.slice(page * LIMIT, (page + 1) * LIMIT);
        return result;
    }, [hideOther, dataSource, filters, pair, status, page]);

    const closeTypes = useMemo(() => {
        return {
            position: [
                {
                    type: 'ALL',
                    label: t('futures:mobile.close_all_positions.close_type.close_all', { pair: pairConfig?.quoteAsset })
                },
                {
                    type: 'PROFIT',
                    label: t('futures:mobile.close_all_positions.close_type.close_all_profit', { pair: pairConfig?.quoteAsset })
                },
                {
                    type: 'LOSS',
                    label: t('futures:mobile.close_all_positions.close_type.close_all_loss', { pair: pairConfig?.quoteAsset })
                },
                {
                    type: 'PAIR',
                    label: t('futures:mobile.close_all_positions.close_type.close_all_pair', { pair: pairConfig?.baseAsset + '/' + pairConfig?.quoteAsset })
                }
            ],
            openOrders: [
                {
                    type: 'ALL_PENDING',
                    label: t('futures:mobile.close_all_positions.close_type.close_all_pending', { pair: pairConfig?.quoteAsset })
                },
                {
                    type: 'ALL_PAIR_PENDING',
                    label: t('futures:mobile.close_all_positions.close_type.close_all_pair_pending', {
                        pair: pairConfig?.baseAsset + '/' + pairConfig?.quoteAsset
                    })
                }
            ]
        };
    }, [pairConfig]);

    const renderBtnCloseAll = () => {
        return (
            <PopoverV2
                ref={btnCloseAll}
                label={<CloseButton disabled={!dataFilter.length}>{t(isPosition ? 'common:close_all_orders' : 'common:cancel_all_orders')}</CloseButton>}
                className="w-max py-2 text-sm !mt-2 z-20 !left-0"
            >
                <div className="overflow-hidden rounded-md shadow-lg bg-white dark:bg-darkBlue-3 w-max">
                    <div className="relative space-y-2">
                        {closeTypes[isPosition ? 'position' : 'openOrders'].map((item, index) => {
                            return (
                                <div
                                    onClick={() => {
                                        onHandleClick('delete_all', item);
                                        btnCloseAll.current.close();
                                    }}
                                    key={index}
                                    className={classNames(
                                        'text-left py-2 px-4 cursor-pointer w-full text-sm text-txtPrimary dark:text-white hover:bg-gray-13 dark:hover:bg-hover-dark'
                                    )}
                                >
                                    {item.label}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </PopoverV2>
        );
    };

    const renderFee = (order) => {
        const assetId = order?.fee_metadata?.close_order?.currency ?? 72;
        const ratio = fees_futures.find((rs) => rs.assetId === assetId)?.ratio;
        return (
            <div onClick={() => onHandleClick('fee', order)} className="flex items-center justify-end space-x-1">
                <SortIcon size={20} color="currentColor" activeColor="currentColor" className="text-gray-1 dark:text-gray-7" />
                <span>{ratio}</span>
                <img src={getS3Url(`/images/coins/64/${assetId}.png`)} width={16} height={16} />
            </div>
        );
    };

    // { key: 'pair', dataIndex: 'pair', title: 'Coin', fixed: 'left', align: 'left', width: pairColumnsWidth },
    const columns = useMemo(
        () => [
            {
                key: 'id',
                dataIndex: 'id',
                title: 'ID / ' + t('common:time'),
                align: 'left',
                width: 192,
                render: (_row, item) => (
                    <div className="text-txtPrimary dark:text-gray-4 font-normal text-sm h-full flex flex-col justify-between">
                        <div>{formatTime(item.opened_at, 'HH:mm:ss dd/MM/yyyy')}</div>
                        <div>ID #{item.displaying_id}</div>
                    </div>
                ),
                sortable: true
            },
            {
                key: 'pair',
                dataIndex: 'symbol',
                title: t('common:pair'),
                align: 'left',
                width: 205,
                render: (row, item) => {
                    let specialOrder;
                    if (item?.metadata?.dca_order_metadata) {
                        if (!item?.meta_data?.dca_order_metadata?.is_main_order) {
                            specialOrder = t('futures:mobile:adjust_margin:added_volume');
                        }
                    }
                    if (item?.metadata?.partial_close_metadata) {
                        if (!item?.meta_data?.partial_close_metadata?.is_main_order) {
                            specialOrder = t('futures:mobile:adjust_margin:close_partially');
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
                            specialOrder={!isPosition ? specialOrder : null}
                            canShare={isPosition}
                        />
                    );
                },
                sortable: true
            },
            {
                key: 'pnl',
                visible: isPosition,
                title: 'PNL (ROE%)',
                align: 'left',
                width: 138,
                render: (row) => {
                    if (!isPosition) return undefined;
                    const isVndc = row?.symbol.indexOf('VNDC') !== -1 || row?.symbol.indexOf('VNST') !== -1;
                    const symbol = convertSymbol(row?.symbol);
                    const ticker = marketWatch[symbol];
                    return (
                        <OrderProfit
                            className="w-full !text-sm"
                            percentClassName="!justify-start"
                            key={row.displaying_id}
                            order={row}
                            initPairPrice={ticker}
                            setShareOrderModal={() => setShareOrder(row)}
                            decimal={isVndc ? row?.decimalSymbol : row?.decimalSymbol + 2}
                        />
                    );
                },
                sortable: false
            },
            {
                key: 'volume_margin',
                visible: isPosition,
                dataIndex: 'order_value',
                title: `${t('futures:order_table:volume')} / ${t('futures:margin')}`,
                align: 'left',
                width: 204,
                render: (row, item) =>
                    item?.order_value ? (
                        <div className="w-full flex items-center space-x-3 font-normal text-sm text-txtSecondary dark:text-darkBlue-5">
                            <Edit onClick={() => onHandleClick('vol', item)} className="cursor-pointer hover:opacity-60" />
                            <div className="flex flex-col gap-1">
                                <div>
                                    {t('common:vol')}:{' '}
                                    <span className="text-txtPrimary dark:text-gray-4">
                                        {formatNumber(item?.order_value, item?.decimalScalePrice, 0, true)}
                                    </span>
                                </div>
                                <div>
                                    {t('futures:margin')}:{' '}
                                    <span className="text-txtPrimary dark:text-gray-4">{formatNumber(item?.margin, item?.decimalScalePrice, 0, true)}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        '-'
                    ),
                sortable: true
            },
            {
                key: 'market_price-open_price',
                visible: !isPosition,
                title: `${t('futures:mobile.market_price')} / ${t('futures:order_table:open_price')}`,
                align: 'left',
                width: 200,
                render: (row) => {
                    const symbol = convertSymbol(row?.symbol);
                    const ticker = marketWatch[symbol];
                    return (
                        <div className="flex flex-col gap-1 font-normal text-sm text-txtSecondary dark:text-darkBlue-5">
                            <div>
                                {t('common:market')}:{' '}
                                <span className="text-txtPrimary dark:text-gray-4">
                                    {ticker && formatNumber(ticker?.lastPrice, row?.decimalScalePrice, 0, true)}
                                </span>
                            </div>
                            <div>
                                {t('futures:order_table.open')}:{' '}
                                <span className="text-txtPrimary dark:text-gray-4">{formatNumber(row?.price, row?.decimalScalePrice, 0, true)}</span>
                            </div>
                        </div>
                    );
                },
                sortable: false
            },
            {
                key: 'sltp',
                title: `${t('futures:stop_loss')} / ${t('futures:take_profit')}`,
                align: 'left',
                width: 228,
                render: (row) => (
                    <div className="flex items-center w-full space-x-3">
                        {row.status !== VndcFutureOrderType.Status.CLOSED && (
                            <Edit onClick={() => onHandleClick('sltp', row)} className="cursor-pointer hover:opacity-60" />
                        )}
                        <div className="flex flex-col gap-1 font-normal text-sm text-txtSecondary dark:text-darkBlue-5">
                            <div>
                                SL:{' '}
                                <span className="text-red-2 dark:text-red">
                                    {row?.sl
                                        ? `${formatNumber(row?.sl, row?.decimalScalePrice, 0, true)} ${isPosition ? `(${getRatioProfit(row?.sl, row)}%)` : ''}`
                                        : '_'}
                                </span>
                            </div>
                            <div>
                                TP:{' '}
                                <span className="text-green-3 dark:text-teal">
                                    {row?.tp
                                        ? `${formatNumber(row?.tp, row?.decimalScalePrice, 0, true)} ${isPosition ? `(${getRatioProfit(row?.tp, row)}%)` : ''}`
                                        : '_'}
                                </span>
                            </div>
                        </div>
                    </div>
                ),
                sortable: false
            },
            {
                key: 'open_price',
                visible: isPosition,
                title: t('futures:order_table:open_price'),
                align: 'right',
                width: 138,
                render: (row, item) => (
                    <div className="text-txtPrimary dark:text-gray-4 text-sm font-normal">
                        {formatNumber(item?.open_price, item?.decimalScalePrice, 0, true)}
                    </div>
                ),
                sortable: false
            },
            {
                key: 'market_price',
                visible: isPosition,
                title: t('futures:mobile.market_price'),
                align: 'right',
                width: 138,
                render: (row, item) => {
                    const symbol = convertSymbol(row?.symbol);
                    const ticker = marketWatch[symbol];
                    return (
                        ticker && (
                            <div className="text-txtPrimary dark:text-gray-4 text-sm font-normal">
                                {formatNumber(ticker?.[row?.side === VndcFutureOrderType.Side.BUY ? 'bid' : 'ask'], row?.decimalScalePrice, 0, true)}
                            </div>
                        )
                    );
                },
                sortable: false
            },
            {
                key: 'volume',
                visible: !isPosition,
                title: t('futures:order_table:volume'),
                align: 'left',
                width: 138,
                render: (row, item) => <span className="text-sm">{formatNumber(item?.order_value, item?.decimalScalePrice, 0, true)}</span>,
                sortable: false
            },
            {
                key: 'last_price',
                title: t('futures:order_table:last_price'),
                align: 'right',
                width: 138,
                render: (row) => {
                    const symbol = convertSymbol(row?.symbol);
                    const ticker = marketWatch[symbol];
                    return ticker && <span className="text-sm">{formatNumber(ticker?.lastPrice, row?.decimalScalePrice, 0, true)}</span>;
                },
                sortable: true
            },
            {
                key: 'liq_price',
                visible: isPosition,
                title: t('futures:calulator:liq_price'),
                align: 'right',
                width: 144,
                render: (row) => <span className="text-sm">{renderLiqPrice(row, false)}</span>,
                sortable: true
            },
            {
                key: 'margin',
                visible: !isPosition,
                title: t('futures:margin'),
                align: 'right',
                width: 120,
                render: (row) => <span className="text-sm">{formatNumber(row?.margin, row?.decimalScalePrice, 0, true)}</span>,
                sortable: true
            },
            {
                key: 'fee',
                title: t('common:fee'),
                align: 'right',
                width: 138,
                render: renderFee
            },
            {
                key: 'status',
                visible: !isPosition,
                title: t('common:status'),
                align: 'right',
                width: 178,
                render: (row) => (
                    <div className="px-4 py-1 bg-yellow-100/[0.15] text-yellow-100 font-normal text-sm rounded-[80px] text-center">
                        {t('futures:mobile.pending_order')}
                    </div>
                ),
                sortable: true
            },
            {
                key: 'operator',
                title: renderBtnCloseAll(),
                align: 'center',
                fixed: 'right',
                width: 164,
                render: (row) => <CloseButton onClick={() => onHandleClick('delete', row)}>{t('common:close')}</CloseButton>
            }
        ],
        [marketWatch, pair, dataFilter, isPosition]
    );

    const fetchOrder = async (method = 'GET', params, cb) => {
        try {
            const {
                status,
                data,
                message: msg
            } = await fetchApi({
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
                    message: msg
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

    const flag = useRef(false);
    const onHandleClick = (key, data) => {
        if (key !== 'delete_all') rowData.current = data;
        switch (key) {
            case 'vol':
                flag.current = true;
                setShowEditVol(true);
                break;
            case 'router':
                flag.current = true;
                router?.push('/futures/' + data.symbol);
                break;
            case 'sltp':
                flag.current = true;
                setShowEditSLTP(true);
                break;
            case 'share':
                flag.current = true;
                setShowShareModal(true);
                break;
            case 'delete':
                flag.current = true;
                setShowCloseModal(true);
                break;
            case 'delete_all':
                flag.current = true;
                setCloseType(data);
                setShowCloseAll(true);
                break;
            case 'fee':
                flag.current = true;
                setShowFees(true);
                break;
            case 'detail':
                if (flag.current) {
                    flag.current = false;
                    return;
                }
                // router.push('/futures/order/' + data?.displaying_id);
                setShowOrderDetail(true);
                break;
            default:
                break;
        }
    };

    const onConfirmEdit = (params) => {
        fetchOrder('PUT', params, (e) => {
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

    const decimals = useMemo(() => {
        return {
            price: rowData.current?.decimalScalePrice || 0,
            symbol: rowData.current?.decimalSymbol || 0
        };
    }, [showEditSLTP, showOrderDetail, showEditVol, showShareModal, showCloseModal]);

    const pairConfigDetail = useMemo(() => {
        return allPairConfigs.find((rs) => rs.symbol === rowData.current?.symbol);
    }, [showEditSLTP, showOrderDetail, showEditVol, showShareModal, showCloseModal, allPairConfigs]);

    if (!isAuth)
        return (
            <div className="cursor-pointer flex items-center justify-center h-full">
                <a
                    href={getLoginUrl('sso', 'login')}
                    className="w-[200px] bg-dominant !text-white font-medium text-center py-2.5 rounded-lg cursor-pointer hover:opacity-80"
                >
                    {t('futures:order_table:login_to_continue')}
                </a>
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
            <FuturesFeeModal order={rowData.current} isVisible={showFees} onClose={() => setShowFees(false)} />
            {/* <OrderClose open={showModalDelete} onClose={() => setShowModalDelete(false)} onConfirm={onConfirm} data={rowData.current} /> */}
            {/* <ShareFuturesOrder isVisible={!!shareOrder} order={shareOrder} pairPrice={marketWatch[shareOrder?.symbol]} onClose={() => setShareOrder(null)} /> */}
            <FuturesOrderDetailModal order={rowData.current} isVisible={showOrderDetail} onClose={() => setShowOrderDetail(false)} decimals={decimals} />
            <FututesShareModal order={rowData.current} isVisible={showShareModal} onClose={() => setShowShareModal(false)} decimals={decimals} />
            <FuturesCloseOrder
                order={rowData.current}
                isVisible={showCloseModal}
                onClose={() => setShowCloseModal(false)}
                decimals={decimals}
                marketWatch={marketWatch}
                pairConfig={pairConfigDetail}
            />
            <FuturesCloseAllOrder
                isVisible={showCloseAll}
                onClose={() => {
                    setShowCloseAll(false);
                    setPage(0);
                }}
                marketWatch={marketWatch}
                pairConfig={pairConfig}
                closeType={closeType}
                isPosition={isPosition}
            />
            <EditSLTPV2
                isVisible={showEditSLTP}
                order={rowData.current}
                onClose={() => setShowEditSLTP(false)}
                status={rowData.current?.status}
                onConfirm={onConfirmEdit}
                pairConfig={pairConfigDetail}
                decimals={decimals}
                marketWatch={marketWatch}
            />
            <ModifyOrder
                isVisible={showEditVol}
                order={rowData.current}
                onClose={() => setShowEditVol(false)}
                pairConfig={pairConfigDetail}
                decimals={decimals}
                marketWatch={marketWatch}
            />
            <TableV2
                loading={loading}
                data={dataFilter}
                onRowClick={(e) => onHandleClick('detail', e)}
                columns={columns}
                shadowWithFixedCol
                scroll={{ x: true }}
                height={400}
                tableStyle={{
                    padding: '14px 16px',
                    headerFontStyle: {
                        height: '68px !important',
                        'padding-top': '0px !important',
                        'padding-bottom': '0px !important'
                    }
                }}
                pagingPrevNext={{
                    language,
                    page: page,
                    hasNext: hasNext.current,
                    onChangeNextPrev: (e) => setPage(page + e)
                }}
            />
        </>
    );
};

const CloseButton = ({ children, onClick, disabled = false }) => {
    return (
        <button
            className="w-full h-[36px] flex items-center justify-center font-semibold text-sm text-txtPrimary dark:text-darkBlue-5 disabled:text-txtDisabled dark:disabled:text-txtDisabled-dark bg-gray-13 dark:bg-dark-2 cursor-pointer rounded-md"
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default FuturesOpenOrdersVndc;
