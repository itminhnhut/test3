import React, { useEffect, useState } from 'react';
import { getProfitVndc, VndcFutureOrderType } from '../PlaceOrder/Vndc/VndcFutureOrderType';
import { formatNumber, getPriceColor } from 'redux/actions/utils';
import { Share2 } from 'react-feather';
import { IconArrowOnus } from "components/common/Icons";
import colors from 'styles/colors'
import Emitter from 'redux/actions/emitter';
import { PublicSocketEvent } from 'redux/actions/const';
import FuturesMarketWatch from 'models/FuturesMarketWatch';

const OrderProfit = ({ order, initPairPrice, setShareOrderModal, className = '', isMobile, isTabHistory, onusMode = false, decimal = 0 }) => {


    const [pairPrice, setPairPrice] = useState(initPairPrice);
    const {symbol} = order
    useEffect(() => {
        if (!symbol) return;
        // ? Subscribe publicSocket
        // ? Get Pair Ticker
        Emitter.on(PublicSocketEvent.FUTURES_TICKER_UPDATE + symbol, async (data) => {
            if (symbol === data?.s && data?.p > 0) {
                const _pairPrice = FuturesMarketWatch.create(data);
                setPairPrice(_pairPrice);
            }
        });
        return () => {
            Emitter.off(PublicSocketEvent.FUTURES_TICKER_UPDATE + symbol);
        };
    }, [symbol]);

    if (!pairPrice?.lastPrice && !isTabHistory) return '-';
    // Lệnh đang mở, khi ước tính profit thì buy lấy giá bid, sell lấy giá ask
    let profit = 0
    if (isTabHistory) {
        profit = order?.profit
    } else {
        if (order && pairPrice) {
            profit = getProfitVndc(order, order?.side === VndcFutureOrderType.Side.BUY ? pairPrice?.bid : pairPrice?.ask, true);
        }
    }

    // const profit = isTabHistory ? order?.profit : getProfitVndc(order, pairPrice?.lastPrice,);
    const ratio = profit / order.margin;
    const percent = formatNumber(((onusMode ? Math.abs(ratio) : ratio) * 100), 2, 0, true);
    return <div className='flex items-center w-full'>
        <div className={`${getPriceColor(profit, onusMode)} ${className} ${onusMode ? 'gap-[2px]' : ''}`}>
            {profit !== 0 ? <>
                <div className={isMobile ? 'text-[16px] font-semibold leading-[1.375rem]' : ''}>
                    {profit > 0 ? '+' : ''}
                    {formatNumber(profit, decimal, 0, true)} {!isMobile && pairPrice?.quoteAsset}
                </div>
                <div className={isMobile ? 'flex items-center justify-end leading-[1.125rem] font-medium' : ''}>
                    {onusMode ?
                        <>
                            <IconArrowOnus className={`w-[7px] mr-[2px] ${profit > 0 ? '' : 'rotate-180'}`} color={profit > 0 ? colors.onus.green : colors.onus.red} />
                            {percent + '%'}
                        </>
                        :
                        <> ({percent + '%'}) </>
                    }
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
