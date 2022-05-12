import React, { useState, useEffect } from 'react';
import TradingInput from 'components/trade/TradingInput';
import { useTranslation } from 'next-i18next'
import { getS3Url } from 'redux/actions/utils';
import FuturesLeverageSettings from 'components/screens/Futures/LeverageSettings';
import { API_FUTURES_LEVERAGE } from 'redux/actions/apis';
import axios from 'axios';
import { ApiStatus } from 'redux/actions/const';

const OrderLeverage = ({ leverage, setLeverage, isAuth, pair, pairConfig }) => {
    const { t } = useTranslation();
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        isAuth && getLeverage(pairConfig?.pair)
    }, [pairConfig, isAuth])

    const getLeverage = async (symbol) => {
        const { data } = await axios.get(API_FUTURES_LEVERAGE, {
            params: {
                symbol,
            },
        })
        if (data?.status === ApiStatus.SUCCESS) {
            setLeverage(data?.data?.[pairConfig?.pair])
        }
    }

    return (
        <>
            <TradingInput
                thousandSeparator={true}
                label={t('futures:leverage:leverage')}
                value={leverage}
                allowNegative={false}
                onValueChange={({ floatValue }) => setLeverage(floatValue ?? 1)}
                decimalScale={0}
                // isAllowed={({ floatValue }) => floatValue <= 125}
                labelClassName='whitespace-nowrap capitalize'
                tailContainerClassName='flex items-center text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs select-none'
                renderTail={() => (
                    <div className='relative group select-none'>
                        <div className='flex items-center' onClick={() => setOpenModal(true)}>
                            <img src={getS3Url('/images/icon/ic_add.png')} height={16} width={16} className='min-w-[16px]' />
                        </div>
                    </div>
                )}
                inputClassName="text-xs"
            />
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
                />
            }
        </>
    );
};

export default OrderLeverage;