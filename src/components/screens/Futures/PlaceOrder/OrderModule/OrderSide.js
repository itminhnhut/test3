import React from 'react';
import { useTranslation } from 'next-i18next';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import ButtonClip from 'components/common/V2/ButtonV2/ButtonClip'

const OrderSide = ({ side, setSide, leverage }) => {
    const { t } = useTranslation();
    return (
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
            <div className="px-4 py-2 text-sm text-txtSecondary-dark bg-darkBlue-3 rounded-md cursor-pointer font-semibold">{leverage}x</div>
        </div>
    );
};

export default OrderSide;
