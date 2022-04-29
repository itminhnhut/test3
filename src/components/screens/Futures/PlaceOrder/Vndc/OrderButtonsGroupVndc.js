import { useCallback, useState } from 'react';
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
    isAuth,
    decimalScaleQty
}) => {
    const { t } = useTranslation()
    const router = useRouter();
    const [disabled, setDisabled] = useState(false);
    const handleParams = useCallback(
        (side) => {
            const _size = isNaN(size) ? side === VndcFutureOrderType.Side.BUY ? +quantity?.buy : +quantity?.sell : Number(size)
            const params = {
                symbol: pairConfig?.symbol,
                type: getType(type),
                side: side,
                quantity: Number(_size.toFixed(decimalScaleQty)),
                price: getPrice(getType(type), side, price, ask, bid, stopPrice),
                leverage,
                sl: +orderSlTp.sl,
                tp: +orderSlTp.tp,
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

    const onHandleClick = (side) => {
        if (!isAuth) {
            onLogin();
            return;
        }
        if (isError) return;
        setDisabled(true)
        placeFuturesOrder(handleParams(side), {
            filters: pairConfig?.filters,
            lastPrice,
            isMarket: [
                FuturesOrderTypes.Market,
                FuturesOrderTypes.StopMarket,
            ].includes(type),
        }, t, () => {
            setDisabled(false)
        })
    }

    const classNameError = disabled || (isAuth && isError) ? '!bg-gray-3 dark:!bg-darkBlue-4 text-gray-1 dark:text-darkBlue-2 cursor-not-allowed' : '';

    return (
        <div className='flex items-center justify-between font-bold text-sm text-white select-none'>
            <div
                className={`w-[48%] bg-dominant text-center py-2.5 rounded-lg cursor-pointer hover:opacity-80 ${classNameError}`}
                onClick={() => onHandleClick(VndcFutureOrderType.Side.BUY)}
            >
                {isAuth ? t('futures:buy_order') : t('futures:order_table:login_to_continue')}
            </div>
            <div
                className={`w-[48%] bg-red text-center py-2.5 rounded-lg cursor-pointer hover:opacity-80 ${classNameError}`}
                onClick={() => onHandleClick(VndcFutureOrderType.Side.SELL)}
            >
                {isAuth ? t('futures:sell_order') : t('futures:order_table:login_to_continue')}
            </div>
        </div>
    )
}

export default FuturesOrderButtonsGroupVndc
