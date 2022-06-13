import React, { useRef } from 'react';
import styled from 'styled-components';
import colors from 'styles/colors';
import { formatNumber, formatTime, getS3Url } from 'redux/actions/utils';
import OrderProfit from 'components/screens/Futures/TradeRecord/OrderProfit';
import { useTranslation } from 'next-i18next'
import { getProfitVndc, VndcFutureOrderType, renderCellTable } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType'
import Big from "big.js";
import { FuturesOrderEnum } from 'redux/actions/const';

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

    const actions = (action, key) => {
        if (action === 'modal') {
            isModal.current = true;
            onShowModal(order, key)
        }
        if (action === 'delete') {
            isModal.current = true;
            onShowModal(order, 'delete')
        }
        if (action === 'detail' && order?.status !== VndcFutureOrderType.Status.REQUESTING) {
            if (isModal.current) {
                isModal.current = false;
                return;
            }
            onShowDetail(order, isTabHistory)
        }

    }

    const profit = isTabHistory ? order?.profit : dataMarketWatch && getProfitVndc(order, dataMarketWatch?.lastPrice)

    return (
        <div className="flex flex-col mx-[-16px] p-[16px] border-b-[1px] border-b-gray-4 dark:border-divider-dark"
            onClick={() => onShowDetail && actions('detail')}
        >
            <div className="flex items-center justify-between mb-[10px]">
                <div className="flex flex-col" >
                    {/* <SideComponent isDark={isDark} isBuy={order.side === VndcFutureOrderType.Side.BUY}>{renderCellTable('side', order)}</SideComponent> */}
                    <div className="flex items-center">
                        <div className="font-semibold mr-[10px]">{(symbol?.baseAsset ?? '-') + '/' + (symbol?.quoteAsset ?? '-')}</div>
                        <div className="text-teal border-teal border-[1px] text-xs px-[5px] rounded-[2px]">{order?.leverage}x</div>
                    </div>
                    <div className={`text-xs font-medium ${order.side === FuturesOrderEnum.Side.BUY ? 'text-teal' : 'text-red'}`}>
                        <span>{renderCellTable('side', order)}</span>&nbsp;/&nbsp;
                        <span>{renderCellTable('type', order)}</span>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="text-xs ">
                        <div className="text-gray-1 dark:text-txtSecondary-dark py-[1px]">{formatTime(order?.created_at, 'yyyy-MM-dd HH:mm:ss')}</div>
                        <div className="text-xs font-medium text-teal py-[1px] float-right">
                            <OrderProfit className="flex" order={order} pairPrice={dataMarketWatch} isTabHistory={isTabHistory} isMobile />
                        </div>
                    </div>
                    {profit ?
                        <div className="border-[1px] border-teal p-[5px] rounded-[2px] ml-[16px]" onClick={() => actions('modal', 'share')}>
                            <img src={getS3Url("/images/icon/ic_share.png")} height={18} width={18} />
                        </div>
                        : null
                    }
                </div>
            </div>
            <div>
                {/* <Row className="!justify-start !w-full">
                    <div className="text-gray-1 text-xs dark:text-txtSecondary-dark min-w-[70px]">{t('futures:mobile:pnl')}</div>
                    <span className="text-xs font-medium text-teal"><OrderProfit className="flex" isMobile order={order} pairPrice={dataMarketWatch} isTabHistory={isTabHistory} /></span>
                </Row> */}
                <div className="flex flex-wrap gap-x-[10px] w-full">
                    <OrderItem
                        label={t('futures:order_table:open_price')}
                        value={isTabHistory ? formatNumber(order?.open_price, 8, 0, false) : getOpenPrice(order, dataMarketWatch)}
                    />
                    <OrderItem label={t('futures:order_table:volume')} value={formatNumber(order?.order_value, 0, 0, true)} />
                    <OrderItem
                        label={t(`futures:order_table:${isTabHistory ? 'close_price' : 'last_price2'}`)}
                        value={formatNumber(isTabHistory ? order?.close_price : dataMarketWatch?.lastPrice)}
                    />
                    <OrderItem
                        label={t(isTabHistory ? 'futures:order_table:reason_close' : `futures:mobile:liq_price`)}
                        value={isTabHistory ? renderReasonClose(order) : renderLiqPrice(order)}
                    />
                    <OrderItem
                        label={t('futures:stop_loss')}
                        value={formatNumber(order?.sl)}
                    />
                    <OrderItem
                        label={t('futures:take_profit')}
                        value={formatNumber(order?.tp)}
                    />
                </div>
            </div>
            {allowButton &&
                <div className="flex items-center justify-between ">
                    <Button className="dark:bg-bgInput-dark dark:text-txtSecondary-dark" onClick={() => actions('modal', 'edit')}> {t('futures:tp_sl:modify_tpsl')}</Button>
                    <Button className="dark:bg-bgInput-dark dark:text-txtSecondary-dark" onClick={() => actions('delete')}>{t('common:close')}</Button>
                </div>
            }
        </div>
    );
};

export const SideComponent = styled.div.attrs(({ isBuy }) => ({
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
})`
width:calc(50% - 5px)
`

const Label = styled.div.attrs({
    className: `text-gray-1 text-xs dark:text-txtSecondary-dark min-w-[50px]`
})``

const Button = styled.div.attrs({
    className: `text-gray-1 bg-gray-4 rounded-[4px] h-[30px] flex items-center justify-center text-xs font-medium`
})`
width:calc(50% - 4px)
`

export const OrderItem = ({ label, value, valueClassName = '' }) => {
    return (
        <Row className="justify-between">
            <Label>{label}</Label>
            <div className={`text-xs font-medium text-right ${valueClassName}`}>{value}</div>
        </Row>
    )
}

export default OrderItemMobile;
