import { useEffect, useState } from 'react';
import Emitter from 'redux/actions/emitter';
import { PublicSocketEvent } from 'redux/actions/const';
import FuturesMarketWatch from 'models/FuturesMarketWatch';
import { formatNumber } from 'redux/actions/utils';

const MiniTickerData = ({
    symbol,
    dataKey,
    initPairPrice,
}) => {
    const [pairPrice, setPairPrice] = useState(null);

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

    const _pairPrice = pairPrice || initPairPrice
    if(symbol !== _pairPrice?.symbol) return '-'
    if (!symbol || !(pairPrice?.[dataKey] || initPairPrice?.[dataKey])) return '-';
    return (
        formatNumber((pairPrice || initPairPrice)?.[dataKey], 8)
    );
};

export default MiniTickerData;
