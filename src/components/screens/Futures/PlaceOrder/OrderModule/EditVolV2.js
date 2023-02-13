import React, { useMemo, useState, useRef, useEffect } from 'react';
import ModalV2 from 'components/common/V2/ModalV2';
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';
import { useTranslation } from 'next-i18next';
import { formatNumber, getType } from 'redux/actions/utils';
import { createSelector } from 'reselect';
import find from 'lodash/find';
import { DefaultFuturesFee } from 'redux/actions/const';
import { useSelector } from 'react-redux';
import { Minus, Plus } from 'react-feather';
import TradingInput from 'components/trade/TradingInput';
import Slider from 'components/trade/InputSlider';
import { getMaxQuoteQty } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import floor from 'lodash/floor';
import ChevronDown from 'components/svg/ChevronDown';
import { getTypesLabel, VndcFutureOrderType, validator } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import SelectV2 from 'components/common/V2/SelectV2';
import CollapseV2 from 'components/common/V2/CollapseV2';

const tabs = [
    { label: 'futures:mobile:adjust_margin:add_volume', value: 'vol' },
    { label: 'futures:margin', value: 'margin' }
];

const getPairConfig = createSelector([(state) => state?.futures?.pairConfigs, (utils, params) => params], (pairConfigs, params) => {
    return find(pairConfigs, { ...params });
});

const getAvailable = createSelector([(state) => state.wallet?.FUTURES, (utils, params) => params], (wallet, params) => {
    const _avlb = wallet?.[params.assetId];
    return _avlb ? Math.max(_avlb?.value, 0) - Math.max(_avlb?.locked_value, 0) : 0;
});
const EditVolV2 = ({ isVisible, onClose, order, status, lastPrice, decimals, onConfirm, pairTicker }) => {
    const { t } = useTranslation();
    const [tab, setTab] = useState('vol');
    const pairConfig = useSelector((state) => getPairConfig(state, { pair: order?.symbol }));
    const available = useSelector((state) => getAvailable(state, { assetId: pairConfig?.quoteAssetId }));
    const _lastPrice = pairTicker ? pairTicker[order?.symbol]?.lastPrice : lastPrice;
    const quoteAsset = pairTicker ? pairTicker[order?.symbol]?.quoteAsset : order?.quoteAsset;
    const order_value = order?.order_value ?? 0;
    const side = order?.side;
    const margin = order?.margin ?? 0;
    const quantity = order?.quantity ?? 0;

    const [volume, setVolume] = useState();
    const [leverage, setLeverage] = useState(order?.leverage);
    const [type, setType] = useState(order?.type);
    const [price, setPrice] = useState(_lastPrice);
    const [percent, setPercent] = useState(1);
    const [showCustomized, setShowCustomized] = useState(false);
    const isChangeSlide = useRef(false);

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
        if (!isVisible) return;
        setType(order?.type);
        setLeverage(order?.leverage);
        setPrice(_lastPrice);
        setPercent(1);
        setShowCustomized(false);
    }, [isVisible]);

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
        setVolume(value);
        setPercent(_x ? _x : x);
    };

    const fee = useMemo(() => {
        const _fee = order?.fee ?? 0;
        // const funding = order?.funding_fee?.margin ? Math.abs(order?.funding_fee?.margin) : 0
        return _fee;
    }, [order]);

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

    const changeClass = `w-5 h-5 flex items-center justify-center rounded-md`;

    return (
        <ModalV2 className="!max-w-[800px]" isVisible={isVisible} onBackdropCb={onClose}>
            <div className="text-2xl font-semibold mb-2">Điều chỉnh lệnh</div>
            <Tabs isDark tab={tab} className="gap-8 border-b border-divider-dark">
                {tabs?.map((item) => (
                    <TabItem className="!text-left !px-0" value={item.value} onClick={(isClick) => isClick && setTab(item.value)}>
                        {t(item.label)}
                    </TabItem>
                ))}
            </Tabs>
            <div className="mt-6">
                <div className="grid grid-cols-2 gap-11">
                    <div className="max-h-[518px] overflow-y-auto overflow-x-hidden space-y-6">
                        <div>
                            <div className="text-teal text-lg font-semibold relative w-max bottom-[-13px] px-[6px] left-[9px] bg-bgSpotContainer-dark">
                                {order?.symbol} {order?.leverage}x
                            </div>
                            <div className="border border-divider-dark p-4 rounded-md">
                                <div className="flex items-center justify-between">
                                    <span className="text-txtSecondary-dark">{t('futures:order_table:open_price')}</span>
                                    <span className="font-semibold">{formatNumber(order?.open_price, decimals.price, 0, true)}</span>
                                </div>
                                <div className="h-[1px] bg-divider-dark w-full my-3"></div>
                                <div className="flex items-center justify-between">
                                    <span className="text-txtSecondary-dark">{t('futures:mobile:adjust_margin:current_volume')}</span>
                                    <span className="font-semibold">{formatNumber(order?.order_value, decimals.symbol, 0, true)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="text-sm text-txtSecondary-dark mb-2">{t('futures:mobile:adjust_margin:added_volume_2')}</div>
                            <div className="px-4 mb-3 flex items-center bg-dark-2 rounded-md">
                                <div className={changeClass}>
                                    <Minus
                                        size={15}
                                        className="text-onus-white cursor-pointer"
                                        onClick={() => volume > minQuoteQty && available && setVolume((prevState) => Number(prevState) - Number(minQuoteQty))}
                                    />
                                </div>
                                <TradingInput
                                    value={volume}
                                    decimalScale={decimals.symbol}
                                    allowNegative={false}
                                    thousandSeparator={true}
                                    containerClassName="px-2.5 !bg-dark-2 w-full"
                                    inputClassName="!text-center"
                                    onValueChange={({ value }) => onChangeVolume(value)}
                                    disabled={!available}
                                    inputMode="decimal"
                                    allowedDecimalSeparators={[',', '.']}
                                />
                                <div className={changeClass}>
                                    <Plus
                                        size={15}
                                        className="text-onus-white cursor-pointer"
                                        onClick={() => volume < maxQuoteQty && available && setVolume((prevState) => Number(prevState) + Number(minQuoteQty))}
                                    />
                                </div>
                            </div>
                            <div className="w-full px-2">
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
                                            <div className="text-sm text-txtSecondary-dark">{t('futures:leverage:leverage')}</div>
                                            <div className="px-4 flex items-center bg-dark-2 rounded-md">
                                                <div className={changeClass}>
                                                    <Minus
                                                        size={15}
                                                        className="text-onus-white cursor-pointer"
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
                                                    inputClassName="!text-center w-full"
                                                    containerClassName="px-2.5 !bg-dark-2 w-full"
                                                    onValueChange={({ value }) => setLeverage(value)}
                                                    disabled={!available}
                                                    inputMode="decimal"
                                                    suffix={'x'}
                                                    allowedDecimalSeparators={[',', '.']}
                                                />
                                                <div className={changeClass}>
                                                    <Plus
                                                        size={15}
                                                        className="text-onus-white cursor-pointer"
                                                        onClick={() =>
                                                            leverage < pairConfig?.leverageConfig.max && setLeverage((prevState) => Number(prevState) + 1)
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2 mt-4">
                                        <div className="text-sm text-txtSecondary-dark">{t('common:price')}</div>
                                        <TradingInput
                                            value={type === VndcFutureOrderType.Type.MARKET ? '' : price}
                                            decimalScale={decimals.price}
                                            allowNegative={false}
                                            thousandSeparator={true}
                                            containerClassName="px-2.5 !bg-dark-2 w-full"
                                            inputClassName="!text-center"
                                            onValueChange={({ value }) => setPrice(value)}
                                            disabled={type === VndcFutureOrderType.Type.MARKET}
                                            // validator={_validator()}
                                            renderTail={() => <span className={`text-txtSecondary-dark`}>{quoteAsset}</span>}
                                            allowedDecimalSeparators={[',', '.']}
                                        />
                                    </div>
                                </>
                            </CollapseV2>
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-darkBlue-3 text-base">
                        <div className="font-semibold mb-6">{t('futures:calulator:result')}</div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="text-txtSecondary-dark">{t('futures:tp_sl:mark_price')}</div>
                                <div className="font-semibold">
                                    {formatNumber(_lastPrice, decimals.symbol, 0, true)} {quoteAsset}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-txtSecondary-dark">{t('futures:margin')}</div>
                                <div className="font-semibold">
                                    {formatNumber(general.margin, decimals.symbol, 0, true)} {quoteAsset}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-txtSecondary-dark">{t('futures:mobile:adjust_margin:average_open_price')}</div>
                                <div className="font-semibold">
                                    {formatNumber(general.AvePrice, decimals.symbol, 0, true)} {quoteAsset}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-txtSecondary-dark">{t('futures:mobile:adjust_margin:new_liq_price')}</div>
                                <div className="font-semibold">
                                    {formatNumber(general.liqPrice, decimals.symbol, 0, true)} {quoteAsset}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-txtSecondary-dark">{t('futures:mobile:available')}</div>
                                <div className="font-semibold">
                                    {formatNumber(available, decimals.symbol, 0, true)} {quoteAsset}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ModalV2>
    );
};

export default EditVolV2;
