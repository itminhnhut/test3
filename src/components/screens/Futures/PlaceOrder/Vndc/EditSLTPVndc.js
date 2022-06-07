import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Button from 'components/common/Button';
import Modal from 'components/common/ReModal';
import { X } from 'react-feather';
import { formatNumber } from 'redux/actions/utils';
import { VndcFutureOrderType } from './VndcFutureOrderType';
import { useTranslation } from 'next-i18next';
import TradingInput from 'components/trade/TradingInput';
import { useSelector } from 'react-redux';
import { find } from 'lodash';
import styled from "styled-components";
import colors from 'styles/colors';
import Slider from 'components/trade/InputSlider';
import { Dot } from 'components/trade/StyleInputSlider';
import classNames from 'classnames';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';


const FuturesEditSLTPVndc = ({
    isVisible,
    order,
    onClose,
    status,
    onConfirm,
    pairTicker,
    lastPrice = 0,
    isMobile
}) => {
    const _lastPrice = pairTicker ? pairTicker[order?.symbol]?.lastPrice : lastPrice;
    const quoteAsset = pairTicker ? pairTicker[order?.symbol]?.quoteAsset : order?.quoteAsset;
    const futuresConfigs = useSelector(state => state.futures.pairConfigs);
    const wallets = useSelector((state) => state.wallet?.FUTURES)
    // Get pair config of order symbol
    const symbol = order?.symbol;
    const pairConfig = find(futuresConfigs, { symbol });
    if (!pairConfig) return null
    const { t } = useTranslation();
    const [data, setData] = useState({
        displaying_id: order?.displaying_id,
        price: +(status === VndcFutureOrderType.Status.PENDING ? order?.price : status === VndcFutureOrderType.Status.ACTIVE ? order?.open_price : order?.close_price),
        sl: Number(order?.sl),
        tp: Number(order?.tp),
    });

    const [tab, setTab] = useState(1);
    const [percent, setPercent] = useState({ tp: 0, sl: 0 })
    const profit = useRef({ tp: 0, sl: 0 })
    const tabPercent = useRef({ tp: 0, sl: 0 })
    const [currentTheme] = useDarkMode()
    const dotStep = useRef(isMobile ? 4 : 6);

    const getProfitSLTP = (sltp) => {
        const {
            fee = 0,
            side,
            quantity,
            open_price,
            status,
            price
        } = order;
        const openPrice = status === VndcFutureOrderType.Status.PENDING ? price : open_price
        let total = quantity * (sltp - openPrice);
        let profit = side === VndcFutureOrderType.Side.BUY ? total - fee : -total - fee;
        return formatNumber(profit, 0, 0, true);
    };

    const calculateSLTP = (profit) => {
        const {
            fee = 0,
            side,
            quantity,
            open_price,
            status,
            price
        } = order;
        const openPrice = +(status === VndcFutureOrderType.Status.PENDING ? price : open_price)
        let _profit = side === VndcFutureOrderType.Side.BUY ? profit + fee : -profit + fee;
        const sltp = (_profit / quantity) + openPrice;
        const decimals = countDecimals(decimalScalePrice?.tickSize)
        return Number(sltp).toFixed(decimals);
    };

    const onHandleChange = (key, e) => {
        const value = +e.value;
        const decimals = countDecimals(decimalScalePrice?.tickSize)
        const per = value === 0 ? tab === 1 ? 0 : 50 : getValuePercent(0, key, value) + 50;
        if (tab === 1) {
            profit.current[key] = getProfitSLTP(value)
            setData({
                ...data,
                [key]: value
            });
        } else if (tab === 0) {
            profit.current[key] = formatNumber(value, decimals, 0, true)
            if (value) {
                setData({
                    ...data,
                    [key]: calculateSLTP(value)
                });
            }
        } else {
            const {
                quantity,
                open_price,
                status,
                price,
                leverage,
            } = order;
            const openPrice = status === VndcFutureOrderType.Status.PENDING ? price : open_price;
            const margin = openPrice * quantity;
            const _profit = (value / 100) * margin / leverage;
            profit.current[key] = formatNumber(_profit, decimals, 0, true)
            tabPercent.current[key] = value;
            setData({
                ...data,
                [key]: calculateSLTP(_profit)
            })
        }
        setPercent({
            ...percent,
            [key]: per
        })
    };

    const inputValidator = (type, price) => {
        let isValid = true,
            msg = null;

        const priceFilter = pairConfig?.filters?.find((o) => o.filterType === 'PRICE_FILTER') ||
            {};
        switch (type) {
            case 'price':
            case 'stop_loss':
            case 'take_profit':
                const _maxPrice = priceFilter?.maxPrice;
                const _minPrice = priceFilter?.minPrice;
                const _price = type === 'price' ? data.price : type === 'stop_loss' ? data.sl : data.tp;

                if (+_price < +_minPrice) {
                    isValid = false
                    msg = `${t('futures:minimun_price')} ${formatNumber(_minPrice, 0, 0, true)}`
                }

                if (+_price > +_maxPrice) {
                    isValid = false
                    msg = `${t('futures:maximun_price')} ${formatNumber(_maxPrice, 0, 0, true)}`
                }

                return {
                    isValid,
                    msg
                };
            default:
                return {};
        }
    };

    const countDecimals = (value) => {
        if (Math.floor(value) === value || !value) return 0;
        return value.toString()
            .split('.')[1]?.length || 0;
    };

    const onChangePercent = (x, xmax, key) => {
        const size = 100 / dotStep.current
        let index = 0;
        if (x >= 1 && x < 2) {
            index = 1
        } else if (x >= 2 && x < 4) {
            index = 2
        } else if (x >= 3 && x < 6) {
            index = 3
        } else if (x >= 5 && x < 7) {
            index = 4
        } else if (x >= 6 && x < 9) {
            index = 5
        } else if (x >= 8) {
            index = 6
        }
        // index * size / xmax
        onSetValuePercent(x, key)
    }

    const onSetValuePercent = (x, key) => {
        const decimals = countDecimals(decimalScalePrice?.tickSize)
        const sltp = +Number(getValuePercent(x, key)).toFixed(decimals);
        if (tab === 0) {
            profit.current[key] = formatNumber(sltp, decimals, 0, true)
            setData({
                ...data,
                [key]: calculateSLTP(sltp)
            })
        }
        if (tab === 1) {
            profit.current[key] = getProfitSLTP(sltp)
            setData({
                ...data,
                [key]: sltp
            })
        }
        if (tab === 2) {
            const {
                quantity,
                open_price,
                status,
                price,
                leverage
            } = order;
            const openPrice = status === VndcFutureOrderType.Status.PENDING ? price : open_price;
            const margin = openPrice * quantity;
            const _profit = (getValuePercent(x, key) / 100) * margin / leverage;
            profit.current[key] = formatNumber(_profit, decimals, 0, true)
            tabPercent.current[key] = getLabelPercent(x, false, key);
            setData({
                ...data,
                [key]: calculateSLTP(_profit)
            })
        }
        setPercent({ ...percent, [key]: x })
    }

    const formatCash = n => {
        const length = +String(Number(n).toFixed(0)).length;
        if (n < 1e3) return n.toFixed(2);
        if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(length > 4 ? 1 : 2) + "K";
        if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(length > 8 ? 1 : 2) + "M";
        if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(2) + "B";
        if (n >= 1e12) return +(n / 1e12).toFixed(2) + "T";
    };

    const getValuePercent = (x, key, getX) => {
        const _avlb = wallets?.[pairConfig?.quoteAssetId];
        const balance = _avlb?.value;
        const result = 0;
        if (tab === 0) {
            if (getX) return (getX / balance) * 100 * 5;
            const negative = -(50 - x) < 0
            const formatX = x === 50 ? 0 : x > 50 ? (x - 50) / 5 : -(50 - x) / 5;
            result = balance * (formatX / 100);
        }
        if (tab === 1) {
            if (getX) return ((getX - data.price) / data.price) * 100 * 5 * 2;
            const formatX = x === 50 ? 0 : x > 50 ? (x - 50) / 5 / 2 : -(50 - x) / 5 / 2;
            result = data.price + (data.price * (formatX / 100))
        }
        if (tab === 2) {
            if (getX) return getX / 2;
            const formatX = x === 50 ? 0 : x > 50 ? (x - 50) * 2 : -(50 - x) * 2;
            result = formatX.toFixed(0)
        }
        return result;
    }

    const getLabelPercent = (index, isString = false, key) => {
        const _avlb = wallets?.[pairConfig?.quoteAssetId];
        const balance = _avlb?.value;
        const result = 0;
        if (tab === 0) {
            const negative = -(50 - index) < 0
            const formatX = index === 50 ? 0 : index > 50 ? (index - 50) / 5 : (50 - index) / 5;
            result = index === 50 ? 0 : (negative ? '-' : '') + formatCash(balance * (formatX / 100));
        }
        if (tab === 1) {
            const negative = -(50 - index) < 0
            const formatX = index === 50 ? 0 : index > 50 ? (index - 50) / 5 / 2 : (50 - index) / 5 / 2;
            const _price = data.price + (negative ? -data.price : data.price) * (formatX / 100);
            result = formatCash(_price)
        }
        if (tab === 2) {
            const negative = -(50 - index) < 0
            const formatX = index === 50 ? 0 : index > 50 ? (index - 50) * 2 : -(50 - index) * 2;
            result = formatX.toFixed(0)
        }
        return result;
    }

    useEffect(() => {
        profit.current = {
            tp: tab === 1 ? getProfitSLTP(Number(order?.tp)) : 0,
            sl: tab === 1 ? getProfitSLTP(Number(order?.sl)) : 0,
        }
        tabPercent.current = {
            tp: 0,
            sl: 0,
        }
        const perTP = 0;
        const perSL = 0
        if (tab === 1) {
            perTP = getValuePercent(0, 'tp', Number(order?.tp));
            perSL = getValuePercent(0, 'sl', Number(order?.sl));
        }
        setPercent({ tp: perTP, sl: perSL });
        setData({
            ...data,
            tp: tab === 1 ? Number(order?.tp) : calculateSLTP(0),
            sl: tab === 1 ? Number(order?.sl) : calculateSLTP(0)
        });

    }, [tab])

    const customDotAndLabel = useCallback((xmax, pos, key) => {

        const dot = []
        const label = []
        const size = 100 / dotStep.current
        const postion = pos.left === 50 ? 0 : pos.left > 50 ? (pos.left - 50) * 2 : -(50 - pos.left) * 2;
        for (let i = 0; i <= dotStep.current; ++i) {
            const index = postion * dotStep.current / 100;
            const a = index / 2;
            const b = i - (dotStep.current / 2);
            let active = false;
            if (a >= b && b >= 0 || a <= b && b <= 0) {
                active = true;
            }
            dot.push(
                <Dot
                    key={`inputSlider_dot_${i}`}
                    active={active}
                    percentage={i * size}
                    isDark={currentTheme === THEME_MODE.DARK}
                    bgColorActive={key === 'sl' ? colors.red : colors.teal}
                />
            )
            label.push(
                <div className='relative' key={`inputSlider_label_${i}`}>
                    <span
                        onClick={() => {
                            onSetValuePercent(i * size, key)
                        }}
                        className={classNames(
                            'block absolute font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark select-none cursor-pointer',
                            {
                                'left-1/2 -translate-x-1/2':
                                    i >= 0 && i !== xmax / dotStep.current,
                                '-left-1/2 translate-x-[-80%]':
                                    i === xmax / dotStep.current,
                            }
                        )}
                    >
                        {getLabelPercent(i * size, true, key)}
                        {tab === 2 && i !== 3 && '%'}
                    </span>
                </div>
            )
        }
        return { dot, label }
    }, [tab, percent])

    const decimalScalePrice = pairConfig?.filters.find(rs => rs.filterType === 'PRICE_FILTER');

    const isError = useMemo(() => {
        const not_valid = !inputValidator('price').isValid || !data.tp || !data.sl
        return not_valid;
    }, [data]);

    const classNameError = isError ? '!bg-gray-3 dark:!bg-darkBlue-3 dark:!text-darkBlue-4 text-gray-1 cursor-not-allowed' : '';

    const classMobile = useMemo(() => {
        const height = window.innerHeight <= 600 ? 'max-h-[500px] overflow-auto ' : '';
        const widht = 'w-[95%]';
        return height + widht + ' overflow-x-hidden'
    }, [isMobile])

    return (
        <Modal isVisible={isVisible} onBackdropCb={onClose} containerClassName={`${isMobile ? classMobile : 'w-[390px]'} p-0 top-[50%]`}>
            <div
                className="px-5 py-4 flex items-center justify-between border-b border-divider dark:border-divider-dark sticky top-0 z-[10px] bg-white dark:bg-darkBlue-2 rounded-t-lg">
                <span className="font-bold text-[16px]">
                    {t('futures:tp_sl:modify_tpsl')}
                </span>{' '}
                <X
                    size={20}
                    strokeWidth={1}
                    className="cursor-pointer"
                    onClick={onClose}
                />
            </div>
            <div className="px-5 pt-4 pb-6 text-sm">
                <div className="mb-3 font-medium flex items-center justify-between">
                    <span className="text-txtSecondary dark:text-txtSecondary-dark">
                        {t('futures:order_table:symbol')}
                    </span>
                    <span
                        className="text-dominant">{order?.symbol} {t('futures:tp_sl:perpetual')} {order?.leverage}x</span>
                </div>
                <div className="mb-3 font-medium flex items-center justify-between">
                    {!status && pairTicker ?
                        <div
                            className="px-3 flex items-center w-full h-[36px] bg-gray-5 dark:bg-darkBlue-3 rounded-[4px] justify-between">
                            <TradingInput
                                thousandSeparator
                                type="text"
                                className="flex-grow text-right font-medium h-[21px]"
                                containerClassName="w-full !py-0 !px-0 border-none"
                                value={data.price}
                                label={t('futures:order_table:open_price')}
                                validator={inputValidator('price')}
                                decimalScale={countDecimals(decimalScalePrice?.tickSize)}
                                onValueChange={(e) => onHandleChange('price', e)}
                                inputMode="decimal"
                                allowedDecimalSeparators={[',', '.']}
                            />
                            <span className="font-medium text-txtSecondary dark:text-txtSecondary-dark pl-2">
                                {quoteAsset}
                            </span>
                        </div>
                        :
                        <>
                            <span className="text-txtSecondary dark:text-txtSecondary-dark">
                                {t('futures:order_table:open_price')}
                            </span>
                            <span className="">{formatNumber(data.price, 2, 0, true) + ' ' + quoteAsset}</span>
                        </>
                    }
                </div>
                <div className="font-medium flex items-center justify-between">
                    <span className="text-txtSecondary dark:text-txtSecondary-dark">
                        {t('futures:tp_sl:mark_price')}
                    </span>
                    <span className="">{formatNumber(_lastPrice, 2, 0, true) + ' ' + quoteAsset}</span>
                </div>
                <div className='px-[20px] text-gray-1 flex items-center justify-around mx-[-20px] bg-[#F2FCFC] dark:bg-darkBlue-4 w-[calc(100% + 40px)] mt-5 font-semibold'>
                    <TabItem active={tab === 1} onClick={() => setTab(1)}
                        isDark={currentTheme === THEME_MODE.DARK}>{t('futures:price')}</TabItem>
                    <TabItem active={tab === 0} onClick={() => setTab(0)}
                        isDark={currentTheme === THEME_MODE.DARK}>{t('futures:order_table:profit')}</TabItem>
                    <TabItem active={tab === 2} onClick={() => setTab(2)}
                        isDark={currentTheme === THEME_MODE.DARK}>{t('futures:profit_margin')}</TabItem>
                </div>
                <div className="mt-5 flex items-center">
                    <div
                        className="px-3 flex items-center w-full h-[36px] bg-gray-5 dark:bg-darkBlue-3 rounded-[4px]">
                        <TradingInput
                            thousandSeparator
                            type="text"
                            label={t('futures:take_profit')}
                            className="flex-grow text-right font-medium h-[21px] text-teal"
                            containerClassName="w-full !py-0 !px-0 border-none"
                            value={tab === 0 ? profit.current.tp : tab === 1 ? data.tp : tabPercent.current.tp}
                            // validator={tab === 1 && inputValidator('take_profit')}
                            decimalScale={countDecimals(decimalScalePrice?.tickSize)}
                            onValueChange={(e) => onHandleChange('tp', e)}
                            renderTail={() => (
                                <span className="font-medium text-teal pl-2">
                                    {tab === 2 ? '%' : quoteAsset}
                                </span>
                            )}
                            inputMode="decimal"
                            allowedDecimalSeparators={[',', '.']}
                        />
                    </div>
                </div>
                <div className="mt-2 mb-3">
                    <Slider
                        useLabel axis='x' x={percent.tp} xmax={100}
                        labelSuffix='%'
                        customDotAndLabel={(xmax, pos) => customDotAndLabel(xmax, pos, 'tp')}
                        // bgColorSlide={'transparent'}
                        xStart={50}
                        reload={tab}
                        bgColorActive={colors.teal}
                        onChange={({ x }) => onChangePercent(x, 100, 'tp')} />
                </div>
                <div className="mt-2 font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark">
                    {t('futures:tp_sl:when')}&nbsp;
                    <span className="text-txtPrimary dark:text-txtPrimary-dark">
                        {t('futures:tp_sl:mark_price')}&nbsp;
                    </span>
                    {t('futures:tp_sl:reaches')}&nbsp;
                    <span className="text-txtPrimary dark:text-txtPrimary-dark">
                        {formatNumber(data.tp, 0, 0, true)}&nbsp;
                    </span>
                    {t('futures:tp_sl:estimate')}&nbsp;
                    <span className="text-dominant">{profit.current.tp + ' ' + quoteAsset}</span>.
                </div>

                <div className="my-4 w-full h-[1px] bg-divider dark:bg-divider-dark" />

                <div className="flex items-center">
                    <div
                        className="px-3 flex items-center w-full h-[36px] bg-gray-5 dark:bg-darkBlue-3 rounded-[4px]">
                        <TradingInput
                            thousandSeparator
                            type="text"
                            label={t('futures:stop_loss')}
                            className="flex-grow text-right font-medium h-[21px] text-red"
                            containerClassName="w-full !py-0 !px-0 border-none"
                            value={tab === 0 ? profit.current.sl : tab === 1 ? data.sl : tabPercent.current.sl}
                            // validator={tab === 1 && inputValidator('stop_loss')}
                            decimalScale={countDecimals(decimalScalePrice?.tickSize)}
                            onValueChange={(e) => onHandleChange('sl', e)}
                            renderTail={() => (
                                <span className="font-medium text-red pl-2">
                                    {tab === 2 ? '%' : quoteAsset}
                                </span>
                            )}
                            inputMode="decimal"
                            allowedDecimalSeparators={[',', '.']}
                        />
                    </div>
                </div>
                <div className="mt-2 mb-3">
                    <Slider
                        useLabel axis='x' x={percent.sl} xmax={100}
                        labelSuffix='%'
                        customDotAndLabel={(xmax, pos) => customDotAndLabel(xmax, pos, 'sl')}
                        bgColorSlide={colors.red}
                        bgColorActive={colors.red}
                        xStart={50}
                        reload={tab}
                        onChange={({ x }) => onChangePercent(x, 100, 'sl')} />
                </div>
                <div className="mt-2 font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark">
                    {t('futures:tp_sl:when')}&nbsp;
                    <span className="text-txtPrimary dark:text-txtPrimary-dark">
                        {t('futures:tp_sl:mark_price')}&nbsp;
                    </span>
                    {t('futures:tp_sl:reaches')}&nbsp;
                    <span className="text-txtPrimary dark:text-txtPrimary-dark">
                        {formatNumber(data.sl, 0, 0, true)}&nbsp;
                    </span>
                    {t('futures:tp_sl:estimate')}&nbsp;
                    <span className="text-red">{profit.current.sl + ' ' + quoteAsset}</span>.
                </div>

                <div className="mt-4 font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark">
                    {/* {t('futures:tp_sl:this_setting')}&nbsp; */}
                    {/* <span className="font-bold">{t('futures:tp_sl:take_profit_stop_loss')}</span>&nbsp; */}
                    {/* {t('futures:tp_sl:automaticcally_cancel')} */}
                </div>

                <Button
                    title={t('futures:leverage:confirm')}
                    type="primary"
                    className={`mt-5 !h-[36px] ${classNameError}`}
                    componentType="button"
                    disabled={isError}
                    onClick={() => {
                        const params = {
                            ...data,
                            price: Number(data.price),
                            sl: Number(data.sl),
                            tp: Number(data.tp)
                        };
                        onConfirm(params);
                    }}
                />
            </div>
        </Modal>
    );
};

const TabItem = styled.div`
    cursor:pointer;
    color: ${({ active, isDark }) => active ? (isDark ? colors.teal : colors.darkBlue) : isDark ? colors.darkBlue5 : colors.grey1};
    font-weight: 600;
    position:relative;
    height:45px;
    display:flex;
    align-items:center;
    justify-content:center;
    &::after {
        display: ${({ active }) => active ? 'block' : 'none'};
        content: '';
        position: absolute;
        border-bottom: 2px solid ${colors.teal};
        width:40px;
        bottom:0;
        z-index: 2
    }
`
export default FuturesEditSLTPVndc;
