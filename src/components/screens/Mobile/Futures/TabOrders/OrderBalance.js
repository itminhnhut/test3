import React, { useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import { formatCurrency, formatNumber } from 'redux/actions/utils';
import { useSelector } from 'react-redux';
import TradingLabel from 'components/trade/TradingLabel';
import { getProfitVndc, VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import isNil from 'lodash/isNil';

const OrderBalance = ({
    ordersList,
    visible,
    mode,
    isTabHistory
}) => {
    const { t } = useTranslation();


    const wallets = useSelector(state => state.wallet.FUTURES);
    const assetConfig = useSelector((state) => state.utils.assetConfig) || null;
    const futuresMarketWatch = useSelector((state) => state?.futures?.marketWatch) || null;

    const balance = useMemo(() => {
        if (!wallets || !assetConfig) return;
        let value = 0;
        if (Array.isArray(assetConfig) && assetConfig?.length) {
            const futures = assetConfig.filter(o => o?.assetCode === 'VNDC');
            const dataFilter = {
                ...futures[0],
                wallet: wallets?.[futures[0].id],
            };
            value = dataFilter?.wallet?.value;
            if (+value < 0 || Math.abs(+value) < 1e-4 || isNil(value) || !value) value = 0;
            return {
                value,
                item: dataFilter
            };
        }
        return value;
    }, [wallets, assetConfig]);

    const totalProfit = useMemo(() => {
        let _totalProfit = 0;
        ordersList.forEach((item) => {
            const refPrice = item?.side === VndcFutureOrderType.Side.BUY ? futuresMarketWatch?.[item.symbol]?.bid : futuresMarketWatch?.[item.symbol]?.ask
            const lastPrice = refPrice || 0;
            _totalProfit += getProfitVndc(item, lastPrice);
        });
        return _totalProfit;
    }, [ordersList, futuresMarketWatch]);

    const volume = useMemo(() => {
        const total = ordersList.reduce((a, b) => a + (b.status !== VndcFutureOrderType.Status.PENDING && b?.order_value || 0), 0);
        return parseFloat(total).toFixed(10);
    }, [ordersList])

    const className = totalProfit === 0 ? '' : totalProfit > 0 ? 'text-onus-green' : 'text-onus-red';
    const pnl = <div className={className}>{formatNumber(totalProfit, 0, 0, true)}</div>;
    const total = balance.value + totalProfit;
    const lengthEquity = total ? formatNumber(total, balance?.item?.assetDigit)
        .replace(/,/g, '') : 0;
    const equity = lengthEquity.length > 7 ? formatCurrency(total) : formatNumber(total, balance?.item?.assetDigit, 0, true);
    const _volume = formatCurrency(volume);
    const length = balance?.value ? formatNumber(balance.value, balance?.item?.assetDigit)
        .replace(/,/g, '') : 0;
    const _balance = length.length > 7 ? formatCurrency(balance.value) : formatNumber(balance.value, balance?.item?.assetDigit);
    if (!visible) return null;
    if (mode === 'collapse') {
        return <div className="flex pt-[10px]">
            <TradingLabel
                label={t('futures:mobile:pnl')}
                value={pnl}
                labelClassName="dark:text-onus-grey"
                containerClassName={`text-xs flex justify-between w-1/2 pb-[6px] pr-[8px]`}
            />
            <TradingLabel
                label={t('futures:mobile:equity')}
                value={equity}
                labelClassName="dark:text-onus-grey"
                containerClassName='text-xs flex justify-between w-1/2 pb-[6px]'
            />
        </div>
    }
    return (
        <div
            className="sticky top-[42px] bg-white dark:bg-onus z-[10px] flex flex-wrap px-[16px] pb-[5px] pt-4">
            <div className="bg-onus-line rounded-[6px] w-full text-sm py-[9px] flex justify-around items-center px-[25px]">
                <div className="flex flex-col items-center">
                    <div className="font-normal text-onus-grey">{t('futures:mobile:equity')}</div>
                    <div className="font-medium">{equity}</div>
                </div>
                <div className="h-[30px] w-[1px] bg-[#2B3247]"></div>
                <div className="flex flex-col items-center ">
                    <div className="font-normal text-onus-grey">{t('futures:mobile:pnl')}</div>
                    <div className="font-medium">{pnl}</div>
                </div>
                <div className="h-[30px] w-[1px] bg-[#2B3247]"></div>
                <div className="flex flex-col items-center ">
                    <div className="font-normal text-onus-grey">{t('futures:mobile:volume_2')}</div>
                    <div className="font-medium">{_volume}</div>
                </div>
                {/* {!isTabHistory &&
                    <TradingLabel
                        label={t('futures:mobile:balance')}
                        value={_balance}
                        labelClassName="dark:text-onus-grey"
                        containerClassName="text-xs flex justify-between w-1/2 pb-[5px] pr-[8px]"
                    />
                }
                {!isTabHistory &&
                    <TradingLabel
                        label={t('futures:mobile:equity')}
                        value={equity}
                        labelClassName="dark:text-onus-grey"
                        containerClassName="text-xs flex justify-between w-1/2 pb-[5px]"
                    />
                }
                <TradingLabel
                    label={t('futures:mobile:pnl')}
                    value={pnl}
                    labelClassName="dark:text-onus-grey"
                    containerClassName={`text-xs flex justify-between w-1/2 pb-[5px] pr-[8px]`}
                />
                <TradingLabel
                    label={t('futures:mobile:volume_2')}
                    value={_volume}
                    labelClassName="dark:text-onus-grey"
                    containerClassName="text-xs flex justify-between w-1/2 pb-[5px]"
                /> */}
            </div>
        </div>
    );
};
export default OrderBalance;
