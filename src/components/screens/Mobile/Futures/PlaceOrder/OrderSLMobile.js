import React, { useState } from 'react';
import TradingInput from '../../../../trade/TradingInput';
import { useTranslation } from 'next-i18next';
import { getS3Url } from 'redux/actions/utils';
import AddCircleOutline from 'components/svg/AddCircleOutline';

const OrderSLMobile = ({ sl, setSl, decimals, onChangeTpSL, validator, context, isAuth, show }) => {
    const { t } = useTranslation();
    const [isFocus, setIsFocus] = useState(false);

    return (
        <div className="relative">
            {!isAuth && isFocus &&
                <div className='absolute right-0 top-0 -translate-y-full z-50 flex flex-col items-center'>
                    <div className='px-3 py-1.5 rounded-md bg-darkBlue-4 text-xs'>
                        {t('futures:order_table:login_to_continue')}
                    </div>
                    <div
                        className='w-[8px] h-[6px] bg-darkBlue-4'
                        style={{
                            clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
                        }}
                    />
                </div>
            }
            <TradingInput
                onusMode={true}
                thousandSeparator={true}
                validator={validator}
                label={'SL'}
                value={sl}
                allowNegative={false}
                onValueChange={({ floatValue = '' }) => setSl(floatValue)}
                decimalScale={decimals.decimalScalePrice}
                labelClassName='whitespace-nowrap capitalize text-txtSecondary dark:text-txtSecondary-dark'
                containerClassName="h-[36px] bg-gray-12 dark:bg-dark-2"
                tailContainerClassName='flex items-center text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs select-none'
                renderTail={() => {
                    if (!show) return null
                    return (<div className='relative group select-none' data-tut="order-adjust-btn">
                        <div className='flex items-center'
                            onMouseDown={() => setIsFocus(true)}
                            onMouseLeave={() => setIsFocus(false)}
                            onClick={onChangeTpSL} >
                            <AddCircleOutline color="currentColor" size={16} className="text-txtSecondary dark:text-txtSecondary-dark flex-shrink-0"/>
                        </div>
                    </div>)
                }

                }
                inputClassName="text-xs !text-center"
                inputMode="decimal"
                allowedDecimalSeparators={[',', '.']}
            />
        </div>
    );
};

export default OrderSLMobile;
