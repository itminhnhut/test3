import React, { useEffect, useRef, memo } from 'react';
import TradingInput from '../../../../trade/TradingInput';
import { useTranslation } from 'next-i18next'
import { getS3Url } from 'redux/actions/utils';
const initPercent = 25;
const OrderVolumeMobile = memo(({ size, setSize, decimals, maxSize, type, side }) => {
    const { t } = useTranslation();
    const refresh = useRef(false);

    useEffect(() => {
        if (!refresh.current && maxSize) {
            refresh.current = true;
            setSize(maxSize * initPercent / 100);
        }
    }, [maxSize])

    useEffect(() => {
        refresh.current = false;
    }, [type])

    useEffect(() => {
        setSize(maxSize * initPercent / 100);
    }, [side, type])

    return (
        <TradingInput
            thousandSeparator={true}
            label={t('futures:volume')}
            value={size}
            allowNegative={false}
            onValueChange={({ floatValue = 0 }) => setSize(floatValue)}
            // validator={getValidator('quantity')}
            decimalScale={decimals.decimalScaleQtyLimit}
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
});

export default OrderVolumeMobile;