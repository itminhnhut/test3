import React from 'react';
import TradingInput from '../../../../trade/TradingInput';
import { useTranslation } from 'next-i18next'
import { getS3Url } from 'redux/actions/utils';

const OrderTPMobile = ({ tp, setTp, decimals, onChangeTpSL }) => {
    const { t } = useTranslation();
    return (
        <TradingInput
            thousandSeparator={true}
            label={'TP'}
            value={tp}
            allowNegative={false}
            onValueChange={({ floatValue = 0 }) => setTp(floatValue)}
            decimalScale={decimals.decimalScalePrice}
            labelClassName='whitespace-nowrap capitalize'
            containerClassName="h-[36px]"
            tailContainerClassName='flex items-center text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs select-none'
            renderTail={() => (
                <div className='relative group select-none' onClick={onChangeTpSL}>
                    <div className='flex items-center'>
                        <img src={getS3Url('/images/icon/ic_add.png')} height={16} width={16} className='min-w-[16px]' />
                    </div>
                </div>
            )}
            inputClassName="text-xs !text-center"
        />
    );
};

export default OrderTPMobile;