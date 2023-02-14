import React, { useMemo, useState } from 'react';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { useTranslation } from 'next-i18next';
import { formatNumber } from 'redux/actions/utils';
import { getProfitVndc, VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { DefaultFuturesFee } from 'redux/actions/const';
import classNames from 'classnames';
const ADJUST_TYPE = {
    ADD: 'ADD',
    REMOVE: 'REMOVE'
};

const CONFIG_MIN_PROFIT = [
    { leverage: [-Infinity, 1], minMarginRatio: 0.2 },
    { leverage: [1, 5], minMarginRatio: 0.25 },
    { leverage: [5, 10], minMarginRatio: 0.3 },
    { leverage: [10, 15], minMarginRatio: 0.4 },
    { leverage: [15, 25], minMarginRatio: 0.5 },
    { leverage: [25, Infinity], minMarginRatio: null }
];

const calMinProfitAllow = (leverage) => {
    const { minMarginRatio } = CONFIG_MIN_PROFIT.find((c) => {
        const [start, end] = c.leverage;
        return leverage > start && leverage <= end;
    });
    return minMarginRatio;
};

const calLiqPrice = (side, quantity, open_price, margin, fee, order) => {
    const size = side === VndcFutureOrderType.Side.SELL ? -quantity : quantity;
    const number = side === VndcFutureOrderType.Side.SELL ? -1 : 1;
    // const funding = order?.funding_fee?.margin ? Math.abs(order?.funding_fee?.margin) : 0
    return (size * open_price + fee - margin) / (quantity * (number - DefaultFuturesFee.NamiFrameOnus));
};

const EditMarginV2 = ({ order, pairConfig, _lastPrice, pairTicker, available, decimals, quoteAsset, order_value, side, margin, quantity, fee, onConfirm }) => {
    const { t } = useTranslation();
    const [amount, setAmount] = useState('');
    const leverage = order?.leverage;
    const open_price = order?.open_price;
    const [adjustType, setAdjustType] = useState(ADJUST_TYPE.ADD);

    const profit = getProfitVndc(order, _lastPrice, true);
    const {
        newMargin = 0,
        newLiqPrice = 0,
        minMarginRatio,
        initMargin = 0,
        maxRemovable = 0
    } = useMemo(() => {
        if (!order) return {};
        const initMargin = +order_value / +leverage;
        const minMarginRatio = calMinProfitAllow(leverage);
        let maxRemovable = order.margin - initMargin * minMarginRatio + Math.min(profit, 0);
        if (!minMarginRatio) {
            maxRemovable = 0;
        }

        const newMargin = margin + (adjustType === ADJUST_TYPE.REMOVE ? -amount : +amount);
        return {
            newMargin,
            newLiqPrice: calLiqPrice(side, quantity, open_price, newMargin, fee, order),
            minMarginRatio,
            initMargin,
            maxRemovable: maxRemovable * 0.9 // Minus 10% to ensure valid in server
        };
    }, [order, amount, adjustType, profit]);

    const percent = formatNumber((profit / newMargin) * 100, 2, 0, true);

    return (
        <>
            <div className="grid grid-cols-2 gap-11">
                <div className="max-h-[518px] overflow-y-auto overflow-x-hidden space-y-6">213123</div>
                <div className="p-4 rounded-xl bg-darkBlue-3 text-base">
                    <div className="font-semibold mb-6">{t('futures:calulator:result')}</div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="text-txtSecondary-dark">{t('futures:mobile:adjust_margin:assigned_margin')}</div>
                            <div className="font-semibold">{formatNumber(margin, decimals.symbol)}</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-txtSecondary-dark">{t('futures:mobile:adjust_margin:available')}</div>
                            <div className="font-semibold">{formatNumber(available, decimals.symbol)}</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-txtSecondary-dark">{t('futures:mobile:adjust_margin:new_liq_price')}</div>
                            <div className="font-semibold">
                                {formatNumber(newLiqPrice, decimals.price, 0, true)}
                                <span className="ml-1">{quoteAsset}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-txtSecondary-dark">{t('futures:mobile:adjust_margin:profit_ratio')}</div>
                            <div
                                className={classNames('font-semibold', {
                                    'text-teal': percent >= 0,
                                    'text-red': percent < 0
                                })}
                            >
                                {(percent > 0 ? '+' : '') + percent + '%'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ButtonV2 disabled={false} onClick={onConfirm} className="mt-8">
                {t('common:confirm')}
            </ButtonV2>
        </>
    );
};

export default EditMarginV2;
