import React, { useEffect, useRef, memo } from 'react';
import TradingInput from '../../../../trade/TradingInput';
import { useTranslation } from 'next-i18next'
import { getS3Url } from 'redux/actions/utils';
const initPercent = 25;
const OrderVolumeMobile = memo(({ size, setSize, decimals, context, pairConfig }) => {
    const { t } = useTranslation();
    return (
        <TradingInput
            thousandSeparator={true}
            label={t('futures:order_table:volume')}
            value={size}
            allowNegative={false}
            onValueChange={({ floatValue = '' }) => setSize(floatValue)}
            // validator={getValidator('quantity')}
            decimalScale={decimals.decimalScaleQtyLimit}
            labelClassName='whitespace-nowrap'
            containerClassName="h-[36px]"
            tailContainerClassName='flex items-center text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs select-none'
            renderTail={() => (
                <div className='relative group select-none'>
                    <div className='flex items-center'>
                        {pairConfig?.baseAsset ?? ''}
                    </div>
                </div>
            )}
            inputClassName="text-xs !text-center"
        // onFocus={() => context.onHiddenBottomNavigation(true)}
        // onBlur={() => context.onHiddenBottomNavigation(false)}
        />
    );
});

export default OrderVolumeMobile;