import React, { useEffect } from 'react';
import { VndcFutureOrderType } from '../PlaceOrder/Vndc/VndcFutureOrderType'
import { formatNumber, getPriceColor } from 'redux/actions/utils'
import { Share2 } from 'react-feather'

const OrderProfit = ({ order, pairPrice }) => {
    const { status, quantity, open_price, type, symbol, side, close_price } = order;
    const price = pairPrice?.lastPrice;
    if (!order || !symbol) return null
    let { fee } = order;
    fee = fee || 0
    let profitXBT = 0, profitUSDT = 0;
    let profitUSD = '-';
    let closePrice = 1
    if (status === VndcFutureOrderType.Status.ACTIVE) {
        closePrice = price;
    } else if (status === VndcFutureOrderType.Status.CLOSED) {
        closePrice = close_price
    }
    if (!closePrice) return '- VNDC';
    try {
        let buyProfitUSDT = 0;
        buyProfitUSDT = quantity * (closePrice - open_price)
        profitUSDT = side === VndcFutureOrderType.Side.BUY ? buyProfitUSDT - fee : -buyProfitUSDT - fee;

    } catch (e) {
        console.error('__ e ', e);
    }
    const percent = formatNumber((profitUSDT / order.margin), 2, 0, true);
    if (isNaN(percent)) return null;
    return <div className='flex items-center'>
        <div className={getPriceColor(profitUSDT)}>
            <div>
                {profitUSDT > 0 ? '+' : ''}
                {formatNumber(profitUSDT, 0, 0, true)} {pairPrice?.quoteAsset}
            </div>
            <div>
                ({percent > 0 ? '+' : ''}
                {percent + '%'})
            </div>
        </div>
        <Share2 size={16} className='ml-1' />
    </div>
};

export default OrderProfit;