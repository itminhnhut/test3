import React, { useEffect, useRef, memo, useState } from 'react';
import TradingInput from '../../../../trade/TradingInput';
import { useTranslation } from 'next-i18next'
import { getS3Url } from 'redux/actions/utils';
import OrderVolumeMobileModal from './OrderVolumeMobileModal';

const initPercent = 25;
const OrderVolumeMobile = memo(({ size, setSize, decimals, context, pairConfig, setShowEditVolume }) => {
    const { t } = useTranslation();

    return (
        <div onClick={() => setShowEditVolume(true)} >
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
                disabled
                inputClassName="text-xs !text-center"
            // onFocus={() => context.onHiddenBottomNavigation(true)}
            // onBlur={() => context.onHiddenBottomNavigation(false)}
            />
        </div>
    );
});

export default OrderVolumeMobile;