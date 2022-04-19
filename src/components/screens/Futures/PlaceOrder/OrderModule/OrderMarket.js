import { useTranslation } from 'next-i18next';
import { ChevronDown } from 'react-feather';

import TradingInput from 'components/trade/TradingInput';
import { FuturesStopOrderMode } from 'redux/reducers/futures';

const FuturesOrderMarket = ({
    isStopMarket,
    pairConfig,
    selectedAsset,
    setAsset,
    handleQuantity,
    size,
    stopPrice,
    setStopPrice,
    getValidator,
    stopOrderMode,
    setStopOrderMode,
    getOrderStopModeLabel,
    isVndcFutures
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
                                {isVndcFutures ? 'VNDC' : <>
                                    {getOrderStopModeLabel(stopOrderMode)}
                                    <ChevronDown
                                        size={12}
                                        className='ml-1 group-hover:rotate-180'
                                    />
                                </>
                                }
                            </div>
                            {!isVndcFutures &&
                                <div className='overflow-hidden hidden group-hover:block absolute z-30 min-w-[55px] top-full right-0 text-txtPrimary dark:text-txtPrimary-dark rounded-md bg-bgPrimary dark:bg-bgPrimary-dark drop-shadow-onlyLight dark:border dark:border-darkBlue-4'>
                                    <div
                                        className='px-3 py-1.5 hover:bg-teal-lightTeal dark:hover:bg-teal-opacity cursor-pointer'
                                        onClick={() =>
                                            setStopOrderMode(
                                                FuturesStopOrderMode.lastPrice
                                            )
                                        }
                                    >
                                        Last
                                    </div>
                                    <div
                                        className='px-3 py-1.5 hover:bg-teal-lightTeal dark:hover:bg-teal-opacity cursor-pointer'
                                        onClick={() =>
                                            setStopOrderMode(
                                                FuturesStopOrderMode.markPrice
                                            )
                                        }
                                    >
                                        Mark
                                    </div>
                                </div>
                            }
                        </div>
                    )}
                />
            )}
            <TradingInput
                thousandSeparator={size?.includes('%') ? false : true}
                label={t('futures:size')}
                labelClassName='whitespace-nowrap'
                value={size}
                suffix={size?.includes('%') ? '%' : ''}
                onChange={({ target: { value } }) => handleQuantity(value)}
                decimalScale={pairConfig?.quantityPrecision}
                validator={getValidator('quantity')}
                tailContainerClassName='flex items-center text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs select-none'
                renderTail={() => (
                    <div className='relative group select-none'>
                        <div className='flex items-center'>
                            {selectedAsset}{' '}
                            {!isVndcFutures &&
                                <ChevronDown
                                    size={12}
                                    className='ml-1 group-hover:rotate-180'
                                />
                            }
                        </div>
                        {!isVndcFutures &&
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
                        }
                    </div>
                )}
            />
        </div>
    )
}

export default FuturesOrderMarket
