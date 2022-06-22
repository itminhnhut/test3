import React, { Fragment, useEffect, useRef, useState, useMemo, useCallback } from 'react';
import Modal from 'components/common/ReModal';
import Button from 'components/common/Button';
import { useTranslation } from 'next-i18next';
import { countDecimals, formatCurrency, formatNumber, getSuggestSl, getSuggestTp } from 'redux/actions/utils';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { useSelector } from 'react-redux';
import { find } from 'lodash';
import SortIcon from 'components/screens/Mobile/SortIcon';
import TradingInput from 'components/trade/TradingInput';
import { Popover, Transition } from '@headlessui/react';
import Switcher from 'components/common/Switcher';
import { log } from 'utils';
import CheckBox from 'components/common/CheckBox';
import Slider from 'components/trade/InputSlider';
import { Dot } from 'components/trade/StyleInputSlider';
import classNames from 'classnames';
import colors from 'styles/colors'
import { DefaultFuturesFee } from 'redux/actions/const';

const EditSLTPVndcMobile = ({
    onClose, isVisible, order, status, onConfirm,
    pairTicker, lastPrice = 0, isMobile, onusMode = false }) => {
    const { t } = useTranslation();
    const [data, setData] = useState({
        displaying_id: order?.displaying_id,
        price: +(status === VndcFutureOrderType.Status.PENDING ? order?.price : status === VndcFutureOrderType.Status.ACTIVE ? order?.open_price : order?.close_price),
        sl: Number(order?.sl),
        tp: Number(order?.tp),
    });
    const [show, setShow] = useState({ tp: +order?.tp > 0, sl: +order?.sl > 0 })
    const [tabSl, setTabSl] = useState(0)
    const [tabTp, setTabTp] = useState(0)
    const profit = useRef({ tp: 0, sl: 0 })
    const [percent, setPercent] = useState({ tp: 0, sl: 0 })
    const [autoType, setAutoType] = useState(false);
    const dotStep = useRef(4);
    const _lastPrice = pairTicker ? pairTicker[order?.symbol]?.lastPrice : lastPrice;
    const quoteAsset = pairTicker ? pairTicker[order?.symbol]?.quoteAsset : order?.quoteAsset;
    const futuresConfigs = useSelector(state => state.futures.pairConfigs);
    const wallets = useSelector((state) => state.wallet?.FUTURES)
    const symbol = order?.symbol;
    const pairConfig = find(futuresConfigs, { symbol });
    const decimalScalePrice = pairConfig?.filters.find(rs => rs.filterType === 'PRICE_FILTER');
    if (!pairConfig) return null
    const isChangeSlide = useRef(false);

    const getProfitSLTP = (sltp) => {
        const {
            fee = 0,
            side,
            quantity,
            open_price,
            status,
            price,
            size
        } = order;
        const isBuy = side === VndcFutureOrderType.Side.BUY;
        const openPrice = status === VndcFutureOrderType.Status.PENDING ? price : open_price;
        let total = quantity * (isBuy ? sltp - openPrice : openPrice - sltp);
        const _fee = quantity * (sltp + openPrice) * DefaultFuturesFee.NamiFrameOnus;
        let profit = total - _fee
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
        return +Number(sltp).toFixed(decimals);
    };

    const getSLTP = (index = 60, key) => {
        const {
            quantity,
            open_price,
            status,
            price,
            side,
            leverage
        } = order;
        const openPrice = status === VndcFutureOrderType.Status.PENDING ? price : open_price;
        const tpsl = key === 'sl' ? getSuggestSl(side, openPrice, leverage, index / 100) : getSuggestTp(side, openPrice, leverage, index / 100);
        const decimals = countDecimals(decimalScalePrice?.tickSize)
        return +tpsl.toFixed(decimals)
    }

    const onChangeAutoType = () => {
        localStorage.setItem('auto_type_tp_sl', JSON.stringify({ auto: !autoType }))
        setAutoType(!autoType)
    }

    useEffect(() => {
        if (order?.sl) {
            profit.current.sl = getProfitSLTP(Number(order?.sl));
        }
        if (order?.tp) {
            profit.current.tp = getProfitSLTP(Number(order?.tp));
        }
        if (order.leverage <= 10) {
            if (!order?.sl) {
                profit.current.sl = 0
            }
            if (!order?.tp) {
                profit.current.tp = 0
            }
        }
        setTimeout(() => {
            setPercent({
                sl: getPercentSlTp(Number(order?.sl), 'sl').toFixed(0),
                tp: getPercentSlTp(Number(order?.tp), 'tp').toFixed(0),
            })
        }, 100);
        setData({
            ...data,
            tp: Number(order?.tp),
            sl: Number(order?.sl),
        });
        const autoTypeInput = localStorage.getItem('auto_type_tp_sl');
        if (autoTypeInput) {
            autoTypeInput = JSON.parse(autoTypeInput);
            setAutoType(autoTypeInput?.auto)
        }
    }, [])

    const onHandleChange = (key, e) => {
        if (isChangeSlide.current) {
            isChangeSlide.current = false;
            return;
        }
        const value = +e.value === 0 ? '' : +e.value;
        const decimals = countDecimals(decimalScalePrice?.tickSize);
        profit.current[key] = value ? getProfitSLTP(value) : 0;
        setPercent({ ...percent, [key]: getPercentSlTp(value, key) })
        setData({
            ...data,
            [key]: value
        });
    }

    const getPercentSlTp = (sltp, key) => {
        if (!sltp) return 50;
        const { leverage, side } = order;
        let formatX = 0;
        if (side == VndcFutureOrderType.Side.BUY) {
            formatX = (sltp * (1 - DefaultFuturesFee.NamiFrameOnus) - _lastPrice * (1 + DefaultFuturesFee.NamiFrameOnus)) * leverage / _lastPrice * 100
        } else {
            formatX = (sltp * (-1 - DefaultFuturesFee.NamiFrameOnus) + _lastPrice * (1 - DefaultFuturesFee.NamiFrameOnus)) * leverage / _lastPrice * 100
        }
        return formatX <= -100 ? -1 : Math.abs(formatX > 0 ? 50 + formatX / 2 : -50 - formatX / 2)
    }

    const placeholder = (key) => {
        const tab = key === 'stop_loss' ? tabSl : tabTp
        return tab === 0 ? t(`futures:mobile:${key}_input`) : tab === 1 ? t(`futures:mobile:profit_input`) : t('futures:mobile:percent_input')
    }

    const setDataGeneral = (sltp, key) => {
        profit.current[key] = sltp ? getProfitSLTP(sltp) : 0;
        setData({ ...data, [key]: sltp });
        setPercent({ ...percent, [key]: sltp ? getPercentSlTp(sltp, key) : 50 })
    }

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
        setShow({ ...show, [key]: !show[key] })
    }

    const customDotAndLabel = useCallback((xmax, pos, key) => {
        const dot = []
        const label = []
        const size = 100 / dotStep.current
        const postion = pos.left === 50 ? 0 : pos.left > 50 ? (pos.left - 50) * 2 : -(50 - pos.left) * 2;
        for (let i = 0; i <= dotStep.current; ++i) {
            // console.log(Number(i * size) ,Number(data[key] > 0 ? percent[key] : 50))
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
                    isDark
                    onusMode
                    bgColorActive={colors.onus.slider}
                    bgColorDot={colors.onus.bg3}

                />
            )
            label.push(
                <div className='relative' key={`inputSlider_label_${i}`}>
                    <span
                        onClick={() => {
                            onSetValuePercent(i * size, key)
                        }}
                        className={classNames(
                            'block absolute text-xs dark:text-onus-grey select-none cursor-pointer',
                            {
                                'left-1/2 -translate-x-1/2 ml-[3px]': i > 0 && i < dotStep.current,
                                '-left-1/2 translate-x-[-80%]': i === dotStep.current,
                                '!text-onus-white': Number(i * size) === Number(data[key] > 0 ? percent[key] : 50) && onusMode,
                            }
                        )}
                    >
                        {getLabelPercent(i * size, key)}
                        {'%'}
                    </span>
                </div>
            )
        }
        return { dot, label }
    }, [percent])

    const getLabelPercent = (index, key) => {
        //+- 100% -> total 200%
        const negative = -(50 - index) < 0
        const formatX = index === 50 ? 0 : index > 50 ? (index - 50) * 2 : -(50 - index) * 2;
        return formatX.toFixed(0)
    }

    const arrDot = useMemo(() => {
        const size = 100 / dotStep.current;
        const arr = [];
        for (let i = 0; i <= dotStep.current; i++) {
            arr.push(i * size)
        }
        return arr
    }, [dotStep.current])

    const onChangePercent = (x, xmax, key) => {
        const _x = arrDot.reduce((prev, curr) => {
            let i = 0;
            if (Math.abs(curr - x) < 2 || Math.abs(prev - x) < 2) {
                i = Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev;
            }
            return i;
        });
        onSetValuePercent(_x ? _x : x, key)
    }

    const onSetValuePercent = (x, key) => {
        isChangeSlide.current = true;
        const formatX = getLabelPercent(x, key);
        const tpsl = getSLTP(key === 'sl' ? -formatX : formatX, key);
        profit.current[key] = getProfitSLTP(tpsl);
        setData({ ...data, [key]: tpsl })
        setPercent({ ...percent, [key]: x })
    }

    return (
        <Modal onusMode={true} isVisible={true} onBackdropCb={onClose}
        >

            <div className="pb-[25px]">
                <div className="text-lg font-bold text-onus-white pb-[6px]">{t('futures:mobile:modify_tpsl_title')}</div>
                <div className="text-onus-green font-semibold relative w-max bottom-[-13px] bg-onus-bgModal px-[6px] left-[9px]">{order?.symbol} {order?.leverage}x</div>
                <div className="border border-onus-bg2 px-[15px] py-[10px] rounded-lg pt-[21px]">
                    <div className="text-sm flex items-center justify-between">
                        <span className="text-txtSecondary dark:text-onus-grey">
                            {t('futures:order_table:open_price')}
                        </span>
                        <span className="font-medium">{formatNumber(data.price, 2, 0, true)}</span>
                    </div>
                    <div className="h-[1px] bg-onus-bg2 w-full my-[10px]"></div>
                    <div className="text-sm flex items-center justify-between">
                        <span className="text-txtSecondary dark:text-onus-grey">
                            {t('futures:tp_sl:mark_price')}
                        </span>
                        <span className="font-medium">{formatNumber(_lastPrice, 2, 0, true)}</span>
                    </div>

                </div>
            </div>
            {!order?.displaying_id ?
                <div
                    className="flex items-center text-sm font-medium select-none cursor-pointer"
                    onClick={onChangeAutoType}
                >
                    <CheckBox onusMode={true} active={autoType}
                        boxContainerClassName={`rounded-[2px] ${autoType ? '' : 'border !border-onus-grey !bg-onus-bg2'}`} />
                    <span className="ml-3 whitespace-nowrap text-onus-grey font-medium text-xs">
                        {t('futures:mobile:auto_type_sltp')}
                    </span>
                </div>
                : null
            }
            <div className="pt-[25px]">
                <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                        <label className="text-onus-white font-semibold mr-2">{t('futures:stop_loss')}</label>
                        <Switcher onusMode addClass="dark:!bg-onus-white w-[22px] h-[22px]" wrapperClass="!h-6 w-12"
                            active={show.sl} onChange={() => onSwitch('sl')} />
                    </div>
                    {show.sl && <div className="text-xs flex">
                        <div className="font-normal text-onus-grey">{t('futures:mobile:pnl_estimate')}:</div>&nbsp;
                        <div className="font-medium text-onus-red">{profit.current.sl + ' ' + quoteAsset}</div>
                    </div>
                    }
                </div>
                {show.sl &&
                    <div className="h-[44px] rounded-[6px] w-full bg-onus-bg2 flex mt-4">
                        <TradingInput
                            onusMode={onusMode}
                            thousandSeparator
                            type="text"
                            placeholder={placeholder('stop_loss')}
                            labelClassName="hidden"
                            className={`flex-grow text-sm font-medium h-[21px] text-onus-white w-full `}
                            containerClassName={`w-full !px-3 border-none ${isMobile ? 'dark:bg-onus-bg2' : ''}`}
                            value={data.sl}
                            decimalScale={countDecimals(decimalScalePrice?.tickSize)}
                            onValueChange={(e) => onHandleChange('sl', e)}
                            renderTail={() => (
                                <span className={`font-medium pl-2 text-onus-grey`}>
                                    {tabSl === 2 ? '%' : quoteAsset}
                                </span>
                            )}
                            inputMode="decimal"
                            allowedDecimalSeparators={[',', '.']}
                        />
                    </div>
                }
                <div className={`mt-2 mb-[14px] ${!show.sl ? 'hidden' : ''}`}>
                    <Slider
                        useLabel
                        onusMode
                        labelSuffix='%'
                        x={percent.sl}
                        axis='x'
                        xmax={100}
                        bgColorActive={colors.onus.slider}
                        bgColorSlide={colors.onus.slider}
                        xStart={50}
                        positionLabel="top"
                        customDotAndLabel={(xmax, pos) => customDotAndLabel(xmax, pos, 'sl')}
                        onChange={({ x }) => onChangePercent(x, 100, 'sl')}
                    />
                </div>
            </div>
            <div className="pt-[30px] pb-10">
                <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                        <label className="text-onus-white font-semibold mr-2">{t('futures:take_profit')}</label>
                        <Switcher onusMode addClass="dark:!bg-onus-white w-[22px] h-[22px]" wrapperClass="!h-6 w-12"
                            active={show.tp} onChange={() => onSwitch('tp')} />
                    </div>
                    {show.tp && <div className="text-xs flex">
                        <div className="font-normal text-onus-grey">{t('futures:mobile:pnl_estimate')}:</div>&nbsp;
                        <div className="font-medium text-onus-green">{profit.current.tp + ' ' + quoteAsset}</div>
                    </div>}
                </div>
                {show.tp &&
                    <div className="h-[44px] rounded-[6px] w-full bg-onus-bg2 flex mt-4">
                        <TradingInput
                            onusMode={onusMode}
                            thousandSeparator
                            type="text"
                            placeholder={placeholder('take_profit')}
                            labelClassName="hidden"
                            className={`flex-grow text-sm font-medium h-[21px] text-onus-white w-full `}
                            containerClassName={`w-full !px-3 border-none ${isMobile ? 'dark:bg-onus-bg2' : ''}`}
                            value={data.tp}
                            decimalScale={countDecimals(decimalScalePrice?.tickSize)}
                            onValueChange={(e) => onHandleChange('tp', e)}
                            renderTail={() => (
                                <span className={`font-medium pl-2 text-onus-grey`}>
                                    {tabTp === 2 ? '%' : quoteAsset}
                                </span>
                            )}
                            inputMode="decimal"
                            allowedDecimalSeparators={[',', '.']}
                        />
                    </div>
                }
                <div className={`mt-2 ${!show.tp ? 'hidden' : ''}`}>
                    <Slider
                        useLabel
                        onusMode
                        labelSuffix='%'
                        x={percent.tp}
                        axis='x'
                        xmax={100}
                        bgColorActive={colors.onus.slider}
                        bgColorSlide={colors.onus.slider}
                        xStart={50}
                        positionLabel="top"
                        customDotAndLabel={(xmax, pos) => customDotAndLabel(xmax, pos, 'tp')}
                        onChange={({ x }) => onChangePercent(x, 100, 'tp')}
                    />
                </div>
            </div>
            <Button
                onusMode={true}
                title={t('futures:leverage:confirm')}
                type="primary"
                className={`!h-[50px] !text-[16px] !font-semibold`}
                componentType="button"
                onClick={() => {
                    const newData = {
                        ...data,
                        sl: show?.sl ? data.sl : 0,
                        tp: show?.tp ? data.tp : 0,
                    }
                    onConfirm(newData)
                }}
            />
        </Modal>
    );
};

export default EditSLTPVndcMobile;
