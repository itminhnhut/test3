import { memo, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { ChevronDown } from 'react-feather'

import TradingInput from 'components/trade/TradingInput'
import Tooltip from 'components/common/Tooltip'

const FuturesOrderLimit = memo(({ quoteAsset, baseAsset }) => {
    const { t } = useTranslation()

    return (
        <div>
            <TradingInput
                label={t('common:price')}
                tailContainerClassName='flex items-center text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs select-none'
                renderTail={() => (
                    <>
                        <div
                            data-tip=''
                            data-for='last_mark_price'
                            className='truncate mr-2 text-dominant cursor-pointer'
                        >
                            {t('futures:last_mark_price')}
                        </div>
                        <div>{quoteAsset}</div>
                        <Tooltip id='last_mark_price' place='top'>
                            <span className='text-xs'>
                                {t('futures:last_mark_price_tooltip')}
                            </span>
                        </Tooltip>
                    </>
                )}
            />
            <TradingInput
                containerClassName='mt-[12px]'
                label={t('futures:size')}
                labelClassName='whitespace-nowrap'
                tailContainerClassName='flex items-center text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs select-none'
                renderTail={() => (
                    <div className='relative group select-none'>
                        <div className='flex items-center'>
                            {quoteAsset}{' '}
                            <ChevronDown
                                size={12}
                                className='ml-1 group-hover:rotate-180'
                            />
                        </div>
                        <div className='overflow-hidden hidden group-hover:block absolute z-30 min-w-[55px] top-full right-0 text-txtPrimary dark:text-txtPrimary-dark rounded-md bg-bgPrimary dark:bg-bgPrimary-dark drop-shadow-onlyLight dark:border dark:border-darkBlue-4'>
                            <div className='px-3 py-1.5 hover:bg-teal-lightTeal dark:hover:bg-teal-opacity cursor-pointer'>
                                {quoteAsset}
                            </div>
                            <div className='px-3 py-1.5 hover:bg-teal-lightTeal dark:hover:bg-teal-opacity cursor-pointer'>
                                {baseAsset}
                            </div>
                        </div>
                    </div>
                )}
            />
        </div>
    )
})

export default FuturesOrderLimit
