import React, { useEffect, useState } from 'react';
import { formatNumber, getPriceColor } from 'redux/actions/utils';
import Emitter from 'redux/actions/emitter';
import { PublicSocketEvent } from 'redux/actions/const';
import FuturesMarketWatch from 'models/FuturesMarketWatch';
import { getProfitVndc, VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';

const CloseProfit = ({length ,order, initPairPrice, doShow, calculatePnL, isMobile, isTabHistory, onusMode = false, decimal = 0, mode, index }) => {
    const [pairPrice, setPairPrice] = useState(null);
    const [lastSymbol, setLastSymbol] = useState(null);
    const _pairPrice = pairPrice || initPairPrice
    const publicSocket = useSelector((state) => state.socket.publicSocket);
    const { t } = useTranslation();

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

    if (!_pairPrice?.lastPrice && !isTabHistory) return '-';
    // Lệnh đang mở, khi ước tính profit thì buy lấy giá bid, sell lấy giá ask
    let profit = 0

    if (order.symbol !== _pairPrice.symbol) return '-'
    if (order && _pairPrice) {
        profit = getProfitVndc(order, order?.side === VndcFutureOrderType.Side.BUY ? _pairPrice?.bid : _pairPrice?.ask, true);
    }
    const ratio = profit / order.margin;
    const percent = formatNumber(((onusMode ? Math.abs(ratio) : ratio) * 100), 2, 0, true);

    useEffect(() => {calculatePnL({[`${order.displaying_id}`]: profit})}, [pairPrice])

    return (
        <div className={`h-[60px] ${index != length - 1 && 'border-b'} border-onus-bg2 flex items-center w-full`}>
            <div className="w-full">
                <div className="flex w-full justify-between">
                    <div className="font-semibold text-sm leading-[22px]">
                        {order.symbol}
                    </div>
                    <div className="text-onus-green">
                        {profit > 0 ?
                            <div className="text-onus-green">
                                +{formatNumber(profit, decimal, 0, true)} {!isMobile && _pairPrice?.quoteAsset}
                            </div>
                            :
                            <div className="text-onus-red">
                                {formatNumber(profit, decimal, 0, true)} {!isMobile && _pairPrice?.quoteAsset}
                            </div>
                        }
                    </div>
                </div>
                <div className="flex w-full justify-between">
                    <div className="flex w-full justify-start">
                        <div className="text-onus-green font-medium text-xs leading-[18px]">
                            {`${order.side === 'Buy' ? t('futures:buy_order') : t('futures:sell_order')} / ${order.type === 'Market' ? t('futures:market') : t('futures:limit')}`}
                        </div>
                        <div className="text-xs leading-[18px] font-medium tracking-[-0.02em] text-darkBlue-5">
                            &nbsp;· ID #{order.displaying_id}
                        </div>
                    </div>

                    {profit > 0 ?
                        (<div className="text-onus-green font-medium text-xs leading-[18px] w-full text-right">
                            ▴ {percent}%
                        </div>)
                        :
                        (<div className="text-onus-red font-medium text-xs leading-[18px] w-full text-right">
                            ▾ {percent}%
                        </div>)
                    }
                </div>
            </div>
        </div>)

};

export default CloseProfit;
