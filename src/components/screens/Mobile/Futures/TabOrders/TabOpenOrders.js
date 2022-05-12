import React, { useMemo, useState } from 'react';
import CheckBox from 'components/common/CheckBox'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components';
import colors from 'styles/colors';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType'
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { formatNumber, formatTime } from 'redux/actions/utils'
import Big from "big.js";
import OrderProfit from 'components/screens/Futures/TradeRecord/OrderProfit'

const TabOpenOrders = ({ ordersList, pair }) => {
    const { t } = useTranslation();
    const [hideOther, setHideOther] = useState(false)
    const marketWatch = useSelector((state) => state.futures.marketWatch)

    const dataFilter = useMemo(() => {
        return hideOther ? ordersList.filter(order => order?.symbol === pair) : ordersList;
    }, [hideOther, ordersList, pair])

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
                return <div className="flex items-center ">
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

    return (
        <div className="">
            <div
                className='flex items-center text-sm font-medium select-none cursor-pointer'
                onClick={() => setHideOther(!hideOther)}
            >
                <CheckBox active={hideOther} />{' '}
                <span className='ml-1 whitespace-nowrap text-gray font-medium capitalize'>
                    {t('futures:hide_other_symbols')}
                </span>
            </div>
            <div className="pt-[22px]" >
                {dataFilter?.map((order, i) => {
                    const dataMarketWatch = marketWatch[order?.symbol];
                    return (
                        <div key={i} className="flex flex-col mb-[10px]">
                            <div className="flex items-center justify-between mb-[10px]">
                                <div className="w-full flex">
                                    <SideComponent isBuy={order.side === VndcFutureOrderType.Side.BUY}>{order.side}</SideComponent>
                                    <div>
                                        <div className="font-semibold text-sm">{dataMarketWatch?.baseAsset + '/' + dataMarketWatch?.quoteAsset}</div>
                                        <div className="text-xs font-medium text-gray">
                                            <span className="mr-[12px]">{'#' + order?.displaying_id}</span>
                                            <span>{formatTime(order?.created_at, 'yyyy-MM-dd HH:mm:ss')}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    2
                                </div>
                            </div>
                            <div>
                                <div className="flex mb-[10px]">
                                    <Label>PnL</Label>
                                    <span className="text-xs font-medium text-teal"><OrderProfit order={order} pairPrice={dataMarketWatch} /></span>
                                </div>
                                <div className="flex">
                                    <div className="w-1/2">
                                        <div className="flex mb-[10px]">
                                            <Label>{t('futures:order_table:open_price')}</Label>
                                            <div className="text-xs font-medium ">{getOpenPrice(order, dataMarketWatch)}</div>
                                        </div>
                                        <div className="flex mb-[10px]">
                                            <Label>{t('futures:order_table:last_price2')}</Label>
                                            <span className="text-xs font-medium ">{formatNumber(dataMarketWatch?.lastPrice, 0, 0, true)}</span>
                                        </div>
                                        <div className="flex mb-[10px]">
                                            <Label>{t('futures:stop_loss')}</Label>
                                            <span className="text-xs font-medium ">{formatNumber(order?.sl, 0, 0, true)}</span>
                                        </div>
                                    </div>
                                    <div className="w-1/2">
                                        <div className="flex mb-[10px]">
                                            <Label>Entry Price</Label>
                                            <span className="text-xs font-medium ">100,000,000</span>
                                        </div>
                                        <div className="flex mb-[10px]">
                                            <Label>Mark Price</Label>
                                            <span className="text-xs font-medium ">100,000,000</span>
                                        </div>
                                        <div className="flex mb-[10px]">
                                            <Label>Stop Loss</Label>
                                            <span className="text-xs font-medium ">100,000,000</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

const SideComponent = styled.div.attrs(({ isBuy }) => ({
    className: `flex items-center justify-center font-medium mr-[12px]`
}))`
    width:38px;
    height:38px;
    border-radius:2px;
    background-color:${({ isBuy }) => isBuy ? colors.lightTeal : colors.lightRed2};
    color:${({ isBuy }) => isBuy ? colors.teal : colors.red2};
    font-size:10px
`

const Label = styled.div.attrs({
    className: `text-gray text-xs`
})`
    min-width:60px;
`

export default TabOpenOrders;