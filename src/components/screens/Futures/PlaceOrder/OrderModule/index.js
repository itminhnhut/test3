import { useCallback, useEffect, useMemo } from 'react'
import { API_GET_FUTURES_MARKET_WATCH } from 'redux/actions/apis'
import { FUTURES_NUMBER_OF_CONTRACT } from 'constants/constants'
import { FuturesOrderTypes } from 'redux/reducers/futures'
import { useTranslation } from 'next-i18next'
import { formatNumber } from 'redux/actions/utils'
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
}) => {
    // ? Use hooks
    const { t } = useTranslation()

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

    // ? Init lastPrice
    useEffect(() => {
        getLastedLastPrice(pairConfig?.pair)
    }, [pairConfig?.pair])

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
                        isStopMarket={
                            currentType === FuturesOrderTypes.StopMarket
                        }
                    />
                )}
                {(currentType === FuturesOrderTypes.Limit ||
                    currentType === FuturesOrderTypes.StopLimit) && (
                    <FuturesOrderLimit
                        price={price}
                        stopPrice={stopPrice}
                        size={size}
                        handlePrice={handlePrice}
                        handleQuantity={handleQuantity}
                        setStopPrice={setStopPrice}
                        setAsset={setAsset}
                        selectedAsset={selectedAsset}
                        getLastedLastPrice={() =>
                            getLastedLastPrice(pairConfig?.pair)
                        }
                        isStopLimit={
                            currentType === FuturesOrderTypes.StopLimit
                        }
                        pairConfig={pairConfig}
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
                <TradingLabel
                    label={t('common:buy')}
                    value={`0.0000 ${selectedAsset}`}
                    containerClassName='text-xs'
                />
                <TradingLabel
                    label={t('common:sell')}
                    value={`0.0000 ${selectedAsset}`}
                    containerClassName='text-xs'
                />
            </div>

            <Divider className='my-5' />

            {/* Order SL-TP */}
            <FuturesOrderSLTP />

            <Divider className='my-5' />

            {/* Buttons Group */}
            <FuturesOrderButtonsGroup
                symbol={pairConfig?.symbol}
                positionMode={positionMode}
                type={currentType}
                quantity={quantity}
                price={price}
                stopPrice={stopPrice}
            />
        </div>
    )
}
export default FuturesOrderModule
