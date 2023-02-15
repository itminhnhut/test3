import React, { useMemo, useState, useEffect } from 'react';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { useTranslation } from 'next-i18next';
import { formatNumber } from 'redux/actions/utils';
import { getProfitVndc, VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { DefaultFuturesFee } from 'redux/actions/const';
import classNames from 'classnames';
import TradingInput from 'components/trade/TradingInput';
import Slider from 'components/trade/InputSlider';
import { floor } from 'lodash';
import WarningCircle from 'components/svg/WarningCircle';
import { API_VNDC_FUTURES_CHANGE_MARGIN } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import fetchApi from 'utils/fetch-api';
import { reFetchOrderListInterval } from 'redux/actions/futures';
import { useDispatch } from 'react-redux';

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

const EditMarginV2 = ({ order, _lastPrice, available, decimals, quoteAsset, order_value, side, margin, quantity, fee, onConfirm, forceFetchOrder }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [amount, setAmount] = useState('');
    const leverage = order?.leverage;
    const open_price = order?.open_price;
    const [adjustType, setAdjustType] = useState(ADJUST_TYPE.ADD);
    const [percent, setPercent] = useState(0);
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        setPercent(((amount * 100) / available).toFixed(0));
    }, [amount]);

    const errorProfit = useMemo(() => {
        if (adjustType === ADJUST_TYPE.REMOVE) {
            return t('futures:mobile:adjust_margin:temp_future');
        }
        if (adjustType === ADJUST_TYPE.REMOVE) {
            if (minMarginRatio === null) {
                return t('futures:mobile:adjust_margin:not_allow_change_margin');
            } else if (+amount > maxRemovable) {
                return t(`futures:mobile:adjust_margin:max_removable`, { max: formatNumber(maxRemovable, decimals.symbol) });
            }
        }
    }, [adjustType, amount, maxRemovable, minMarginRatio]);

    const onChangePercent = (x) => {
        const _amount = floor((x * available) / 100, decimals.symbol);
        setAmount(_amount);
    };

    const validator = () => {
        return {
            isValid: !(+amount > available && adjustType === ADJUST_TYPE.ADD),
            msg: t('futures:maximum_price') + formatNumber(available, decimals.symbol)
        };
    };

    const _onConfirm = async () => {
        let message;
        setLoading(true);
        try {
            const { data, status } = await fetchApi({
                url: API_VNDC_FUTURES_CHANGE_MARGIN,
                options: { method: 'PUT' },
                params: {
                    displaying_id: order?.displaying_id,
                    margin_change: +amount,
                    type: adjustType
                }
            });
            dispatch(reFetchOrderListInterval(2, 5000));
            if (forceFetchOrder) forceFetchOrder();

            if (status === ApiStatus.SUCCESS) {
                message = {
                    status: 'success',
                    title: t('common:success'),
                    message: t(
                        `futures:mobile:adjust_margin:${
                            {
                                [ADJUST_TYPE.ADD]: 'add_success',
                                [ADJUST_TYPE.REMOVE]: 'remove_success'
                            }[adjustType]
                        }`
                    )
                };
            } else {
                const requestId = data?.requestId && `(${data?.requestId.substring(0, 8)})`;
                console.log(data?.requestId, requestId);
                message = {
                    status: 'error',
                    title: t('common:failed'),
                    message: t(`futures:mobile:adjust_margin:error:${status || 'UNKNOWN'}`),
                    notes: requestId
                };
            }
        } catch (error) {
        } finally {
            if (onConfirm) onConfirm(message);
            setLoading(false);
        }
    };

    const isError = !validator().isValid || !amount;
    const ratioProfit = formatNumber((profit / newMargin) * 100, 2, 0, true);

    return (
        <>
            <div className="grid grid-cols-2 gap-11">
                <div className="max-h-[518px] overflow-y-auto overflow-x-hidden space-y-6">
                    <div>
                        <div className="text-txtSecondary-dark text-sm mb-3">{t('futures:mobile:adjust_margin:adjustment_type')}</div>
                        <div className="flex items-center">
                            <div
                                className={classNames('w-full flex items-center justify-center py-3 rounded-l border border-divider-dark cursor-pointer', {
                                    'bg-dark-2 font-semibold': adjustType === ADJUST_TYPE.ADD
                                })}
                                onClick={() => setAdjustType(ADJUST_TYPE.ADD)}
                            >
                                {t('futures:mobile:adjust_margin:add')} {t('futures:margin').toLowerCase()}
                            </div>
                            <div
                                className={classNames(
                                    'w-full flex items-center justify-center py-3 rounded-r border border-l-0 border-divider-dark cursor-pointer',
                                    {
                                        'bg-dark-2 font-semibold': adjustType === ADJUST_TYPE.REMOVE
                                    }
                                )}
                                onClick={() => setAdjustType(ADJUST_TYPE.REMOVE)}
                            >
                                {t('futures:mobile:adjust_margin:remove')} {t('futures:margin').toLowerCase()}
                            </div>
                        </div>
                        <div className="mt-6">
                            <div className="text-txtSecondary-dark text-sm mb-2">{t('common:amount')}</div>
                            <TradingInput
                                value={amount}
                                placeholder={t('futures:mobile:adjust_margin:amount_placeholder')}
                                decimalScale={decimals.symbol}
                                allowNegative={false}
                                thousandSeparator={true}
                                containerClassName="px-2.5 !bg-dark-2 w-full"
                                inputClassName="!text-left !ml-0"
                                onValueChange={({ value }) => setAmount(value)}
                                inputMode="decimal"
                                allowedDecimalSeparators={[',', '.']}
                                validator={validator()}
                                tailContainerClassName="text-txtSecondary dark:text-txtSecondary-dark text-xs select-none"
                                renderTail={() => quoteAsset}
                                clearAble
                            />
                            <div className="w-full px-2 mt-4">
                                <Slider
                                    useLabel
                                    positionLabel="top"
                                    labelSuffix="%"
                                    x={percent}
                                    axis="x"
                                    xmax={100}
                                    xmin={0}
                                    onChange={({ x }) => available && onChangePercent(x)}
                                    dots={4}
                                />
                            </div>
                        </div>
                    </div>
                </div>
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
                                    'text-teal': ratioProfit >= 0,
                                    'text-red': ratioProfit < 0
                                })}
                            >
                                {(ratioProfit > 0 ? '+' : '') + ratioProfit + '%'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative mt-8">
                <div className="flex items-start space-x-2 absolute -top-5">
                    {errorProfit && (
                        <>
                            <WarningCircle className="flex-none" />
                            <span className="text-xs text-[#FF9F1A]">{errorProfit}</span>
                        </>
                    )}
                </div>
                <ButtonV2 disabled={isError || !!errorProfit || loading} onClick={_onConfirm}>
                    {t('common:confirm')}
                </ButtonV2>
            </div>
        </>
    );
};

export default EditMarginV2;
