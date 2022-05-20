import React, { memo, useContext, useState } from 'react';
import styled from 'styled-components'
import { useTranslation } from 'next-i18next';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType'
import { formatNumber, formatCurrency } from 'redux/actions/utils';
import { Balance } from '../TabOrders/OrderBalance';
import TradingLabel from 'components/trade/TradingLabel';
import { useSelector } from 'react-redux'
import { placeFuturesOrder } from 'redux/actions/futures';
import { AlertContext } from 'components/common/layouts/LayoutMobile'

const OrderCollapse = ({ pairConfig, size, pairPrice, decimals, leverage, isAuth, marginAndValue, availableAsset }) => {
    const { t } = useTranslation();
    const ordersList = useSelector(state => state?.futures?.ordersList)
    const context = useContext(AlertContext);
    const [disabled, setDisabled] = useState(false)

    const onOrder = (side, price) => {
        if (disabled) return;
        setDisabled(true);
        const sl = price - ((side === VndcFutureOrderType.Side.BUY ? price : -price) * 0.05)
        const tp = price + ((side === VndcFutureOrderType.Side.SELL ? -price : price) * 0.05)
        const params = {
            symbol: pairConfig?.symbol,
            type: VndcFutureOrderType.Type.MARKET,
            side: side,
            quantity: size,
            price,
            leverage,
            sl: +sl.toFixed(decimals.decimalScalePrice),
            tp: +tp.toFixed(decimals.decimalScalePrice)
        };
        placeFuturesOrder(params, { alert: context?.alert }, t, () => {
            setDisabled(false)
        })
    }

    const className = disabled || !isAuth ? '!bg-gray-3 dark:!bg-darkBlue-4 text-gray-1 dark:text-darkBlue-2 cursor-not-allowed' : '';

    return (
        <div className="w-full">
            <div className="relative flex w-full h-[56px] text-sm">
                <Side className={`bg-teal rounded-l-[6px] text-white ${className}`}
                    onClick={() => onOrder(VndcFutureOrderType.Side.BUY, pairPrice?.ask)}>
                    <div>{t('common:buy')}&nbsp;{formatNumber(size, decimals.decimalScaleQtyLimit)}&nbsp;{pairConfig?.baseAsset}</div>
                    <span>{formatNumber(pairPrice?.ask, decimals.decimalScalePrice, 0, true)}</span>
                </Side>
                <Text>
                    {formatNumber(pairPrice?.ask - pairPrice?.bid, decimals.decimalScalePrice, 0, true)}
                </Text>
                <Side className={`bg-red rounded-r-[6px] text-white items-end ${className}`}
                    onClick={() => onOrder(VndcFutureOrderType.Side.SELL, pairPrice?.bid)}>
                    <div>{t('common:sell')}&nbsp;{formatNumber(size, decimals.decimalScaleQtyLimit)}&nbsp;{pairConfig?.baseAsset}</div>
                    <span>{formatNumber(pairPrice?.bid, decimals.decimalScalePrice, 0, true)}</span>
                </Side>
            </div>
            {ordersList.length > 0 ?
                <Equity ordersList={ordersList} />
                :
                <div className="flex pt-[10px]">
                    <TradingLabel
                        label={t('futures:mobile:available')}
                        value={formatNumber(availableAsset ?? 0, 0)}
                        containerClassName={`text-xs flex justify-between w-1/2 pb-[5px] pr-[8px]`}
                    />
                    <TradingLabel
                        label={t('futures:margin')}
                        value={`${marginAndValue?.marginLength > 7 ? formatCurrency(marginAndValue?.margin) : formatNumber(
                            marginAndValue?.margin,
                            pairConfig?.pricePrecision || 2
                        )}`}
                        containerClassName='text-xs flex justify-between w-1/2 pb-[5px]'
                    />
                </div>
            }
        </div>
    );
};

const Equity = memo(({ ordersList }) => {
    const { t } = useTranslation();
    return (
        <div className="flex pt-[10px]">
            <TradingLabel
                label={t('futures:mobile:pnl')}
                value={<Balance ordersList={ordersList} mode='pnl' />}
                containerClassName={`text-xs flex justify-between w-1/2 pb-[5px] pr-[8px]`}
            />
            <TradingLabel
                label={t('futures:mobile:equity')}
                value={<Balance ordersList={ordersList} mode='equity' />}
                containerClassName='text-xs flex justify-between w-1/2 pb-[5px]'
            />
        </div>
    )
})

const Side = styled.div.attrs({
    className: 'w-1/2 bg-teal px-[16px] flex justify-center flex-col font-medium'
})`
`

const Text = styled.div.attrs({
    className: 'absolute font-medium bg-white text-teal text-xs rounded-[6px] px-[15px] py-[4px] left-[50%] top-[50%]'
})`
transform:translate(-50%, -50%)
`

export default OrderCollapse;