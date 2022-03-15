import { memo, useState } from 'react'
import { FuturesOrderTypes } from 'redux/reducers/futures'
import { useTranslation } from 'next-i18next'

import FuturesOrderButtonsGroup from './OrderButtonsGroup'
import FuturesOrderUtilities from './OrderUtilities'
import FuturesOrderSlider from './OrderSlider'
import FuturesOrderMarket from './OrderMarket'
import FuturesOrderLimit from './OrderLimit'
import FuturesOrderSLTP from './OrderSLTP'
import TradingLabel from 'components/trade/TradingLabel'
import SvgExchange from 'components/svg/Exchange'
import Divider from 'components/common/Divider'

const INITIAL_STATE = {
    percentage: null,
}

const FuturesOrderModule = memo(({ currentType, pairConfig }) => {
    // ? State Management
    const [state, set] = useState(INITIAL_STATE)
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }))

    const { t } = useTranslation()

    // ? Render Handler
    const renderOrderInput = () => {
        switch (currentType) {
            case FuturesOrderTypes.Market:
                return <FuturesOrderMarket pairConfig={pairConfig} />
            case FuturesOrderTypes.Limit:
                return (
                    <FuturesOrderLimit
                        quoteAsset={pairConfig?.quoteAsset}
                        baseAsset={pairConfig?.baseAsset}
                    />
                )
            default:
                return null
        }
    }

    return (
        <div className='pt-5 pb-[18px]'>
            {/* Order Utilities */}
            <FuturesOrderUtilities
                quoteAsset={pairConfig?.quoteAsset}
                quoteAssetId={pairConfig?.quoteAssetId}
            />

            {/* Order Input Scenario */}
            <div className='mt-4'>
                {/*  */}
                {renderOrderInput()}
            </div>

            {/* Slider */}
            <div className='mt-4'>
                <FuturesOrderSlider />
            </div>
            <div className='mt-3.5 flex items-center justify-between select-none'>
                <TradingLabel
                    label={t('common:buy')}
                    value={'0.0000 BTC'}
                    containerClassName='text-xs'
                />
                <TradingLabel
                    label={t('common:sell')}
                    value={'0.0000 BTC'}
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
                        value={'100 USDT'}
                        containerClassName='text-xs'
                    />
                    <TradingLabel
                        label={t('common:cost')}
                        value={'100 USDT'}
                        containerClassName='text-xs'
                    />
                </div>
                <div className='mt-2 flex items-center justify-between'>
                    <TradingLabel
                        label={t('common:max')}
                        value={'100 USDT'}
                        containerClassName='text-xs'
                    />
                    <TradingLabel
                        label={t('common:max')}
                        value={'100 USDT'}
                        containerClassName='text-xs'
                    />
                </div>
            </div>
        </div>
    )
})

export default FuturesOrderModule
