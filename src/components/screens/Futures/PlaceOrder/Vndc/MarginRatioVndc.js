import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { formatCurrency, formatNumber } from 'redux/actions/utils';
import { useSelector } from 'react-redux';
import { getProfitVndc, VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import isNil from 'lodash/isNil';
import Emitter from 'redux/actions/emitter';
import { PublicSocketEvent } from 'redux/actions/const';
import FuturesMarketWatch from 'models/FuturesMarketWatch';

const FuturesMarginRatioVndc = ({ pairConfig, decimals }) => {
    const quoteAsset = pairConfig?.quoteAsset;
    const assetConfig = useSelector((state) => state.utils.assetConfig) || null;
    const futuresMarketWatch = useSelector((state) => state?.futures?.marketWatch) || null;
    const ordersList = useSelector((state) => state?.futures?.ordersList);
    const wallets = useSelector((state) => state.wallet.FUTURES);
    const { t } = useTranslation();
    const [state, set] = useState();
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));

    // Handle socket here
    useEffect(() => {
        // ? Subscribe publicSocket
        // ? Get Pair Ticker
        Emitter.on(PublicSocketEvent.FUTURES_TICKER_UPDATE, async (data) => {
            if (data?.s && data?.p > 0) {
                const _pairPrice = FuturesMarketWatch.create(data);
                setState({ [data.s]: _pairPrice });
            }
        });
        return () => {
            // Emitter.off(PublicSocketEvent.FUTURES_TICKER_UPDATE);
        };
    }, []);

    const balance = useMemo(() => {
        if (!wallets || !assetConfig) return;
        let value = 0;
        if (Array.isArray(assetConfig) && assetConfig?.length) {
            const futures = assetConfig.filter((o) => o?.assetCode === quoteAsset);
            const dataFilter = {
                ...futures[0],
                wallet: wallets?.[futures[0]?.id]
            };
            value = Math.max(dataFilter?.wallet?.value, 0);
            if (+value < 0 || Math.abs(+value) < 1e-4 || isNil(value) || !value) value = 0;
            return {
                value,
                item: dataFilter
            };
        }
        return value;
    }, [wallets, assetConfig, pairConfig]);

    const totalProfit = useMemo(() => {
        let _totalProfit = 0;
        const dataFilter = ordersList.filter((order) => order.symbol.includes(quoteAsset));
        dataFilter.forEach((item) => {
            const _priceData = state?.[item.symbol] || futuresMarketWatch?.[item.symbol];
            const refPrice = item?.side === VndcFutureOrderType.Side.BUY ? _priceData?.bid : _priceData?.ask;
            const lastPrice = refPrice || 0;
            _totalProfit += getProfitVndc(item, lastPrice, true);
        });
        return _totalProfit;
    }, [ordersList, futuresMarketWatch, state, pairConfig]);

    const volume = useMemo(() => {
        const dataFilter = ordersList.filter((order) => order.symbol.includes(quoteAsset));
        const total = dataFilter.reduce((a, b) => a + ((b.status !== VndcFutureOrderType.Status.PENDING && b?.order_value) || 0), 0);
        return parseFloat(total).toFixed(10);
    }, [ordersList, pairConfig]);

    const dataFormat = useMemo(() => {
        const pnl = formatNumber(totalProfit, balance?.item?.assetDigit, 0, true);
        const equity = formatNumber(balance.value + totalProfit, 2);
        const _volume = formatNumber(volume, decimals.symbol);
        const _balance = formatNumber(balance.value, decimals.symbol);
        return {
            pnl,
            balance: _balance,
            volume: _volume,
            equity
        };
    }, [balance, totalProfit, volume, decimals]);

    return (
        <div className="p-6 pl-4 h-full !overflow-x-hidden overflow-y-auto ">
            <div className="flex items-center justify-between dragHandleArea">
                <span className="futures-component-title text-lg font-semibold">{t('common:overview')}</span>
            </div>

            <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                    <span className="flex items-center text-sm text-txtSecondary dark:text-txtSecondary-dark">{t('futures:balance')}</span>
                    <div className="font-semibold">
                        {dataFormat.balance} {quoteAsset}
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="flex items-center text-sm text-txtSecondary dark:text-txtSecondary-dark">{t('futures:mobile:pnl')}</span>
                    <div className={`font-semibold ${totalProfit === 0 ? '' : totalProfit > 0 ? 'text-teal' : 'text-red'}`}>
                        {dataFormat.pnl} {quoteAsset}
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="flex items-center text-sm text-txtSecondary dark:text-txtSecondary-dark">{t('futures:mobile:volume_2')}</span>
                    <div className="font-semibold">{dataFormat.volume}</div>
                </div>
            </div>
        </div>
    );
};

export default FuturesMarginRatioVndc;
