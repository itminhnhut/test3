import React from 'react';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { useTranslation } from 'next-i18next'
import classNames from 'classnames';


const TabOrderVndc = ({ side, setSide, className = '', isMobile, height = 32 }) => {
    const { t } = useTranslation()

    return (
        <div className="flex items-center spot-place-orders-container" style={{ height: height }}>
            <div className="spot-place-orders-tabs w-full">
                <div style={{ height: height }}
                    className={classNames(
                        'mr-[-1px] spot-place-orders-tab bg-bgInput dark:bg-bgInput-dark capitalize text-txtSecondary dark:text-txtSecondary-dark block--left',
                        {
                            ' active z-[2]': side === VndcFutureOrderType.Side.BUY
                        },
                        className
                    )}
                    onClick={() => setSide(VndcFutureOrderType.Side.BUY)}
                >
                    {t('common:buy')}
                </div>
                <svg
                    style={{ height: height }}
                    className={`!w-[34px] spot-place-orders-tab bg-bgInput dark:bg-bgInput-dark arrow z-[1] ${side === VndcFutureOrderType.Side.SELL
                        ? 'sell'
                        : 'buy'
                        }`}
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    fill="none"
                >
                    <path fill={side === VndcFutureOrderType.Side.SELL ? '#E5544B' : '#00C8BC'} d="M32 0L18.1569 0C17.096 0 16.0786 0.421427 15.3284 1.17157L3.32842 13.1716C1.76633 14.7337 1.76633 17.2663 3.32843 18.8284L15.3284 30.8284C16.0786 31.5786 17.096 32 18.1569 32H32V0Z" />
                </svg>
                <div
                    style={{ height: height }}
                    className={classNames(
                        'ml-[-1px] spot-place-orders-tab bg-bgInput dark:bg-bgInput-dark capitalize text-txtSecondary dark:text-txtSecondary-dark block--right',
                        {
                            ' active z-[2]': side === VndcFutureOrderType.Side.SELL
                        },
                        className
                    )}
                    onClick={() => setSide(VndcFutureOrderType.Side.SELL)}
                >
                    {t('common:sell')}
                </div>
            </div>
        </div>
    );
};



export default TabOrderVndc;
