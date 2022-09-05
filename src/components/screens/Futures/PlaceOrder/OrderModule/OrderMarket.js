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
    isVndcFutures,
    decimalScalePrice,
    decimalScaleQty
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
                    label={t('common:stop_price')}
                    value={stopPrice}
                    onValueChange={({ value }) => setStopPrice(value)}
                    allowNegative={false}
                    decimalScale={decimalScalePrice}
                    validator={getValidator('price', true)}
                    tailContainerClassName='flex items-center text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs select-none'
                    renderTail={() => (
                        <div className='relative group select-none'>
                            <div className='flex items-center'>
                                {pairConfig?.quoteAsset}
                            </div>
                        </div>
                    )}
                />
            )}
            <TradingInput
                thousandSeparator={String(size)?.includes('%') ? false : true}
                label={t('futures:size')}
                labelClassName='whitespace-nowrap capitalize'
                value={size}
                allowNegative={false}
                suffix={String(size)?.includes('%') ? '%' : ''}
                onChange={({ target: { value } }) => handleQuantity(value)}
                decimalScale={decimalScaleQty}
                validator={getValidator('quantity')}
                tailContainerClassName='flex items-center text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs select-none'
                renderTail={() => (
                    <div className='relative group select-none'>
                        <div className='flex items-center'>
                            {selectedAsset}
                        </div>
                    </div>
                )}
            />
        </div>
    )
}

export default FuturesOrderMarket
