import React from 'react';
import classNames from 'classnames';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType'
import { useTranslation } from 'next-i18next'
import { formatNumber } from 'redux/actions/utils';
import { FuturesOrderTypes as OrderTypes } from 'redux/reducers/futures';
import { getType, getPrice } from '../../../Futures/PlaceOrder/Vndc/OrderButtonsGroupVndc'

const OrderButtonMobile = ({
    side, price, size, stopPrice, type, decimals,
    pairConfig, pairPrice, leverage, sl, tp
}) => {
    const { t } = useTranslation();
    const isBuy = VndcFutureOrderType.Side.BUY === side
    const _price = type === OrderTypes.Limit ? price : stopPrice;

    const onHandleSave = () => {
        const params = {
            symbol: pairConfig?.symbol,
            type: getType(type),
            side: side,
            quantity: size,
            price: getPrice(getType(type), side, price, pairPrice?.ask, pairPrice?.bid, stopPrice),
            leverage,
            sl: sl,
            tp: tp
        };
        console.log(params)
    }

    return (
        <div onClick={onHandleSave} className={`${isBuy ? 'bg-dominant' : 'bg-red'} text-white text-sm h-[67px] rounded-[6px] flex flex-col items-center justify-center`}>
            <div className='font-semibold'>{isBuy ? t('common:buy') + ' / Long' : t('common:sell') + ' / Short'}</div>
            {type !== OrderTypes.Market && <div className='font-medium'>{formatNumber(_price, decimals.decimalScalePrice, 0, true)}</div>}
        </div>
    );
};

export default OrderButtonMobile;