import { useCallback, useEffect } from 'react'
import { placeFuturesOrder } from 'redux/actions/futures'
import { useTranslation } from 'next-i18next'
import { FuturesOrderTypes } from 'redux/reducers/futures'
import { VndcFutureOrderType } from './VndcFutureOrderType'

const getType = (type) => {
    switch (type) {
        case FuturesOrderTypes.Limit:
            return VndcFutureOrderType.Type.LIMIT;
        case FuturesOrderTypes.Market:
            return VndcFutureOrderType.Type.MARKET;
        case FuturesOrderTypes.StopLimit:
        case FuturesOrderTypes.StopMarket:
            return VndcFutureOrderType.Type.STOP;
        default:
            return VndcFutureOrderType.Limit;
    }
}

const getPrice = (type, side, price, ask, bid, stopPrice) => {
    if (type === VndcFutureOrderType.Type.MARKET) return VndcFutureOrderType.Side.BUY === side ? ask : bid;
    if (type === VndcFutureOrderType.Type.STOP) return Number(stopPrice);
    return Number(price);
}

const FuturesOrderButtonsGroupVndc = ({
    pairConfig,
    type,
    positionMode,
    quantity,
    price,
    size,
    stopPrice,
    lastPrice,
    stopOrderMode,
    leverage,
    orderSlTp,
    isError,
    ask,
    bid,
}) => {
    const { t } = useTranslation()
    const handleParams = useCallback(
        (side) => {
            const _size = isNaN(size) ? Number(size.substring(0, size.indexOf('%'))) / 100 : Number(size);
            const params = {
                symbol: pairConfig?.symbol,
                type: getType(type),
                side: side,
                quantity: _size,
                price: getPrice(getType(type), side, price, ask, bid, stopPrice),
                leverage,
                ...orderSlTp
            }
            return params
        },
        [
            pairConfig?.symbol,
            type,
            size,
            quantity,
            price,
            orderSlTp,
            stopPrice,
            ask, bid,
        ]
    )

    return (
        <div className='flex items-center justify-between font-bold text-sm text-white select-none'>
            <div
                className='w-[48%] bg-dominant text-center py-2.5 rounded-lg cursor-pointer hover:opacity-80'
                onClick={() =>
                    !isError &&
                    placeFuturesOrder(handleParams(VndcFutureOrderType.Side.BUY), {
                        filters: pairConfig?.filters,
                        lastPrice,
                        isMarket: [
                            FuturesOrderTypes.Market,
                            FuturesOrderTypes.StopMarket,
                        ].includes(type),
                    })
                }
            >
                {t('common:buy')}/Long
            </div>
            <div
                className='w-[48%] bg-red text-center py-2.5 rounded-lg cursor-pointer hover:opacity-80'
                onClick={() =>
                    !isError &&
                    placeFuturesOrder(handleParams(VndcFutureOrderType.Side.SELL), {
                        filters: pairConfig?.filters,
                        lastPrice,
                        isMarket: [
                            FuturesOrderTypes.Market,
                            FuturesOrderTypes.StopMarket,
                        ].includes(type),
                    })
                }
            >
                {t('common:sell')}/Short
            </div>
        </div>
    )
}

export default FuturesOrderButtonsGroupVndc
