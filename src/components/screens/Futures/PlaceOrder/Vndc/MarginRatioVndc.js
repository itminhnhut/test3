import React, { useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import { convertSymbol, formatNumber } from 'redux/actions/utils';
import { useSelector } from 'react-redux';
import { getProfitVndc, VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import isNil from 'lodash/isNil';

const FuturesMarginRatioVndc = ({ pairConfig, decimals }) => {
    const quoteAsset = pairConfig?.quoteAsset;
    const ordersList = useSelector((state) => state?.futures?.ordersList);
    const wallets = useSelector((state) => state.wallet.FUTURES);
    const futuresMarketWatch = useSelector((state) => state?.futures?.marketWatch) || null;
    const { t } = useTranslation();

    const balance = useMemo(() => {
        if (!wallets) return 0;
        const avl = wallets?.[pairConfig?.quoteAssetId];
        let value = Math.max(avl?.value, 0);
        if (+value < 0 || Math.abs(+value) < 1e-4 || isNil(value) || !value) value = 0;
        return value;
    }, [wallets, pairConfig]);

    const totalProfit = useMemo(() => {
        let _totalProfit = 0;
        const dataFilter = ordersList.filter((order) => order.symbol.includes(quoteAsset));
        dataFilter.forEach((item) => {
            const symbol = convertSymbol(item.symbol);
            const _priceData = futuresMarketWatch?.[symbol];
            const refPrice = item?.side === VndcFutureOrderType.Side.BUY ? _priceData?.bid : _priceData?.ask;
            const lastPrice = refPrice || 0;
            _totalProfit += getProfitVndc(item, lastPrice, true);
        });
        return _totalProfit;
    }, [ordersList, futuresMarketWatch, pairConfig]);

    const volume = useMemo(() => {
        const dataFilter = ordersList.filter((order) => order.symbol.includes(quoteAsset));
        const total = dataFilter.reduce((a, b) => a + ((b.status !== VndcFutureOrderType.Status.PENDING && b?.order_value) || 0), 0);
        return parseFloat(total).toFixed(10);
    }, [ordersList, pairConfig]);

    const dataFormat = useMemo(() => {
        const pnl = formatNumber(totalProfit, decimals.symbol, 0, true);
        const equity = formatNumber(balance + totalProfit, 2);
        const _volume = formatNumber(volume, decimals.symbol);
        const _balance = formatNumber(balance, decimals.symbol);
        return {
            pnl,
            balance: _balance,
            volume: _volume,
            equity
        };
    }, [balance, totalProfit, volume, decimals]);

    return (
        <div className="p-6 pl-4 h-full !overflow-x-hidden overflow-y-auto ">
            <div className="flex items-center justify-between">
                <span className="futures-component-title !text-lg !font-semibold">{t('common:overview')}</span>
            </div>

            <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                    <span className="flex items-center text-sm text-txtSecondary dark:text-txtSecondary-dark">{t('futures:balance')}</span>
                    <div className="font-semibold !text-base">
                        {dataFormat.balance} {quoteAsset}
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="flex items-center text-sm text-txtSecondary dark:text-txtSecondary-dark">{t('futures:mobile:pnl')}</span>
                    <div className={`font-semibold !text-base ${totalProfit === 0 ? '' : totalProfit > 0 ? 'text-teal' : 'text-red'}`}>
                        {dataFormat.pnl} {quoteAsset}
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="flex items-center text-sm text-txtSecondary dark:text-txtSecondary-dark">{t('futures:mobile:volume_2')}</span>
                    <div className="font-semibold !text-base">{dataFormat.volume}</div>
                </div>
            </div>
        </div>
    );
};

export default FuturesMarginRatioVndc;
