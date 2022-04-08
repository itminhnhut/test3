import { useCallback, useEffect, useMemo, useState } from 'react'
import { API_GET_FUTURES_MARKET_WATCH } from 'redux/actions/apis'
import { FUTURES_NUMBER_OF_CONTRACT } from 'constants/constants'
import { FuturesOrderTypes, FuturesStopOrderMode } from 'redux/reducers/futures'
import { useTranslation } from 'next-i18next'
import { countDecimals, formatNumber } from 'redux/actions/utils'
import { ApiStatus } from 'redux/actions/const'
import { log } from 'utils'

import FuturesOrderButtonsGroup from './OrderButtonsGroup'
import FuturesOrderUtilities from './OrderUtilities'
import FuturesOrderSlider from './OrderSlider'
import FuturesOrderMarket from './OrderMarket'
import FuturesMarketWatch from 'models/FuturesMarketWatch'
import FuturesOrderLimit from './OrderLimit'
import FuturesOrderSLTP from './OrderSLTP'
import TradingLabel from 'components/trade/TradingLabel'
import SvgExchange from 'components/svg/Exchange'
import Divider from 'components/common/Divider'
import axios from 'axios'
import min from 'lodash/min'
import { useSelector } from 'react-redux'
import { roundToDown } from 'round-to'

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
}) => {
    // ? Use hooks
    const [baseAssetUsdValue, setBaseAssetUsdValue] = useState(0)

    const { t } = useTranslation()
    const usdRate = useSelector((state) => state.utils.usdRate)

    // ? Data helper
    const getLastedLastPrice = async (symbol) => {
        const { data } = await axios.get(API_GET_FUTURES_MARKET_WATCH, {
            params: { symbol },
        })
        if (data?.status === ApiStatus.SUCCESS) {
            const lastedLastPrice = FuturesMarketWatch.create(
                data?.data?.[0]
            )?.lastPrice
            log.d('Setted lasted lastPrice ', lastedLastPrice)
            handlePrice(lastedLastPrice)
        }
    }

    const inputValidator = (type) => {
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
                    msg = `Minium Qty is ${_displayingMin}`
                    isValid = false
                }

                if (quantity?.both > _max) {
                    msg = `Maxium Qty is ${_displayingMax}`
                    isValid = false
                }

                return { isValid, msg }

            case 'price':
                const _maxPrice = priceFilter?.maxPrice
                const _minPrice = priceFilter?.minPrice

                if (+price < _minPrice) {
                    isValid = false
                    msg = `Minium Price is ${_minPrice}`
                }

                if (+price > _maxPrice) {
                    isValid = false
                    msg = `Maxium Price is ${_maxPrice}`
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
        const _buy = size?.includes('%')
            ? formatNumber(quantity?.buy, pairConfig?.quantityPrecision || 4)
            : '0.0000'
        const _sell = size?.includes('%')
            ? formatNumber(quantity?.sell, pairConfig?.quantityPrecision || 4)
            : '0.0000'

        return (
            <>
                <TradingLabel
                    label={t('common:buy')}
                    value={`${_buy} ${selectedAsset}`}
                    containerClassName='text-xs'
                />
                <TradingLabel
                    label={t('common:sell')}
                    value={`${_sell} ${selectedAsset}`}
                    containerClassName='text-xs'
                />
            </>
        )
    }, [size, pairConfig, selectedAsset, quantity])

    // ? Init lastPrice
    useEffect(() => {
        getLastedLastPrice(pairConfig?.pair)
    }, [pairConfig?.pair])

    useEffect(() => {
        if (usdRate) {
            setBaseAssetUsdValue(usdRate?.[pairConfig?.baseAssetId])
        }
    }, [pairConfig?.baseAssetId, usdRate])

    return (
        <div className='pt-5 pb-[18px]'>
            {/* Order Utilities */}
            <FuturesOrderUtilities
                quoteAsset={pairConfig?.quoteAsset}
                quoteAssetId={pairConfig?.quoteAssetId}
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
                    />
                )}
            </div>

            {/* Slider */}
            <div className='mt-4'>
                <FuturesOrderSlider
                    size={size}
                    available={availableAsset}
                    onChange={(size) => handleQuantity(size, true)}
                />
            </div>

            <div className='mt-3.5 flex items-center justify-between select-none'>
                {renderBuySellByPercent()}
            </div>

            <Divider className='my-5' />

            {/* Order SL-TP */}
            <FuturesOrderSLTP />

            <Divider className='my-5' />

            {/* Buttons Group */}
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
            />
        </div>
    )
}

export default FuturesOrderModule
