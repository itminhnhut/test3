import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { API_GET_FUTURES_MARKET_WATCH } from 'redux/actions/apis'
import { FuturesOrderTypes } from 'redux/reducers/futures'
import { useTranslation } from 'next-i18next'
import { ApiStatus } from 'redux/actions/const'

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
import { log } from 'utils'
import min from 'lodash/min'
import { FUTURES_NUMBER_OF_CONTRACT } from 'constants/constants'

const INITIAL_STATE = {
    percentage: null,
    price: '',
    stopPrice: '',
    size: '',
}

const FuturesOrderModule = memo(
    ({ markPrice, currentType, currentLeverage, pairConfig }) => {
        // ? State Management
        const [state, set] = useState({
            ...INITIAL_STATE,
            selectedAsset: pairConfig?.baseAsset,
        })
        const setState = (state) =>
            set((prevState) => ({ ...prevState, ...state }))

        // ? Use hooks
        const { t } = useTranslation()

        // ? Memmoized Variable
        const initialMargin = useMemo(() => {
            if (!state.price || !state.size || !currentLeverage) {
                return 0
            }
            log.d(
                'Futures Initial Margin: ',
                (+state.price * +state.size) / currentLeverage
            )
            return (+state.price * +state.size) / currentLeverage
        }, [state.price, state.size, currentLeverage])

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
                setState({ price: lastedLastPrice })
            }
        }

        // ? Init lastPrice
        useEffect(() => {
            getLastedLastPrice(pairConfig?.pair)
        }, [pairConfig?.pair])

        useEffect(() => {
            console.log('Listen markPrice ', markPrice)
        }, [markPrice])

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
                            price={state.price}
                            stopPrice={state.stopPrice}
                            size={state.size}
                            setState={setState}
                            isStopMarket={
                                currentType === FuturesOrderTypes.StopMarket
                            }
                            pairConfig={pairConfig}
                        />
                    )}
                    {(currentType === FuturesOrderTypes.Limit ||
                        currentType === FuturesOrderTypes.StopLimit) && (
                        <FuturesOrderLimit
                            price={state.price}
                            stopPrice={state.stopPrice}
                            size={state.size}
                            setState={setState}
                            selectedAsset={state.selectedAsset}
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
                    <FuturesOrderSlider />
                </div>
                <div className='mt-3.5 flex items-center justify-between select-none'>
                    <TradingLabel
                        label={t('common:buy')}
                        value={`0.0000 ${state.selectedAsset}`}
                        containerClassName='text-xs'
                    />
                    <TradingLabel
                        label={t('common:sell')}
                        value={`0.0000 ${state.selectedAsset}`}
                        containerClassName='text-xs'
                    />
                </div>

                <Divider className='my-5' />

                {/* Order SL-TP */}
                <FuturesOrderSLTP />

                <Divider className='my-5' />

                {/* Buttons Group */}
                <FuturesOrderButtonsGroup />

                {/* Cost and Stuff */}
                <div className='mt-4 select-none'>
                    <div className='flex items-center justify-between'>
                        <TradingLabel
                            label={t('common:cost')}
                            value={` ${pairConfig?.quoteAsset}`}
                            containerClassName='text-xs'
                        />
                        <TradingLabel
                            label={t('common:cost')}
                            value={`100 ${pairConfig?.quoteAsset}`}
                            containerClassName='text-xs'
                        />
                    </div>
                    <div className='mt-2 flex items-center justify-between'>
                        <TradingLabel
                            label={t('common:max')}
                            value={`100 ${state.selectedAsset}`}
                            containerClassName='text-xs'
                        />
                        <TradingLabel
                            label={t('common:max')}
                            value={`100 ${state.selectedAsset}`}
                            containerClassName='text-xs'
                        />
                    </div>
                </div>
            </div>
        )
    }
)

export default FuturesOrderModule
