import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import colors from 'styles/colors';
import { formatNumber, formatTime, getS3Url } from 'redux/actions/utils';
import OrderProfit from 'components/screens/Futures/TradeRecord/OrderProfit';
import { useTranslation } from 'next-i18next';
import { renderCellTable, VndcFutureOrderType, getRatioProfit, fees, modeOrders } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import Big from 'big.js';
import { DefaultFuturesFee, FuturesOrderEnum, PublicSocketEvent } from 'redux/actions/const';
import { FUTURES_RECORD_CODE } from 'components/screens/Futures/TradeRecord/RecordTableTab';
import MiniTickerData from 'components/screens/Futures/MiniTickerData';
import Emitter from 'redux/actions/emitter';
import FuturesMarketWatch from 'models/FuturesMarketWatch';
import { useSelector } from 'react-redux';
import { ChevronDown, ChevronUp } from 'react-feather';
import classnames from 'classnames'

const OrderItemMobile = ({
    order,
    onShowModal,
    mode,
    onShowDetail,
    symbol,
    allowButton,
    tab,
    decimalSymbol = 0,
    decimalScalePrice = 0,
    isVndcFutures,
    collapse,
    setCollapse
}) => {
    const { t } = useTranslation();
    const isTabHistory = tab === FUTURES_RECORD_CODE.orderHistory;
    const isTabOpen = tab === FUTURES_RECORD_CODE.openOrders;
    const isTabPosition = tab === FUTURES_RECORD_CODE.position;
    const [pairPrice, setPairPrice] = useState(null);
    const marketWatch = useSelector((state) => state.futures.marketWatch);
    const [lastSymbol, setLastSymbol] = useState(null);
    const dataMarketWatch = marketWatch[order?.symbol];

    useEffect(() => {
        if (order?.symbol !== lastSymbol) {
            setLastSymbol(order?.symbol);
            setPairPrice(null);
        }
    }, [order]);


    useEffect(() => {
        if (!order.symbol || order.status === VndcFutureOrderType.Status.CLOSED) return;
        Emitter.on(PublicSocketEvent.FUTURES_TICKER_UPDATE + order.symbol, async (data) => {
            if (order.symbol === data?.s && data?.p > 0) {
                const _pairPrice = FuturesMarketWatch.create(data);
                setPairPrice(_pairPrice);
            }
        });
        return () => {
            Emitter.off(PublicSocketEvent.FUTURES_TICKER_UPDATE + order.symbol);
        };
    }, [order?.symbol]);

    const getOpenPrice = (row, pairPrice) => {
        let text = row?.price ? formatNumber(row?.price, 8, 0, true) : 0;
        switch (row.status) {
            case VndcFutureOrderType.Status.PENDING:
                let bias = null;
                const value = row['price'];
                if (!pairPrice) return null;
                const openPrice = row.side === VndcFutureOrderType.Side.BUY ? pairPrice?.ask : pairPrice?.bid;
                const closePrice = row.side === VndcFutureOrderType.Side.BUY ? pairPrice?.bid : pairPrice?.ask;
                if (pairPrice?.lastPrice > 0 && value > 0) {
                    let biasValue = +Big(value)
                        .minus(openPrice);
                    const formatedBias = formatNumber(biasValue, 8, 0, true);
                    bias =
                        biasValue > 0 ? (
                            <span>
                                (<span className="text-onus-green">+{formatedBias}</span>)
                            </span>
                        ) : (
                            <span>
                                (<span className="text-onus-red">{formatedBias}</span>)
                            </span>
                        );
                }
                text = row.price ? formatNumber(row.price, 8) : '';
                return <div>{text}</div>;
            case VndcFutureOrderType.Status.ACTIVE:
                text = row.open_price ? formatNumber(row.open_price, 8) : '';
                return <div>{text}</div>;
            case VndcFutureOrderType.Status.CLOSED:
                text = row.close_price ? formatNumber(row.close_price, 8) : '';
                return <div>{text}</div>;
            default:
                return <div>{text}</div>;

        }
    };

    const renderLiqPrice = (row) => {
        const size = (row?.side === VndcFutureOrderType.Side.SELL ? -row?.quantity : row?.quantity);
        const number = (row?.side === VndcFutureOrderType.Side.SELL ? -1 : 1);
        const liqPrice = (size * row?.open_price + row?.fee - row?.margin) / (row?.quantity * (number - DefaultFuturesFee.NamiFrameOnus));
        return row?.status === VndcFutureOrderType.Status.ACTIVE && liqPrice > 0 ? formatNumber(liqPrice, decimalScalePrice, 0, false) : '-';
    };

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
            default:
                return '';
        }
    };

    const renderSlTp = (value, ratio = false) => {
        if (value) {
            return formatNumber(value) + (ratio ? ' (' + getRatioProfit(value, order) + '%)' : '')
        }
        return '-';
    };

    const isModal = useRef(false);

    const actions = (action, key) => {
        if (action === 'modal') {
            isModal.current = true;
            onShowModal(order, key)
        }
        if (action === 'delete') {
            isModal.current = true;
            onShowModal(order, 'delete');
        }
        if (action === 'detail' && order?.status !== VndcFutureOrderType.Status.REQUESTING) {
            if (isModal.current) {
                isModal.current = false;
                return;
            }
            onShowDetail(order, isTabHistory);
        }
        if (action === 'expand' && isShortcut) {
            if (isModal.current) {
                isModal.current = false;
                return;
            }
            if (setCollapse) {
                setCollapse(order?.displaying_id !== collapse ? order?.displaying_id : null)
            }
        }
    };

    let profit = 0;
    const canShare = [VndcFutureOrderType.Status.ACTIVE, VndcFutureOrderType.Status.CLOSED].includes(order.status);
    let marginRatio = 0;

    if (isTabHistory) {
        profit = order?.profit;
        marginRatio = (profit / order?.margin) * 100;
    }

    const renderQuoteprice = () => {
        return order?.side === VndcFutureOrderType.Side.BUY
            ? <MiniTickerData initPairPrice={dataMarketWatch} dataKey={'bid'} symbol={order?.symbol} />
            : <MiniTickerData initPairPrice={dataMarketWatch} dataKey={'ask'} symbol={order?.symbol} />;
    };

    const _renderLastPrice = (isTabHistory) => {
        if (isTabHistory) {
            return order?.close_price ? formatNumber(order?.close_price) : '-';
        } else {
            return <MiniTickerData initPairPrice={dataMarketWatch} dataKey={'lastPrice'} symbol={order?.symbol} />;
        }
    };

    const orderStatus = useMemo(() => {
        const cancelled = isTabHistory && (order.status === VndcFutureOrderType.Status.PENDING ||
            (order.status === VndcFutureOrderType.Status.CLOSED && !order?.close_price && order?.type !== VndcFutureOrderType.Type.MARKET));
        const pending = !isTabHistory && order.status === VndcFutureOrderType.Status.PENDING || order.status === VndcFutureOrderType.Status.REQUESTING;
        return {
            cancelled,
            pending
        };
    }, [order]);

    const renderFee = (order) => {
        const assetId = order?.fee_metadata?.close_order?.currency ?? order?.fee_metadata?.place_order?.currency;
        const ratio = fees.find(rs => rs.assetId === assetId)?.ratio
        if (isTabHistory) return order?.close_price ? formatNumber(order?.close_price) : '-';
        return (
            <div className="flex items-center justify-end space-x-1">
                <span>{ratio}</span>
                <img src={getS3Url(`/images/coins/64/${assetId}.png`)} width={16} height={16} />
            </div>
        )
    }

    const isModify = order?.sl > 0 || order?.tp > 0;
    const isShortcut = mode === modeOrders.shortcut;
    return (
        <div className="flex flex-col -mx-4 p-4 border-b-[1px] border-onus-line"
            onClick={() => !isShortcut && onShowDetail && actions('detail')}
        >
            <div onClick={() => actions('expand')}
                className="flex items-center justify-between mb-3">
                <div className="flex items-center text-[10px] font-medium text-onus-grey leading-[1.125rem]">
                    <div>ID #{order?.displaying_id}</div>
                    <div className="bg-onus-grey h-[2px] w-[2px] rounded-[50%] mx-1"></div>
                    <div>{formatTime(order?.created_at, 'yyyy-MM-dd')}</div>
                    <div className="bg-onus-grey h-[2px] w-[2px] rounded-[50%] mx-1"></div>
                    <div>{formatTime(order?.created_at, 'HH:mm:ss')}</div>
                </div>
                {isShortcut && !isTabHistory &&
                    (!collapse ? <ChevronDown size={24} color={colors.onus.grey} /> : <ChevronUp size={24} color={colors.onus.grey} />)
                }
            </div>
            <div onClick={() => actions('expand')}
                className="flex items-center justify-between">
                <div className="flex flex-col gap-[2px]">
                    <div className="flex items-center">
                        <div
                            className="font-semibold leading-[1.375rem] mr-[6px]">{(symbol?.baseAsset ?? '-') + '/' + (symbol?.quoteAsset ?? '-')}</div>
                        <div
                            className="text-onus-white bg-onus-bg3 text-xs font-medium leading-5 px-[7px] rounded-[3px]">
                            {order?.leverage}x
                        </div>
                        {canShare ?
                            <img className="ml-3"
                                onClick={() => actions('modal', 'share')}
                                src={getS3Url('/images/icon/ic_share_onus.png')} height={20} width={20} />
                            : null
                        }
                    </div>
                    <div
                        className={`text-xs font-medium ${order.side === FuturesOrderEnum.Side.BUY ? 'text-onus-green' : 'text-onus-red'}`}>
                        <span>{renderCellTable('side', order)}</span>&nbsp;/&nbsp;
                        <span>{renderCellTable('type', order)}</span>
                    </div>

                </div>
                <div className="flex items-center">
                    {orderStatus.cancelled || orderStatus.pending ?
                        <div
                            className={`bg-onus-bg3 py-[5px] px-4 rounded-[100px] font-semibold text-xs ${orderStatus.cancelled ? 'text-onus-grey' : 'text-onus-orange bg-onus-orange/[0.1]'}`}>
                            {t(`futures:mobile:${orderStatus.cancelled ? 'cancelled_order' : 'pending_order'}`)}
                        </div>
                        :
                        <>
                            <div className="text-xs text-right" onClick={() => canShare && actions('modal', 'share')}>
                                <div className="text-xs font-medium text-onus-green float-right">
                                    <OrderProfit onusMode={true} className="flex flex-col"
                                        order={order} initPairPrice={dataMarketWatch} isTabHistory={isTabHistory}
                                        isMobile decimal={isVndcFutures ? decimalSymbol : decimalSymbol + 2}
                                        mode={mode} />
                                </div>
                            </div>
                        </>
                    }
                </div>
            </div>
            {(!isShortcut || collapse === order?.displaying_id) &&
                <div onClick={() => isShortcut && onShowDetail && actions('detail')}>
                    {!isTabHistory && (isModify || isTabOpen) &&
                        <div className="flex rounded-md border border-onus-bg3 p-2 mt-3">
                            <OrderItem
                                fullWidth
                                label={isTabOpen ? t('futures:mobile:quote_price') : t('futures:stop_loss')}
                                value={isTabOpen ? renderQuoteprice() : renderSlTp(order?.sl, true)}
                                className="text-center border-r border-onus-bg3"
                                valueClassName={`${!isTabOpen ? 'text-onus-red' : ''}`}
                            />
                            <OrderItem
                                fullWidth
                                label={isTabOpen ? t('futures:order_table:open_price') : t('futures:take_profit')}
                                value={isTabOpen ? getOpenPrice(order, dataMarketWatch) : renderSlTp(order?.tp, true)}
                                className="text-center"
                                valueClassName={`${!isTabOpen ? 'text-onus-green' : ''}`}
                            />
                        </div>
                    }

                    <div className="flex flex-wrap w-full mt-5 justify-between">
                        <OrderItem
                            label={isTabPosition ? t('futures:order_table:open_price') : t('futures:stop_loss')}
                            value={isTabPosition ? getOpenPrice(order, dataMarketWatch) : renderSlTp(order?.sl)}
                            className="py-[2px] space-y-[2px] mb-2"
                            valueClassName={`${!isTabPosition ? order?.sl > 0 ? 'text-onus-red' : 'text-onus-white' : ''}`}
                        />
                        <OrderItem
                            center
                            label={t('futures:order_table:volume')}
                            className="py-[2px] space-y-[2px] mb-2"
                            value={order?.order_value ? formatNumber(order?.order_value, decimalSymbol, 0, true) : '-'}
                        />
                        <OrderItem
                            label={t(isTabHistory ? 'futures:mobile:reason_close' : 'futures:margin')}
                            className="py-[2px] space-y-[2px] text-right mb-2"
                            value={isTabHistory ? renderReasonClose(order) : order?.margin ? formatNumber(order?.margin, decimalSymbol, 0, false) : '-'}
                        />
                        <OrderItem
                            label={isTabPosition ? t('futures:mobile:quote_price') : t('futures:take_profit')}
                            value={isTabPosition ? renderQuoteprice() : renderSlTp(order?.tp)}
                            className="py-[2px] space-y-[2px]"
                            valueClassName={`${!isTabPosition ? order?.tp > 0 ? 'text-onus-green' : 'text-onus-white' : ''}`}
                        />
                        <OrderItem
                            center
                            label={t(isTabHistory ? 'futures:order_table:open_price' : `futures:mobile:liq_price`)}
                            className="py-[2px] space-y-[2px]"
                            value={isTabHistory ? order?.open_price ? formatNumber(order?.open_price, 8, 0, false) : '-' : renderLiqPrice(order)}
                        />
                        <OrderItem
                            dropdown={!isTabHistory}
                            label={isTabHistory ? t(`futures:order_table:close_price`) : t('common:fee')}
                            className="py-[2px] space-y-[2px] text-right"
                            value={renderFee(order)}
                            onClick={() => !isTabHistory && actions('modal', 'edit-fee')}
                        />
                    </div>
                    {allowButton &&
                        <div className="flex items-center justify-between space-x-2 mt-5">
                            {
                                order.status === VndcFutureOrderType.Status.ACTIVE &&
                                <Button
                                    className="bg-onus-bg3 text-onus-gray !h-[36px]"
                                    onClick={() => actions('modal', 'edit-margin')}> {t('futures:mobile.adjust_margin.button_title')}</Button>
                            }
                            <Button
                                className="bg-onus-bg3 text-onus-gray !h-[36px]"
                                onClick={() => actions('modal', 'edit')}> {t(`futures:tp_sl:${isModify ? 'modify' : 'add'}_tpsl`)}</Button>
                            <Button
                                className="bg-onus-bg3 text-onus-gray !h-[36px]"
                                onClick={() => actions('delete')}>{t('common:close')}</Button>
                        </div>
                    }
                </div>
            }
        </div>
    );
};

export const SideComponent = styled.div.attrs(({ isBuy }) => ({
    className: `flex items-center justify-center font-medium mr-[12px]`
}))`
  width: 38px;
  height: 38px;
  border-radius: 2px;
  background-color: ${({
    isBuy,
    isDark
}) => isBuy ? (isDark ? '#00c8bc1a' : colors.lightTeal) : colors.lightRed2};
  color: ${({ isBuy }) => isBuy ? colors.teal : colors.red2};
  font-size: 10px
`;
const Row = styled.div.attrs({
    className: `flex flex-col justify-between`
})`
    width: calc(100% / 3 - 8px);
`

const Label = styled.div.attrs({
    className: `text-xs text-onus-grey min-w-[50px] leading-[1.25rem]`
})``;

const Button = styled.div.attrs({
    className: `text-onus-grey bg-gray-4 rounded-[4px] h-[30px] flex items-center justify-center text-xs font-semibold`
})`
  width: calc(50% - 4px)
`;

export const OrderItem = (props) => {
    const { label, value, className = '', valueClassName = '', dropdown, onClick, center, fullWidth } = props;
    return (
        <Row onClick={onClick} className={classnames(
            {
                'items-center': center,
                '!w-full': fullWidth
            }
        )}>
            <div className={`${className}`} >
                {dropdown ?
                    <div className="flex items-center space-x-1 justify-end">
                        <Label>{label} </Label>
                        <ChevronDown size={12} color={colors.onus.grey} />
                    </div>
                    :
                    <Label>{label} </Label>
                }
                <div className={`leading-[1.25rem] text-xs font-medium ${valueClassName}`}>{value}</div>
            </div>
        </Row>
    )
}

export default OrderItemMobile;
