import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import FuturesLeverageSettings from 'components/screens/Futures/LeverageSettings';
import { API_FUTURES_LEVERAGE } from 'redux/actions/apis';
import axios from 'axios';
import { ApiStatus } from 'redux/actions/const';
import classnames from 'classnames';

const OrderLeverage = ({ leverage, setLeverage, isAuth, pair, pairConfig, context, getLeverage, inputValidator }) => {
    const { t } = useTranslation();
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        pairConfig?.pair && isAuth && fetchLeverage(pairConfig?.pair);
    }, [pairConfig?.pair, isAuth]);

    const fetchLeverage = async (symbol) => {
        const { data } = await axios.get(API_FUTURES_LEVERAGE, {
            params: {
                symbol
            }
        });
        if (data?.status === ApiStatus.SUCCESS) {
            if (getLeverage) getLeverage(data?.data?.[pairConfig?.pair]);
            setLeverage(data?.data?.[pairConfig?.pair]);
        }
    };

    useEffect(() => {
        document.addEventListener('click', _onClose);
        return () => {
            document.removeEventListener('click', _onClose);
        };
    }, []);

    const _onClose = (e) => {
        const container = document.querySelector('.leverage-mobile');
        if (container && !container.contains(e.target.parentElement)) {
            setOpenModal(false);
        }
    };

    return (
        <>
            <div
                onClick={() => setOpenModal(true)}
                data-tut="order-leverage"
                className={classnames(
                    'flex items-center justify-center h-[32px] w-12 text-txtPrimary dark:text-txtPrimary-dark border-divider dark:border-gray-4 leading-8 text-center border-[1px] text-xs px-[5px] rounded-[4px] font-medium',
                    { '!border-red-2': !inputValidator('leverage').isValid }
                )}
            >
                {leverage}x
            </div>
            {openModal && (
                <FuturesLeverageSettings
                    onusMode={true}
                    pair={pair}
                    leverage={leverage}
                    setLeverage={setLeverage}
                    pairConfig={pairConfig}
                    isVisible={openModal}
                    isAuth={isAuth}
                    onClose={() => setOpenModal(false)}
                    isVndcFutures={true}
                    dots={5}
                    className="max-w-full overflow-hidden"
                    // containerStyle={{ transform: 'unset' }}
                />
            )}
        </>
    );
};

export default OrderLeverage;
