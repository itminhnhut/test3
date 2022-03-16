import { memo, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { ChevronDown } from 'react-feather'

import TradingInput from 'components/trade/TradingInput'

const FuturesOrderMarket = ({ isStopMarket, pairConfig }) => {
    const { t } = useTranslation()

    return (
        <div>
            {isStopMarket && (
                <TradingInput
                    containerClassName='mb-[12px]'
                    label={'Stop Price'}
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
                tailContainerClassName='flex items-center text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs select-none'
                renderTail={() => (
                    <div className='relative group select-none'>
                        <div className='flex items-center'>
                            {pairConfig?.quoteAsset}{' '}
                            <ChevronDown
                                size={12}
                                className='ml-1 group-hover:rotate-180'
                            />
                        </div>
                        <div className='overflow-hidden hidden group-hover:block absolute z-30 min-w-[55px] top-full right-0 text-txtPrimary dark:text-txtPrimary-dark rounded-md bg-bgPrimary dark:bg-bgPrimary-dark drop-shadow-onlyLight dark:border dark:border-darkBlue-4'>
                            <div className='px-3 py-1.5 hover:bg-teal-lightTeal dark:hover:bg-teal-opacity cursor-pointer'>
                                {pairConfig?.quoteAsset}
                            </div>
                            <div className='px-3 py-1.5 hover:bg-teal-lightTeal dark:hover:bg-teal-opacity cursor-pointer'>
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
