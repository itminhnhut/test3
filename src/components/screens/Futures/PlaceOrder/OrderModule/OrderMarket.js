import { memo, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { ChevronDown } from 'react-feather'

import TradingInput from 'components/trade/TradingInput'

const FuturesOrderMarket = ({
    isStopMarket,
    pairConfig,
    selectedAsset,
    setAsset,
    handleQuantity,
    size,
    stopPrice,
    setStopPrice,
}) => {
    const { t } = useTranslation()
    const onReverseAsset = (current, asset) => {
        if (current === asset) return
        setAsset(asset)
        handleQuantity('')
    }

    return (
        <div>
            {isStopMarket && (
                <TradingInput
                    containerClassName='mb-[12px]'
                    label={'Stop Price'}
                    value={stopPrice}
                    onValueChange={({ value }) => setStopPrice(value)}
                    decimalScale={pairConfig?.pricePrecision}
                    tailContainerClassName='flex items-center text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs select-none'
                    renderTail={() => (
                        <div className='relative group select-none'>
                            <div className='flex items-center'>
                                Mark
                                <ChevronDown
                                    size={12}
                                    className='ml-1 group-hover:rotate-180'
                                />
                            </div>
                            <div className='overflow-hidden hidden group-hover:block absolute z-30 min-w-[55px] top-full right-0 text-txtPrimary dark:text-txtPrimary-dark rounded-md bg-bgPrimary dark:bg-bgPrimary-dark drop-shadow-onlyLight dark:border dark:border-darkBlue-4'>
                                <div className='px-3 py-1.5 hover:bg-teal-lightTeal dark:hover:bg-teal-opacity cursor-pointer'>
                                    Last
                                </div>
                                <div className='px-3 py-1.5 hover:bg-teal-lightTeal dark:hover:bg-teal-opacity cursor-pointer'>
                                    Mark
                                </div>
                            </div>
                        </div>
                    )}
                />
            )}
            <TradingInput
                label={t('futures:size')}
                labelClassName='whitespace-nowrap'
                size={size}
                onChange={({ target: { value } }) => handleQuantity(value)}
                tailContainerClassName='flex items-center text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs select-none'
                renderTail={() => (
                    <div className='relative group select-none'>
                        <div className='flex items-center'>
                            {selectedAsset}{' '}
                            <ChevronDown
                                size={12}
                                className='ml-1 group-hover:rotate-180'
                            />
                        </div>
                        <div className='overflow-hidden hidden group-hover:block absolute z-30 min-w-[55px] top-full right-0 text-txtPrimary dark:text-txtPrimary-dark rounded-md bg-bgPrimary dark:bg-bgPrimary-dark drop-shadow-onlyLight dark:border dark:border-darkBlue-4'>
                            <div
                                className='px-3 py-1.5 hover:bg-teal-lightTeal dark:hover:bg-teal-opacity cursor-pointer'
                                onClick={() =>
                                    onReverseAsset(
                                        selectedAsset,
                                        pairConfig?.quoteAsset
                                    )
                                }
                            >
                                {pairConfig?.quoteAsset}
                            </div>
                            <div
                                className='px-3 py-1.5 hover:bg-teal-lightTeal dark:hover:bg-teal-opacity cursor-pointer'
                                onClick={() =>
                                    onReverseAsset(
                                        selectedAsset,
                                        pairConfig?.baseAsset
                                    )
                                }
                            >
                                {pairConfig?.baseAsset}
                            </div>
                        </div>
                    </div>
                )}
            />
        </div>
    )
}

export default FuturesOrderMarket
