import React, {useState, useEffect, useMemo} from 'react';
import TradingInput from 'components/trade/TradingInput';
import {useTranslation} from 'next-i18next'
import {getS3Url} from 'redux/actions/utils';
import FuturesLeverageSettings from 'components/screens/Futures/LeverageSettings';
import {API_FUTURES_LEVERAGE} from 'redux/actions/apis';
import axios from 'axios';
import {ApiStatus} from 'redux/actions/const';

const OrderLeverage = ({leverage, setLeverage, isAuth, pair, pairConfig, context, getLeverage}) => {
    const {t} = useTranslation();
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        isAuth && fetchLeverage(pairConfig?.pair)
    }, [pairConfig, isAuth])

    const fetchLeverage = async (symbol) => {
        const {data} = await axios.get(API_FUTURES_LEVERAGE, {
            params: {
                symbol,
            },
        })
        if (data?.status === ApiStatus.SUCCESS) {
            if (getLeverage) getLeverage(data?.data?.[pairConfig?.pair])
            setLeverage(data?.data?.[pairConfig?.pair])
        }
    }

    const classMobile = useMemo(() => {
        return 'w-[95%] overflow-x-hidden !max-w-[500px]'
    }, [])

    return (
        <>
            <div
                onClick={() => setOpenModal(true)}
                data-tut="order-leverage"
                className="h-[32px] w-12 text-teal border-teal leading-8 text-center border-[1px] text-xs px-[5px] rounded-[4px]">{leverage}x
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
                className={`top-[50%] ${classMobile}`}
            />
            }
        </>
    );
};

export default OrderLeverage;
