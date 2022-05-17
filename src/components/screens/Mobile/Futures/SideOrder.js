import React, { memo } from 'react';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType'
import TabOrderVndc from 'components/screens/Futures/PlaceOrder/Vndc/TabOrderVndc'

const SideOrder = memo(({ side, setSide }) => {
    return (
        <div className="px-[16px]">
            <TabOrderVndc side={side} setSide={setSide} className="!text-xs" />
        </div>
    );
});

export default SideOrder;