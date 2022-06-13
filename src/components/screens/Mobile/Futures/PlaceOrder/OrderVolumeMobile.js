import React, { useEffect, useRef, memo, useState } from 'react';
import TradingInput from '../../../../trade/TradingInput';
import { useTranslation } from 'next-i18next'
import { getS3Url } from 'redux/actions/utils';
import OrderVolumeMobileModal from './OrderVolumeMobileModal';

const initPercent = 25;
const OrderVolumeMobile = memo(({ decimals, pairConfig, setShowEditVolume, quoteQty }) => {
    const { t } = useTranslation();

    return (
        <div onClick={() => setShowEditVolume(true)} >
            <TradingInput
                thousandSeparator={true}
                label={t('futures:mobile:volume')}
                value={quoteQty}
                allowNegative={false}
                // onValueChange={({ floatValue = '' }) => setSize(floatValue)}
                // validator={getValidator('quantity')}
                decimalScale={0}
                labelClassName='whitespace-nowrap capitalize dark:text-onus-grey'
                containerClassName="h-[36px] dark:bg-onus-input"
                tailContainerClassName='flex items-center text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs select-none'
                renderTail={() => (
                    <div className='relative group select-none dark:text-onus-grey'>
                        <div className='flex items-center'>
                            {pairConfig?.quoteAsset ?? ''}
                        </div>
                    </div>
                )}
                readOnly
                inputClassName="text-xs !text-center !text-white"
            // onFocus={() => context.onHiddenBottomNavigation(true)}
            // onBlur={() => context.onHiddenBottomNavigation(false)}
            />
        </div>
    );
});

export default OrderVolumeMobile;