import React, { useState, useContext } from 'react';
import classNames from 'classnames';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType'
import { useTranslation } from 'next-i18next'
import { formatNumber, getLoginUrl } from 'redux/actions/utils';
import { FuturesOrderTypes as OrderTypes, FuturesOrderTypes } from 'redux/reducers/futures';
import { getType, getPrice } from 'components/screens/Futures/PlaceOrder/Vndc/OrderButtonsGroupVndc'
import { placeFuturesOrder } from 'redux/actions/futures';
import showNotification from 'utils/notificationService';
import { AlertContext } from 'components/common/layouts/LayoutMobile'

const OrderButtonMobile = ({
    side, price, size, stopPrice, type, decimals,
    pairConfig, pairPrice, leverage, sl, tp, isAuth,
    isError, quoteQty
}) => {
    const context = useContext(AlertContext);
    const [disabled, setDisabled] = useState(false);
    const { t } = useTranslation();
    const isBuy = VndcFutureOrderType.Side.BUY === side
    const _price = getPrice(getType(type), side, price, pairPrice?.ask, pairPrice?.bid, stopPrice);


    const onHandleSave = () => {
        if (!isAuth) {
            window.open(
                getLoginUrl('sso', 'login'),
                '_self'
            )
            return;
        }
        if (isError) return;

        setDisabled(true)
        const params = {
            symbol: pairConfig?.symbol,
            type: getType(type),
            side: side,
            quantity: size,
            price: _price,
            leverage,
            sl: sl,
            tp: tp,
            quoteQty,
            useQuoteQty: true
        };
        placeFuturesOrder(params, { alert: context?.alert }, t, () => {
            setDisabled(false)
        })
    }

    const classNameError = disabled || (isAuth && isError) ? '!bg-gray-3 dark:!bg-darkBlue-3 text-gray-1 dark:text-darkBlue-4 cursor-not-allowed' : '';
    const title = type === FuturesOrderTypes.Limit ? t('futures:mobile:limit') : type === FuturesOrderTypes.StopMarket ? 'stop market' : ''
    return (
        <div onClick={onHandleSave} className={`${isBuy ? 'bg-dominant' : 'bg-red'} text-white text-sm h-[67px] rounded-[6px] flex flex-col items-center justify-center ${classNameError}`}>
            <div className='font-semibold text-center'>{!isAuth ? t('futures:mobile:login_short') : (isBuy ? t('common:buy') : t('common:sell')) + ' ' + title}</div>
            <div className='font-medium'>{formatNumber(_price, decimals.decimalScalePrice, 0, true)}</div>
        </div>
    );
};

export default OrderButtonMobile;
