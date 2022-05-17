import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next'
import { formatNumber, formatCurrency } from 'redux/actions/utils';
import { useSelector } from 'react-redux'
import TradingLabel from 'components/trade/TradingLabel';
import { getProfitVndc } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import isNil from 'lodash/isNil';

const AVAILBLE_KEY = 'futures_available'
const OrderBalance = ({ ordersList, visible }) => {
    const { t } = useTranslation();
    if (!visible) return null;
    return (
        <div className="flex flex-wrap px-[16px] pb-[5px] border-b-gray-4 border-b-[1px] mt-[10px] dark:border-divider-dark">
            <TradingLabel
                label={t('futures:mobile:balance')}
                value={<Balance />}
                containerClassName='text-xs flex justify-between w-1/2 pb-[5px] pr-[8px]'
            />
            <TradingLabel
                label={t('futures:mobile:equity')}
                value={<Balance ordersList={ordersList} mode='equity' />}
                containerClassName='text-xs flex justify-between w-1/2 pb-[5px]'
            />

            <TradingLabel
                label={t('futures:mobile:pnl')}
                value={<Balance ordersList={ordersList} mode='pnl' />}
                containerClassName={`text-xs flex justify-between w-1/2 pb-[5px] pr-[8px]`}
            />
            <TradingLabel
                label={t('futures:order_table:volume')}
                value={<Balance ordersList={ordersList} mode='volume' />}
                containerClassName='text-xs flex justify-between w-1/2 pb-[5px]'
            />

        </div>
    );
};

const Balance = ({ ordersList = [], mode }) => {
    const wallets = useSelector(state => state.wallet.FUTURES)
    const assetConfig = useSelector((state) => state.utils.assetConfig) || null
    const futuresMarketWatch = useSelector((state) => state?.futures?.marketWatch) || null;

    const balance = useMemo(() => {
        if (!wallets || !assetConfig) return
        let value = 0;
        if (Array.isArray(assetConfig) && assetConfig?.length) {
            const futures = assetConfig.filter(o => o?.assetCode === 'VNDC');
            const dataFilter = {
                ...futures[0],
                wallet: wallets?.[futures[0].id],
            };
            value = dataFilter?.wallet?.value;
            if (+value < 0 || Math.abs(+value) < 1e-4 || isNil(value) || !value) value = 0;
            return { value, item: dataFilter };
        }
        return value;
    }, [wallets, assetConfig])

    const totalProfit = useMemo(() => {
        let _totalProfit = 0;
        ordersList.forEach((item) => {
            const lastPrice = futuresMarketWatch?.[item.symbol]?.lastPrice || 0
            _totalProfit += getProfitVndc(item, lastPrice);
        });
        return _totalProfit;
    }, [ordersList, futuresMarketWatch])

    const volume = useMemo(() => {
        const total = ordersList.reduce((a, b) => a + b?.quantity, 0);
        return total;
    }, [ordersList])

    switch (mode) {
        case 'pnl':
            return formatNumber(totalProfit, 0, 0, true);
        case 'equity':
            const total = balance.value + totalProfit;
            const lengthEquity = formatNumber(total, balance?.item?.assetDigit).replaceAll(',', '');
            return lengthEquity.length > 7 ? formatCurrency(total) : formatNumber(total, balance?.item?.assetDigit, 0, true);
        case 'volume':
            return formatNumber(volume, 8, 0, true);
        default:
            const length = formatNumber(balance.value, balance?.item?.assetDigit).replaceAll(',', '');
            return length.length > 7 ? formatCurrency(balance.value) : formatNumber(balance.value, balance?.item?.assetDigit);
    }
}

export default OrderBalance;