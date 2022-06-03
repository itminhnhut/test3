import React, { memo } from 'react';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType'
import TabOrderVndc from 'components/screens/Futures/PlaceOrder/Vndc/TabOrderVndc'

const SideOrder = memo(({ side, setSide }) => {
    return (
        <div data-tut="order-side">
            <TabOrderVndc side={side} setSide={setSide} isMobile className="!text-xs" height={32} />
        </div>
    );
});

export default SideOrder;
