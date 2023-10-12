import React, { useEffect, useState } from 'react';
import { formatNumber, getPriceColor } from 'redux/actions/utils';
import Emitter from 'redux/actions/emitter';
import { FuturesOrderEnum, PublicSocketEvent } from 'redux/actions/const';
import FuturesMarketWatch from 'models/FuturesMarketWatch';
import { getProfitVndc, renderCellTable, VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { formatPrice } from 'src/redux/actions/utils';

const CalculatePNL = ({ order, initPairPrice, onusMode = false, decimal = 0 }) => {
    const [pairPrice, setPairPrice] = useState(null);
    const [lastSymbol, setLastSymbol] = useState(null);
    const _pairPrice = pairPrice || initPairPrice
    const { symbol } = order
    useEffect(() => {
        if (order?.symbol !== lastSymbol) {
            setLastSymbol(order?.symbol);
            setPairPrice(null);
        }
    }, [order]);

    useEffect(() => {
        if (!symbol) return;
        // ? Subscribe publicSocket
        // ? Get Pair Ticker
        Emitter.once(PublicSocketEvent.FUTURES_TICKER_UPDATE + symbol, async (data) => {
            if (symbol === data?.s && data?.p > 0) {
                const _pairPrice = FuturesMarketWatch.create(data);
                setPairPrice(_pairPrice);
            }
        });
        return () => {
            Emitter.off(PublicSocketEvent.FUTURES_TICKER_UPDATE + symbol);
        };
    }, [symbol]);

    if (!_pairPrice?.lastPrice) return '-';
    // Lệnh đang mở, khi ước tính profit thì buy lấy giá bid, sell lấy giá ask
    let profit = 0

    if (order.symbol !== _pairPrice.symbol) return '-'
    if (order && _pairPrice) {
        profit = getProfitVndc(order, order?.side === VndcFutureOrderType.Side.BUY ? _pairPrice?.bid : _pairPrice?.ask, true);
    }
    const ratio = profit / order.margin;
    const percent = formatPrice((profit/order.order_value) * 100, 2);

    return <span className={classNames(profit >= 0 ? 'text-teal' : 'text-red')}>{formatPrice(profit, decimal)} ({percent}%)</span>
};  

export default CalculatePNL