import { useCallback } from 'react';
import { placeFuturesOrder } from 'redux/actions/futures';
import { useTranslation } from 'next-i18next';
import { FuturesOrderTypes } from 'redux/reducers/futures';
import { VndcFutureOrderType } from './VndcFutureOrderType';
import { getLoginUrl } from 'src/redux/actions/utils';
import { useRouter } from 'next/router';

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
    isAuth
}) => {
    const { t } = useTranslation()
    const router = useRouter();
    const handleParams = useCallback(
        (side) => {
            const params = {
                symbol: pairConfig?.symbol,
                type: getType(type),
                side: side,
                quantity: isNaN(size) ? side === VndcFutureOrderType.Side.BUY ? +quantity?.buy : +quantity?.sell : Number(size),
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

    const onLogin = () => {
        router.push(getLoginUrl('sso'))
    }

    return (
        <div className='flex items-center justify-between font-bold text-sm text-white select-none'>
            <div
                className='w-[48%] bg-dominant text-center py-2.5 rounded-lg cursor-pointer hover:opacity-80'
                onClick={() =>
                    !isAuth ? onLogin() :
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
                {isAuth ? t('common:buy') + '/Long' : t('futures:order_table:login_to_continue')}
            </div>
            <div
                className='w-[48%] bg-red text-center py-2.5 rounded-lg cursor-pointer hover:opacity-80'
                onClick={() =>
                    !isAuth ? onLogin() :
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
                {isAuth ? t('common:sell') + '/Short' : t('futures:order_table:login_to_continue')}
            </div>
        </div>
    )
}

export default FuturesOrderButtonsGroupVndc
