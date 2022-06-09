import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import OrderVolumeMobile from './OrderVolumeMobile';
import OrderPriceMobile from './OrderPriceMobile';
import OrderTPMobile from './OrderTPMobile';
import OrderSLMobile from './OrderSLMobile';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { FuturesOrderTypes as OrderTypes, FuturesOrderTypes } from 'redux/reducers/futures';
import OrderTypeMobile from './OrderTypeMobile';
import OrderMarginMobile from './OrderMarginMobile';
import OrderButtonMobile from './OrderButtonMobile';
import { formatNumber } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import OrderCollapse from './OrderCollapse';
import FuturesEditSLTPVndc from 'components/screens/Futures/PlaceOrder/Vndc/EditSLTPVndc';
import { getPrice, getType } from 'components/screens/Futures/PlaceOrder/Vndc/OrderButtonsGroupVndc';
import { AlertContext } from 'components/common/layouts/LayoutMobile';
import { createSelector } from 'reselect';
import OrderVolumeMobileModal from './OrderVolumeMobileModal';
import SideOrder from 'components/screens/Mobile/Futures/SideOrder';
import OrderLeverage from 'components/screens/Mobile/Futures/PlaceOrder/OrderLeverage';

const getPairPrice = createSelector(
    [
        state => state.futures,
        (state, pair) => pair
    ],
    (futures, pair) => futures.marketWatch[pair]
);

const initPercent = 25;

const PlaceOrder = ({
    decimals,
    side,
    setSide,
    pairPrice,
    pair,
    isAuth,
    availableAsset,
    pairConfig,
    isVndcFutures,
    collapse
}) => {
    const lastPrice = pairPrice?.lastPrice;
    const usdRate = useSelector((state) => state.utils.usdRate);
    const { t } = useTranslation();
    const [baseAssetUsdValue, setBaseAssetUsdValue] = useState(0);
    const initPercent = 25;
    const [type, setType] = useState(OrderTypes.Market);
    const [leverage, setLeverage] = useState(50);
    const [size, setSize] = useState(0);
    const [price, setPrice] = useState(0);
    const [stopPrice, setStopPrice] = useState(0);
    const [tp, setTp] = useState(0);
    const [sl, setSl] = useState(0);
    const rowData = useRef(null);
    const [showEditSLTP, setShowEditSLTP] = useState(false);
    const firstTime = useRef(true);
    const context = useContext(AlertContext);
    const marketWatch = useSelector(state => getPairPrice(state, pair));
    const newDataLeverage = useRef(0);
    const [showEditVolume, setShowEditVolume] = useState(false);
    const [quoteQty, setQuoteQty] = useState(0)

    useEffect(() => {
        if (usdRate) {
            setBaseAssetUsdValue(usdRate?.[pairConfig?.baseAssetId]);
        }
    }, [pairConfig?.baseAssetId, usdRate]);

    const getMaxQuoteQty = (price, type, side, leverage, availableAsset, pairPrice, pairConfig, isQuoteQty) => {
        let maxBuy = 0;
        let maxSell = 0;
        let _price = price
        if (Math.trunc(availableAsset) > 0) {
            if ([OrderTypes.Limit, OrderTypes.StopMarket].includes(type) && price) {
                maxBuy = availableAsset / ((1 / leverage) + (0.1 / 100)) / (isQuoteQty ? 1 : price);
                maxSell = maxBuy;
            } else if ([OrderTypes.Market].includes(type)) {
                price = side === VndcFutureOrderType.Side.BUY ? pairPrice?.ask : pairPrice?.bid;
                maxBuy = availableAsset / ((1 / leverage) + (0.1 / 100)) / (isQuoteQty ? 1 : pairPrice?.ask);
                maxSell = availableAsset / ((1 / leverage) + (0.1 / 100)) / (isQuoteQty ? 1 : pairPrice?.bid);
            }
        }
        const lotSize =
            pairConfig?.filters?.find((o) =>
                [
                    FuturesOrderTypes.Market,
                    FuturesOrderTypes.StopMarket,
                ].includes(type)
                    ? o?.filterType === 'MARKET_LOT_SIZE'
                    : o?.filterType === 'LOT_SIZE'
            ) || {};
        const _maxConfig = lotSize?.maxQty * (isQuoteQty ? price : 1); //maxConfig quoteQty
        const _maxQty = side === VndcFutureOrderType.Side.BUY ? maxBuy : maxSell;
        return isAuth ? Math.min(_maxConfig, _maxQty) : _maxConfig;
    };

    useEffect(() => {
        if (firstTime.current && (marketWatch?.lastPrice > 0 || pairPrice?.lastPrice > 0)) {
            firstTime.current = false;
        }
    }, [marketWatch, pairPrice, firstTime.current]);

    useEffect(() => {
        firstTime.current = true;
    }, [pair]);

    useEffect(() => {
        if (firstTime.current) return;
        setPrice(lastPrice);
        setStopPrice(lastPrice);
    }, [pair, type]);

    useEffect(() => {
        if (firstTime.current) return;
        const _sl = +(lastPrice - ((side === VndcFutureOrderType.Side.BUY ? lastPrice : -lastPrice) * 0.05));
        const _tp = +(lastPrice + ((side === VndcFutureOrderType.Side.SELL ? -lastPrice : lastPrice) * 0.05));
        setTp(_tp);
        setSl(_sl);
        if (type === OrderTypes.Market) {
            onChangeQuoteQty(lastPrice, leverage)
        }
    }, [side, type]);

    useEffect(() => {
        if (firstTime.current) return;
        const _lastPrice = marketWatch?.lastPrice ?? lastPrice;
        setPrice(_lastPrice);
        setStopPrice(_lastPrice);
        const _sl = +(_lastPrice - ((side === VndcFutureOrderType.Side.BUY ? _lastPrice : -_lastPrice) * 0.05));
        const _tp = +(_lastPrice + ((side === VndcFutureOrderType.Side.SELL ? -_lastPrice : _lastPrice) * 0.05));
        setTp(_tp);
        setSl(_sl);
    }, [firstTime.current]);

    const onChangeQuoteQty = (price, leverage) => {
        const minQuoteQty = pairConfig?.filters.find(item => item.filterType === "MIN_NOTIONAL")?.notional ?? 100000;
        const maxQuoteQty = getMaxQuoteQty(price, type, side, leverage, availableAsset, pairPrice, pairConfig, true);
        let _quoteQty = +Number(maxQuoteQty * (initPercent / 100)).toFixed(0)
        _quoteQty = _quoteQty < minQuoteQty ? minQuoteQty : _quoteQty;
        const _size = +((_quoteQty / price) * initPercent / 100).toFixed(decimals.decimalScaleQtyLimit);
        setSize(_size);
        setQuoteQty(_quoteQty)
    }

    useEffect(() => {
        if (firstTime.current) return;
        if (newDataLeverage.current) {
            const _lastPrice = marketWatch?.lastPrice ?? lastPrice;
            onChangeQuoteQty(_lastPrice, newDataLeverage?.current);
        }
    }, [firstTime.current, newDataLeverage.current]);

    const getLeverage = (_leverage) => {
        newDataLeverage.current = _leverage;
    };

    const marginAndValue = useMemo(() => {
        const volume = quoteQty;
        const volumeLength = volume.toFixed(0).length;
        const margin = volume / leverage;
        const marginLength = margin.toFixed(0).length;
        return {
            volume,
            margin,
            volumeLength,
            marginLength
        };
    }, [pairPrice, side, type, size, quoteQty]);

    const inputValidator = (mode, isStop) => {
        let isValid = true,
            msg = null;

        const lotSize =
            pairConfig?.filters?.find((o) =>
                [
                    FuturesOrderTypes.Market,
                    FuturesOrderTypes.StopMarket,
                ].includes(type)
                    ? o?.filterType === 'MARKET_LOT_SIZE'
                    : o?.filterType === 'LOT_SIZE'
            ) || {};

        const priceFilter =
            pairConfig?.filters?.find((o) => o.filterType === 'PRICE_FILTER') ||
            {};

        switch (mode) {
            // input check
            case 'quoteQty':
                const _min = pairConfig?.filters.find(item => item.filterType === "MIN_NOTIONAL")?.notional ?? 100000
                const _decimals = 0;
                const _priceInput = type === OrderTypes.Limit ? price : stopPrice;
                const _max = +Number(availableAsset / (1 / leverage + (0.1 / 100))).toFixed(0);
                const _displayingMax = `${formatNumber(_max, _decimals, 0, true)} ${pairConfig?.baseAsset}`;
                const _displayingMin = `${formatNumber(_min, _decimals, 0, true)} ${pairConfig?.baseAsset}`;
                if (quoteQty < +_min) {
                    msg = `${t('futures:minimun_qty')} ${_displayingMin} `;
                    isValid = false;
                }
                if (quoteQty > +Number(_max)
                    .toFixed(_decimals)) {
                    msg = `${t('futures:maximun_qty')} ${_displayingMax}`;
                    isValid = false;
                }
                return {
                    isValid,
                    msg
                };

            case 'price':
            case 'stop_loss':
            case 'take_profit':
                const _maxPrice = priceFilter?.maxPrice;
                const _minPrice = priceFilter?.minPrice;
                const _price = isStop ? stopPrice : mode === 'price' ? price : mode === 'stop_loss' ? sl : tp;
                if (+_price < +_minPrice) {
                    isValid = false;
                    msg = `${t('futures:minimun_price')} ${!isVndcFutures ? _minPrice : formatNumber(_minPrice, 0, 0, true)}`;
                }

                if (+_price > +_maxPrice) {
                    isValid = false;
                    msg = `${t('futures:maximun_price')} ${!isVndcFutures ? _maxPrice : formatNumber(_maxPrice, 0, 0, true)}`;
                }

                return {
                    isValid,
                    msg
                };
            case 'leverage':
                let isValid = true;
                let msg = null;
                const min = pairConfig?.leverageConfig?.min ?? 0;
                const max = pairConfig?.leverageConfig?.max ?? 0;
                if (min > leverage) {
                    msg = `${t('futures:minimun_leverage')} ${_displayingMin} `;
                    isValid = false;
                }
                if (max < leverage) {
                    msg = `${t('futures:maximun_leverage')} ${_displayingMax}`;
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
        const not_valid = !inputValidator('price', ArrStop.includes(type)).isValid || !inputValidator('quoteQty').isValid ||
            !inputValidator('stop_loss').isValid || !inputValidator('take_profit').isValid || !inputValidator('leverage').isValid;
        return !isVndcFutures ? false : not_valid;
    }, [price, size, type, stopPrice, sl, tp, isVndcFutures, leverage, quoteQty]);

    const onChangeTpSL = () => {
        const ArrStop = [FuturesOrderTypes.StopMarket, FuturesOrderTypes.StopLimit];
        if (!isVndcFutures || !inputValidator('price', ArrStop.includes(type)).isValid ||
            !inputValidator('quoteQty').isValid) {
            const minQuoteQty = pairConfig?.filters.find(item => item.filterType === "MIN_NOTIONAL")?.notional ?? 100000;
            const maxQuoteQty = getMaxQuoteQty(price, type, side, leverage, availableAsset, pairPrice, pairConfig, true);
            const available = maxQuoteQty >= minQuoteQty;
            context.alert.show('error', t('futures:invalid_amount'), available ? t('futures:invalid_amount') : t('futures:mobile:balance_insufficient'))
            return;
        }
        const _price = getPrice(getType(type), side, price, pairPrice?.ask, pairPrice?.bid, stopPrice);
        rowData.current = {
            fee: 0,
            quantity: size,
            status: 0,
            price: _price,
            quoteAsset: pairConfig.quoteAsset,
            symbol: pairConfig.symbol,
            sl: +sl.toFixed(decimals.decimalScalePrice),
            tp: +tp.toFixed(decimals.decimalScalePrice),
            leverage,
            side,
        };
        setShowEditSLTP(true);
    };

    const onConfirmSLTP = (data) => {
        setSl(data.sl);
        setTp(data.tp);
        setShowEditSLTP(false);
    };

    const onConfirmEditVolume = (quoteQty) => {
        const _price = type === FuturesOrderTypes.Market ?
            (VndcFutureOrderType.Side.BUY === side ? pairPrice?.ask : pairPrice?.bid) :
            price;
        const _size = (quoteQty / _price).toFixed(decimals.decimalScaleQtyLimit)
        setSize(+_size);
        setQuoteQty(quoteQty);
        setShowEditVolume(false);
    };
    return (
        <>

            <div className="flex flex-wrap justify-between px-[16px] py-[10px]">

                {showEditSLTP &&
                    <FuturesEditSLTPVndc
                        isVisible={showEditSLTP}
                        order={rowData.current}
                        onClose={() => setShowEditSLTP(false)}
                        status={rowData.current.status}
                        onConfirm={onConfirmSLTP}
                        lastPrice={lastPrice}
                        isMobile
                    />
                }
                {collapse &&
                    <OrderCollapse
                        side={side} pairPrice={pairPrice} type={type} size={size}
                        price={price} stopPrice={stopPrice} pairConfig={pairConfig}
                        decimals={decimals} leverage={leverage} isAuth={isAuth}
                        marginAndValue={marginAndValue} availableAsset={availableAsset}
                        quoteQty={quoteQty} isError={isError}
                    />
                }
                <div className={collapse ? 'hidden' : 'w-full flex flex-wrap justify-between'}>
                    <OrderInput>
                        <div className="flex flex-row justify-between">
                            <OrderTypeMobile type={type} setType={setType}
                                orderTypes={pairConfig?.orderTypes} isVndcFutures={isVndcFutures} />

                            <OrderLeverage
                                leverage={leverage} setLeverage={setLeverage}
                                isAuth={isAuth} pair={pair}
                                pairConfig={pairConfig}
                                inputValidator={inputValidator}
                                context={context}
                                getLeverage={getLeverage}
                            />
                        </div>

                    </OrderInput>
                    {!collapse &&
                        <OrderInput>
                            <SideOrder side={side} setSide={setSide} />
                        </OrderInput>
                    }
                    <OrderInput data-tut="order-volume">
                        {showEditVolume && <OrderVolumeMobileModal
                            size={size}
                            decimal={0}
                            onClose={() => setShowEditVolume(false)}
                            onConfirm={onConfirmEditVolume}
                            pairConfig={pairConfig}
                            type={type}
                            side={side}
                            quoteQty={quoteQty}
                            price={price}
                            pairPrice={pairPrice}
                            leverage={leverage}
                            availableAsset={availableAsset}
                            getMaxQuoteQty={getMaxQuoteQty}
                        />}
                        <OrderVolumeMobile
                            size={size} setSize={setSize} decimals={decimals}
                            context={context}
                            pairConfig={pairConfig}
                            quoteQty={quoteQty}
                            setShowEditVolume={setShowEditVolume}
                        />
                    </OrderInput>
                    <OrderInput>
                        <OrderPriceMobile
                            type={type}
                            price={price} setPrice={setPrice} decimals={decimals}
                            context={context} stopPrice={stopPrice} setStopPrice={setStopPrice}
                            pairConfig={pairConfig}
                        />
                    </OrderInput>
                    <OrderInput data-tut="order-sl">
                        <OrderSLMobile
                            sl={sl} setSl={setSl} decimals={decimals}
                            onChangeTpSL={onChangeTpSL} context={context} />
                    </OrderInput>
                    <OrderInput data-tut="order-tp">
                        <OrderTPMobile
                            tp={tp} setTp={setTp} decimals={decimals}
                            onChangeTpSL={onChangeTpSL} context={context} />
                    </OrderInput>
                    <OrderInput>
                        <OrderMarginMobile marginAndValue={marginAndValue} pairConfig={pairConfig}
                            availableAsset={availableAsset} />
                    </OrderInput>
                    <OrderInput data-tut="order-button">
                        <OrderButtonMobile
                            tp={tp} sl={sl} type={type} size={size} price={price}
                            stopPrice={stopPrice} side={side} decimals={decimals}
                            pairConfig={pairConfig} pairPrice={pairPrice}
                            leverage={leverage} isAuth={isAuth} isError={isError}
                            isAuth={isAuth} quoteQty={quoteQty}
                        />
                    </OrderInput>
                </div>
            </div>
        </>
    );
};

const OrderInput = styled.div`
  width: calc(50% - 8px);
  margin-bottom: 8px
`;

export default PlaceOrder;
