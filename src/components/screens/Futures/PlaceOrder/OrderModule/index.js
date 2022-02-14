import { memo } from 'react'
import { FuturesOrderTypes } from 'redux/reducers/futures'
import { useTranslation } from 'next-i18next'
import { File } from 'react-feather'

import FuturesOrderMarket from './OrderMarket'
import FuturesOrderLimit from './OrderLimit'
import TradingLabel from 'components/trade/TradingLabel'
import SvgExchange from 'components/svg/Exchange'
import AvblAsset from 'components/trade/AvblAsset'

const FuturesOrderModule = memo(({ currentType, pairConfig }) => {
    const { t } = useTranslation()

    const renderOrderInput = () => {
        switch (currentType) {
            case FuturesOrderTypes.Market:
                return <FuturesOrderMarket />
            case FuturesOrderTypes.Limit:
            default:
                return <FuturesOrderLimit />
        }
    }

    return (
        <div className='pt-5 pb-[18px]'>
            {/* Order Utilities */}
            <div className='flex items-center'>
                <div className='flex-grow'>
                    <TradingLabel
                        label={t('common:available_balance')}
                        value={
                            <AvblAsset
                                useSuffix
                                assetId={pairConfig?.quoteAssetId}
                            />
                        }
                    />
                </div>
                <div className='w-6 h-6 flex items-center justify-center rounded-md cursor-pointer hover:bg-gray-4 dark:hover:bg-darkBlue-3'>
                    <div className='flex flex-col text-txtSecondary dark:text-txtSecondary-dark'>
                        <i className='block translate-y-1/3 ci-small_long_left' />
                        <i className='block -translate-y-1/3 ci-small_long_right' />
                    </div>
                </div>
                <div className='w-6 h-6 ml-2 flex items-center justify-center rounded-md cursor-pointer hover:bg-gray-4 dark:hover:bg-darkBlue-3 text-txtSecondary dark:text-txtSecondary-dark'>
                    <File size={16} strokeWidth={1.8} />
                </div>
            </div>

            {/* Main Order */}
            <div className='mt-4'>{renderOrderInput()}</div>
        </div>
    )
})

export default FuturesOrderModule
