import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import ButtonClip from 'components/common/V2/ButtonV2/ButtonClip';
import LeverageSettings from 'components/screens/Futures/LeverageSettings';

const OrderSide = ({ side, setSide, leverage, setLeverage, pair, pairConfig, isAuth }) => {
    const { t } = useTranslation();
    const [showLeverage, setShowLeverage] = useState(false);

    return (
        <>
            <LeverageSettings
                pair={pair}
                leverage={leverage}
                setLeverage={setLeverage}
                pairConfig={pairConfig}
                isVisible={showLeverage}
                isAuth={isAuth}
                onClose={() => setShowLeverage(false)}
                isVndcFutures={true}
                dots={5}
                className="max-w-full overflow-hidden"
            />
            <div className="flex items-center space-x-2 mb-4">
                <div className="flex w-full">
                    <ButtonClip
                        isFuture
                        onClick={() => setSide(VndcFutureOrderType.Side.BUY)}
                        mode={VndcFutureOrderType.Side.BUY}
                        active={side === VndcFutureOrderType.Side.BUY}
                    >
                        {t('common:buy')}
                    </ButtonClip>
                    <ButtonClip
                        isFuture
                        onClick={() => setSide(VndcFutureOrderType.Side.SELL)}
                        mode={VndcFutureOrderType.Side.SELL}
                        active={side === VndcFutureOrderType.Side.SELL}
                    >
                        {t('common:sell')}
                    </ButtonClip>
                </div>
                <div
                    onClick={() => setShowLeverage(true)}
                    className="px-4 py-2 text-sm dark:text-txtSecondary-dark bg-gray-13 dark:bg-darkBlue-3 rounded-md cursor-pointer font-semibold"
                >
                    {leverage}x
                </div>
            </div>
        </>
    );
};

export default OrderSide;
