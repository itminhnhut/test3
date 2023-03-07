import React, { useMemo, useState, useRef, useEffect } from 'react';
import ModalV2 from 'components/common/V2/ModalV2';
import { useTranslation } from 'next-i18next';
import SwitchV2 from 'components/common/V2/SwitchV2';
import styled from 'styled-components';
import { getType, formatNumber, checkInFundingTime, checkLargeVolume } from 'redux/actions/utils';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { getProfitVndc, VndcFutureOrderType, getTypesLabel, validator } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import CollapseV2 from 'components/common/V2/CollapseV2';
import { Minus, Plus } from 'react-feather';
import TradingInput from 'components/trade/TradingInput';
import classNames from 'classnames';
import Slider from 'components/trade/InputSlider';
import ChevronDown from 'components/svg/ChevronDown';
import { ApiStatus, DefaultFuturesFee } from 'redux/actions/const';
import Tooltip from 'components/common/Tooltip';
import SelectV2 from 'components/common/V2/SelectV2';
import { API_GET_FUTURES_ORDER, API_PARTIAL_CLOSE_ORDER } from 'redux/actions/apis';
import fetchApi from 'utils/fetch-api';
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';

const FuturesCloseOrder = ({ isVisible, onClose, order, marketWatch, lastPrice, decimals, pairConfig, forceFetchOrder }) => {
    const { t } = useTranslation();
    const _lastPrice = marketWatch ? marketWatch[order?.symbol]?.lastPrice : lastPrice;
    const pairTicker = marketWatch[order?.symbol];
    const quoteAsset = pairTicker?.quoteAsset;
    const [partialClose, setPartialClose] = useState(false);
    const order_value = order?.order_value || 0;
    const side = order?.side;

    const [volume, setVolume] = useState();
    const [price, setPrice] = useState(_lastPrice);
    const [type, setType] = useState(order?.type);
    const [percent, setPercent] = useState(0);
    const [showCustomized, setShowCustomized] = useState(false);
    const isChangeSlide = useRef(false);
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const message = useRef({
        status: '',
        title: '',
        message: '',
        notes: ''
    });

    const isMaket = useMemo(() => {
        return type === VndcFutureOrderType.Type.MARKET;
    }, [type, order]);

    const isPending = useMemo(() => {
        return order?.status === VndcFutureOrderType.Status.PENDING;
    }, [order]);

    const totalPnL = useMemo(() => {
        const profit = getProfitVndc(order, order?.side === VndcFutureOrderType.Side.BUY ? pairTicker?.bid : pairTicker?.ask, true) || 0;
        return {
            profit: profit,
            percent: (profit / order?.margin) * 100
        };
    }, [order, pairTicker]);

    const minQuoteQty = useMemo(() => {
        const initValue = quoteAsset === 'VNDC' ? 100000 : 5;
        return pairConfig ? pairConfig?.filters.find((item) => item.filterType === 'MIN_NOTIONAL')?.notional : initValue;
    }, [pairConfig, quoteAsset]);

    const maxQuoteQty = useMemo(() => {
        const pendingVol = order?.metadata?.partial_close_metadata?.partial_close_orders?.reduce((pre, { close_volume = 0, status }) => {
            return pre + (status === VndcFutureOrderType.Status.PENDING ? close_volume : 0);
        }, 0);
        return order_value - (pendingVol ?? 0);
    }, [order]);

    useEffect(() => {
        if (isVisible) {
            setVolume();
            setPercent(0);
            setPartialClose(false);
            setType(order?.type);
        }
    }, [isVisible]);

    useEffect(() => {
        if (partialClose) {
            setVolume();
            setPercent(0);
            setPrice(_lastPrice);
        }
    }, [partialClose]);

    useEffect(() => {
        if (showCustomized) {
            setPrice(_lastPrice);
            setType(order?.type);
        }
    }, [showCustomized]);

    const onChangeVolume = (value) => {
        if (isChangeSlide.current) {
            isChangeSlide.current = false;
            return;
        }
        setVolume(value);
        setPercent((value * 100) / maxQuoteQty);
    };

    const arrDot = useMemo(() => {
        const size = 100 / 4;
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
        const value = ((+maxQuoteQty * (_x ? _x : x)) / 100).toFixed(decimals.symbol);
        setVolume(+value || '');
        setPercent(_x ? _x : x);
    };

    const _validator = (key, isText = false) => {
        switch (key) {
            case 'price':
                const _side = side === VndcFutureOrderType.Side.BUY ? VndcFutureOrderType.Side.SELL : VndcFutureOrderType.Side.BUY;
                return validator('price', price, String(type).toUpperCase(), _side, _lastPrice, pairConfig, decimals.symbol, t, isText);
            case 'quoteQty':
                return {
                    isValid: !(volume < +minQuoteQty || volume > +maxQuoteQty),
                    msg:
                        volume < +minQuoteQty
                            ? `${t('futures:minimum_qty')}: ${formatNumber(minQuoteQty, decimals.symbol)}`
                            : `${t('futures:maximum_qty')}: ${formatNumber(maxQuoteQty, decimals.symbol)}`
                };
            default:
                break;
        }
    };

    const textDescription = (key, data) => {
        let rs = {};
        switch (key) {
            case 'price':
                rs = {
                    min: `${t('common:min')}: ${formatNumber(data?.min, decimals.symbol)}`,
                    max: `${t('common:max')}: ${data?.max ? formatNumber(data?.max, decimals.symbol) : '-'}`
                };
                return `${rs.min}. ${rs.max}`;
            case 'quoteQty':
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

    const general = useMemo(() => {
        const isVndc = quoteAsset === 'VNDC';
        const profit = getProfitVndc(order, side === VndcFutureOrderType.Side.BUY ? pairTicker?.bid : pairTicker?.ask, true);
        const formatProfit = formatNumber(profit, isVndc ? decimals.symbol : decimals.symbol + 2, 0, true);
        const totalPercent = (formatProfit > 0 ? '+' : '-') + formatNumber(Math.abs(profit / order?.margin) * 100, 2, 0, true);
        let est_pnl = 0;
        // const funding = order?.funding_fee?.margin ? Math.abs(order?.funding_fee?.margin) : 0
        if (type !== VndcFutureOrderType.Type.MARKET) {
            const _price = +price;
            const size = volume / _price;
            if (side === VndcFutureOrderType.Side.BUY) {
                est_pnl = size * (_price - order?.open_price) - size * (_price + order?.open_price) * DefaultFuturesFee.Nami;
            } else {
                est_pnl = size * (order?.open_price - _price) - size * (_price + order?.open_price) * DefaultFuturesFee.Nami;
            }
        } else {
            est_pnl = (percent / 100) * profit;
        }
        return {
            remaining_volume: maxQuoteQty - (volume || 0),
            percent: totalPercent,
            profit: +profit,
            formatProfit: formatProfit,
            est_pnl: est_pnl,
            pendingVol: order_value - maxQuoteQty
        };
    }, [volume, order, percent, pairTicker, decimals, price, type, maxQuoteQty]);

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

    const onConfirm = async () => {
        try {
            const params = {
                displaying_id: order?.displaying_id,
                closeType: type,
                price: +price,
                useQuoteQty: true,
                closeVolume: +volume,
                special_mode: 1
            };
            let isLargeVolume = false;
            const isPartialClose = partialClose && percent < 100;
            if (isPartialClose) {
                isLargeVolume = checkLargeVolume(+volume, quoteAsset === 'VNDC');
            } else {
                isLargeVolume = checkLargeVolume(order?.order_value, quoteAsset === 'VNDC');
            }
            const inFundingTime = checkInFundingTime();
            let notice = null;
            if (inFundingTime) {
                notice = t('futures:high_funding_note');
            } else if (isLargeVolume) {
                notice = t('futures:high_volume_note');
            }
            setLoading(true);

            const { status, data } = await fetchApi({
                url: isPartialClose ? API_PARTIAL_CLOSE_ORDER : API_GET_FUTURES_ORDER,
                options: { method: isPartialClose ? 'POST' : 'DELETE' },
                params: params
            });
            if (status === ApiStatus.SUCCESS) {
                if (isPartialClose) {
                    message.current = {
                        status: 'success',
                        title: t('futures:mobile:adjust_margin:add_volume_success'),
                        message: t('futures:close_order:request_successfully'),
                        notes: notice
                    };
                } else {
                    message.current = {
                        status: 'success',
                        title: t('futures:close_order:modal_title', { value: order?.displaying_id }),
                        message: t('futures:close_order:request_successfully', { value: order?.displaying_id }),
                        notes: notice
                    };
                }

                if (forceFetchOrder) forceFetchOrder();
            } else {
                const requestId = data?.requestId && `(${data?.requestId.substring(0, 8)})`;
                message.current = {
                    status: 'error',
                    title: t('common:failed'),
                    message: t(`error:futures:${status || 'UNKNOWN'}`),
                    notes: requestId
                };
            }
        } catch (error) {
            message.current = {
                status: 'error',
                title: t('common:failed'),
                message: error?.message
            };
        } finally {
            if (onClose) onClose();
            setShowAlert(true);
            setLoading(false);
        }
    };

    const changeClass = `w-5 h-5 flex items-center justify-center rounded-md`;
    const isError = partialClose && (!volume || !_validator('quoteQty')?.isValid || (!_validator('price')?.isValid && showCustomized && !isMaket));

    return (
        <>
            <AlertModalV2
                isVisible={showAlert}
                onClose={() => setShowAlert(false)}
                type={message.current?.status}
                title={message.current?.title}
                message={message.current?.message}
                notes={message.current?.notes}
            />
            {isPending ? (
                <ModalV2 className="!max-w-[488px]" isVisible={isVisible} onBackdropCb={onClose}>
                    <div className="text-2xl leading-[30px] font-semibold mb-3">{t('futures:close_order:title')}</div>
                    <div className="text-teal text-lg font-semibold relative w-max bottom-[-13px] px-[6px] left-[9px] bg-white dark:bg-bgSpotContainer-dark">
                        {order?.symbol} {order?.leverage}x
                    </div>
                    <div className="border border-divider dark:border-divider-dark p-4 rounded-md mb-6">
                        <div className="flex items-center justify-between">
                            <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('futures:order_table:mark_price')}</span>
                            <span className="font-semibold">{formatNumber(_lastPrice, decimals.price, 0, true)}</span>
                        </div>
                        <div className="h-[0.5px] bg-divider dark:bg-divider-dark w-full my-3"></div>
                        <div className="flex items-center justify-between">
                            <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('futures:mobile:adjust_margin:current_volume')}</span>
                            <span className="font-semibold">{formatNumber(order?.order_value, decimals.symbol, 0, true)}</span>
                        </div>
                        <div className="h-[0.5px] bg-divider dark:bg-divider-dark w-full my-3"></div>
                        <div className="flex items-center justify-between">
                            <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('futures:mobile:close_all_positions:estimated_pnl')}</span>
                            <span className="font-semibold">-</span>
                        </div>
                    </div>
                    <ButtonV2 disabled={isError || loading} onClick={onConfirm} className="mt-10">
                        {t('common:confirm')}
                    </ButtonV2>
                </ModalV2>
            ) : (
                <ModalV2 className="!max-w-[800px]" isVisible={isVisible} onBackdropCb={onClose}>
                    <div className="flex items-center justify-between mb-8">
                        <div className="text-2xl font-semibold">{t('futures:close_order:title')}</div>
                        <div className="flex items-center space-x-2">
                            <span className="text-txtSecondary dark:text-txtSecondary">{t('futures:mobile:adjust_margin:close_partially')}</span>
                            <SwitchV2
                                onChange={() => {
                                    setPartialClose(!partialClose);
                                    setShowCustomized(false);
                                }}
                                checked={partialClose}
                            />
                        </div>
                    </div>
                    <div className="rounded-md border border-divider dark:border-divider-dark p-6 flex divide-x divide-divider dark:divide-divider-dark">
                        <Row>
                            <Item>{t('common:pair')}</Item>
                            <Item className="text-teal">
                                {order?.symbol} {order?.leverage}x
                            </Item>
                        </Row>
                        <Row>
                            <Item>{t('futures:mobile:quote_price')}</Item>
                            <Item>{formatNumber(_lastPrice, decimals.price)}</Item>
                        </Row>
                        <Row>
                            <Item>{t('futures:mobile:adjust_margin:current_volume')}</Item>
                            <Item>{formatNumber(order?.order_value, decimals.symbol)}</Item>
                        </Row>
                        <Row>
                            <Item className="whitespace-nowrap">{t('futures:mobile:close_all_positions:estimated_pnl')}</Item>
                            <Item className={totalPnL.percent < 0 ? 'text-red' : 'text-teal'}>
                                {formatNumber(totalPnL.profit, decimals.symbol, 0, true)} ({formatNumber(totalPnL.percent, 2, 0, true)}%)
                            </Item>
                        </Row>
                    </div>
                    <CollapseV2 reload={showCustomized} className={`w-full`} isCustom active={partialClose}>
                        <Tooltip id={'pending_closed_volume'} place="top" effect="solid" isV3 className="max-w-[300px]" />
                        <div className="pt-6">
                            <div className="flex items-center justify-between text-sm text-txtSecondary dark:text-txtSecondary mb-2">
                                <div>{t('futures:mobile:adjust_margin:closed_volume')}</div>
                                <div className="space-x-1">
                                    <span>{t('futures:mobile:adjust_margin:est_pnl')}:</span>
                                    <span className={general.est_pnl < 0 ? 'text-red' : 'text-teal'}>
                                        {formatNumber(general.est_pnl, decimals.symbol, 0, true)} {quoteAsset}
                                    </span>
                                </div>
                            </div>
                            <div className={classNames('mb-3 flex items-center')}>
                                <TradingInput
                                    headContainerClassName="!border-0"
                                    renderHead={
                                        <div className={changeClass}>
                                            <Minus
                                                size={16}
                                                className="fill-current text-txtSecondary dark:text-txtSecondary-dark cursor-pointer"
                                                onClick={() => volume > minQuoteQty && setVolume((prevState) => Number(prevState) - Number(minQuoteQty))}
                                            />
                                        </div>
                                    }
                                    renderTail={
                                        <div className={changeClass}>
                                            <Plus
                                                size={16}
                                                className="fill-current text-txtSecondary dark:text-txtSecondary-dark cursor-pointer"
                                                onClick={() => volume < maxQuoteQty && setVolume((prevState) => Number(prevState) + Number(minQuoteQty))}
                                            />
                                        </div>
                                    }
                                    value={volume}
                                    decimalScale={decimals.symbol}
                                    allowNegative={false}
                                    thousandSeparator={true}
                                    containerClassName="px-2.5 dark:!bg-dark-2 w-full"
                                    inputClassName="!text-center"
                                    onValueChange={({ value }) => onChangeVolume(value)}
                                    inputMode="decimal"
                                    validator={_validator('quoteQty')}
                                    textDescription={textDescription('quoteQty', { min: minQuoteQty, max: maxQuoteQty })}
                                    errorTooltip={false}
                                    allowedDecimalSeparators={[',', '.']}
                                    clearAble
                                />
                            </div>
                            <div className="w-full pl-1">
                                <Slider
                                    useLabel
                                    positionLabel="top"
                                    labelSuffix="%"
                                    x={percent}
                                    axis="x"
                                    xmax={100}
                                    xmin={0}
                                    onChange={({ x }) => onChangePercent(x)}
                                    dots={4}
                                />
                            </div>
                        </div>
                        <CollapseV2
                            className="w-full"
                            isCustom
                            active={showCustomized}
                            label={
                                <div
                                    className="font-semibold flex items-center space-x-2 cursor-pointer w-max pt-6"
                                    onClick={() => setShowCustomized(!showCustomized)}
                                >
                                    <span>{t('futures:mobile:adjust_margin:advanced_custom')}</span>
                                    <ChevronDown size={16} className={`${showCustomized ? '!rotate-0' : ''} transition-all`} />
                                </div>
                            }
                        >
                            {showCustomized && (
                                <div className="pt-4 grid grid-cols-12 gap-3">
                                    <div className="space-y-2 col-span-3">
                                        <div className="text-sm text-txtSecondary dark:text-txtSecondary-dark">{t('common:order_type')}</div>
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
                                    <div className="space-y-2 col-span-9">
                                        <div className="text-sm text-txtSecondary dark:text-txtSecondary-dark">{t('common:price')}</div>
                                        <TradingInput
                                            value={type === VndcFutureOrderType.Type.MARKET ? t('futures:market') : price}
                                            decimalScale={decimals.price}
                                            allowNegative={false}
                                            thousandSeparator={true}
                                            containerClassName="px-2.5 dark:!bg-dark-2 w-full"
                                            inputClassName="!text-left !ml-0"
                                            onValueChange={({ value }) => setPrice(value)}
                                            disabled={type === VndcFutureOrderType.Type.MARKET}
                                            validator={_validator('price')}
                                            textDescription={textDescription('price', _validator('price', true))}
                                            errorTooltip={false}
                                            renderTail={() => <span className={`text-txtSecondary dark:text-txtSecondary-dark`}>{quoteAsset}</span>}
                                            allowedDecimalSeparators={[',', '.']}
                                            clearAble
                                        />
                                    </div>
                                </div>
                            )}
                        </CollapseV2>
                        <div className="h-[1px] my-6 bg-divider dark:bg-divider-dark w-full" />
                        <div className="flex items-center justify-between">
                            <Row>
                                <Item>{t('futures:mobile:adjust_margin:closed_volume')}</Item>
                                <Item>{formatNumber(volume, decimals.symbol)}</Item>
                            </Row>
                            <Row center>
                                <Item data-tip={t('futures:mobile:adjust_margin:tooltip_pending_close_volume')} data-for="pending_closed_volume" tooltip>
                                    {t('futures:mobile:adjust_margin:pending_closed_volume')}
                                </Item>
                                <Item className="text-center">{formatNumber(general.pendingVol, decimals.symbol)}</Item>
                            </Row>
                            <Row right>
                                <Item>{t('futures:mobile:adjust_margin:remaining_volume')}</Item>
                                <Item>{formatNumber(general.remaining_volume, decimals.symbol)}</Item>
                            </Row>
                        </div>
                    </CollapseV2>
                    <ButtonV2 disabled={isError || loading} onClick={onConfirm} className="mt-10">
                        {t('common:confirm')}
                    </ButtonV2>
                </ModalV2>
            )}
        </>
    );
};

const Row = styled.div.attrs(({ right, center }) => ({
    className: classNames('space-y-2 w-full px-3 first:pl-0 last:pr-0', { 'flex flex-col items-end': right, 'flex flex-col items-center': center })
}))``;

const Item = styled.div.attrs(({ tooltip }) => ({
    className: classNames(`first:text-txtSecondary dark:first:text-txtSecondary-dark last:font-semibold w-max`, {
        'border-b border-dashed border-divider dark:border-divider-dark': tooltip
    })
}))``;

export default FuturesCloseOrder;
