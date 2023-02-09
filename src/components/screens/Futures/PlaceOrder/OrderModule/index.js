import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FuturesOrderTypes } from 'redux/reducers/futures';
import { useTranslation } from 'next-i18next';
import { formatNumber, getFilter, getLiquidatePrice, getSuggestSl, getSuggestTp } from 'redux/actions/utils';
import FuturesOrderSlider from 'components/screens/Futures/PlaceOrder/OrderModule/OrderSlider';
import FuturesOrderSLTP from 'components/screens/Futures/PlaceOrder/OrderModule/OrderSLTP';
import FuturesOrderButtonsGroupVndc from 'components/screens/Futures/PlaceOrder/Vndc/OrderButtonsGroupVndc';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import TradingInput from 'components/trade/TradingInput';
import { DefaultFuturesFee, ExchangeOrderEnum, FuturesOrderEnum } from 'redux/actions/const';
import { AddCircleColorIcon } from 'components/svg/SvgIcon';

const FuturesOrderModule = ({ type, leverage, pairConfig, availableAsset, isVndcFutures, isAuth, side, decimals, pairPrice }) => {
    const { t } = useTranslation();
    const ask = pairPrice?.ask ?? 0;
    const bid = pairPrice?.bid ?? 0;
    const lastPrice = pairPrice?.lastPrice ?? 0;
    const mount = useRef(true);
    const [price, setPrice] = useState(lastPrice);
    const [quoteQty, setQuoteQty] = useState(0);
    const [orderSlTp, setOrderSlTp] = useState({
        sl: '',
        tp: ''
    });

    useEffect(() => {
        if (mount.current && lastPrice) {
            mount.current = false;
        }
    }, [mount.current, lastPrice]);

    useEffect(() => {
        if (mount.current) return;
        setPrice(lastPrice);
    }, [mount.current, type, decimals]);

    useEffect(() => {
        if (mount.current) return;
        onChangeSlTp(leverage, type === FuturesOrderTypes.Market ? lastPrice : price);
    }, [side, type, decimals, leverage, price]);

    const onChangeSlTp = (leverage, _lastPrice) => {
        const _sl = +getSuggestSl(side, _lastPrice, leverage, leverage >= 100 ? 0.9 : 0.6).toFixed(decimals.price);
        const _tp = +getSuggestTp(side, _lastPrice, leverage, leverage >= 100 ? 0.9 : 0.6).toFixed(decimals.price);
        if (leverage <= 10) {
            setOrderSlTp({ tp: '', sl: '' });
        } else if (leverage <= 20) {
            setOrderSlTp({ tp: '', sl: _sl });
        }
        if (leverage > 20) {
            setOrderSlTp({ tp: _tp, sl: _sl });
        }
    };

    const inputValidator = (type) => {
        let isValid = true,
            msg = null;
        const { sl, tp } = orderSlTp;
        switch (type) {
            // input check
            case 'quoteQty':
                const _min = pairConfig?.filters.find((item) => item.filterType === 'MIN_NOTIONAL')?.notional ?? (isVndcFutures ? 100000 : 5);
                const _decimals = 0;
                const _max = availableAsset / (1 / leverage + DefaultFuturesFee.NamiFrameOnus);
                const _displayingMax = `${formatNumber(_max, _decimals, 0, true)} ${pairConfig?.quoteAsset}`;
                const _displayingMin = `${formatNumber(_min, _decimals, 0, true)} ${pairConfig?.quoteAsset}`;
                if (quoteQty < +_min) {
                    msg = `${t('futures:minimum_qty')} ${_displayingMin} `;
                    isValid = false;
                } else if (quoteQty > +Number(_max).toFixed(_decimals)) {
                    msg = `${t('futures:maximum_qty')} ${_displayingMax}`;
                    isValid = false;
                }
                return {
                    isValid,
                    msg
                };
            case 'price':
            case 'stop_loss':
            case 'take_profit':
                // Nếu không nhập thì ko cần validate luôn, cho phép đặt lệnh không cần SL, TP
                if ((type === 'stop_loss' && !sl) || (type === 'take_profit' && !tp)) {
                    return {
                        isValid,
                        msg
                    };
                }
                const priceFilter = getFilter(ExchangeOrderEnum.Filter.PRICE_FILTER, pairConfig);
                const percentPriceFilter = getFilter(ExchangeOrderEnum.Filter.PERCENT_PRICE, pairConfig);
                const _maxPrice = priceFilter?.maxPrice;
                const _minPrice = priceFilter?.minPrice;
                let _activePrice = lastPrice;
                if (type !== 'price') {
                    if (type === 'LIMIT') {
                        _activePrice = price;
                    } else if (type === 'STOP_MARKET') {
                        _activePrice = stopPrice;
                    }
                }

                // Truong hop dat lenh market
                const lowerBound = {
                    min: Math.max(_minPrice, _activePrice * percentPriceFilter?.multiplierDown),
                    max: Math.min(_activePrice, _activePrice * (1 - percentPriceFilter?.minDifferenceRatio))
                };

                const upperBound = {
                    min: Math.max(_activePrice, _activePrice * (1 + percentPriceFilter?.minDifferenceRatio)),
                    max: Math.min(_maxPrice, _activePrice * percentPriceFilter?.multiplierUp)
                };

                let bound = lowerBound;
                if (side === FuturesOrderEnum.Side.BUY) {
                    bound = type === 'stop_loss' ? lowerBound : upperBound;
                } else {
                    bound = type === 'stop_loss' ? upperBound : lowerBound;
                }

                if (type === 'stop_loss') {
                    bound = side === FuturesOrderEnum.Side.BUY ? lowerBound : upperBound;
                    // Modify bound base on type
                    if (sl < bound.min) {
                        isValid = false;
                        msg = `${t('futures:minimum_price')} ${formatNumber(bound.min, decimals.decimalScalePrice, 0, true)}`;
                    } else if (sl > bound.max) {
                        isValid = false;
                        msg = `${t('futures:maximum_price')} ${formatNumber(bound.max, decimals.decimalScalePrice, 0, true)}`;
                    }
                } else if (type === 'take_profit') {
                    bound = side === FuturesOrderEnum.Side.BUY ? upperBound : lowerBound;
                    if (tp < bound.min) {
                        isValid = false;
                        msg = `${t('futures:minimum_price')} ${formatNumber(bound.min, decimals.decimalScalePrice, 0, true)}`;
                    } else if (tp > bound.max) {
                        isValid = false;
                        msg = `${t('futures:maximum_price')} ${formatNumber(bound.max, decimals.decimalScalePrice, 0, true)}`;
                    }
                } else if (type === 'price' && (type === 'STOP_MARKET' || type === 'LIMIT')) {
                    const _checkPrice = type === 'STOP_MARKET' ? stopPrice : price;
                    if (side === FuturesOrderEnum.Side.BUY) {
                        // Truong hop la buy thi gia limit phai nho hon gia hien tai
                        if (type === 'LIMIT') {
                            if (price < lowerBound.min) {
                                isValid = false;
                                msg = `${t('futures:minimum_price')} ${formatNumber(lowerBound.min, decimals.decimalScalePrice, 0, true)}`;
                            } else if (price > lowerBound.max) {
                                isValid = false;
                                msg = `${t('futures:maximum_price')} ${formatNumber(lowerBound.max, decimals.decimalScalePrice, 0, true)}`;
                            }
                        } else if (type === 'STOP_MARKET') {
                            if (stopPrice < upperBound.min) {
                                isValid = false;
                                msg = `${t('futures:minimum_price')} ${formatNumber(upperBound.min, decimals.decimalScalePrice, 0, true)}`;
                            } else if (stopPrice > upperBound.max) {
                                isValid = false;
                                msg = `${t('futures:maximum_price')} ${formatNumber(upperBound.max, decimals.decimalScalePrice, 0, true)}`;
                            }
                        }
                    } else if (side === FuturesOrderEnum.Side.SELL) {
                        if (type === 'LIMIT') {
                            if (price < upperBound.min) {
                                isValid = false;
                                msg = `${t('futures:minimum_price')} ${formatNumber(upperBound.min, decimals.decimalScalePrice, 0, true)}`;
                            } else if (price > upperBound.max) {
                                isValid = false;
                                msg = `${t('futures:maximum_price')} ${formatNumber(upperBound.max, decimals.decimalScalePrice, 0, true)}`;
                            }
                        } else if (type === 'STOP_MARKET') {
                            if (stopPrice < lowerBound.min) {
                                isValid = false;
                                msg = `${t('futures:minimum_price')} ${formatNumber(lowerBound.min, decimals.decimalScalePrice, 0, true)}`;
                            } else if (stopPrice > lowerBound.max) {
                                isValid = false;
                                msg = `${t('futures:maximum_price')} ${formatNumber(lowerBound.max, decimals.decimalScalePrice, 0, true)}`;
                            }
                        }
                    }
                }

                if (type === 'stop_loss' && isValid) {
                    //  Kiểm tra hợp lệ giá liquidate không
                    // const size = size
                    const liquidatePrice = getLiquidatePrice(
                        {
                            quantity: quoteQty / _activePrice,
                            side,
                            quoteQty,
                            leverage
                        },
                        _activePrice
                    );
                    const bias = DefaultFuturesFee.NamiFrameOnus;
                    const liquidatePriceBound = {
                        upper: liquidatePrice * (1 - bias),
                        lower: liquidatePrice * (1 + bias)
                    };
                    if (side === VndcFutureOrderType.Side.SELL && sl > liquidatePriceBound.upper) {
                        isValid = false;
                        msg = `${t('futures:liquidate_alert_less')} ${formatNumber(liquidatePriceBound.upper, decimals.decimalScalePrice, 0, true)}`;
                    } else if (side === VndcFutureOrderType.Side.BUY && sl < liquidatePriceBound.lower) {
                        isValid = false;
                        msg = `${t('futures:liquidate_alert_greater')} ${formatNumber(liquidatePriceBound.lower, decimals.decimalScalePrice, 0, true)}`;
                    }
                }

                return {
                    isValid,
                    msg
                };
            case 'leverage':
                const min = pairConfig?.leverageConfig?.min ?? 0;
                const max = pairConfig?.leverageConfig?.max ?? 0;
                if (min > leverage) {
                    msg = `${t('futures:minimum_leverage')} ${min} `;
                    isValid = false;
                }
                if (max < leverage) {
                    msg = `${t('futures:maximum_leverage')} ${max}`;
                    isValid = false;
                }
                return {
                    isValid,
                    msg,
                    isError: !isValid
                };
            default:
                return {};
        }
    };

    const isError = useMemo(() => {
        const ArrStop = [FuturesOrderTypes.StopMarket, FuturesOrderTypes.StopLimit];
        const not_valid =
            !inputValidator('price', ArrStop.includes(type)).isValid ||
            !inputValidator('stop_loss').isValid ||
            !inputValidator('take_profit').isValid ||
            !inputValidator('quoteQty').isValid ||
            !inputValidator('leverage').isValid;
        // console.log(
        //     !inputValidator('price', ArrStop.includes(type)).isValid,
        //     !inputValidator('stop_loss').isValid,
        //     !inputValidator('take_profit').isValid,
        //     !inputValidator('quoteQty').isValid,
        //     !inputValidator('leverage').isValid
        // );
        return not_valid;
    }, [price, type, orderSlTp, isVndcFutures, leverage, quoteQty]);

    const renderAvail = () => {
        const margin = quoteQty / leverage;
        return (
            <div className="mt-4 text-sm space-y-2">
                <div className="flex items-center justify-between">
                    <div className="text-darkBlue-5 flex items-center space-x-1">
                        <span>{t('futures:mobile:available')}</span>
                        <AddCircleColorIcon className="cursor-pointer" />
                    </div>
                    <span>
                        {formatNumber(availableAsset, decimals.symbol)} {pairConfig?.quoteAsset}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-darkBlue-5">{t('futures:margin')}</span>
                    <span>
                        {formatNumber(margin, decimals.symbol)} {pairConfig?.quoteAsset}
                    </span>
                </div>
            </div>
        );
    };

    const isMarket = FuturesOrderTypes.Market === type;

    return (
        <div className="mt-4 space-y-4">
            <TradingInput
                containerClassName="w-full dark:bg-dark-2"
                label={t('common:price')}
                value={isMarket ? t('futures:market') : price}
                disabled={isMarket}
                allowNegative={false}
                onValueChange={({ value }) => setPrice(value)}
                decimalScale={decimals.price}
                validator={inputValidator('price')}
                tailContainerClassName="text-txtSecondary dark:text-txtSecondary-dark text-xs select-none"
                renderTail={() => <div>{pairConfig?.quoteAsset}</div>}
            />
            <TradingInput
                label={t('futures:order_table:volume')}
                value={quoteQty}
                allowNegative={false}
                onValueChange={({ value }) => setQuoteQty(value)}
                validator={inputValidator('quoteQty')}
                decimalScale={decimals.qty}
                containerClassName="w-full dark:bg-dark-2"
                labelClassName="whitespace-nowrap"
                tailContainerClassName="text-txtSecondary dark:text-txtSecondary-dark text-xs select-none"
                renderTail={() => <div>{pairConfig?.quoteAsset}</div>}
            />

            {/* Slider */}
            <div className="mt-4">
                <FuturesOrderSlider
                    availableAsset={availableAsset}
                    quoteQty={quoteQty}
                    onChange={(vol) => setQuoteQty(vol)}
                    isVndcFutures={isVndcFutures}
                    side={side}
                    type={type}
                    isAuth={isAuth}
                    decimals={decimals}
                    pairConfig={pairConfig}
                    lastPrice={lastPrice}
                    leverage={leverage}
                    price={price}
                    pairPrice={pairPrice}
                    inputValidator={inputValidator}
                />
            </div>

            {/* Order SL-TP */}
            <FuturesOrderSLTP
                isVndcFutures={isVndcFutures}
                orderSlTp={orderSlTp}
                setOrderSlTp={setOrderSlTp}
                decimals={decimals}
                inputValidator={inputValidator}
                side={side}
                pairConfig={pairConfig}
                price={price}
                lastPrice={lastPrice}
                ask={ask}
                bid={bid}
                type={type}
                leverage={leverage}
                isAuth={isAuth}
            />

            {renderAvail()}

            <FuturesOrderButtonsGroupVndc
                pairConfig={pairConfig}
                type={type}
                quoteQty={quoteQty}
                price={price}
                leverage={leverage}
                orderSlTp={orderSlTp}
                isError={isError}
                lastPrice={lastPrice}
                ask={ask}
                bid={bid}
                isAuth={isAuth}
                decimals={decimals}
                side={side}
            />
        </div>
    );
};

export default FuturesOrderModule;
