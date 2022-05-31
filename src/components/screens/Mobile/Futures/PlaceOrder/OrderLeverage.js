import React, { useState, useEffect } from 'react';
import TradingInput from 'components/trade/TradingInput';
import { useTranslation } from 'next-i18next'
import { getS3Url } from 'redux/actions/utils';
import FuturesLeverageSettings from 'components/screens/Futures/LeverageSettings';
import { API_FUTURES_LEVERAGE } from 'redux/actions/apis';
import axios from 'axios';
import { ApiStatus } from 'redux/actions/const';

const OrderLeverage = ({ leverage, setLeverage, isAuth, pair, pairConfig, context, getLeverage }) => {
    const { t } = useTranslation();
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        isAuth && fetchLeverage(pairConfig?.pair)
    }, [pairConfig, isAuth])

    const fetchLeverage = async (symbol) => {
        const { data } = await axios.get(API_FUTURES_LEVERAGE, {
            params: {
                symbol,
            },
        })
        if (data?.status === ApiStatus.SUCCESS) {
            if (getLeverage) getLeverage(data?.data?.[pairConfig?.pair])
            setLeverage(data?.data?.[pairConfig?.pair])
        }
    }

    return (
        <>
            <div onClick={() => setOpenModal(true)}>
                <TradingInput
                    thousandSeparator={true}
                    label={t('futures:leverage:leverage')}
                    value={leverage}
                    allowNegative={false}
                    onValueChange={({ floatValue = '' }) => setLeverage(floatValue)}
                    decimalScale={0}
                    disabled
                    // isAllowed={({ floatValue }) => floatValue <= 125}
                    labelClassName='whitespace-nowrap'
                    containerClassName="h-[36px]"
                    tailContainerClassName='flex items-center text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs select-none'
                    renderTail={() => (
                        <div className='relative group select-none'>
                            <div className='flex items-center'>
                                <img src={getS3Url('/images/icon/ic_add.png')} height={16} width={16} className='min-w-[16px]' />
                            </div>
                        </div>
                    )}
                    inputClassName="text-xs"
                // onFocus={() => context.onHiddenBottomNavigation(true)}
                // onBlur={() => context.onHiddenBottomNavigation(false)}
                />
            </div>
            {openModal &&
                <FuturesLeverageSettings
                    pair={pair}
                    leverage={leverage}
                    setLeverage={setLeverage}
                    pairConfig={pairConfig}
                    isVisible={openModal}
                    isAuth={isAuth}
                    onClose={() => setOpenModal(false)}
                    isVndcFutures={true}
                    dots={5}
                    className="top-[50%]"
                />
            }
        </>
    );
};

export default OrderLeverage;