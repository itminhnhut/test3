import React from 'react';
import classNames from 'classnames';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType'

const OrderButtonMobile = ({ side, price, stopPrice }) => {
    const isBuy = VndcFutureOrderType.Side.BUY === side
    return (
        <div className={`${isBuy ? 'bg-dominant' : 'bg-red'} h-[67px] rounded-[6px] flex items-center justify-center`}>

        </div>
    );
};

export default OrderButtonMobile;