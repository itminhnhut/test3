import React, { useRef } from 'react';
import styled from 'styled-components';
import colors from 'styles/colors';
import { formatNumber, formatTime } from 'redux/actions/utils'
import OrderProfit from 'components/screens/Futures/TradeRecord/OrderProfit';
import { useTranslation } from 'next-i18next'
import { getProfitVndc, VndcFutureOrderType, renderCellTable } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType'
import Big from "big.js";

const OrderItemMobile = ({ order, isBuy, dataMarketWatch, onShowModal, mode, isDark, onShowDetail, symbol, allowButton }) => {
    const { t } = useTranslation();
    const isTabHistory = mode === 'history';

    const getOpenPrice = (row, pairPrice) => {
        let text = row?.price ? formatNumber(row?.price, 8, 0, true) : 0;
        switch (row.status) {
            case VndcFutureOrderType.Status.PENDING:
                let bias = null;
                const value = row['price'];
                if (!pairPrice) return null
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
                text = row.price ? formatNumber(row.price, 8) : '';
                return <div className="flex items-center text-right ">
                    <div>{text} {bias}</div>
                </div>;
            case VndcFutureOrderType.Status.ACTIVE:
                text = row.open_price ? formatNumber(row.open_price, 8) : '';
                return <div>{text}</div>;
            case VndcFutureOrderType.Status.CLOSED:
                text = row.close_price ? formatNumber(row.close_price, 8) : '';
                return <div>{text}</div>;
            default:
                return <div>{text}</div>;
        }
    }

    const renderLiqPrice = (row) => {
        const size = (row?.side === VndcFutureOrderType.Side.SELL ? -row?.quantity : row?.quantity)
        const number = (row?.side === VndcFutureOrderType.Side.SELL ? -1 : 1);
        const liqPrice = (size * row?.open_price + row?.fee - row?.margin) / (row?.quantity * (number - 0.1 / 100))
        return row?.status === VndcFutureOrderType.Status.ACTIVE ? formatNumber(liqPrice, 0, 0, true) : '-'
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

    const isModal = useRef(false);

    const actions = (action) => {
        if (action === 'modal') {
            isModal.current = true;
            onShowModal(order, 'share')
        }
        if (action === 'detail') {
            if (isModal.current) {
                isModal.current = false;
                return;
            }
            onShowDetail(order)
        }

    }

    const profit = isTabHistory ? order?.profit : dataMarketWatch && getProfitVndc(order, dataMarketWatch?.lastPrice)

    return (
        <div className="flex flex-col mx-[-16px] p-[16px] border-b-[1px] border-b-gray-4 dark:border-divider-dark"
            onClick={() => onShowDetail && actions('detail')}
        >
            <div className="flex items-center justify-between mb-[10px]">
                <div className="w-full flex" >
                    <SideComponent isDark={isDark} isBuy={order.side === VndcFutureOrderType.Side.BUY}>{renderCellTable('side', order)}</SideComponent>
                    <div>
                        <div className="flex items-center">
                            <div className="font-semibold text-sm mr-[10px]">{(symbol?.baseAsset ?? '-') + '/' + (symbol?.quoteAsset ?? '-')}</div>
                            <div className="text-teal border-teal border-[1px] text-xs px-[5px] rounded-[2px]">{order?.leverage}x</div>
                        </div>
                        <div className="text-xs font-medium text-gray-1 dark:text-txtSecondary-dark">
                            <span className="mr-[12px]">{'#' + order?.displaying_id}</span>
                            <span>{formatTime(order?.created_at, 'yyyy-MM-dd HH:mm:ss')}</span>
                        </div>
                    </div>
                </div>
                {profit ?
                    <div className="border-[1px] border-teal p-[5px] rounded-[2px]" onClick={() => actions('modal')}>
                        <img src="/images/icon/ic_share.png" height={16} width={16} />
                    </div>
                    : null
                }
            </div>
            <div>
                <Row className="!justify-start">
                    <div className="text-gray-1 text-xs dark:text-txtSecondary-dark min-w-[70px]">{t('futures:mobile:pnl')}</div>
                    <span className="text-xs font-medium text-teal"><OrderProfit className="flex" isMobile order={order} pairPrice={dataMarketWatch} isTabHistory={isTabHistory} /></span>
                </Row>
                <div className="flex">
                    <div className="w-1/2 mr-[10px]">
                        <div className="flex mb-[10px] justify-between">
                            <Label>{t('futures:order_table:open_price')}</Label>
                            <div className="text-xs font-medium text-right">{isTabHistory ? formatNumber(order?.open_price, 8, 0, false)  : getOpenPrice(order, dataMarketWatch)}</div>
                        </div>
                        <Row>
                            <Label>{t(`futures:order_table:${isTabHistory ? 'close_price' : 'last_price2'}`)}</Label>
                            <span className="text-xs font-medium text-right">{formatNumber(isTabHistory ? order?.close_price : dataMarketWatch?.lastPrice)}</span>
                        </Row>
                        <Row>
                            <Label>{t('futures:stop_loss')}</Label>
                            <span className="text-xs font-medium text-right">{formatNumber(order?.sl)}</span>
                        </Row>
                    </div>
                    <div className="w-1/2">
                        <Row>
                            <Label>{t('futures:order_table:volume')}</Label>
                            <span className="text-xs font-medium text-right">{formatNumber(order?.order_value, 0, 0, true)}</span>
                        </Row>
                        <Row>
                            <Label>{t(isTabHistory ? 'futures:order_table:reason_close' : `futures:mobile:liq_price`)}</Label>
                            <span className="text-xs font-medium text-right">{isTabHistory ? renderReasonClose(order) : renderLiqPrice(order)}</span>
                        </Row>
                        <Row>
                            <Label>{t('futures:take_profit')}</Label>
                            <span className="text-xs font-medium text-right">{formatNumber(order?.tp)}</span>
                        </Row>
                    </div>
                </div>
            </div>
            {allowButton &&
                <div className="flex items-center justify-between ">
                    <Button className="dark:bg-bgInput-dark dark:text-txtSecondary-dark" onClick={() => onShowModal(order, 'edit')}> {t('futures:tp_sl:modify_tpsl')}</Button>
                    <Button className="dark:bg-bgInput-dark dark:text-txtSecondary-dark" onClick={() => onShowModal(order, 'delete')}>{t('common:close')}</Button>
                </div>
            }
        </div>
    );
};

const SideComponent = styled.div.attrs(({ isBuy }) => ({
    className: `flex items-center justify-center font-medium mr-[12px]`
}))`
    width:38px;
    height:38px;
    border-radius:2px;
    background-color:${({ isBuy, isDark }) => isBuy ? (isDark ? '#00c8bc1a' : colors.lightTeal) : colors.lightRed2};
    color:${({ isBuy }) => isBuy ? colors.teal : colors.red2};
    font-size:10px
`
const Row = styled.div.attrs({
    className: `flex mb-[10px] justify-between`
})``

const Label = styled.div.attrs({
    className: `text-gray-1 text-xs dark:text-txtSecondary-dark min-w-[50px]`
})``

const Button = styled.div.attrs({
    className: `text-gray-1 bg-gray-4 rounded-[4px] h-[30px] flex items-center justify-center text-xs font-medium`
})`
width:calc(50% - 4px)
`
export default OrderItemMobile;
