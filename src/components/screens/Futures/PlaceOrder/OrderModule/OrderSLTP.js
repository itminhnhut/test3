import CheckBox from 'components/common/CheckBox'
import TradingInput from 'components/trade/TradingInput'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'next-i18next'
import { setUsingSltp } from 'redux/actions/futures'
import { ChevronDown } from 'react-feather'

const FuturesOrderSLTP = () => {
    const useSltp = useSelector((state) => state.futures.useSltp) || false

    const dispatch = useDispatch()
    const { t } = useTranslation()

    return (
        <>
            <CheckBox
                label='TP-SL'
                active={useSltp}
                onChange={() => dispatch(setUsingSltp(!useSltp))}
            />
            {useSltp && (
                <>
                    <TradingInput
                        containerClassName='mt-[12px]'
                        label={t('futures:take_profit')}
                        labelClassName='whitespace-nowrap'
                        tailContainerClassName='flex items-center font-medium text-xs select-none'
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
                                        Lorem
                                    </div>
                                    <div className='px-3 py-1.5 hover:bg-teal-lightTeal dark:hover:bg-teal-opacity cursor-pointer'>
                                        ipsum
                                    </div>
                                </div>
                            </div>
                        )}
                    />
                    <TradingInput
                        containerClassName='mt-[12px]'
                        label={t('futures:stop_loss')}
                        labelClassName='whitespace-nowrap'
                        tailContainerClassName='flex items-center font-medium text-xs select-none'
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
                                        Lorem
                                    </div>
                                    <div className='px-3 py-1.5 hover:bg-teal-lightTeal dark:hover:bg-teal-opacity cursor-pointer'>
                                        ipsum
                                    </div>
                                </div>
                            </div>
                        )}
                    />
                </>
            )}
        </>
    )
}

export default FuturesOrderSLTP
