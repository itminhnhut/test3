import React, { Fragment, useEffect, useRef, useState } from 'react';
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
    const tabPercent = useRef({ tp: 0, sl: 0 })
    const _lastPrice = pairTicker ? pairTicker[order?.symbol]?.lastPrice : lastPrice;
    const quoteAsset = pairTicker ? pairTicker[order?.symbol]?.quoteAsset : order?.quoteAsset;
    const futuresConfigs = useSelector(state => state.futures.pairConfigs);
    const wallets = useSelector((state) => state.wallet?.FUTURES)
    const symbol = order?.symbol;
    const pairConfig = find(futuresConfigs, { symbol });
    const decimalScalePrice = pairConfig?.filters.find(rs => rs.filterType === 'PRICE_FILTER');
    if (!pairConfig) return null

    const getProfitSLTP = (sltp) => {
        const {
            fee = 0,
            side,
            quantity,
            open_price,
            status,
            price
        } = order;
        const openPrice = status === VndcFutureOrderType.Status.PENDING ? price : open_price;
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
        const tpsl = key === 'sl' ? getSuggestSl(side, _lastPrice, leverage, leverage >= 100 ? 0.9 : index / 100) : getSuggestTp(side, _lastPrice, leverage, leverage >= 100 ? 0.9 : index / 100);
        const decimals = countDecimals(decimalScalePrice?.tickSize)
        return +tpsl.toFixed(decimals)
    }

    useEffect(() => {
        if (order.leverage < 10) {
            if (!order?.sl) {
                profit.current.sl = 0
            }
            if (!order?.tp) {
                profit.current.tp = 0
            }
        } else {
            profit.current = {
                tp: tabTp === 0 ? getProfitSLTP(Number(order?.tp)) : 0,
                sl: tabSl === 0 ? getProfitSLTP(Number(order?.sl)) : 0,
            }
        }
        tabPercent.current = { tp: 0, sl: 0 }
        setData({
            ...data,
            tp: Number(order?.tp),
            sl: Number(order?.sl),
        });

    }, [tabSl, tabTp])

    const tabs = [{ value: 0, label: t('futures:price') }, { value: 2, label: '%' }]
    const renderTab = (mode) => {
        const tab = mode === 'sl' ? tabSl : tabTp
        const tabName = tabs.find(rs => rs.value === tab);
        return (
            <div className="relative flex items-center justify-between h-full w-full" >
                <button
                    type="button"
                    className="flex items-center justify-between focus:outline-none w-full"
                    aria-expanded="false"
                    onClick={() => {
                        if (mode === 'sl') {
                            setTabSl(tabSl === 0 ? 2 : 0)
                        } else {
                            setTabTp(tabTp === 0 ? 2 : 0)
                        }
                    }}
                >
                    <div className="text-sm font-medium">{tabName.label}</div>
                    <div className="min-w-[12px]"><SortIcon /></div>
                </button>
            </div>
        )
    }

    const getLabelButton = (index, isString = false, key) => {
        const _avlb = wallets?.[pairConfig?.quoteAssetId];
        const balance = Math.max(_avlb?.value, 0);
        let label = 0;
        let value = 0
        const prefix = key === 'sl' ? '+' : '+';
        let tab = key === 'sl' ? tabSl : tabTp
        if (tab === 0) {
            //40%
            value = data.price + (data.price * index * 0.4 / 100)
            label = prefix + formatCurrency(value, 2);
        }
        if (tab === 1) {
            // 10%
            value = balance * (index * 0.1 / 100);
            label = prefix + formatCurrency(value, 2);
        }
        if (tab === 2) {
            //+- 100%
            value = getSLTP(index, key);
            label = prefix + index + '%';
        }
        return { label, value };
    }

    const onChangeSlTP = (value, key, index) => {
        const tab = key === 'sl' ? tabSl : tabTp
        if (tab === 2) {
            tabPercent.current[key] = index;
            profit.current[key] = getProfitSLTP(value);
        }

        setData({ ...data, [key]: value })
    }

    const renderButtons = (qty, key) => {
        const tab = key === 'sl' ? tabSl : tabTp
        if (tab !== 2) return null;
        const size = 100 / qty;
        const arr = [5, 10, 25, 50, 100];
        const result = [];
        arr.forEach(per => {
            const { label, value } = getLabelButton(per, true, key);
            result.push(
                <div onClick={() => onChangeSlTP(value, key, per)}
                    className="active:bg-onus/[0.1] px-4 py-[5px] bg-onus-bg2 rounded-[4px] text-xs font-medium mr-[4.5px] last:mr-0">
                    {label}
                </div>
            )
        })
        return <div className={`flex flex-wrap mt-3 text-onus-white font-medium`}>{result}</div>;
    }

    const onHandleChange = (key, e) => {
        const value = +e.value === 0 ? '' : +e.value;
        const decimals = countDecimals(decimalScalePrice?.tickSize);
        const tab = key === 'sl' ? tabSl : tabTp
        if (tab === 0) {
            profit.current[key] = getProfitSLTP(value)
            setData({
                ...data,
                [key]: value
            });
        } else if (tab === 1) {
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
            const _value = key === 'sl' ? -value : value
            const _profit = (_value / 100) * margin / leverage;
            profit.current[key] = formatNumber(_profit, decimals, 0, true)
            tabPercent.current[key] = value;
            setData({
                ...data,
                [key]: getSLTP(value, key)
            })
        }
    }

    const placeholder = (key) => {
        const tab = key === 'stop_loss' ? tabSl : tabTp
        return tab === 0 ? t(`futures:mobile:${key}_input`) : tab === 1 ? t(`futures:mobile:profit_input`) : t('futures:mobile:percent_input')
    }

    const onSwitch = (key) => {
        const tab = key === 'sl' ? tabSl : tabTp
        tabPercent.current[key] = 0;
        if (tab === 0) {
            if (order.leverage < 10) {
                profit.current = {
                    tp: 0,
                    sl: 0,
                }
            } else if (order.leverage <= 20) {
                if (!order?.sl) {
                    setData({ ...data, sl: getSLTP(order.leverage, 'sl') });
                    profit.current.sl = getProfitSLTP(getSLTP(order.leverage, 'sl'));
                }
            } else if (order.leverage > 20 && (!order?.sl || !order?.tp)) {
                if (key === 'sl' && !order?.sl) {
                    setData({ ...data, [key]: getSLTP(order.leverage, 'sl') });
                    profit.current[key] = getProfitSLTP(getSLTP(order.leverage, 'sl'));
                } else if (!order?.tp) {
                    setData({ ...data, [key]: getSLTP(order.leverage, 'tp') });
                    profit.current[key] = getProfitSLTP(getSLTP(order.leverage, 'tp'));
                }
            } else if (!order?.sl || !order?.tp) {
                setData({ ...data, [key]: getSLTP(order.leverage, key) });
                profit.current[key] = getProfitSLTP(getSLTP(order.leverage, key));
            } else {
                setData({ ...data, [key]: order[key] });
                profit.current[key] = getProfitSLTP(getSLTP(order.leverage, key));
            }
        } else {
            profit.current[key] = 0;
        }
        setShow({ ...show, [key]: !show[key] })
    }

    return (
        <Modal onusMode={true} isVisible={true} onBackdropCb={onClose}
            selectorClose="sltp-mobile"
        >

            <div className="pb-[33px]">
                <div className="text-lg font-bold text-onus-white pb-[20px]">{t('futures:tp_sl:modify_tpsl')}</div>
                <div className="text-onus-green font-semibold relative w-max bottom-[-13px] bg-onus-bgModal px-[6px] left-[9px]">{order?.symbol} {order?.leverage}x</div>
                <div className="border border-onus-bg2 px-[15px] py-[10px] rounded-lg pt-[21px]">
                    <div className="text-sm flex items-center justify-between">
                        <span className="text-txtSecondary dark:text-onus-grey">
                            {t('futures:tp_sl:mark_price')}
                        </span>
                        <span className="font-medium">{formatNumber(_lastPrice, 2, 0, true)}</span>
                    </div>
                    <div className="h-[1px] bg-onus-bg2 w-full my-[10px]"></div>
                    <div className="text-sm flex items-center justify-between">
                        <span className="text-txtSecondary dark:text-onus-grey">
                            {t('futures:order_table:open_price')}
                        </span>
                        <span className="font-medium">{formatNumber(data.price, 2, 0, true)}</span>
                    </div>
                </div>
            </div>
            <div>
                <div className='flex items-center'>
                    <label className="text-onus-white font-semibold mr-2">{t('futures:stop_loss')}</label>
                    <Switcher onusMode addClass="dark:!bg-onus-white w-[22px] h-[22px]" wrapperClass="!h-6 w-12"
                        active={show.sl} onChange={() => onSwitch('sl')} />
                </div>
                {show.sl && <>
                    <div className="h-[44px] rounded-[6px] w-full bg-onus-bg2 flex mt-4">
                        <TradingInput
                            onusMode={onusMode}
                            thousandSeparator
                            type="text"
                            placeholder={placeholder('stop_loss')}
                            labelClassName="hidden"
                            className={`flex-grow text-sm font-normal h-[21px] text-onus-grey w-full `}
                            containerClassName={`w-full !px-3 border-none ${isMobile ? 'dark:bg-onus-bg2' : ''}`}
                            value={tabSl === 0 ? data.sl : tabSl === 1 ? profit.current.sl : tabPercent.current.sl}
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
                        <div className="min-w-[66px] bg-[#445571] px-3 h-full rounded-r-[6px]">
                            {renderTab('sl')}
                        </div>
                    </div>
                    {renderButtons(4, 'sl')}
                    <div className="text-xs flex pt-3">
                        <div className="font-normal text-onus-grey">{t('futures:mobile:est_stop_loss')}:</div>&nbsp;
                        <div className="font-medium text-onus-red">{profit.current.sl + ' ' + quoteAsset}</div>
                    </div>
                </>
                }
            </div>
            <div className="pt-[33px] pb-10">
                <div className='flex items-center pb-4'>
                    <label className="text-onus-white font-semibold mr-2">{t('futures:take_profit')}</label>
                    <Switcher onusMode addClass="dark:!bg-onus-white w-[22px] h-[22px]" wrapperClass="!h-6 w-12"
                        active={show.tp} onChange={() => onSwitch('tp')} />
                </div>
                {show.tp && <>
                    <div className="h-[44px] rounded-[6px] w-full bg-onus-bg2 flex">
                        <TradingInput
                            onusMode={onusMode}
                            thousandSeparator
                            type="text"
                            placeholder={placeholder('take_profit')}
                            labelClassName="hidden"
                            className={`flex-grow text-sm font-normal h-[21px] text-onus-grey w-full `}
                            containerClassName={`w-full !px-3 border-none ${isMobile ? 'dark:bg-onus-bg2' : ''}`}
                            value={tabTp === 0 ? data.tp : tabTp === 1 ? profit.current.tp : tabPercent.current.tp}
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
                        <div className="min-w-[66px] bg-[#445571] px-3 h-full rounded-r-[6px]">
                            {renderTab('tp')}
                        </div>
                    </div>
                    {renderButtons(4, 'tp')}
                    <div className="text-xs flex pt-3">
                        <div className="font-normal text-onus-grey">{t('futures:mobile:est_take_profit')}:</div>&nbsp;
                        <div className="font-medium text-onus-green">{profit.current.tp + ' ' + quoteAsset}</div>
                    </div>
                </>
                }
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

                    console.log('__ check new data', newData, show, data)
                    onConfirm(newData)
                }}
            />
        </Modal>
    );
};

export default EditSLTPVndcMobile;
