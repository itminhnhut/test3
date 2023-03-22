import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import ModalV2 from 'components/common/V2/ModalV2';
import { useTranslation } from 'next-i18next';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { formatNumber, getFilter, getSuggestSl, getSuggestTp } from 'redux/actions/utils';
import CheckBox from 'components/common/CheckBox';
import SwitchV2 from 'components/common/V2/SwitchV2';
import Button from 'components/common/V2/ButtonV2/Button';
import TradingInput from 'components/trade/TradingInput';
import { isNumeric } from 'utils';
// import { SwapIcon } from '../../../../svg/SvgIcon';
import colors from 'styles/colors';
import Slider from 'components/trade/InputSlider';
import { Dot, ThumbLabel } from 'components/trade/StyleInputSlider';
import { ceil, find } from 'lodash';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { DefaultFuturesFee, ExchangeOrderEnum, FuturesOrderEnum } from 'redux/actions/const';
import { useSelector } from 'react-redux';

const initValue = {
    displaying_id: null,
    price: 0,
    sl: 0,
    tp: 0
};

const EditSLTPV2 = ({ isVisible, onClose, order, status, lastPrice, decimals, onConfirm, marketWatch }) => {
    const { t } = useTranslation();
    const symbol = order?.symbol;
    const futuresConfigs = useSelector((state) => state.futures.pairConfigs);
    const pairConfig = find(futuresConfigs, { symbol });
    const [currentTheme] = useDarkMode();
    const _lastPrice = marketWatch ? marketWatch[order?.symbol]?.lastPrice : lastPrice;
    const quoteAsset = marketWatch ? marketWatch[order?.symbol]?.quoteAsset : order?.quoteAsset;
    const [autoType, setAutoType] = useState(false);
    const [data, setData] = useState(initValue);
    const [show, setShow] = useState({ tp: +order?.tp > 0, sl: +order?.sl > 0 });
    const profit = useRef({ tp: 0, sl: 0 });
    const [percent, setPercent] = useState({ tp: 0, sl: 0 });
    const [mode, setMode] = useState({ tp: 'profit', sl: 'profit' });
    const dotStep = useRef(4);
    const isChangeSlide = useRef(false);
    const isDark = currentTheme === THEME_MODE.DARK;

    const getProfitSLTP = (sltp) => {
        const { fee = 0, side, quantity, open_price, status, price } = order;
        const isBuy = side === VndcFutureOrderType.Side.BUY;
        const openPrice = +(status === VndcFutureOrderType.Status.PENDING ? price : open_price);
        let total = quantity * (isBuy ? sltp - openPrice : openPrice - sltp);
        const _fee = quantity * (sltp + openPrice) * DefaultFuturesFee.Nami;
        let profit = total - _fee;
        return profit;
    };

    const getPercentSlTp = (sltp, _price) => {
        if (!sltp) return 50;
        let { leverage, side, order_value, margin } = order;

        if (order_value && margin) leverage = order_value / margin;
        let formatX = 0;
        let _activePrice = _price;
        if (side == VndcFutureOrderType.Side.BUY) {
            formatX = (((sltp * (1 - DefaultFuturesFee.Nami) - _activePrice * (1 + DefaultFuturesFee.Nami)) * leverage) / _activePrice) * 100;
        } else {
            formatX = (((sltp * (-1 - DefaultFuturesFee.Nami) + _activePrice * (1 - DefaultFuturesFee.Nami)) * leverage) / _activePrice) * 100;
        }
        return +(formatX <= -100 ? -1 : Math.abs(formatX > 0 ? 50 + formatX / 2 : -50 - formatX / 2)).toFixed(0);
    };

    const getSLTP = (index = 60, key) => {
        const { open_price, status, price, side, order_value, margin } = order;
        let leverage = order?.leverage;
        if (order_value && margin) leverage = order_value / margin;
        const openPrice = status === VndcFutureOrderType.Status.PENDING ? price : open_price;
        const tpsl = key === 'sl' ? getSuggestSl(side, openPrice, leverage, index / 100) : getSuggestTp(side, openPrice, leverage, index / 100);
        return +tpsl.toFixed(decimals.symbol);
    };

    const onHandleChange = (key, e) => {
        if (isChangeSlide.current) {
            isChangeSlide.current = false;
            return;
        }
        let value = '';
        if (isNumeric(e.floatValue)) {
            value = e.floatValue;
        }
        profit.current[key] = value ? getProfitSLTP(value) : 0;
        setPercent({
            ...percent,
            [key]: getPercentSlTp(value, data.price)
        });
        setData({
            ...data,
            [key]: value
        });
    };

    const arrDot = useMemo(() => {
        const size = 100 / dotStep.current;
        const arr = [];
        for (let i = 0; i <= dotStep.current; i++) {
            arr.push(i * size);
        }
        return arr;
    }, [dotStep.current]);

    const onChangePercent = (x, xmax, key) => {
        const _x = arrDot.reduce((prev, curr) => {
            let i = 0;
            if (Math.abs(curr - x) < 2 || Math.abs(prev - x) < 2) {
                i = Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev;
            }
            return i;
        });
        onSetValuePercent(_x ? _x : x, key);
    };

    const onSetValuePercent = (x, key) => {
        isChangeSlide.current = true;
        const formatX = getLabelPercent(x, key);
        const tpsl = getSLTP(key === 'sl' ? -formatX : formatX, key);
        profit.current[key] = getProfitSLTP(tpsl);
        setData({
            ...data,
            [key]: tpsl
        });
        setPercent({
            ...percent,
            [key]: x
        });
    };

    const setDataGeneral = (sltp, key) => {
        profit.current[key] = sltp ? getProfitSLTP(sltp) : 0;
        setData({
            ...data,
            [key]: sltp
        });
        setPercent({
            ...percent,
            [key]: sltp ? getPercentSlTp(sltp, data.price) : 50
        });
    };

    useEffect(() => {
        if (!isVisible) return;
        const _price = +(status === VndcFutureOrderType.Status.PENDING
            ? order?.price
            : status === VndcFutureOrderType.Status.ACTIVE
            ? order?.open_price
            : order?.close_price);
        setData({
            displaying_id: order?.displaying_id,
            price: _price,
            sl: order?.sl,
            tp: order?.tp
        });
        setShow({ tp: +order?.tp > 0, sl: +order?.sl > 0 });
        if (order?.sl) {
            profit.current.sl = getProfitSLTP(Number(order?.sl));
        }
        if (order?.tp) {
            profit.current.tp = getProfitSLTP(Number(order?.tp));
        }
        if (order?.leverage <= 10) {
            if (!order?.sl) {
                profit.current.sl = 0;
            }
            if (!order?.tp) {
                profit.current.tp = 0;
            }
        }
        setTimeout(() => {
            setPercent({
                sl: +getPercentSlTp(Number(order?.sl), _price),
                tp: +getPercentSlTp(Number(order?.tp), _price)
            });
        }, 200);

        let autoTypeInput = localStorage.getItem('web_auto_type_tp_sl');
        if (autoTypeInput) {
            autoTypeInput = JSON.parse(autoTypeInput);
            setAutoType(autoTypeInput?.auto);
        }
    }, [isVisible]);

    const onSwitch = (key) => {
        if (!order?.displaying_id) {
            if (autoType) {
                if (order.leverage <= 10) {
                    setDataGeneral(0, key);
                } else if (order.leverage <= 20) {
                    if (key === 'sl') {
                        const sltp = getSLTP(60, key);
                        setDataGeneral(sltp, key);
                    } else {
                        setDataGeneral(0, key);
                    }
                } else if (order.leverage > 20 && order.leverage <= 100) {
                    const sltp = getSLTP(60, key);
                    setDataGeneral(sltp, key);
                } else {
                    const sltp = getSLTP(90, key);
                    setDataGeneral(sltp, key);
                }
            }
        } else {
            if (order[key]) {
                if (!data[key]) setDataGeneral(order[key], key);
            } else {
                setDataGeneral(0, key);
            }
        }
        setShow({
            ...show,
            [key]: !show[key]
        });
    };

    const onChangeAutoType = () => {
        localStorage.setItem('web_auto_type_tp_sl', JSON.stringify({ auto: !autoType }));
        setAutoType(!autoType);
    };

    const onHandleSwap = (key) => {
        const value = mode[key] === 'percent' ? 'profit' : 'percent';
        setMode({ ...mode, [key]: value });
    };

    const customDotAndLabel = useCallback(
        (xmax, pos, key) => {
            const dot = [];
            const label = [];
            const size = 100 / dotStep.current;
            const postion = pos.left === 50 ? 0 : pos.left > 50 ? (pos.left - 50) * 2 : -(50 - pos.left) * 2;
            const _bgColorDot = isDark ? colors.dark[2] : colors.gray[11];
            for (let i = 0; i <= dotStep.current; ++i) {
                // console.log(Number(i * size) ,Number(data[key] > 0 ? percent[key] : 50))
                const index = (postion * dotStep.current) / 100;
                const a = index / 2;
                const b = i - dotStep.current / 2;
                let active = false;
                if ((a >= b && b >= 0) || (a <= b && b <= 0)) {
                    active = true;
                }
                dot.push(<Dot key={`inputSlider_dot_${i}`} active={active} percentage={i * size} isDark={isDark} bgColorDot={_bgColorDot} />);
            }
            return {
                dot,
                label
            };
        },
        [percent]
    );

    const customPercentLabel = useCallback((pos) => {
        const postion = pos.left === 50 ? 0 : pos.left > 50 ? (pos.left - 50) * 2 : -(50 - pos.left) * 2;
        return (
            <ThumbLabel
                min={pos.left === 0}
                max={pos.left === 100}
                isZero={pos.left === 0}
                isDark={isDark}
                className={`left-1/2 translate-x-[-50%] w-max !text-txtPrimary dark:!text-white`}
            >
                {ceil(postion, 0)}%
            </ThumbLabel>
        );
    }, []);

    const getLabelPercent = (index, key) => {
        //+- 100% -> total 200%
        const negative = -(50 - index) < 0;
        const formatX = index === 50 ? 0 : index > 50 ? (index - 50) * 2 : -(50 - index) * 2;
        return formatX.toFixed(0);
    };

    const placeholder = (key) => {
        // const tab = key === 'stop_loss' ? tabSl : tabTp;
        return t(`futures:mobile:${key}_input`);
    };

    const textColor = (value) => {
        return value === 0 ? 'dark:text-white' : value > 0 ? 'text-teal' : 'text-red';
    };

    const inputValidator = (type, isText = false) => {
        let isValid = true,
            msg = null;
        const { sl, tp } = data;
        let min = 0,
            max = 0;
        switch (type) {
            case 'stop_loss':
            case 'take_profit':
                if ((type === 'stop_loss' && !sl && !isText) || (type === 'take_profit' && !tp && !isText)) {
                    return {
                        isValid,
                        msg
                    };
                }
                const priceFilter = getFilter(ExchangeOrderEnum.Filter.PRICE_FILTER, pairConfig);
                const percentPriceFilter = getFilter(ExchangeOrderEnum.Filter.PERCENT_PRICE, pairConfig);
                const _maxPrice = priceFilter?.maxPrice;
                const _minPrice = priceFilter?.minPrice;
                let _activePrice = order?.status === FuturesOrderEnum.Status.PENDING ? order?.price : _lastPrice;
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
                if (order?.side === FuturesOrderEnum.Side.BUY) {
                    bound = type === 'stop_loss' ? lowerBound : upperBound;
                } else {
                    bound = type === 'stop_loss' ? upperBound : lowerBound;
                }

                if (type === 'stop_loss') {
                    bound = order?.side === FuturesOrderEnum.Side.BUY ? lowerBound : upperBound;
                    min = bound.min;
                    max = bound.max;
                    // Modify bound base on type
                    if (sl < bound.min) {
                        isValid = false;
                        msg = `${t('futures:minimum_price')} ${formatNumber(bound.min, decimals.symbol, 0, true)}`;
                    } else if (sl > bound.max) {
                        isValid = false;
                        msg = `${t('futures:maximum_price')} ${formatNumber(bound.max, decimals.symbol, 0, true)}`;
                    }
                } else if (type === 'take_profit') {
                    bound = order?.side === FuturesOrderEnum.Side.BUY ? upperBound : lowerBound;
                    min = bound.min;
                    max = bound.max;
                    if (tp < bound.min) {
                        isValid = false;
                        msg = `${t('futures:minimum_price')} ${formatNumber(bound.min, decimals.symbol, 0, true)}`;
                    } else if (tp > bound.max) {
                        isValid = false;
                        msg = `${t('futures:maximum_price')} ${formatNumber(bound.max, decimals.symbol, 0, true)}`;
                    }
                }
                if (isText) {
                    return { min, max };
                }
                return {
                    isValid,
                    msg
                };
            default:
                return {
                    isValid,
                    msg
                };
        }
    };

    const textDescription = (key, data) => {
        let rs = {};
        switch (key) {
            case 'stop_loss':
            case 'take_profit':
                rs = {
                    min: `${t('common:min')}: ${formatNumber(data?.min, decimals.price)}`,
                    max: `${t('common:max')}: ${data?.max ? formatNumber(data?.max, decimals.price) : '-'}`
                };
                return `${rs.min}. ${rs.max}.`;
            default:
                break;
        }
        return '';
    };

    const _onConfirm = () => {
        const newData = {
            ...data,
            sl: show?.sl ? data.sl || '' : '',
            tp: show?.tp ? data.tp || '' : ''
        };
        if (onConfirm) onConfirm(newData);
    };

    const isError = !inputValidator('stop_loss').isValid || !inputValidator('take_profit').isValid;

    return (
        <ModalV2 className="!max-w-[488px] text-base" isVisible={isVisible} onBackdropCb={onClose}>
            <div>
                <div className="text-2xl leading-[30px] font-semibold mb-3">{t('futures:mobile:modify_tpsl_title')}</div>
                <div className="text-teal text-lg font-semibold relative w-max bottom-[-13px] px-[6px] left-[9px] bg-white dark:bg-bgSpotContainer-dark">
                    {order?.symbol} {order?.leverage}x
                </div>
                <div className="border border-divider dark:border-divider-dark p-4 rounded-md mb-6">
                    <div className="flex items-center justify-between">
                        <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('futures:order_table:open_price')}</span>
                        <span className="font-semibold">{formatNumber(data.price, 2, 0, true)}</span>
                    </div>
                    <div className="h-[0.5px] bg-divider dark:bg-divider-dark w-full my-3"></div>
                    <div className="flex items-center justify-between">
                        <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('common:last_price')}</span>
                        <span className="font-semibold">{formatNumber(_lastPrice, 2, 0, true)}</span>
                    </div>
                </div>
                <CheckBox
                    isV3
                    onChange={onChangeAutoType}
                    active={autoType}
                    className="h-full"
                    labelClassName="!text-base"
                    label={t('futures:mobile:auto_type_sltp')}
                />
                <div className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex items-center space-x-2">
                                <label className="font-semibold whitespace-nowrap">{t('futures:stop_loss')}</label>
                                <SwitchV2 onChange={() => onSwitch('sl')} checked={show.sl} />
                            </div>
                            {show.sl && (
                                <div className="text-xs flex items-center ">
                                    <div className="font-normal text-txtSecondary dark:text-txtSecondary-dark whitespace-nowrap">
                                        {t('futures:mobile:pnl_estimate')}:
                                    </div>
                                    &nbsp;
                                    <div className={`font-medium text-right ${textColor(profit.current.sl)}`}>
                                        {formatNumber(profit.current.sl, decimals.symbol, 0, true) + ' ' + quoteAsset}
                                    </div>
                                </div>
                            )}
                        </div>
                        {show.sl && (
                            <>
                                <div className="flex space-x-2">
                                    <TradingInput
                                        containerClassName="w-full dark:bg-dark-2"
                                        value={data.sl}
                                        placeholder={placeholder('stop_loss')}
                                        allowNegative={false}
                                        onValueChange={(e) => onHandleChange('sl', e)}
                                        decimalScale={decimals.price}
                                        inputClassName="!text-left !ml-0"
                                        validator={inputValidator('stop_loss')}
                                        textDescription={textDescription('stop_loss', inputValidator('stop_loss', true))}
                                        errorTooltip={false}
                                        clearAble
                                    />
                                    <div
                                        // onClick={() => onHandleSwap('sl')}
                                        className="flex items-center p-3 bg-gray-10 dark:bg-dark-2 space-x-2 text-teal font-semibold rounded-md h-11 sm:h-12 cursor-pointer select-none"
                                    >
                                        <span className="min-w-[3rem] text-center">{mode.sl === 'profit' ? quoteAsset : '%'}</span>
                                        {/* <SwapIcon color={colors.teal} /> */}
                                    </div>
                                </div>
                                <div className={`mt-2`}>
                                    <Slider
                                        useLabel
                                        labelSuffix="%"
                                        x={percent.sl}
                                        axis="x"
                                        xmax={100}
                                        xStart={0}
                                        positionLabel="top"
                                        customPercentLabel={customPercentLabel}
                                        customDotAndLabel={(xmax, pos) => customDotAndLabel(xmax, pos, 'sl')}
                                        onChange={({ x }) => onChangePercent(x, 100, 'sl')}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex items-center space-x-2">
                                <label className="font-semibold whitespace-nowrap">{t('futures:take_profit')}</label>
                                <SwitchV2 onChange={() => onSwitch('tp')} checked={show.tp} />
                            </div>
                            {show.tp && (
                                <div className="text-xs flex items-center ">
                                    <div className="font-normal text-txtSecondary dark:text-txtSecondary-dark whitespace-nowrap">
                                        {t('futures:mobile:pnl_estimate')}:
                                    </div>
                                    &nbsp;
                                    <div className={`font-medium text-right ${textColor(profit.current.tp)}`}>
                                        {formatNumber(profit.current.tp, decimals.symbol, 0, true) + ' ' + quoteAsset}
                                    </div>
                                </div>
                            )}
                        </div>
                        {show.tp && (
                            <>
                                <div className="flex space-x-2">
                                    <TradingInput
                                        containerClassName="w-full dark:bg-dark-2"
                                        value={data.tp}
                                        placeholder={placeholder('take_profit')}
                                        allowNegative={false}
                                        onValueChange={(e) => onHandleChange('tp', e)}
                                        decimalScale={decimals.price}
                                        inputClassName="!text-left !ml-0"
                                        validator={inputValidator('take_profit')}
                                        textDescription={textDescription('take_profit', inputValidator('take_profit', true))}
                                        errorTooltip={false}
                                        clearAble
                                    />
                                    <div
                                        // onClick={() => onHandleSwap('tp')}
                                        className="flex items-center p-3 bg-gray-10 dark:bg-dark-2 space-x-2 text-teal font-semibold rounded-md h-11 sm:h-12 cursor-pointer select-none"
                                    >
                                        <span className="min-w-[3rem] text-center">{mode.tp === 'profit' ? quoteAsset : '%'}</span>
                                        {/* <SwapIcon color={colors.teal} /> */}
                                    </div>
                                </div>
                                <div className={`mt-2`}>
                                    <Slider
                                        useLabel
                                        labelSuffix="%"
                                        x={percent.tp}
                                        axis="x"
                                        xmax={100}
                                        xStart={0}
                                        positionLabel="top"
                                        customPercentLabel={customPercentLabel}
                                        customDotAndLabel={(xmax, pos) => customDotAndLabel(xmax, pos, 'tp')}
                                        onChange={({ x }) => onChangePercent(x, 100, 'tp')}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <Button disabled={isError} onClick={_onConfirm} variants="primary" className="mt-10">
                    {t('common:confirm')}
                </Button>
            </div>
        </ModalV2>
    );
};

export default EditSLTPV2;
