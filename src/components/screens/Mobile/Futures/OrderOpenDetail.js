import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import OrderProfit from 'components/screens/Futures/TradeRecord/OrderProfit';
import { OrderItem } from './TabOrders/OrderItemMobile';
import { useSelector } from 'react-redux';
import { renderCellTable, VndcFutureOrderType, getRatioProfit, fees } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { emitWebViewEvent, formatNumber, formatTime, getS3Url } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import Button from 'components/common/Button';
import { AlertContext } from 'components/common/layouts/LayoutMobile';
import { API_GET_FUTURES_ORDER } from 'redux/actions/apis';
import { ApiStatus, DefaultFuturesFee, FuturesOrderEnum } from 'redux/actions/const';
import fetchApi from 'utils/fetch-api';
import { getShareModalData } from 'components/screens/Mobile/Futures/TabOrders/ShareFutureMobile';
import EditSLTPVndcMobile from './EditSLTPVndcMobile';
import MiniTickerData from 'components/screens/Futures/MiniTickerData';
import CurrencyPopup from 'components/screens/Mobile/Futures/CurrencyPopup';
import ModifyOrder from './ModifyOrder';
import CloseOrderModalMobile from './CloseOrderModalMobile';
import AdjustPositionMargin from './AdjustPositionMargin';

const INITIAL_STATE = {
    socketStatus: false,
};
const OrderOpenDetail = ({
    order,
    isDark,
    pairConfig,
    decimalPrice = 0,
    onClose,
    forceFetchOrder,
    isTabHistory,
    decimalSymbol = 0,
    isVndcFutures
}) => {
    const { t, i18n: { language } } = useTranslation();
    const context = useContext(AlertContext);
    const [state, set] = useState(INITIAL_STATE);
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));
    const status = order?.status;
    const isTabOpen = status === 0 || status === 3;
    const oldOrder = useRef(order);
    const [data, setData] = useState({
        displaying_id: order?.displaying_id,
        price: +(status === VndcFutureOrderType.Status.PENDING ? order?.price : status === VndcFutureOrderType.Status.ACTIVE ? order?.open_price : order?.close_price),
        sl: +order?.sl,
        tp: +order?.tp,
    });
    const marketWatch = useSelector((state) => state.futures.marketWatch);
    const dataMarketWatch = marketWatch[order?.symbol];

    const [showEditSLTP, setShowEditSLTP] = useState(false);
    const [showEditMargin, setShowEditMargin] = useState(false);
    const rowData = useRef(null);
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const publicSocket = useSelector((state) => state.socket.publicSocket);
    const [visibleModalFees, setVisibleModalFees] = useState(false);
    const [showAddVol, setShowAddVol] = useState(false);
    const [openCloseOrderModal, setOpenCloseOrderModal] = useState(false);

    const subscribeFuturesSocket = (symbol) => {
        if (!publicSocket) {
            setState({ socketStatus: !!publicSocket });
        } else {
            if (
                !state.prevPair ||
                state.prevPair !== symbol ||
                !!publicSocket !== state.socketStatus
            ) {
                publicSocket.emit('subscribe:futures:ticker', symbol);
                setState({
                    socketStatus: !!publicSocket,
                    prevPair: symbol
                });
            }
        }
    };

    useEffect(() => {
        if (!order.symbol || order.status === VndcFutureOrderType.Status.CLOSED) return;
        subscribeFuturesSocket(order.symbol);
    }, [publicSocket, order.symbol]);

    const onConfirmSLTP = (e) => {
        // setData(e);
        setDisabled(true);
        fetchOrder('PUT', e, () => {
            localStorage.setItem('edited_id', e.displaying_id);
            context.alert.show('success', t('common:success'), t('futures:modify_order_success'));
            setShowEditSLTP(!showEditSLTP);
            forceFetchOrder();
        });
    };

    const onOpenModify = () => {
        rowData.current = {
            ...order,
            quoteAsset: pairConfig?.quoteAsset
        };
        // rowData.current = { ...oldOrder.current, ...data, quoteAsset: pairConfig?.quoteAsset };
        setShowEditSLTP(!showEditSLTP);
    };

    const onActions = (isDiff) => {
        if (!isDiff) {
            setOpenCloseOrderModal(true)
            // context.alert.show('warning',
            //     t('futures:close_order:modal_title', { value: order?.displaying_id }),
            //     t('futures:close_order:confirm_message', { value: order?.displaying_id }),
            //     null,
            //     () => {
            //         const params = {
            //             displaying_id: order?.displaying_id,
            //             special_mode: 1
            //         };
            //         fetchOrder('DELETE', params, () => {
            //             context.alert.show('success', t('common:success'),
            //                 t('futures:close_order:request_successfully', { value: order?.displaying_id }),
            //                 undefined,
            //                 undefined,
            //                 () => {
            //                     if (onClose) onClose();
            //                 }
            //             );
            //         });
            //     }
            // );
        } else {
            fetchOrder('PUT', data, () => {
                oldOrder.current = { ...oldOrder.current, ...data };
                forceFetchOrder();
                localStorage.setItem('edited_id', data.displaying_id);
                context.alert.show('success', t('common:success'), t('futures:modify_order_success'));
            });
        }
    };

    const fetchOrder = async (method = 'DELETE', params, cb) => {
        setLoading(true);
        try {
            const {
                status,
                data,
                message
            } = await fetchApi({
                url: API_GET_FUTURES_ORDER,
                options: { method },
                params: params,
            });
            if (status === ApiStatus.SUCCESS) {
                if (cb) cb(data?.orders);
            } else {
                const requestId = data?.data?.requestId && `(${data?.data?.requestId.substring(0, 8)})`;
                context.alert.show('error', t('common:failed'), t(`error:futures:${status || 'UNKNOWN'}`), requestId);
            }
        } catch (e) {
            if (e.message === 'Network Error' || !navigator?.onLine) {
                context.alert.show('error', t('common:failed'), t('error:futures:NETWORK_ERROR'));
            }
            console.log(e);
        } finally {
            setLoading(false);
            setTimeout(() => {
                setDisabled(false);
            }, 1000);
        }
    };

    const renderLiqPrice = (row, returnNumber) => {
        const size = (row?.side === VndcFutureOrderType.Side.SELL ? -row?.quantity : row?.quantity);
        const number = (row?.side === VndcFutureOrderType.Side.SELL ? -1 : 1);
        const swap = row?.swap || 0
        const funding = row?.funding_fee?.margin ? Math.abs(row?.funding_fee?.margin) : 0
        const liqPrice = (size * row?.open_price + row?.fee + funding + swap - row?.margin) / (row?.quantity * (number - DefaultFuturesFee.NamiFrameOnus));
        if (returnNumber) row?.status === VndcFutureOrderType.Status.ACTIVE ? liqPrice : 0;
        return row?.status === VndcFutureOrderType.Status.ACTIVE && liqPrice > 0 ? formatNumber(liqPrice, decimalPrice, 0, true) : '-';
    };

    const renderSlTp = (value, ratio = false) => {
        if (value) {
            return formatNumber(value, decimalPrice, 0, true) + (ratio ? ' (' + getRatioProfit(value, order) + '%)' : '')
        }
        return '-';
    };

    const price = useMemo(() => {
        return +(status === VndcFutureOrderType.Status.PENDING ? order?.price : status === VndcFutureOrderType.Status.ACTIVE ? order?.open_price : order?.close_price);
    }, [order]);

    const canShare = [VndcFutureOrderType.Status.ACTIVE, VndcFutureOrderType.Status.CLOSED].includes(order.status);
    const openShare = () => {
        if (!canShare) return null;
        const emitData = getShareModalData({
            order,
            pairPrice: dataMarketWatch
        });
        emitWebViewEvent(JSON.stringify(emitData));
    };

    const renderQuoteprice = useCallback(() => {
        return order?.side === VndcFutureOrderType.Side.BUY
            ? <MiniTickerData key={order?.displaying_id + 'bid'} initPairPrice={dataMarketWatch} dataKey={'bid'} symbol={order?.symbol} />
            : <MiniTickerData key={order?.displaying_id + 'ask'} initPairPrice={dataMarketWatch} dataKey={'ask'} symbol={order?.symbol} />;
    }, [order]);

    const orderStatus = useMemo(() => {
        const pending = !isTabHistory && order.status === VndcFutureOrderType.Status.PENDING || order.status === VndcFutureOrderType.Status.REQUESTING;
        return { pending };
    }, [order]);

    const renderFee = (order) => {
        const assetId = order?.fee_metadata?.close_order?.currency ?? 72;
        const ratio = fees.find(rs => rs.assetId === assetId)?.ratio;
        return (
            <div className="flex items-center justify-end space-x-1">
                <span>{ratio}</span>
                <img src={getS3Url(`/images/coins/64/${assetId}.png`)} width={16} height={16} />
            </div>
        )
    }

    const renderMargin = () => {
        const visible = !((order?.metadata?.dca_order_metadata || order?.metadata?.partial_close_metadata) && orderStatus.pending)
        return (
            <div className="flex items-center justify-end space-x-1" onClick={() => visible && setShowEditMargin(true)}>
                <span>{t('futures:margin')}</span>
                {visible && <img src={getS3Url('/images/icon/ic_add.png')} height={16} width={16} className='min-w-[16px]' />}
            </div>
        )
    }

    const onModifyFee = () => {
        setVisibleModalFees(true);
    }

    const isModify = order?.sl > 0 || order?.tp > 0;

    return (
        <div className="p-6 py-5 -mx-6 border-b border-onus-line">
            {visibleModalFees && <CurrencyPopup
                visibleModalFees={visibleModalFees}
                setVisibleModalFees={setVisibleModalFees}
                forceFetchOrder={forceFetchOrder}
                dataRow={order}
            />
            }
            {showEditSLTP &&
                <EditSLTPVndcMobile
                    onusMode={true}
                    isVisible={showEditSLTP}
                    order={rowData.current}
                    onClose={() => !disabled && setShowEditSLTP(false)}
                    status={rowData.current.status}
                    onConfirm={onConfirmSLTP}
                    lastPrice={dataMarketWatch?.lastPrice}
                    isMobile
                    disabled={disabled}
                />
            }
            {
                showEditMargin &&
                <AdjustPositionMargin
                    order={order}
                    pairPrice={dataMarketWatch}
                    onClose={() => setShowEditMargin()}
                    forceFetchOrder={forceFetchOrder}
                />
            }
            {
                showAddVol &&
                <ModifyOrder
                    order={order}
                    pairPrice={dataMarketWatch}
                    onClose={() => setShowAddVol(false)}
                    pairConfig={pairConfig}
                    forceFetchOrder={forceFetchOrder}
                />
            }
            {openCloseOrderModal &&
                <CloseOrderModalMobile
                    onClose={() => setOpenCloseOrderModal(false)}
                    order={order}
                    pairPrice={dataMarketWatch}
                    forceFetchOrder={forceFetchOrder}

                />
            }
            <div className="flex items-center text-[10px] font-medium text-onus-grey mb-3 leading-[1.125rem]">
                <div>ID #{order?.displaying_id}</div>
                <div className="bg-onus-grey h-[2px] w-[2px] rounded-[50%] mx-1"></div>
                <div>{formatTime(order?.created_at, 'yyyy-MM-dd')}</div>
                <div className="bg-onus-grey h-[2px] w-[2px] rounded-[50%] mx-1"></div>
                <div>{formatTime(order?.created_at, 'HH:mm:ss')}</div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-[2px]">
                    {/* <SideComponent isDark={isDark} isBuy={order.side === VndcFutureOrderType.Side.BUY}>{renderCellTable('side', order)}</SideComponent> */}
                    <div className="flex items-center">
                        <div
                            className="font-semibold leading-[1.375rem] mr-[5px]">{(pairConfig?.baseAsset ?? '-') + '/' + (pairConfig?.quoteAsset ?? '-')}</div>
                        <div
                            className="text-onus-white bg-onus-bg3 text-xs font-medium leading-5 px-[7px] rounded-[3px]">
                            {order?.leverage}x
                        </div>
                        {canShare ?
                            <img className="ml-2"
                                onClick={openShare} src={getS3Url('/images/icon/ic_share_onus.png')} height={20}
                                width={20} />
                            : null
                        }
                    </div>
                    <div
                        className={`text-xs font-medium ${order.side === FuturesOrderEnum.Side.BUY ? 'text-onus-green' : 'text-onus-red'}`}>
                        {order?.metadata?.dca_order_metadata && orderStatus.pending && <span>{t('futures:mobile:adjust_margin:added_volume')}&nbsp;/&nbsp;</span>}
                        {order?.metadata?.partial_close_metadata && orderStatus.pending && <span>{t('futures:mobile:adjust_margin:close_partially')}&nbsp;/&nbsp;</span>}
                        <span>{renderCellTable('side', order, t, language)}</span>&nbsp;/&nbsp;
                        <span>{renderCellTable('type', order, t, language)}</span>
                    </div>
                </div>
                <div className="flex items-center">
                    {orderStatus.pending ?
                        <div
                            className={`bg-onus-bg3 py-[5px] px-4 rounded-[100px] font-semibold text-xs ${orderStatus.cancelled ? 'text-onus-grey' : 'text-onus-orange bg-onus-orange/[0.1]'}`}>
                            {t(`futures:mobile:${orderStatus.cancelled ? 'cancelled_order' : 'pending_order'}`)}
                        </div>
                        :
                        <div className="text-xs text-right" onClick={openShare}>
                            <div className="text-xs font-medium text-onus-green float-right">
                                <OrderProfit key={order.displaying_id} onusMode={true} className="flex flex-col text-right"
                                    decimal={isVndcFutures ? decimalSymbol : decimalSymbol + 2}
                                    order={order} initPairPrice={dataMarketWatch} isTabHistory={false}
                                    isMobile />
                            </div>
                        </div>
                    }
                </div>
            </div>
            {(isModify || isTabOpen) &&
                <div className="flex rounded-md border border-onus-bg3 p-2 mt-3">
                    <OrderItem
                        fullWidth
                        label={isTabOpen ? t('futures:mobile:quote_price') : t('futures:stop_loss')}
                        value={isTabOpen ? renderQuoteprice() : renderSlTp(order?.sl, !isTabOpen)}
                        className="text-center border-r border-onus-bg3"
                        valueClassName={`${!isTabOpen ? 'text-onus-red' : ''}`}
                    />
                    <OrderItem
                        fullWidth
                        label={isTabOpen ? t('futures:order_table:open_price') : t('futures:take_profit')}
                        value={isTabOpen ? formatNumber(price, decimalPrice, 0, true) : renderSlTp(order?.tp, !isTabOpen)}
                        className="text-center"
                        valueClassName={`${!isTabOpen ? 'text-onus-green' : ''}`}
                    />
                </div>
            }
            <div className="flex flex-wrap w-full mt-5 justify-between">
                <OrderItem
                    label={!isTabOpen ? t('futures:order_table:open_price') : t('futures:stop_loss')}
                    value={!isTabOpen ? formatNumber(price, decimalPrice, 0, true) : renderSlTp(order?.sl)}
                    className="py-[2px] space-y-[2px] mb-2"
                    valueClassName={`${isTabOpen ? order?.sl > 0 ? 'text-onus-red' : 'text-onus-white' : ''}`}
                />
                <OrderItem
                    center
                    label={t('futures:order_table:volume')}
                    className="py-[2px] space-y-[2px] mb-2"
                    value={formatNumber(order?.order_value, decimalSymbol, 0, true)}
                />
                <OrderItem
                    label={renderMargin()}
                    className="py-[2px] space-y-[2px] text-right mb-2"
                    value={order?.margin ? formatNumber(order?.margin, decimalSymbol, 0, false) : '-'}
                />
                <OrderItem
                    label={!isTabOpen ? t('futures:mobile:quote_price') : t('futures:take_profit')}
                    value={!isTabOpen ? renderQuoteprice() : renderSlTp(order?.tp)}
                    className="py-[2px] space-y-[2px] "
                    valueClassName={`${isTabOpen ? order?.tp > 0 ? 'text-onus-green' : 'text-onus-white' : ''}`}
                />
                <OrderItem
                    center
                    label={t('futures:mobile:liq_price')}
                    className="py-[2px] space-y-[2px]"
                    value={renderLiqPrice(order)}
                />
                <OrderItem
                    dropdown
                    label={t('common:fee')}
                    className="py-[2px] space-y-[2px] text-right"
                    value={renderFee(order)}
                    onClick={onModifyFee}
                />
            </div>
            <div className="flex w-full mt-4 space-x-2">
                {
                    order.status === VndcFutureOrderType.Status.ACTIVE &&
                    <div className="w-full">
                        <Button
                            title={t('futures:mobile:adjust_margin:add_volume')}
                            className="!h-[36px] bg-onus-bg3 !text-onus-grey !font-semibold"
                            componentType="button"
                            type="primary"
                            onClick={() => setShowAddVol(true)}
                        />
                    </div>
                }
                {!((order?.metadata?.dca_order_metadata || order?.metadata?.partial_close_metadata) && orderStatus.pending) &&
                    <div className="w-full">
                        <Button
                            title={t(`futures:tp_sl:${isModify ? 'modify' : 'add'}_tpsl`)}
                            className="!h-[36px] bg-onus-bg3 !text-onus-grey !font-semibold"
                            componentType="button"
                            type="primary"
                            onClick={onOpenModify}
                        />
                    </div>
                }
                <div className="w-full">
                    <Button
                        title={t(`common:close`)}
                        className="!h-[36px] bg-onus-bg3 !text-onus-grey !font-semibold"
                        componentType="button"
                        type="primary"
                        onClick={() => onActions()}
                        disabled={loading}
                    />
                </div>
            </div>
        </div>
    );
};

export default OrderOpenDetail;
