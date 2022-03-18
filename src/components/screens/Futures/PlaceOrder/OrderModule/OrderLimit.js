import { memo, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { ChevronDown } from 'react-feather'

import TradingInput from 'components/trade/TradingInput'

const FuturesOrderLimit = ({
    isStopLimit,
    pairConfig,
    price,
    size,
    selectedAsset,
    getLastedLastPrice,
    setPrice,
    setSize,
    setStopPrice,
    setAsset,
}) => {
    const { t } = useTranslation()

    return (
        <div>
            {isStopLimit && (
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
                containerClassName='mb-[12px]'
                label={t('common:price')}
                value={price}
                onChange={(e) => setPrice(+e?.target?.value?.trim())}
                tailContainerClassName='relative flex items-center text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs select-none'
                renderTail={() => (
                    <>
                        <div
                            className='group truncate mr-2 text-dominant cursor-pointer'
                            onClick={getLastedLastPrice}
                        >
                            {t('futures:last_price')}
                            <div className='hidden group-hover:block absolute p-2 rounded-md -top-2 left-1/2 translate-x-[-85%] -translate-y-full text-xs text-txtPrimary dark:text-txtPrimary-dark bg-gray-3 dark:bg-darkBlue-4'>
                                {t('futures:last_price_tooltip')}
                                <div className='absolute bottom-0 translate-y-4 left-1/2 -translate-x-1/2 text-lg text-gray-3 dark:text-darkBlue-4'>
                                    <i className='ci-caret_down' />
                                </div>
                            </div>
                        </div>
                        <div>{pairConfig?.quoteAsset}</div>
                    </>
                )}
            />
            <TradingInput
                label={t('futures:size')}
                value={size}
                onChange={(e) => setSize(+e?.target?.value?.trim())}
                labelClassName='whitespace-nowrap'
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
                                onClick={() => setAsset(pairConfig?.quoteAsset)}
                            >
                                {pairConfig?.quoteAsset}
                            </div>
                            <div
                                className='px-3 py-1.5 hover:bg-teal-lightTeal dark:hover:bg-teal-opacity cursor-pointer'
                                onClick={() => setAsset(pairConfig?.baseAsset)}
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

export default FuturesOrderLimit
