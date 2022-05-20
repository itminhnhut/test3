import React from 'react';
import TradingInput from '../../../../trade/TradingInput';
import { useTranslation } from 'next-i18next'
import { getS3Url } from 'redux/actions/utils';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { FuturesOrderTypes as OrderTypes } from 'redux/reducers/futures';

const OrderPriceMobile = ({ price, setPrice, decimals, type }) => {
    const { t } = useTranslation();
    const disabled = OrderTypes.Market === type;
    const getLabelName = OrderTypes.Market === type ? t('futures:price_market') : t('futures:price')

    return (
        <TradingInput
            thousandSeparator={true}
            label={getLabelName}
            value={disabled ? '' : price}
            allowNegative={false}
            disabled={disabled}
            // onChange={({ target: { value } }) => setPrice(value)}
            // validator={getValidator('quantity')}
            onValueChange={({ floatValue = 0 }) => setPrice(floatValue)}
            decimalScale={decimals.decimalScalePrice}
            labelClassName='whitespace-nowrap capitalize'
            containerClassName="h-[36px]"
            tailContainerClassName='flex items-center text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs select-none'
            // renderTail={() => (
            //     <div className='relative group select-none'>
            //         <div className='flex items-center'>
            //             <img src={getS3Url('/images/icon/ic_add.png')} height={16} width={16} className='min-w-[16px]' />
            //         </div>
            //     </div>
            // )}
            inputClassName="text-xs"
        />
    );
};

export default OrderPriceMobile;