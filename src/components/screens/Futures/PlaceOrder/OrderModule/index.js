import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { API_GET_FUTURES_MARKET_WATCH } from 'redux/actions/apis';
import { FuturesOrderTypes, FuturesStopOrderMode } from 'redux/reducers/futures';
import { useTranslation } from 'next-i18next';
import { formatNumber } from 'redux/actions/utils';
import { ApiStatus } from 'redux/actions/const';
import { log } from 'utils';

import FuturesOrderButtonsGroup from './OrderButtonsGroup';
import FuturesOrderUtilities from './OrderUtilities';
import FuturesOrderSlider from './OrderSlider';
import FuturesOrderMarket from './OrderMarket';
import FuturesMarketWatch from 'models/FuturesMarketWatch';
import FuturesOrderLimit from './OrderLimit';
import FuturesOrderSLTP from './OrderSLTP';
import TradingLabel from 'components/trade/TradingLabel';
import Divider from 'components/common/Divider';
import axios from 'axios';
import { useSelector } from 'react-redux';
import FuturesOrderButtonsGroupVndc from '../Vndc/OrderButtonsGroupVndc';
import { VndcFutureOrderType } from '../Vndc/VndcFutureOrderType';

const FuturesOrderModule = ({
    markPrice,
    currentType,
    currentLeverage,
    pairConfig,
    price,
    stopPrice,
    size,
    quantity,
    selectedAsset,
    setStopPrice,
    setAsset,
    handleQuantity,
    handlePrice,
    positionMode,
    availableAsset,
    isReversedAsset,
    lastPrice,
    maxBuy,
    maxSell,
    stopOrderMode,
    setStopOrderMode,
    isVndcFutures,
    ask,
    bid,
    isAuth,
    side
}) => {
    // ? Use hooks
    const [baseAssetUsdValue, setBaseAssetUsdValue] = useState(0)
    const firstTime = useRef(true);

    const { t } = useTranslation()
    const usdRate = useSelector((state) => state.utils.usdRate)
    const [orderSlTp, setOrderSlTp] = useState({
        sl: '',
        tp: ''
    })
    useEffect(() => {
        setOrderSlTp({
            sl: +(lastPrice - ((side === VndcFutureOrderType.Side.BUY ? lastPrice : -lastPrice) * 0.05)),
            tp: +(lastPrice + ((side === VndcFutureOrderType.Side.SELL ? -lastPrice : lastPrice) * 0.05)),
        })
    }, [currentType, side])

    // ? Data helper
    const getLastedLastPrice = async (symbol) => {
        if (isVndcFutures) return;
        const { data } = await axios.get(API_GET_FUTURES_MARKET_WATCH, {
            params: { symbol },
        })
        if (data?.status === ApiStatus.SUCCESS) {
            const lastedLastPrice = FuturesMarketWatch.create(
                data?.data?.[0]
            )?.lastPrice
            handlePrice(lastedLastPrice)
        }
    }

    const inputValidator = (type, isStop) => {
        let isValid = true,
            msg = null

        const lotSize =
            pairConfig?.filters?.find((o) =>
                [
                    FuturesOrderTypes.Market,
                    FuturesOrderTypes.StopMarket,
                ].includes(currentType)
                    ? o?.filterType === 'MARKET_LOT_SIZE'
                    : o?.filterType === 'LOT_SIZE'
            ) || {}

        const priceFilter =
            pairConfig?.filters?.find((o) => o.filterType === 'PRICE_FILTER') ||
            {}

        switch (type) {
            // input check
            case 'quantity':
                const _max = isReversedAsset
                    ? lotSize?.maxQty * baseAssetUsdValue
                    : lotSize?.maxQty
                const _min = isReversedAsset
                    ? lotSize?.minQty * baseAssetUsdValue
                    : lotSize?.minQty

                const _displayingMax = isReversedAsset
                    ? `${_max} ${pairConfig?.quoteAsset} ≈ ${lotSize?.maxQty} ${pairConfig?.baseAsset}`
                    : `${lotSize?.maxQty} ${pairConfig?.baseAsset}`
                const _displayingMin = isReversedAsset
                    ? `${_min} ${pairConfig?.quoteAsset} ≈ ${lotSize?.minQty} ${pairConfig?.baseAsset}`
                    : `${lotSize?.minQty} ${pairConfig?.baseAsset}`

                if (quantity?.both < _min) {
                    msg = `Minimum Qty is ${_displayingMin}`
                    isValid = false
                }

                if (quantity?.both > _max) {
                    msg = `Maximum Qty is ${_displayingMax}`
                    isValid = false
                }

                return { isValid, msg }

            case 'price':
            case 'stop_loss':
            case 'take_profit':
                const _maxPrice = priceFilter?.maxPrice
                const _minPrice = priceFilter?.minPrice
                const _price = isStop ? stopPrice : type === 'price' ? price : type === 'stop_loss' ? orderSlTp.sl : orderSlTp.tp
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

    const getOrderStopModeLabel = (mode) => {
        switch (mode) {
            case FuturesStopOrderMode.lastPrice:
                return 'Last'
            case FuturesStopOrderMode.markPrice:
                return 'Mark'
            default:
                return ''
        }
    }

    const renderBuySellByPercent = useCallback(() => {
        const _buy =
            String(size)?.includes('%')
                ? formatNumber(quantity?.buy, countDecimals(decimalScaleQtyMarket?.stepSize))
                : '0.0000'
        const _sell =
            String(size)?.includes('%')
                ? formatNumber(quantity?.sell, countDecimals(decimalScaleQtyMarket?.stepSize))
                : '0.0000'

        const volume = formatNumber(size, countDecimals(decimalScaleQtyMarket?.stepSize));
        const maxQty = side === VndcFutureOrderType.Side.BUY ? maxBuy : maxSell;

        return (
            <>
                <TradingLabel
                    label={t(isVndcFutures ? 'futures:volume' : 'common:buy')}
                    value={`${isVndcFutures ? volume : _buy} ${selectedAsset}`}
                    containerClassName='text-xs'
                />
                <TradingLabel
                    label={t(isVndcFutures ? 'common:max' : 'common:sell')}
                    value={`${isVndcFutures ? maxQty : _sell} ${selectedAsset}`}
                    containerClassName='text-xs'
                />
            </>
        )
    }, [size, pairConfig, selectedAsset, quantity, side])

    // ? Init lastPrice
    useEffect(() => {
        getLastedLastPrice(pairConfig?.pair)
    }, [pairConfig?.pair])

    useEffect(() => {
        if (usdRate) {
            setBaseAssetUsdValue(usdRate?.[pairConfig?.baseAssetId])
        }
    }, [pairConfig?.baseAssetId, usdRate])

    const isError = useMemo(() => {
        const ArrStop = [FuturesOrderTypes.StopMarket, FuturesOrderTypes.StopLimit]
        const not_valid = !size || !inputValidator('price', ArrStop.includes(currentType)).isValid || !inputValidator('quantity').isValid || !inputValidator('stop_loss').isValid || !inputValidator('take_profit').isValid;
        return !isVndcFutures ? false : not_valid
    }, [price, size, currentType, stopPrice, orderSlTp])

    const countDecimals = (value) => {
        if (Math.floor(value) === value || !value) return 0;
        return value.toString().split(".")[1]?.length || 0;
    }

    const decimalScalePrice = pairConfig?.filters.find(rs => rs.filterType === 'PRICE_FILTER');
    const decimalScaleQtyLimit = pairConfig?.filters.find(rs => rs.filterType === 'LOT_SIZE');
    const decimalScaleQtyMarket = pairConfig?.filters.find(rs => rs.filterType === 'MARKET_LOT_SIZE');

    return (
        <div className='pt-5 pb-[18px]'>
            {/* Order Utilities */}
            <FuturesOrderUtilities
                quoteAsset={pairConfig?.quoteAsset}
                quoteAssetId={pairConfig?.quoteAssetId}
                isAuth={isAuth}
                isVndcFutures={isVndcFutures}
            />

            {/* Order Input Scenario */}
            <div className='mt-4'>
                {(currentType === FuturesOrderTypes.Market ||
                    currentType === FuturesOrderTypes.StopMarket) && (
                        <FuturesOrderMarket
                            stopPrice={stopPrice}
                            setStopPrice={setStopPrice}
                            size={size}
                            handleQuantity={handleQuantity}
                            pairConfig={pairConfig}
                            setAsset={setAsset}
                            selectedAsset={selectedAsset}
                            getValidator={inputValidator}
                            stopOrderMode={stopOrderMode}
                            setStopOrderMode={setStopOrderMode}
                            getOrderStopModeLabel={getOrderStopModeLabel}
                            isStopMarket={
                                currentType === FuturesOrderTypes.StopMarket
                            }
                            isVndcFutures={isVndcFutures}
                            decimalScalePrice={countDecimals(decimalScalePrice?.tickSize)}
                            decimalScaleQty={countDecimals(decimalScaleQtyMarket?.stepSize)}
                        />
                    )}
                {(currentType === FuturesOrderTypes.Limit ||
                    currentType === FuturesOrderTypes.StopLimit) && (
                        <FuturesOrderLimit
                            price={price}
                            handlePrice={handlePrice}
                            size={size}
                            handleQuantity={handleQuantity}
                            stopPrice={stopPrice}
                            setStopPrice={setStopPrice}
                            setAsset={setAsset}
                            selectedAsset={selectedAsset}
                            stopOrderMode={stopOrderMode}
                            setStopOrderMode={setStopOrderMode}
                            getOrderStopModeLabel={getOrderStopModeLabel}
                            pairConfig={pairConfig}
                            getValidator={inputValidator}
                            getLastedLastPrice={() => handlePrice(lastPrice)}
                            isStopLimit={
                                currentType === FuturesOrderTypes.StopLimit
                            }
                            isVndcFutures={isVndcFutures}
                            decimalScalePrice={countDecimals(decimalScalePrice?.tickSize)}
                            decimalScaleQty={countDecimals(decimalScaleQtyLimit?.stepSize)}
                        />
                    )}
            </div>

            {/* Slider */}
            <div className='mt-4'>
                <FuturesOrderSlider
                    size={size}
                    available={availableAsset}
                    onChange={(size) => handleQuantity(size, !isVndcFutures)}
                    isVndcFutures={isVndcFutures}
                    maxBuy={maxBuy}
                    maxSell={maxSell}
                    side={side}
                    currentType={currentType}
                />
            </div>

            <div className='mt-3.5 flex items-center justify-between select-none'>
                {renderBuySellByPercent()}
            </div>

            <Divider className='my-5' />

            {/* Order SL-TP */}
            <FuturesOrderSLTP
                isVndcFutures={isVndcFutures}
                orderSlTp={orderSlTp}
                setOrderSlTp={setOrderSlTp}
                decimalScalePrice={countDecimals(decimalScalePrice?.tickSize)}
                getValidator={inputValidator}
                side={side}
                size={size}
                pairConfig={pairConfig}
                price={price}
                stopPrice={stopPrice}
                lastPrice={lastPrice}
            />

            <Divider className='my-5' />

            {/* Buttons Group */}
            {isVndcFutures ?
                <FuturesOrderButtonsGroupVndc
                    pairConfig={pairConfig}
                    positionMode={positionMode}
                    type={currentType}
                    quantity={quantity}
                    price={price}
                    stopPrice={stopPrice}
                    stopOrderMode={stopOrderMode}
                    leverage={currentLeverage}
                    orderSlTp={orderSlTp}
                    size={size}
                    isError={isError}
                    ask={ask}
                    bid={bid}
                    isAuth={isAuth}
                    decimalScaleQty={countDecimals(decimalScaleQtyMarket?.stepSize)}
                    decimalScalePrice={countDecimals(decimalScalePrice?.tickSize)}
                    side={side}
                />
                :
                <FuturesOrderButtonsGroup
                    pairConfig={pairConfig}
                    positionMode={positionMode}
                    type={currentType}
                    quantity={quantity}
                    price={price}
                    stopPrice={stopPrice}
                    lastPrice={lastPrice}
                    currentType={currentType}
                    stopOrderMode={stopOrderMode}
                    isAuth={isAuth}
                />
            }
        </div>
    )
}

export default FuturesOrderModule
