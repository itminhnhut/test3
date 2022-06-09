import React from 'react';
import TradingInput from '../../../../trade/TradingInput';
import { useTranslation } from 'next-i18next'
import { getS3Url } from 'redux/actions/utils';

const OrderSLMobile = ({ sl, setSl, decimals, onChangeTpSL, validator, context }) => {
    return (
        <TradingInput
            thousandSeparator={true}
            validator={validator}
            label={'SL'}
            value={sl}
            allowNegative={false}
            onValueChange={({ floatValue = '' }) => setSl(floatValue)}
            decimalScale={decimals.decimalScalePrice}
            labelClassName='whitespace-nowrap capitalize'
            containerClassName="h-[36px]"
            tailContainerClassName='flex items-center text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs select-none'
            renderTail={() => (
                <div className='relative group select-none'>
                    <div className='flex items-center' onClick={onChangeTpSL} >
                        <img src={getS3Url('/images/icon/ic_add.png')} height={16} width={16} className='min-w-[16px]' />
                    </div>
                </div>
            )}
            inputClassName="text-xs !text-center"
            inputMode="decimal"
            allowedDecimalSeparators={[',', '.']}
        // onFocus={() => context.onHiddenBottomNavigation(true)}
        // onBlur={() => context.onHiddenBottomNavigation(false)}
        />
    );
};

export default OrderSLMobile;
