import React from 'react';
import { getProfitVndc, VndcFutureOrderType } from '../PlaceOrder/Vndc/VndcFutureOrderType';
import { formatNumber, getPriceColor } from 'redux/actions/utils';
import { Share2 } from 'react-feather';

const OrderProfit = ({ order, pairPrice, setShareOrderModal, className = '', isMobile, isTabHistory, onusMode=false }) => {
    if (!pairPrice?.lastPrice && !isTabHistory) return '-';
    const profit = isTabHistory ? order?.profit : getProfitVndc(order, pairPrice?.lastPrice);
    const percent = formatNumber(((profit / order.margin) * 100), 2, 0, true);
    return <div className='flex items-center w-full'>
        <div className={`${getPriceColor(profit, onusMode)} ${className}`}>
            {profit !== 0 ? <>
                <div>
                    {profit > 0 ? '+' : ''}
                    {formatNumber(profit, 0, 0, true)} {!isMobile && pairPrice?.quoteAsset}
                </div>
                <div>
                    ({percent > 0 ? '+' : ''}
                    {percent + '%'})
                </div>
            </>
                :
                '-'
            }
        </div>
        {order?.status !== VndcFutureOrderType.Status.PENDING && setShareOrderModal &&
            <Share2 size={16} onClick={setShareOrderModal} className='ml-1 cursor-pointer hover:opacity-60' />}
    </div>
};

export default OrderProfit;
