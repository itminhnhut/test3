import React, { useState, memo, useEffect, useMemo, useRef } from 'react';
import OrderVolumeMobile from './OrderVolumeMobile';
import OrderPriceMobile from './OrderPriceMobile';
import OrderTPMobile from './OrderTPMobile';
import OrderSLMobile from './OrderSLMobile';
import styled from 'styled-components';
import { useSelector } from 'react-redux'
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType'
import { FuturesOrderTypes as OrderTypes, FuturesOrderTypes } from 'redux/reducers/futures';
import OrderLeverage from './OrderLeverage';
import OrderTypeMobile from './OrderTypeMobile'
import OrderMarginMobile from './OrderMarginMobile';
import OrderButtonMobile from './OrderButtonMobile';
import { formatNumber } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next'

const initPercent = 25;

const PlaceOrder = ({
    decimals, side, pairPrice, pair, isAuth, availableAsset,
    pairConfig, isVndcFutures,
}) => {
    const lastPrice = pairPrice?.lastPrice;
    const usdRate = useSelector((state) => state.utils.usdRate)
    const { t } = useTranslation();
    const [baseAssetUsdValue, setBaseAssetUsdValue] = useState(0)
    const [maxQty, setMaxQty] = useState(0);

    const [type, setType] = useState(OrderTypes.Limit);
    const [leverage, setLeverage] = useState(50)
    const [size, setSize] = useState(0);
    const [price, setPrice] = useState(0);
    const [stopPrice, setStopPrice] = useState(0)
    const [tp, setTp] = useState(0);
    const [sl, setSl] = useState(0);

    useEffect(() => {
        const _price = type === OrderTypes.Limit ? price : stopPrice;
        if ((availableAsset)) {
            let _maxQty = 0;
            if ([OrderTypes.Limit, OrderTypes.StopMarket].includes(type) && _price) {
                _maxQty = availableAsset / ((1 / leverage) + (0.1 / 100)) / _price;
            } else if ([OrderTypes.Market].includes(type)) {
                if (side === VndcFutureOrderType.Side.BUY) {
                    _maxQty = availableAsset / ((1 / leverage) + (0.1 / 100)) / pairPrice?.ask;
                } else {
                    _maxQty = availableAsset / ((1 / leverage) + (0.1 / 100)) / pairPrice?.bid;
                }
            }
            setMaxQty(_maxQty.toFixed(decimals.decimalScaleQtyLimit))
        } else {
            setMaxQty(0)
        }
    }, [
        availableAsset,
        price,
        size,
        leverage,
        type,
        pairPrice,
        stopPrice
    ])

    useEffect(() => {
        if (usdRate) {
            setBaseAssetUsdValue(usdRate?.[pairConfig?.baseAssetId])
        }
    }, [pairConfig?.baseAssetId, usdRate])

    const maxSize = useMemo(() => {
        const lotSize =
            pairConfig?.filters?.find((o) =>
                [
                    FuturesOrderTypes.Market,
                    FuturesOrderTypes.StopMarket,
                ].includes(type)
                    ? o?.filterType === 'MARKET_LOT_SIZE'
                    : o?.filterType === 'LOT_SIZE'
            ) || {}
        const _maxConfig = lotSize?.maxQty
        return isAuth ? Math.min(_maxConfig, maxQty) : _maxConfig;
    }, [side, pairConfig, pair, isAuth, maxQty, type])

    const firstTime = useRef(true);

    useEffect(() => {
        if (firstTime.current && pairPrice) firstTime.current = false;
    }, [pairPrice])

    useEffect(() => {
        if (firstTime.current) return;
        setPrice(lastPrice);
        setStopPrice(lastPrice)
    }, [pair, type])

    useEffect(() => {
        if (firstTime.current) return;
        const _sl = +(lastPrice - ((side === VndcFutureOrderType.Side.BUY ? lastPrice : -lastPrice) * 0.05))
        const _tp = +(lastPrice + ((side === VndcFutureOrderType.Side.SELL ? -lastPrice : lastPrice) * 0.05))
        setTp(_tp)
        setSl(_sl)
    }, [side, type, pair])

    useEffect(() => {
        setPrice(lastPrice);
        setStopPrice(lastPrice);
        const _sl = +(lastPrice - ((side === VndcFutureOrderType.Side.BUY ? lastPrice : -lastPrice) * 0.05))
        const _tp = +(lastPrice + ((side === VndcFutureOrderType.Side.SELL ? -lastPrice : lastPrice) * 0.05))
        setTp(_tp)
        setSl(_sl)
    }, [firstTime.current])

    const marginAndValue = useMemo(() => {
        const _price = type === FuturesOrderTypes.Market ?
            (VndcFutureOrderType.Side.BUY === side ? pairPrice?.ask : pairPrice?.bid) :
            price;
        const _size = Number(size).toFixed(decimals.decimalScaleQtyLimit);
        const volume = _size * _price;
        const volumeLength = volume.toFixed(0).length;
        const margin = volume / leverage;
        const marginLength = margin.toFixed(0).length;
        return { volume, margin, volumeLength, marginLength }
    }, [pairPrice, side, type])

    const inputValidator = (mode, isStop) => {
        let isValid = true,
            msg = null

        const lotSize =
            pairConfig?.filters?.find((o) =>
                [
                    FuturesOrderTypes.Market,
                    FuturesOrderTypes.StopMarket,
                ].includes(type)
                    ? o?.filterType === 'MARKET_LOT_SIZE'
                    : o?.filterType === 'LOT_SIZE'
            ) || {}

        const priceFilter =
            pairConfig?.filters?.find((o) => o.filterType === 'PRICE_FILTER') ||
            {}

        switch (mode) {
            // input check
            case 'quantity':
                const _max = lotSize?.maxQty
                const _min = lotSize?.minQty
                const _decimals = decimals.decimalScaleQtyLimit
                const _displayingMax = `${formatNumber(lotSize?.maxQty, _decimals, 0, true)} ${pairConfig?.baseAsset}`
                const _displayingMin = `${formatNumber(lotSize?.minQty, _decimals, 0, true)} ${pairConfig?.baseAsset}`

                if (size < +_min) {
                    msg = `${t('futures:minimun_qty')} ${_displayingMin} `
                    isValid = false
                }

                if (size > +_max) {
                    msg = `${t('futures:maximun_qty')} ${_displayingMax}`
                    isValid = false
                }

                return { isValid, msg }

            case 'price':
            case 'stop_loss':
            case 'take_profit':
                const _maxPrice = priceFilter?.maxPrice
                const _minPrice = priceFilter?.minPrice
                const _price = isStop ? stopPrice : mode === 'price' ? price : mode === 'stop_loss' ? sl : tp;
                if (+_price < +_minPrice) {
                    isValid = false
                    msg = `${t('futures:minimun_price')} ${!isVndcFutures ? _minPrice : formatNumber(_minPrice, 0, 0, true)}`
                }

                if (+_price > +_maxPrice) {
                    isValid = false
                    msg = `${t('futures:maximun_price')} ${!isVndcFutures ? _maxPrice : formatNumber(_maxPrice, 0, 0, true)}`
                }

                return { isValid, msg }
            default:
                return {}
        }
    }


    const isError = useMemo(() => {
        const ArrStop = [FuturesOrderTypes.StopMarket, FuturesOrderTypes.StopLimit]
        const not_valid = !size || !inputValidator('price', ArrStop.includes(type)).isValid || !inputValidator('quantity').isValid || !inputValidator('stop_loss').isValid || !inputValidator('take_profit').isValid;
        return !isVndcFutures ? false : not_valid
    }, [price, size, type, stopPrice, sl, tp, isVndcFutures])

    return (
        <div className="flex flex-wrap justify-between px-[16px] py-[10px]">
            <OrderInput>
                <OrderTypeMobile type={type} setType={setType}
                    orderTypes={pairConfig?.orderTypes} isVndcFutures={isVndcFutures} />
            </OrderInput>
            <OrderInput>
                <OrderLeverage
                    leverage={leverage} setLeverage={setLeverage}
                    isAuth={isAuth} pair={pair}
                    pairConfig={pairConfig}
                />
            </OrderInput>
            <OrderInput>
                <OrderVolumeMobile
                    size={size} setSize={setSize} decimals={decimals}
                    maxSize={maxSize}
                    type={type} side={side}
                />
            </OrderInput>
            <OrderInput>
                <OrderPriceMobile
                    type={type}
                    price={price} setPrice={setPrice} decimals={decimals}
                />
            </OrderInput>
            <OrderInput>
                <OrderTPMobile tp={tp} setTp={setTp} decimals={decimals} />
            </OrderInput>
            <OrderInput>
                <OrderSLMobile sl={sl} setSl={setSl} decimals={decimals} />
            </OrderInput>
            <OrderInput>
                <OrderMarginMobile marginAndValue={marginAndValue} pairConfig={pairConfig} availableAsset={availableAsset} />
            </OrderInput>
            <OrderInput>
                <OrderButtonMobile
                    tp={tp} sl={sl} type={type} size={size} price={price}
                    stopPrice={stopPrice} side={side} decimals={decimals}
                    pairConfig={pairConfig} pairPrice={pairPrice}
                    leverage={leverage} isAuth={isAuth} isError={isError}
                    isAuth={isAuth}
                />
            </OrderInput>
        </div>
    );
};


const OrderInput = styled.div`
width:calc(50% - 8px);
margin-bottom:10px
`

export default PlaceOrder;