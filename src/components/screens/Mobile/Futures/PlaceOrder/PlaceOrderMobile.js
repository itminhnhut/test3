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

const initPercent = 25;

const PlaceOrder = ({
    decimals, side, pairPrice, pair, isAuth, availableAsset,
    pairConfig, isVndcFutures, getPairPrice,
}) => {
    const usdRate = useSelector((state) => state.utils.usdRate)
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
        const _lastPrice = getPairPrice()?.lastPrice;
        setPrice(_lastPrice);
        setStopPrice(_lastPrice)
    }, [pair, type])

    useEffect(() => {
        if (firstTime.current) return;
        const _lastPrice = getPairPrice()?.lastPrice;
        const _sl = +(_lastPrice - ((side === VndcFutureOrderType.Side.BUY ? _lastPrice : -_lastPrice) * 0.05))
        const _tp = +(_lastPrice + ((side === VndcFutureOrderType.Side.SELL ? -_lastPrice : _lastPrice) * 0.05))
        setTp(_tp)
        setSl(_sl)
    }, [side, type, pair])

    useEffect(() => {
        const _lastPrice = pairPrice?.lastPrice;
        setPrice(_lastPrice);
        setStopPrice(_lastPrice);
        const _sl = +(_lastPrice - ((side === VndcFutureOrderType.Side.BUY ? _lastPrice : -_lastPrice) * 0.05))
        const _tp = +(_lastPrice + ((side === VndcFutureOrderType.Side.SELL ? -_lastPrice : _lastPrice) * 0.05))
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
                <OrderPriceMobile disabled={OrderTypes.Market === type} price={price} setPrice={setPrice} decimals={decimals} />
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
                    leverage={leverage}
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