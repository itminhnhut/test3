import React, { useContext } from 'react';
import TradingInput from '../../../../trade/TradingInput';
import { useTranslation } from 'next-i18next'
import { FuturesOrderTypes as OrderTypes } from 'redux/reducers/futures';


const OrderPriceMobile = ({ price, setPrice, decimals, type, context, stopPrice, setStopPrice, pairConfig, validator }) => {
    const { t } = useTranslation();
    const disabled = OrderTypes.Market === type;
    const getLabelName = OrderTypes.Market === type ? t('futures:price_market') : t('futures:price')
    const stopMarket = OrderTypes.StopMarket === type
    return (
        <TradingInput
            thousandSeparator={true}
            label={getLabelName}
            value={disabled ? '' : stopMarket ? stopPrice : price}
            allowNegative={false}
            disabled={disabled}
            validator={validator}
            onValueChange={({ floatValue = '' }) => stopMarket ? setStopPrice(floatValue) : setPrice(floatValue)}
            decimalScale={decimals.decimalScalePrice}
            labelClassName='whitespace-nowrap'
            containerClassName="h-[36px]"
            tailContainerClassName='flex items-center text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs select-none'
            renderTail={() => (
                <div className='relative group select-none'>
                    <div className='flex items-center'>
                        {pairConfig?.quoteAsset ?? ''}
                    </div>
                </div>
            )}
            inputClassName={`text-xs !text-center ${disabled ? '!mx-0' : ''}`}
            inputMode="decimal"
            allowedDecimalSeparators={[',', '.']}
        // onFocus={() => context.onHiddenBottomNavigation(true)}
        // onBlur={() => context.onHiddenBottomNavigation(false)}
        />
    );
};

export default OrderPriceMobile;