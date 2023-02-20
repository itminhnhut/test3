import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { formatNumber, getType, checkLargeVolume, checkInFundingTime } from 'redux/actions/utils';
import { DefaultFuturesFee } from 'redux/actions/const';
import { Minus, Plus } from 'react-feather';
import TradingInput from 'components/trade/TradingInput';
import Slider from 'components/trade/InputSlider';
import { getMaxQuoteQty } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import floor from 'lodash/floor';
import ChevronDown from 'components/svg/ChevronDown';
import { getTypesLabel, VndcFutureOrderType, validator } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import SelectV2 from 'components/common/V2/SelectV2';
import CollapseV2 from 'components/common/V2/CollapseV2';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { API_DCA_ORDER } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import fetchApi from 'utils/fetch-api';
import classNames from 'classnames';

const EditVolV2 = ({ order, pairConfig, _lastPrice, pairTicker, available, decimals, quoteAsset, order_value, side, margin, quantity, fee, onConfirm }) => {
    const { t } = useTranslation();
    const [volume, setVolume] = useState();
    const [leverage, setLeverage] = useState(order?.leverage);
    const [type, setType] = useState(order?.type);
    const [price, setPrice] = useState(_lastPrice);
    const [percent, setPercent] = useState(1);
    const [showCustomized, setShowCustomized] = useState(false);
    const isChangeSlide = useRef(false);
    const [loading, setLoading] = useState(false);
    const [focus, setFocus] = useState();

    const minQuoteQty = useMemo(() => {
        const initValue = quoteAsset === 'VNDC' ? 100000 : 5;
        return pairConfig ? +pairConfig?.filters.find((item) => item.filterType === 'MIN_NOTIONAL')?.notional : initValue;
    }, [pairConfig]);

    const maxQuoteQty = useMemo(() => {
        const _type = showCustomized ? type : VndcFutureOrderType.Type.MARKET;
        const _maxQuoteQty = getMaxQuoteQty(price, _type, side, leverage, available, pairTicker, pairConfig, true, true);
        const max = Math.min(leverage * available, _maxQuoteQty);
        return floor(max, decimals.symbol);
    }, [price, side, leverage, pairTicker, pairConfig, type, showCustomized, available]);

    useEffect(() => {
        if (showCustomized) {
            setPrice(_lastPrice);
            setLeverage(order?.leverage);
            setType(order?.type);
        }
    }, [showCustomized]);

    useEffect(() => {
        setVolume(minQuoteQty);
    }, [minQuoteQty]);

    useEffect(() => {
        setPercent((volume * 100) / order_value);
    }, [volume]);

    const onChangeVolume = (value) => {
        if (isChangeSlide.current) {
            isChangeSlide.current = false;
            return;
        }
        setVolume(value);
    };

    const arrDot = useMemo(() => {
        const size = 200 / 4;
        const arr = [];
        for (let i = 0; i <= 4; i++) {
            arr.push(i * size);
        }
        return arr;
    }, []);

    const onChangePercent = (x) => {
        isChangeSlide.current = true;
        const _x = arrDot.reduce((prev, curr) => {
            let i = 0;
            if (Math.abs(curr - x) < 2 || Math.abs(prev - x) < 2) {
                i = Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev;
            }
            return i;
        });
        const value = ((+order_value * (_x ? _x : x)) / 100).toFixed(decimals.symbol);
        setVolume(+value || '');
        setPercent(_x ? _x : x);
    };

    const general = useMemo(() => {
        const _price = type === VndcFutureOrderType.Type.MARKET ? _lastPrice : price;
        const _margin = leverage ? margin + volume / leverage : 0;
        const _quantity = volume / _price + quantity;
        const AvePrice = ((volume / _price) * _price + quantity * order?.open_price) / _quantity;
        const size = side === VndcFutureOrderType.Side.SELL ? -_quantity : _quantity;
        const number = side === VndcFutureOrderType.Side.SELL ? -1 : 1;
        const liqPrice = (size * AvePrice + fee - _margin) / (_quantity * (number - DefaultFuturesFee.Nami));
        return {
            margin: _margin,
            AvePrice: AvePrice,
            liqPrice: liqPrice
        };
    }, [margin, volume, leverage, side, quantity, fee, price, _lastPrice, type, showCustomized]);

    const optionsTypes = useMemo(() => {
        const options = [];
        return pairConfig?.orderTypes?.reduce((prev, curr) => {
            options.push({
                title: getTypesLabel(curr, t),
                value: getType(curr)
            });
            return options;
        }, []);
    }, [pairConfig, t]);

    const _validator = (key) => {
        switch (key) {
            case 'price':
                return validator('price', price, String(type).toUpperCase(), side, _lastPrice, pairConfig, decimals.symbol, t);
            case 'quoteQty':
                return {
                    isValid: !(volume && (volume < +minQuoteQty || volume > +maxQuoteQty)),
                    msg:
                        volume < +minQuoteQty
                            ? `${t('futures:minimum_qty')}: ${formatNumber(minQuoteQty, decimals.symbol)}`
                            : `${t('futures:maximum_qty')}: ${formatNumber(maxQuoteQty, decimals.symbol)}`
                };
            case 'leverage':
                const min = pairConfig?.leverageConfig.min ?? 0;
                const max = pairConfig?.leverageConfig.max ?? 0;
                return {
                    isValid: !(leverage < min || leverage > max),
                    msg:
                        leverage < min
                            ? `${t('futures:minimum_leverage')}: ${formatNumber(min, 0)}`
                            : `${t('futures:maximum_leverage')}: ${formatNumber(max, 0)}`
                };
            default:
                break;
        }
    };

    const _onConfirm = async () => {
        const isLargeVolume = checkLargeVolume(+volume, quoteAsset === 'VNDC');
        const inFundingTime = checkInFundingTime();
        let notice = null;
        if (inFundingTime) {
            notice = t('futures:high_funding_note');
        } else if (isLargeVolume) {
            notice = t('futures:high_volume_note');
        }
        let message;
        try {
            setLoading(true);
            const params = {
                displaying_id: order?.displaying_id,
                type: type,
                leverage: +leverage,
                price: +price,
                useQuoteQty: true,
                quoteQty: +volume
            };
            const { status, data } = await fetchApi({
                url: API_DCA_ORDER,
                options: { method: 'PUT' },
                params: params
            });
            if (status === ApiStatus.SUCCESS) {
                message = {
                    status: 'success',
                    title: t('futures:mobile:adjust_margin:add_volume_success'),
                    message: t('futures:modify_order_success'),
                    notes: notice
                };
            } else {
                const requestId = data?.requestId && `(${data?.requestId.substring(0, 8)})`;
                let _message = t(`error:futures:${status || 'UNKNOWN'}`);
                if (status === 'MAX_TOTAL_VOLUME') {
                    _message = t(`error:futures:MAX_TOTAL_VOLUME`, {
                        value: `${formatNumber(data?.max_notional)} ${order?.symbol.includes('VNDC') ? 'VNDC' : 'USDT'}`
                    });
                }
                message = {
                    status: 'error',
                    title: t('common:failed'),
                    message: _message,
                    notes: requestId
                };
            }
        } catch (e) {
            if (e.message === 'Network Error' || !navigator?.onLine) {
                message = {
                    status: 'error',
                    title: t('common:failed'),
                    message: t('error:futures:NETWORK_ERROR')
                };
            }
        } finally {
            setLoading(false);
            if (onConfirm) onConfirm(message);
        }
    };

    const changeClass = `w-5 h-5 flex items-center justify-center rounded-md`;
    const isError =
        !volume ||
        (available && !_validator('quoteQty')?.isValid) ||
        !_validator('leverage')?.isValid ||
        (!_validator('price')?.isValid && showCustomized && type !== VndcFutureOrderType.Type.MARKET);
    console.log(_validator('leverage'));
    return (
        <>
            <div className="grid grid-cols-2 gap-6">
                <div className="max-h-[518px] overflow-y-auto overflow-x-hidden space-y-6 pr-6 pl-[1px]">
                    <div>
                        <div className="text-teal text-lg font-semibold relative w-max bottom-[-13px] px-[6px] left-[9px] bg-white dark:bg-bgSpotContainer-dark">
                            {order?.symbol} {order?.leverage}x
                        </div>
                        <div className="border border-divider dark:border-divider-dark p-4 rounded-md">
                            <div className="flex items-center justify-between">
                                <span className="text-txtSecondary-dark">{t('futures:order_table:open_price')}</span>
                                <span className="font-semibold">{formatNumber(order?.open_price, decimals.price, 0, true)}</span>
                            </div>
                            <div className="h-[0.5px] bg-divider dark:bg-divider-dark w-full my-3"></div>
                            <div className="flex items-center justify-between">
                                <span className="text-txtSecondary-dark">{t('futures:mobile:adjust_margin:current_volume')}</span>
                                <span className="font-semibold">{formatNumber(order?.order_value, decimals.symbol, 0, true)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="text-sm text-txtSecondary dark:Ltext-txtSecondary-dark mb-2">{t('futures:mobile:adjust_margin:added_volume_2')}</div>
                        <div
                            className={classNames('px-4 mb-3 flex items-center bg-gray-10 dark:bg-dark-2 rounded-md', {
                                'ring-1 !ring-red': !_validator('quoteQty').isValid,
                                'ring-1 ring-teal': focus === 'volume'
                            })}
                        >
                            <div className={changeClass}>
                                <Minus
                                    size={16}
                                    className="fill-current text-txtSecondary dark:text-txtSecondary-dark cursor-pointer"
                                    onClick={() => volume > minQuoteQty && available && setVolume((prevState) => Number(prevState) - Number(minQuoteQty))}
                                />
                            </div>
                            <TradingInput
                                value={volume}
                                decimalScale={decimals.symbol}
                                allowNegative={false}
                                thousandSeparator={true}
                                containerClassName="px-2.5 dark:!bg-dark-2 w-full !border-none"
                                inputClassName="!text-center"
                                onValueChange={({ value }) => onChangeVolume(value)}
                                disabled={!available}
                                inputMode="decimal"
                                validator={_validator('quoteQty')}
                                allowedDecimalSeparators={[',', '.']}
                                clearAble
                                onFocus={() => setFocus('volume')}
                                onBlur={() => setFocus()}
                            />
                            <div className={changeClass}>
                                <Plus
                                    size={16}
                                    className="fill-current text-txtSecondary dark:text-txtSecondary-dark cursor-pointer"
                                    onClick={() => volume < maxQuoteQty && available && setVolume((prevState) => Number(prevState) + Number(minQuoteQty))}
                                />
                            </div>
                        </div>
                        <div className="w-full pl-1">
                            <Slider
                                useLabel
                                positionLabel="top"
                                labelSuffix="%"
                                x={percent}
                                axis="x"
                                xmax={200}
                                xmin={0}
                                onChange={({ x }) => available && onChangePercent(x)}
                                dots={4}
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <CollapseV2
                            className="w-full"
                            isCustom
                            active={showCustomized}
                            label={
                                <div
                                    className="font-semibold flex items-center space-x-2 cursor-pointer w-max mb-4"
                                    onClick={() => setShowCustomized(!showCustomized)}
                                >
                                    <span>{t('futures:mobile:adjust_margin:advanced_custom')}</span>
                                    <ChevronDown size={16} className={`${showCustomized ? 'rotate-0' : ''} transition-all`} />
                                </div>
                            }
                        >
                            <>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <div className="text-sm text-txtSecondary-dark">{t('common:order_type')}</div>
                                        <SelectV2
                                            options={optionsTypes}
                                            value={type}
                                            onChange={(e) => {
                                                setType(e);
                                                setPrice(_lastPrice);
                                            }}
                                            keyExpr="value"
                                            displayExpr="title"
                                            className=""
                                            position="top"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-sm text-txtSecondary dark:text-txtSecondary-dark">{t('futures:leverage:leverage')}</div>
                                        <div
                                            className={classNames('px-4 flex items-center bg-gray-10 dark:bg-dark-2 rounded-md', {
                                                'ring-1 !ring-red': !_validator('leverage').isValid,
                                                'ring-1 ring-teal': focus === 'leverage'
                                            })}
                                        >
                                            <div className={changeClass}>
                                                <Minus
                                                    size={16}
                                                    className="fill-current text-txtSecondary dark:text-txtSecondary-dark cursor-pointer"
                                                    onClick={() =>
                                                        leverage > pairConfig?.leverageConfig.min && setLeverage((prevState) => Number(prevState) - 1)
                                                    }
                                                />
                                            </div>
                                            <TradingInput
                                                value={leverage}
                                                decimalScale={0}
                                                allowNegative={false}
                                                thousandSeparator={true}
                                                inputClassName="!text-center w-full !ml-0"
                                                containerClassName="px-2.5 dark:!bg-dark-2 w-full !border-none"
                                                onValueChange={({ value }) => setLeverage(value)}
                                                disabled={!available}
                                                inputMode="decimal"
                                                suffix={'x'}
                                                allowedDecimalSeparators={[',', '.']}
                                                validator={_validator('leverage')}
                                                onFocus={() => setFocus('leverage')}
                                                onBlur={() => setFocus()}
                                            />
                                            <div className={changeClass}>
                                                <Plus
                                                    size={16}
                                                    className="fill-current text-txtSecondary dark:text-txtSecondary-dark cursor-pointer"
                                                    onClick={() =>
                                                        leverage < pairConfig?.leverageConfig.max && setLeverage((prevState) => Number(prevState) + 1)
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2 mt-4">
                                    <div className="text-sm text-txtSecondary dark:text-txtSecondary-dark">{t('common:price')}</div>
                                    <TradingInput
                                        labelClassName={'dark:!text-white !text-base'}
                                        label={type === VndcFutureOrderType.Type.MARKET ? t('futures:market') : null}
                                        value={type === VndcFutureOrderType.Type.MARKET ? '' : price}
                                        decimalScale={decimals.price}
                                        allowNegative={false}
                                        thousandSeparator={true}
                                        containerClassName="px-2.5 dark:!bg-dark-2 w-full"
                                        inputClassName="!text-left !ml-0"
                                        onValueChange={({ value }) => setPrice(value)}
                                        disabled={type === VndcFutureOrderType.Type.MARKET}
                                        validator={_validator('price')}
                                        renderTail={() => <span className={`text-txtSecondary dark:text-txtSecondary-dark`}>{quoteAsset}</span>}
                                        allowedDecimalSeparators={[',', '.']}
                                        clearAble
                                    />
                                </div>
                            </>
                        </CollapseV2>
                    </div>
                </div>
                <div className="p-4 rounded-xl bg-gray-13 dark:bg-darkBlue-3 text-base">
                    <div className="font-semibold mb-6">{t('futures:calulator:result')}</div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="text-txtSecondary-dark">{t('common:last_price')}</div>
                            <div className="font-semibold text-right">
                                {formatNumber(_lastPrice, decimals.symbol, 0, true)} {quoteAsset}
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-txtSecondary-dark">{t('futures:margin')}</div>
                            <div className="font-semibold text-right">
                                {formatNumber(general.margin, decimals.symbol, 0, true)} {quoteAsset}
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-txtSecondary-dark">{t('futures:mobile:adjust_margin:average_open_price')}</div>
                            <div className="font-semibold text-right">
                                {formatNumber(general.AvePrice, decimals.symbol, 0, true)} {quoteAsset}
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-txtSecondary-dark">{t('futures:mobile:adjust_margin:new_liq_price')}</div>
                            <div className="font-semibold text-right">
                                {formatNumber(general.liqPrice, decimals.symbol, 0, true)} {quoteAsset}
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-txtSecondary-dark">{t('futures:mobile:available')}</div>
                            <div className="font-semibold text-right">
                                {formatNumber(available, decimals.symbol, 0, true)} {quoteAsset}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ButtonV2 disabled={loading || isError} onClick={_onConfirm} className="mt-8">
                {t('common:confirm')}
            </ButtonV2>
        </>
    );
};

export default EditVolV2;
