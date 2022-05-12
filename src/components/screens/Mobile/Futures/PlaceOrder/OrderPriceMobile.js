import React from 'react';
import TradingInput from '../../../../trade/TradingInput';
import { useTranslation } from 'next-i18next'
import { getS3Url } from 'redux/actions/utils';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType'

const OrderPriceMobile = ({ price, setPrice, decimals, disabled }) => {
    const { t } = useTranslation();
    return (
        <TradingInput
            thousandSeparator={true}
            label={t('futures:price')}
            value={disabled ? '' : price}
            allowNegative={false}
            disabled={disabled}
            // onChange={({ target: { value } }) => setPrice(value)}
            // validator={getValidator('quantity')}
            onValueChange={({ floatValue }) => setPrice(floatValue)}
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

export default OrderPriceMobile;