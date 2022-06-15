import React, { useState } from 'react';
import TradingInput from '../../../../trade/TradingInput';
import { useTranslation } from 'next-i18next';
import { getS3Url } from 'redux/actions/utils';

const OrderTPMobile = ({ tp, setTp, decimals, onChangeTpSL, validator, context, isAuth }) => {
    const { t } = useTranslation();
    const [isFocus, setIsFocus] = useState(false);

    return (
        <div className="relative">
            {!isAuth && isFocus &&
                <div className='absolute right-0 top-0 -translate-y-full z-50 flex flex-col items-center'>
                    <div className='px-3 py-1.5 rounded-md bg-gray-3 dark:bg-darkBlue-4 text-xs'>
                        {t('futures:order_table:login_to_continue')}
                    </div>
                    <div
                        className='w-[8px] h-[6px] bg-gray-3 dark:bg-darkBlue-4'
                        style={{
                            clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
                        }}
                    />
                </div>
            }
            <TradingInput
                onusMode={true}
                thousandSeparator={true}
                label={'TP'}
                value={tp}
                allowNegative={false}
                onValueChange={({ floatValue = '' }) => setTp(floatValue)}
                decimalScale={decimals.decimalScalePrice}
                validator={validator}
                labelClassName='whitespace-nowrap capitalize dark:text-onus-grey'
                containerClassName="h-[36px] dark:bg-onus-input"
                tailContainerClassName='flex items-center text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs select-none'
                renderTail={() => (
                    <div className='relative group select-none'
                        onMouseDown={() => setIsFocus(true)}
                        onMouseLeave={() => setIsFocus(false)}
                        onClick={onChangeTpSL}>
                        <div className='flex items-center'>
                            <img src={getS3Url('/images/icon/ic_add.png')} height={16} width={16} className='min-w-[16px]' />
                        </div>
                    </div>
                )}
                inputClassName="text-xs !text-center"
                inputMode="decimal"
                allowedDecimalSeparators={[',', '.']}
            />
        </div>
    );
};

export default OrderTPMobile;
