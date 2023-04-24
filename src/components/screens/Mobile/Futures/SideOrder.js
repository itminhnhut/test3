import React, { memo } from 'react';
import TabOrderVndc from 'components/screens/Futures/PlaceOrder/Vndc/TabOrderVndc';

const SideOrder = memo(({ side, setSide }) => {
    return (
        <div data-tut="order-side">
            <TabOrderVndc
                side={side}
                setSide={setSide}
                isMobile
                className="!text-xs bg-gray-12 dark:bg-dark-2 text-txtSecondary dark:text-txtSecondary-dark"
                height={32}
            />
        </div>
    );
});

export default SideOrder;
