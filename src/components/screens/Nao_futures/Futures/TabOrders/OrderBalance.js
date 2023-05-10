import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { formatCurrency, formatNumber } from 'redux/actions/utils';
import { useSelector } from 'react-redux';
import TradingLabel from 'components/trade/TradingLabel';
import { getProfitVndc, VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import isNil from 'lodash/isNil';
import Emitter from 'redux/actions/emitter';
import { PublicSocketEvent } from 'redux/actions/const';
import FuturesMarketWatch from 'models/FuturesMarketWatch';

const OrderBalance = ({
    ordersList,
    visible,
    mode,
    isTabHistory,
    pairConfig
}) => {
    const { t } = useTranslation();
    const quoteAsset = pairConfig?.quoteAsset ?? 'VNDC';

    const [state, set] = useState();
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));
    const wallets = useSelector(state => state.wallet?.NAO_FUTURES);
    const assetConfig = useSelector((state) => state.utils.assetConfig) || null;
    const futuresMarketWatch = useSelector((state) => state?.futures?.marketWatch) || null;

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
        let value = 0;
        if (Array.isArray(assetConfig) && assetConfig?.length && wallets) {
            const futures = assetConfig.filter((o) => o?.assetCode === quoteAsset);
            const dataFilter = {
                ...futures[0],
                wallet: wallets?.[futures[0].id]
            };
            value = Math.max(dataFilter?.wallet?.value, 0);
            if (+value < 0 || Math.abs(+value) < 1e-4 || isNil(value) || !value) value = 0;
            return {
                value,
                item: dataFilter
            };
        }
        return { value };
    }, [wallets, assetConfig, pairConfig]);

    const totalProfit = useMemo(() => {
        let _totalProfit = 0;
        const dataFilter = ordersList.filter(order => order.symbol.includes(quoteAsset))
        dataFilter.forEach((item) => {
            const _priceData = state?.[item.symbol] || futuresMarketWatch?.[item.symbol]
            const refPrice = item?.side === VndcFutureOrderType.Side.BUY ? _priceData?.bid : _priceData?.ask
            const lastPrice = refPrice || 0;
            _totalProfit += getProfitVndc(item, lastPrice, true);
        });
        return _totalProfit;
    }, [ordersList, futuresMarketWatch, state, pairConfig]);

    const volume = useMemo(() => {
        const dataFilter = ordersList.filter(order => order.symbol.includes(quoteAsset))
        const total = dataFilter.reduce((a, b) => a + (b.status !== VndcFutureOrderType.Status.PENDING && b?.order_value || 0), 0);
        return parseFloat(total).toFixed(10);
    }, [ordersList, pairConfig])

    const className = totalProfit === 0 ? '' : totalProfit > 0 ? 'text-green-2' : 'text-red-2';

    const dataFormat = useMemo(() => {
        const pnl = <div className={className}> {totalProfit > 0 ? "+" : totalProfit < 0 ? "-" : ""} {formatNumber(totalProfit, balance?.item?.assetDigit, 0, true)}</div>;
        const total = balance.value + totalProfit;
        const lengthEquity = total ? formatNumber(total, balance?.item?.assetDigit)
            .replace(/,/g, '') : 0;
        const equity = lengthEquity.length > 7 ? formatCurrency(total, 2) : formatNumber(total, balance?.item?.assetDigit, 0, true);
        const _volume = formatCurrency(volume, 2);
        const length = balance?.value ? formatNumber(balance.value, balance?.item?.assetDigit)
            .replace(/,/g, '') : 0;
        const _balance = length.length > 7 ? formatCurrency(balance.value, 2) : formatNumber(balance.value, balance?.item?.assetDigit);
        return {
            pnl,
            balance: _balance,
            volume: _volume,
            equity
        }
    }, [balance, totalProfit, volume])

    if (!visible) return null;
    if (mode === 'collapse') {
        return <div className="flex pt-[10px]">
            <TradingLabel
                label={t('futures:mobile:pnl')}
                value={dataFormat.pnl}
                labelClassName="text-txtSecondary dark:text-txtSecondary-dark"
                containerClassName={`text-xs flex justify-between w-1/2 pb-[6px] pr-[8px]`}
            />
            <TradingLabel
                label={t('futures:mobile:equity')}
                value={dataFormat.equity}
                labelClassName="text-txtSecondary dark:text-txtSecondary-dark"
                containerClassName='text-xs flex justify-between w-1/2 pb-[6px]'
            />
        </div>
    }
    return (
        <div className="sticky top-[42px] bg-bgPrimary dark:bg-bgPrimary-dark z-[10] flex flex-wrap px-4 pt-4">
            <div className="bg-gray-13 dark:bg-dark-4 rounded-[6px] w-full text-xs py-[9px] flex items-center">
                <div className="flex flex-col items-center w-1/3 border-r border-divider dark:border-divider-dark">
                    <div className="font-normal text-txtSecondary dark:text-txtSecondary-dark pb-[2px]">{t('futures:mobile:balance')}</div>
                    <div className="font-medium">{dataFormat.balance}</div>
                </div>
                <div className="flex flex-col items-center w-1/3 border-r border-divider dark:border-divider-dark">
                    <div className="font-normal text-txtSecondary dark:text-txtSecondary-dark pb-[2px]">{t('futures:mobile:pnl')}</div>
                    <div className="font-medium">{dataFormat.pnl}</div>
                </div>
                <div className="flex flex-col items-center w-1/3">
                    <div className="font-normal text-txtSecondary dark:text-txtSecondary-dark pb-[2px]">{t('futures:mobile:volume_2')}</div>
                    <div className="font-medium">{dataFormat.volume}</div>
                </div>
                {/* {!isTabHistory &&
                    <TradingLabel
                        label={t('futures:mobile:balance')}
                        value={_balance}
                        labelClassName="text-txtSecondary dark:text-txtSecondary-dark"
                        containerClassName="text-xs flex justify-between w-1/2 pb-[5px] pr-[8px]"
                    />
                }
                {!isTabHistory &&
                    <TradingLabel
                        label={t('futures:mobile:equity')}
                        value={equity}
                        labelClassName="text-txtSecondary dark:text-txtSecondary-dark"
                        containerClassName="text-xs flex justify-between w-1/2 pb-[5px]"
                    />
                }
                <TradingLabel
                    label={t('futures:mobile:pnl')}
                    value={pnl}
                    labelClassName="text-txtSecondary dark:text-txtSecondary-dark"
                    containerClassName={`text-xs flex justify-between w-1/2 pb-[5px] pr-[8px]`}
                />
                <TradingLabel
                    label={t('futures:mobile:volume_2')}
                    value={_volume}
                    labelClassName="text-txtSecondary dark:text-txtSecondary-dark"
                    containerClassName="text-xs flex justify-between w-1/2 pb-[5px]"
                /> */}
            </div>
        </div>
    );
};
export default OrderBalance;
