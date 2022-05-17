import React from 'react';
import TradingInput from '../../../../trade/TradingInput';
import { useTranslation } from 'next-i18next'
import { getS3Url } from 'redux/actions/utils';

const OrderSLMobile = ({ sl, setSl, decimals }) => {
    const { t } = useTranslation();
    return (
        <TradingInput
            thousandSeparator={true}
            label={'SL'}
            value={sl}
            allowNegative={false}
            onValueChange={({ floatValue = 0 }) => setSl(floatValue)}
            decimalScale={decimals.decimalScalePrice}
            labelClassName='whitespace-nowrap capitalize'
            tailContainerClassName='flex items-center text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs select-none'
            renderTail={() => (
                <div className='relative group select-none'>
                    <div className='flex items-center'>
                        <img src={getS3Url('/images/icon/ic_add.png')} height={16} width={16} className='min-w-[16px]' />
                    </div>
                </div>
            )}
            inputClassName="text-xs"
        />
    );
};

export default OrderSLMobile;