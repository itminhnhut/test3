import React, { useMemo, useState, useEffect, useContext } from 'react';
import Modal from 'components/common/ReModal';
import Button from 'components/common/Button';
import { useTranslation } from 'next-i18next';
import { formatNumber, countDecimals, getS3Url, emitWebViewEvent } from "redux/actions/utils";
import { useSelector } from 'react-redux';
import Switcher from 'components/common/Switcher';
import TradingInput from "components/trade/TradingInput";
import { Minus, Plus, ChevronDown } from "react-feather";
import Slider from "components/trade/InputSlider";
import colors from "styles/colors";
import { useRef } from 'react';
import Selectbox from "./ModifyOrder/Selectbox";
import { getTypesLabel, validator, getProfitVndc, VndcFutureOrderType } from "components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType";
import { FuturesOrderTypes } from "redux/reducers/futures";
import { AlertContext } from "components/common/layouts/LayoutMobile";
import { getType } from "components/screens/Futures/PlaceOrder/Vndc/OrderButtonsGroupVndc";
import { IconLoading } from "components/common/Icons";
import { API_PARTIAL_CLOSE_ORDER, API_GET_FUTURES_ORDER } from "redux/actions/apis";
import { ApiStatus, DefaultFuturesFee } from "redux/actions/const";
import fetchApi from "utils/fetch-api";
import { createSelector } from 'reselect';
import find from 'lodash/find';
import Tooltip from 'components/common/Tooltip';
import { getShareModalData } from 'components/screens/Mobile/Futures/TabOrders/ShareFutureMobile';

const getPairConfig = createSelector(
    [
        state => state?.futures?.pairConfigs,
        (utils, params) => params
    ],
    (pairConfigs, params) => {
        return find(pairConfigs, { ...params })
    }
);

const CloseOrderModalMobile = ({ onClose, pairPrice, order, forceFetchOrder }) => {
    const { t } = useTranslation();
    const side = order?.side;
    const order_value = order?.order_value ?? 0;
    const lastPrice = pairPrice?.lastPrice;
    const allPairConfigs = useSelector((state) => state?.futures?.pairConfigs);
    const pairConfig = useSelector(state => getPairConfig(state, { pair: order?.symbol }));
    const assetConfig = useSelector((state) => state.utils.assetConfig);
    const [partialClose, setPartialClose] = useState(false);
    const [volume, setVolume] = useState();
    const [type, setType] = useState(String(order?.type).toUpperCase());
    const [price, setPrice] = useState(lastPrice)
    const isChangeSlide = useRef(false);
    const [percent, setPercent] = useState(1);
    const [showCustomized, setShowCustomized] = useState(false);
    const [loading, setLoading] = useState(false);
    const context = useContext(AlertContext);

    const getDecimalPrice = (config) => {
        const decimalScalePrice =
            config?.filters.find((rs) => rs.filterType === "PRICE_FILTER") ?? 1;
        return countDecimals(decimalScalePrice?.tickSize);
    };

    const configSymbol = useMemo(() => {
        const symbol = allPairConfigs.find((rs) => rs.symbol === order?.symbol);
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
        return pairConfig ? pairConfig?.filters.find((item) => item.filterType === "MIN_NOTIONAL")?.notional
            : initValue;
    }, [pairConfig, configSymbol]);

    const maxQuoteQty = useMemo(() => {
        const pendingVol = order?.metadata?.partial_close_metadata?.partial_close_orders?.reduce((pre, { close_volume = 0, status }) => {
            return pre + (status === VndcFutureOrderType.Status.PENDING ? close_volume : 0)
        }, 0)
        return order_value - (pendingVol ?? 0);

    }, [order]);

    useEffect(() => {
        setVolume(maxQuoteQty < minQuoteQty ? maxQuoteQty : minQuoteQty);
    }, [minQuoteQty, maxQuoteQty]);

    useEffect(() => {
        setShowCustomized(false);
    }, [partialClose])

    useEffect(() => {
        setPrice(lastPrice);
        setType(String(order?.type).toUpperCase());
    }, [showCustomized]);

    const arrDot = useMemo(() => {
        const size = 100 / 4;
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
        setVolume(+value);
        setPercent((value * 100) / maxQuoteQty);
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
        const value = ((+maxQuoteQty * (_x ? _x : x)) / 100).toFixed(
            configSymbol.decimalSymbol
        );
        setVolume(+value);
        setPercent(_x ? _x : x);
    };

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
        const profit = getProfitVndc(order, side === VndcFutureOrderType.Side.BUY ? pairPrice?.bid : pairPrice?.ask, true);
        const formatProfit = formatNumber(profit, configSymbol.isVndcFutures ? configSymbol.decimalSymbol : configSymbol.decimalSymbol + 2, 0, true)
        const totalPercent = (formatProfit > 0 ? '+' : '-') + formatNumber(Math.abs(profit / order?.margin) * 100, 2, 0, true)
        let est_pnl = 0;
        if (type !== FuturesOrderTypes.Market) {
            const _price = +price
            const size = volume / _price;
            if (side === VndcFutureOrderType.Side.BUY) {
                est_pnl = size * (_price - order?.open_price) - size * (_price + order?.open_price) * DefaultFuturesFee.NamiFrameOnus
            } else {
                est_pnl = size * (order?.open_price - _price) - size * (_price + order?.open_price) * DefaultFuturesFee.NamiFrameOnus
            }
        } else {
            est_pnl = (percent / 100) * profit;
        }
        return {
            remaining_volume: maxQuoteQty - volume,
            percent: totalPercent,
            profit: +profit,
            formatProfit: formatProfit,
            est_pnl: est_pnl,
            pendingVol: order_value - maxQuoteQty
        }
    }, [volume, order, percent, pairPrice, configSymbol, price, type, maxQuoteQty])

    const _validator = () => {
        const _side = side === VndcFutureOrderType.Side.BUY ? VndcFutureOrderType.Side.SELL : VndcFutureOrderType.Side.BUY
        return validator('price', price, type, _side, lastPrice, pairConfig, configSymbol.decimalScalePrice, t)
    }

    const onConfirm = async () => {
        if (isError) return;
        const params = {
            displaying_id: order?.displaying_id,
            closeType: getType(showCustomized ? type : FuturesOrderTypes.Market),
            price: +price,
            useQuoteQty: true,
            closeVolume: +volume,
            special_mode: 1
        };
        const isPartialClose = partialClose && percent < 100
        setLoading(true)
        try {
            const { status, data, message } = await fetchApi({
                url: isPartialClose ? API_PARTIAL_CLOSE_ORDER : API_GET_FUTURES_ORDER,
                options: { method: isPartialClose ? "POST" : "DELETE" },
                params: params,
            });
            if (status === ApiStatus.SUCCESS) {
                if (isPartialClose) {
                    context.alert.show("success",
                        t("futures:mobile:adjust_margin:add_volume_success"),
                        t("futures:mobile:adjust_margin:partially_closed_success_message"),
                        null, null,
                        () => {
                            onClose()
                            // if (forceFetchOrder) forceFetchOrder()
                        }
                    );
                } else {
                    context.alert.show('success',
                        t('futures:close_order:modal_title', { value: order?.displaying_id }),
                        t('futures:close_order:request_successfully', { value: order?.displaying_id }),
                        null, null,
                        () => {
                            onClose()
                            if (forceFetchOrder) forceFetchOrder()
                        }
                    );
                }
            } else {
                const requestId = data?.requestId && `(${data?.requestId.substring(0, 8)})`;
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
    }

    const getLabel = (type) => {
        if (type !== FuturesOrderTypes.Market) return t('common:price')
        return t('common:price') + ' ' + String(getTypesLabel(type, t)).toLowerCase()
    }

    const openShare = () => {
        const shareData = {
            ...order,
            side: side === VndcFutureOrderType.Side.BUY ? VndcFutureOrderType.Side.SELL : VndcFutureOrderType.Side.BUY,
            profit: general?.est_pnl,
            status: VndcFutureOrderType.Status.CLOSED
        }
        const emitData = getShareModalData({
            order: shareData,
            pairPrice: pairPrice
        });
        emitWebViewEvent(JSON.stringify(emitData));
    };

    const changeClass = `w-5 h-5 flex items-center justify-center rounded-md`;
    const isError = ((maxQuoteQty > volume || volume > maxQuoteQty) && partialClose && (volume > maxQuoteQty || !volume || volume < minQuoteQty ||
        (!_validator()?.isValid && showCustomized && type !== FuturesOrderTypes.Market))) || loading;

    return (
        <Modal onusMode={true} isVisible={true} onBackdropCb={onClose}
        >
            <div className="flex flex-col ">
                <div className="text-lg text-onus-white font-bold leading-6 mb-3">
                    {t("futures:mobile:adjust_margin:close_position")}
                </div>
                <div className="text-onus-green font-semibold relative w-max bottom-[-13px] bg-onus-bgModal px-[6px] left-[9px]">
                    {order?.symbol} {order?.leverage}x
                </div>
                <div className="border border-onus-bg2 p-4 rounded-lg">
                    <div className="text-sm flex items-center justify-between">
                        <span className="text-onus-grey"> {t("futures:mobile:market_price")} </span>
                        <span className="font-medium">
                            {formatNumber(lastPrice, configSymbol.decimalScalePrice, 0, true)}
                        </span>
                    </div>
                    <div className="h-[1px] bg-onus-bg2 w-full my-3"></div>
                    <div className="text-sm flex items-center justify-between">
                        <span className="text-onus-grey">
                            {t("futures:mobile:adjust_margin:current_volume")}
                        </span>
                        <span className="font-medium">
                            {formatNumber(order_value, configSymbol.decimalSymbol, 0, true)}
                        </span>
                    </div>
                    <div className="h-[1px] bg-onus-bg2 w-full my-3"></div>
                    <div className="text-sm flex items-center justify-between">
                        <span className="text-onus-grey whitespace-nowrap">
                            {t("futures:mobile:adjust_margin:est_pnl")}
                        </span>
                        {general.profit ?
                            <div className={`text-sm font-semibold ${general.profit > 0 ? 'text-onus-green' : 'text-onus-red'}`}>
                                {general.formatProfit} ({general.percent}%)
                            </div>
                            : <div className="text-sm font-semibold">-</div>
                        }
                    </div>
                </div>
                {order?.status === 1 &&
                    <div className="mt-8">
                        <div className="flex items-center space-x-2">
                            <div className="font-semibold">{t('futures:mobile:adjust_margin:close_partially')}</div>
                            <Switcher onusMode addClass="!bg-onus-white w-[22px] h-[22px]"
                                wrapperClass="min-h-[24px] !h-6 min-w-[48px]"
                                active={partialClose} onChange={() => setPartialClose(!partialClose)} />
                        </div>
                        {partialClose && <>
                            <div className="mt-6">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="uppercase text-xs text-onus-grey">
                                        {t('futures:mobile:adjust_margin:closed_volume')}
                                    </div>
                                    <div className="flex items-center text-xs">
                                        <span className="text-onus-grey">{t("futures:mobile:adjust_margin:est_pnl")}:</span>&nbsp;
                                        <span className={general.est_pnl > 0 ? "text-onus-green" : "text-onus-red"}>{formatNumber(general.est_pnl, 4, 0, true)}</span>
                                    </div>
                                </div>
                                <div className="px-4 mb-3 h-[44px] flex items-center bg-onus-bg2 rounded-md">
                                    <div className={changeClass}>
                                        <Minus
                                            size={15}
                                            className="text-onus-white cursor-pointer"
                                            onClick={() => volume > minQuoteQty &&
                                                setVolume((prevState) => Number(prevState) - Number(minQuoteQty))
                                            }
                                        />
                                    </div>
                                    <TradingInput
                                        onusMode={true}
                                        label=" "
                                        value={volume}
                                        decimalScale={configSymbol.decimalSymbol}
                                        allowNegative={false}
                                        thousandSeparator={true}
                                        containerClassName="px-2.5 flex-grow text-sm font-medium border-none h-[44px] w-[200px] !bg-onus-bg2"
                                        inputClassName="!text-center"
                                        onValueChange={({ value }) => onChangeVolume(value)}
                                        autoFocus
                                        inputMode="decimal"
                                        allowedDecimalSeparators={[",", "."]}
                                    />
                                    <div className={changeClass}>
                                        <Plus
                                            size={15}
                                            className="text-onus-white cursor-pointer"
                                            onClick={() => volume < order_value &&
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
                                    xmax={100}
                                    xmin={0}
                                    onChange={({ x }) => onChangePercent(x)}
                                    bgColorActive={colors.onus.slider}
                                    bgColorSlide={colors.onus.slider}
                                    dots={4}
                                />
                            </div>
                            <div className="mt-6 flex flex-col space-y-4">
                                <div className="text-sm font-semibold flex items-center space-x-2"
                                    onClick={() => setShowCustomized(!showCustomized)}
                                >
                                    <span> {t("futures:mobile:adjust_margin:advanced_custom")} </span>
                                    <ChevronDown
                                        color={colors.onus.grey}
                                        size={16}
                                        className={`${showCustomized ? "rotate-180" : ""} transition-all`}
                                    />
                                </div>
                                {showCustomized &&
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
                                        <TradingInput
                                            onusMode={true}
                                            value={type === FuturesOrderTypes.Market ? "" : price}
                                            decimalScale={configSymbol.decimalScalePrice}
                                            allowNegative={false}
                                            thousandSeparator={true}
                                            containerClassName="px-2.5 flex-grow text-sm font-medium border-none h-[44px] !bg-onus-bg2 w-[calc(100%-9.75rem)]"
                                            inputClassName="!text-left"
                                            placeholder={getLabel(type)}
                                            onValueChange={({ value }) => setPrice(value)}
                                            disabled={type === FuturesOrderTypes.Market}
                                            autoFocus
                                            validator={_validator()}
                                            labelClassName="!text-sm capitalize"
                                            label={' '}
                                            renderTail={() => (
                                                <span className={`font-medium pl-2 text-onus-grey`}>
                                                    {configSymbol?.quoteAsset}
                                                </span>
                                            )}
                                            allowedDecimalSeparators={[",", "."]}
                                        />
                                    </div>
                                }
                            </div>
                            <Tooltip id="pending-vol" place="top" effect="solid" backgroundColor="bg-darkBlue-4"
                                className="!mx-7 !-mt-2 !px-3 !py-2 !bg-onus-bg2 !opacity-100 !rounded-lg after:!border-t-onus-bg2 after:!left-[30%]"
                                overridePosition={(e) => ({
                                    left: 0,
                                    top: e.top
                                })}
                            >
                            </Tooltip>
                            <div className="mt-8 flex flex-col space-y-2 text-xs">
                                <div className="flex items-center">
                                    <span className="text-onus-grey">{t("futures:mobile:adjust_margin:closed_volume")}:</span>&nbsp;
                                    <span className="font-medium">
                                        {formatNumber(volume, configSymbol.decimalSymbol, 0, true)}&nbsp;{configSymbol?.quoteAsset}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-onus-grey"> {t("futures:mobile:adjust_margin:pending_closed_volume")}:</span>&nbsp;
                                    <span className="font-medium">
                                        {formatNumber(general.pendingVol, configSymbol.decimalSymbol, 0, true)}&nbsp;
                                        {configSymbol?.quoteAsset}
                                    </span>
                                    <div className="px-2" data-tip={t('futures:mobile:adjust_margin:tooltip_pending_close_volume')} data-for="pending-vol" id="tooltip-pending-vol">
                                        <img src={getS3Url('/images/icon/ic_help.png')} height={16} width={16} />
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-onus-grey"> {t("futures:mobile:adjust_margin:remaining_volume")}:</span>&nbsp;
                                    <span className="font-medium">
                                        {formatNumber(general.remaining_volume, configSymbol.decimalSymbol, 0, true)}&nbsp;
                                        {configSymbol?.quoteAsset}
                                    </span>
                                </div>
                            </div>
                        </>
                        }
                    </div>
                }
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
        </Modal>
    );
};

export default CloseOrderModalMobile;