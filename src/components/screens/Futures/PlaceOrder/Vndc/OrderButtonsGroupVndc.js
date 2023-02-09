import { useCallback, useState } from 'react';
import { placeFuturesOrder } from 'redux/actions/futures';
import { useTranslation } from 'next-i18next';
import { FuturesOrderTypes } from 'redux/reducers/futures';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { getLoginUrl, formatNumber } from 'src/redux/actions/utils';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';

export const getType = (type) => {
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
};

export const getPrice = (type, side, price, ask, bid, stopPrice) => {
    if (type === VndcFutureOrderType.Type.MARKET) return VndcFutureOrderType.Side.BUY === side ? ask : bid;
    // if (type === VndcFutureOrderType.Type.STOP) return Number(stopPrice);
    return Number(price);
};

const FuturesOrderButtonsGroupVndc = ({ pairConfig, type, quoteQty, price, lastPrice, leverage, orderSlTp, isError, ask, bid, isAuth, decimals, side }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const _price = getPrice(getType(type), side, price, ask, bid);

    const handleParams = useCallback(
        (side) => {
            const requestId = Math.floor(Date.now() / 2000);
            const params = {
                symbol: pairConfig?.symbol,
                type: getType(type),
                side: side,
                price: +_price,
                leverage,
                sl: +orderSlTp?.sl,
                tp: +orderSlTp?.tp,
                quoteQty: +quoteQty,
                useQuoteQty: true,
                requestId
            };
            return params;
        },
        [pairConfig?.symbol, type, price, orderSlTp, ask, bid]
    );

    const onHandleClick = (side) => {
        if (!isAuth) {
            window.open(getLoginUrl('sso', 'login'), '_self');
            return;
        }
        if (isError) return;
        setLoading(true);
        placeFuturesOrder(
            handleParams(side),
            {
                filters: pairConfig?.filters,
                lastPrice,
                isMarket: [FuturesOrderTypes.Market, FuturesOrderTypes.StopMarket].includes(type)
            },
            t,
            () => {
                setLoading(false);
            }
        );
    };

    const title =
        type === FuturesOrderTypes.Limit
            ? t('futures:mobile:limit')
            : type === FuturesOrderTypes.StopMarket
            ? 'stop market'
            : type === FuturesOrderTypes.StopLimit
            ? 'stop limit'
            : '';

    const isBuy = VndcFutureOrderType.Side.BUY === side;
    return (
        <div className="flex items-center justify-between font-bold text-sm text-white select-none mt-8">
            <ButtonV2
                onClick={() => onHandleClick(isBuy ? VndcFutureOrderType.Side.BUY : VndcFutureOrderType.Side.SELL)}
                disabled={loading || (isAuth && isError)}
                className="flex flex-col !h-[60px]"
            >
                <span>{isAuth ? (isBuy ? t('common:buy') : t('common:sell')) + ' ' + title : t('futures:order_table:login_to_continue')}</span>
                <span className="text-xs">{formatNumber(lastPrice, decimals.price)}</span>
            </ButtonV2>
        </div>
    );
};

export default FuturesOrderButtonsGroupVndc;
