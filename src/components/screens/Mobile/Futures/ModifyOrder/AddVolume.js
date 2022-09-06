import React, { useMemo, useState, useEffect, useRef, useContext } from "react";
import { useTranslation } from "next-i18next";
import { formatNumber, countDecimals } from "redux/actions/utils";
import { useSelector } from "react-redux";
import TradingInput from "components/trade/TradingInput";
import { Minus, Plus, ChevronDown } from "react-feather";
import Slider from "components/trade/InputSlider";
import Button from "components/common/Button";
import colors from "styles/colors";
import floor from "lodash/floor";
import Selectbox from "./Selectbox";
import {
    getTypesLabel,
    VndcFutureOrderType,
    validator
} from "components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType";
import { FuturesOrderTypes } from "redux/reducers/futures";
import { DefaultFuturesFee, } from "redux/actions/const";
import { IconLoading } from "components/common/Icons";
import { API_DCA_ORDER } from "redux/actions/apis";
import { ApiStatus } from "redux/actions/const";
import fetchApi from "utils/fetch-api";
import { AlertContext } from "components/common/layouts/LayoutMobile";
import { getType } from "components/screens/Futures/PlaceOrder/Vndc/OrderButtonsGroupVndc";
import { getMaxQuoteQty } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { createSelector } from 'reselect';
import find from 'lodash/find';

const getPairConfig = createSelector(
    [
        state => state?.futures?.pairConfigs,
        (utils, params) => params
    ],
    (pairConfigs, params) => {
        return find(pairConfigs, { ...params })
    }
);
const AddVolume = ({
    order,
    pairPrice,
    available,
    onClose,
    forceFetchOrder
}) => {
    const { t } = useTranslation();
    const allPairConfigs = useSelector((state) => state?.futures?.pairConfigs);
    const pairConfig = useSelector(state => getPairConfig(state, { pair: order?.symbol }));
    const assetConfig = useSelector((state) => state.utils.assetConfig);
    const lastPrice = pairPrice?.lastPrice ?? 0;
    const { margin = 0, order_value = 0, side, quantity = 0, fee = 0 } = order;
    const [volume, setVolume] = useState();
    const [leverage, setLeverage] = useState(order?.leverage);
    const [type, setType] = useState(String(order?.type).toUpperCase());
    const [price, setPrice] = useState(lastPrice);
    const [percent, setPercent] = useState(1);
    const [showCustomized, setShowCustomized] = useState(false);
    const isChangeSlide = useRef(false);
    const [loading, setLoading] = useState(false);
    const context = useContext(AlertContext);

    const getDecimalPrice = (config) => {
        const decimalScalePrice =
            config?.filters.find((rs) => rs.filterType === "PRICE_FILTER") ?? 1;
        return countDecimals(decimalScalePrice?.tickSize);
    };

    const configSymbol = useMemo(() => {
        const symbol = allPairConfigs.find((rs) => rs.symbol === order.symbol);
        const isVndcFutures = symbol?.quoteAsset === "VNDC";
        const decimalSymbol =
            assetConfig.find((rs) => rs.id === symbol?.quoteAssetId)
                ?.assetDigit ?? 0;
        const decimalScalePrice = getDecimalPrice(symbol);
        return {
            decimalSymbol,
            decimalScalePrice,
            isVndcFutures,
            quoteAsset: symbol?.quoteAsset,
        };
    }, [order]);

    const minQuoteQty = useMemo(() => {
        const initValue = configSymbol.isVndcFutures ? 100000 : 5;
        return pairConfig
            ? +pairConfig?.filters.find(
                (item) => item.filterType === "MIN_NOTIONAL"
            )?.notional
            : initValue;
    }, [pairConfig, configSymbol]);

    useEffect(() => {
        setVolume(minQuoteQty);
    }, [minQuoteQty]);

    useEffect(() => {
        setPercent((volume * 100) / order_value);
    }, [volume]);

    const arrDot = useMemo(() => {
        const size = 200 / 4;
        const arr = [];
        for (let i = 0; i <= 4; i++) {
            arr.push(i * size);
        }
        return arr;
    }, []);

    const onChangeVolume = (value) => {
        if (isChangeSlide.current) {
            isChangeSlide.current = false;
            return;
        }
        setVolume(value);
    };

    const onChangePercent = (x) => {
        isChangeSlide.current = true;
        const _x = arrDot.reduce((prev, curr) => {
            let i = 0;
            if (Math.abs(curr - x) < 2 || Math.abs(prev - x) < 2) {
                i = Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev;
            }
            return i;
        });
        const value = ((+order_value * (_x ? _x : x)) / 100).toFixed(
            configSymbol.decimalSymbol
        );
        setVolume(value);
        setPercent(_x ? _x : x);
    };

    const maxQuoteQty = useMemo(() => {
        const _type = showCustomized ? type : FuturesOrderTypes.Market;
        const _maxQuoteQty = getMaxQuoteQty(
            price,
            _type,
            side,
            leverage,
            available,
            pairPrice,
            pairConfig,
            true, true
        );
        const max = Math.min(leverage * available, _maxQuoteQty);
        return floor(max, configSymbol?.decimalSymbol);
    }, [
        price,
        side,
        leverage,
        available,
        pairPrice,
        pairConfig,
        configSymbol,
        type,
        showCustomized,
    ]);

    const optionsTypes = useMemo(() => {
        const options = [];
        return pairConfig?.orderTypes?.reduce((prev, curr) => {
            options.push({
                title: getTypesLabel(curr, t),
                value: curr,
            });
            return options;
        }, []);
    }, [pairConfig, t]);

    const general = useMemo(() => {
        const _price =
            type === FuturesOrderTypes.Market || !showCustomized
                ? lastPrice
                : price;
        const _margin = margin + volume / leverage;
        const _quantity = volume / _price + quantity;
        const AvePrice =
            ((volume / _price) * _price + quantity * order.price) / _quantity;
        const size =
            side === VndcFutureOrderType.Side.SELL ? -_quantity : _quantity;
        const number = side === VndcFutureOrderType.Side.SELL ? -1 : 1;
        const liqPrice =
            (size * AvePrice + fee - _margin) /
            (_quantity * (number - DefaultFuturesFee.NamiFrameOnus));
        return {
            margin: _margin,
            AvePrice: AvePrice,
            liqPrice: liqPrice,
        };
    }, [
        margin,
        volume,
        leverage,
        side,
        quantity,
        fee,
        price,
        lastPrice,
        type,
        showCustomized,
    ]);

    useEffect(() => {
        setPrice(lastPrice);
        setLeverage(order.leverage);
        setType(String(order?.type).toUpperCase());
    }, [showCustomized]);

    const onConfirm = async () => {
        if (isError) return;
        const params = {
            displaying_id: order?.displaying_id,
            type: getType(showCustomized ? type : FuturesOrderTypes.Market),
            leverage: +leverage,
            price: +price,
            useQuoteQty: true,
            quoteQty: +volume,
        };
        setLoading(true);
        try {
            const { status, data, message } = await fetchApi({
                url: API_DCA_ORDER,
                options: { method: "PUT" },
                params: params,
            });
            if (status === ApiStatus.SUCCESS) {
                context.alert.show("success",
                    t("futures:mobile:adjust_margin:add_volume_success"),
                    t("futures:mobile:adjust_margin:add_volume_success_message"),
                    null, null,
                    () => {
                        onClose()
                        // if (forceFetchOrder) forceFetchOrder()
                    }
                );
            } else {
                const requestId =
                    data?.requestId && `(${data?.requestId.substring(0, 8)})`;
                context.alert.show("error", t("common:failed"), t(`error:futures:${status || "UNKNOWN"}`), requestId);
            }
        } catch (e) {
            if (e.message === "Network Error" || !navigator?.onLine) {
                context.alert.show(
                    "error",
                    t("common:failed"),
                    t("error:futures:NETWORK_ERROR")
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const _validator = () => {
        return validator('price', price, type, side, lastPrice, pairConfig, configSymbol.decimalScalePrice, t)
    }

    const changeClass = `w-5 h-5 flex items-center justify-center rounded-md`;
    const isError =
        (available && (volume < +minQuoteQty || volume > +maxQuoteQty)) ||
        leverage > pairConfig?.leverageConfig.max ||
        leverage < pairConfig?.leverageConfig.min ||
        (!_validator()?.isValid && showCustomized && type !== FuturesOrderTypes.Market) ||
        loading;

    const getLabel = (type) => {
        if (type !== FuturesOrderTypes.Market) return t('common:price')
        return t('common:price') + ' ' + String(getTypesLabel(type, t)).toLowerCase()
    }

    return (
        <div className="px-4 mt-3">
            <div className="text-onus-green font-semibold relative w-max bottom-[-13px] bg-onus-bgModal px-[6px] left-[9px]">
                {order?.symbol} {order?.leverage}x
            </div>
            <div className="border border-onus-bg2 p-4 rounded-lg">
                <div className="text-sm flex items-center justify-between">
                    <span className="text-onus-grey">
                        {t("futures:order_table:open_price")}
                    </span>
                    <span className="font-medium">
                        {formatNumber(
                            order?.price,
                            configSymbol.decimalScalePrice,
                            0,
                            true
                        )}
                    </span>
                </div>
                <div className="h-[1px] bg-onus-bg2 w-full my-3"></div>
                <div className="text-sm flex items-center justify-between">
                    <span className="text-onus-grey">
                        {t("futures:mobile:adjust_margin:current_volume")}
                    </span>
                    <span className="font-medium">
                        {formatNumber(
                            order_value,
                            configSymbol.decimalSymbol,
                            0,
                            true
                        )}
                    </span>
                </div>
            </div>

            <div className="mt-8">
                <div className="uppercase text-xs text-onus-grey mb-2">
                    {t('futures:mobile:adjust_margin:added_volume_2')}
                </div>
                <div className="px-4 mb-3 h-[44px] flex items-center bg-onus-bg2 rounded-md">
                    <div className={changeClass}>
                        <Minus
                            size={15}
                            className="text-onus-white cursor-pointer"
                            onClick={() => volume > minQuoteQty && available &&
                                setVolume((prevState) => Number(prevState) - Number(minQuoteQty))
                            }
                        />
                    </div>
                    <TradingInput
                        onusMode={true}
                        label={' '}
                        value={volume}
                        decimalScale={configSymbol.decimalSymbol}
                        allowNegative={false}
                        thousandSeparator={true}
                        containerClassName="px-2.5 flex-grow text-sm font-medium border-none h-[44px] w-[200px] !bg-onus-bg2"
                        inputClassName="!text-center"
                        onValueChange={({ value }) => onChangeVolume(value)}
                        disabled={!available}
                        autoFocus
                        inputMode="decimal"
                        allowedDecimalSeparators={[",", "."]}
                    />
                    <div className={changeClass}>
                        <Plus
                            size={15}
                            className="text-onus-white cursor-pointer"
                            onClick={() => volume < maxQuoteQty && available &&
                                setVolume((prevState) => Number(prevState) + Number(minQuoteQty))
                            }
                        />
                    </div>
                </div>
                <Slider
                    useLabel
                    positionLabel="top"
                    onusMode
                    labelSuffix="%"
                    x={percent}
                    axis="x"
                    xmax={200}
                    xmin={0}
                    onChange={({ x }) => available && onChangePercent(x)}
                    bgColorActive={colors.onus.slider}
                    bgColorSlide={colors.onus.slider}
                    dots={4}
                />
            </div>
            <div className="mt-6 flex flex-col space-y-4">
                <div
                    className="text-sm font-semibold flex items-center space-x-2"
                    onClick={() => setShowCustomized(!showCustomized)}
                >
                    <span>
                        {t("futures:mobile:adjust_margin:advanced_custom")}
                    </span>
                    <ChevronDown
                        color={colors.onus.grey}
                        size={16}
                        className={`${showCustomized ? "rotate-180" : ""} transition-all`}
                    />
                </div>
                {showCustomized && (
                    <>
                        <div className="flex items-center space-x-4">
                            <Selectbox
                                options={optionsTypes}
                                value={type}
                                onChange={(e) => {
                                    setType(e);
                                    setPrice(lastPrice);
                                }}
                                keyExpr="value"
                                displayExpr="title"
                                className="max-w-[8.75rem]"
                            />
                            <div className="px-4 h-[44px] flex items-center justify-between bg-onus-bg2 rounded-md w-[calc(100%-8.75rem)]">
                                <div className={changeClass}>
                                    <Minus
                                        size={15}
                                        className="text-onus-white cursor-pointer"
                                        onClick={() =>
                                            leverage > pairConfig?.leverageConfig.min &&
                                            setLeverage((prevState) => Number(prevState) - 1)
                                        }
                                    />
                                </div>
                                <TradingInput
                                    onusMode={true}
                                    label=" "
                                    value={leverage}
                                    decimalScale={0}
                                    allowNegative={false}
                                    thousandSeparator={true}
                                    containerClassName="px-2.5 flex-grow text-sm font-medium border-none h-[44px] !bg-onus-bg2 max-w-[6.25rem] min-w-[50px]"
                                    inputClassName="!text-center"
                                    onValueChange={({ value }) => setLeverage(value)}
                                    disabled={!available}
                                    autoFocus
                                    inputMode="decimal"
                                    suffix={'x'}
                                    allowedDecimalSeparators={[",", "."]}
                                />
                                <div className={changeClass}>
                                    <Plus
                                        size={15}
                                        className="text-onus-white cursor-pointer"
                                        onClick={() =>
                                            leverage < pairConfig?.leverageConfig.max &&
                                            setLeverage((prevState) => Number(prevState) + 1)
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <TradingInput
                            onusMode={true}
                            value={type === FuturesOrderTypes.Market ? "" : price}
                            decimalScale={configSymbol.decimalScalePrice}
                            allowNegative={false}
                            thousandSeparator={true}
                            containerClassName="px-2.5 flex-grow text-sm font-medium h-[44px] border-none !bg-onus-bg2 min-w-[50px]"
                            inputClassName="!text-center"
                            onValueChange={({ value }) => setPrice(value)}
                            disabled={type === FuturesOrderTypes.Market}
                            autoFocus
                            validator={_validator()}
                            labelClassName="!text-sm capitalize"
                            label={getLabel(type)}
                            renderTail={() => (
                                <span className={`font-medium pl-2 text-onus-grey`}>
                                    {configSymbol?.quoteAsset}
                                </span>
                            )}
                            allowedDecimalSeparators={[",", "."]}
                        />
                    </>
                )}
            </div>
            <div className="mt-8 flex flex-col space-y-2 text-xs">
                <div className="flex items-center">
                    <span className="text-onus-grey">
                        {t("futures:mobile:market_price")}:
                    </span>
                    &nbsp;
                    <span className="font-medium">
                        {formatNumber(lastPrice, configSymbol.decimalScalePrice, 0, true)}
                        &nbsp;
                        {configSymbol?.quoteAsset}
                    </span>
                </div>
                <div className="flex items-center">
                    <span className="text-onus-grey">
                        {t("futures:margin")}:
                    </span>
                    &nbsp;
                    <span className="font-medium">
                        {formatNumber(general.margin, configSymbol.decimalSymbol, 0, true)}
                        &nbsp;
                        {configSymbol?.quoteAsset}
                    </span>
                </div>
                <div className="flex items-center">
                    <span className="text-onus-grey">
                        {t("futures:mobile:adjust_margin:average_open_price")}
                    </span>
                    &nbsp;
                    <span className="font-medium">
                        {formatNumber(
                            general.AvePrice,
                            configSymbol.decimalScalePrice,
                            0,
                            true
                        )}
                        &nbsp;
                        {configSymbol?.quoteAsset}
                    </span>
                </div>
                <div className="flex items-center">
                    <span className="text-onus-grey">
                        {t("futures:mobile:adjust_margin:new_liq_price")}
                    </span>
                    &nbsp;
                    <span className="font-medium">
                        {formatNumber(
                            general.liqPrice,
                            configSymbol.decimalSymbol,
                            0,
                            true
                        )}
                        &nbsp;
                        {configSymbol?.quoteAsset}
                    </span>
                </div>

                <div className="flex items-center">
                    <span className="text-onus-grey">
                        {t("futures:mobile:available")}:
                    </span>
                    &nbsp;
                    <span className="font-medium">
                        {formatNumber(
                            available,
                            configSymbol.decimalSymbol,
                            0,
                            true
                        )}
                        &nbsp;
                        {configSymbol?.quoteAsset}
                    </span>
                </div>
            </div>
            <div className="mt-6">
                <Button
                    onusMode={true}
                    title={
                        <div className="flex items-center justify-center">
                            {loading ? (
                                <IconLoading color="#FFFFFF" className="!m-0" />
                            ) : (
                                t("futures:leverage:confirm")
                            )}
                        </div>
                    }
                    componentType="button"
                    className={`!h-[3rem] !text-base !font-semibold`}
                    type="primary"
                    disabled={isError}
                    onClick={onConfirm}
                />
            </div>
        </div>
    );
};

export default AddVolume;
