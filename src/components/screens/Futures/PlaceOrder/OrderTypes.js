import { memo, useState } from 'react';
import { FuturesOrderTypes as OrderTypes } from 'redux/reducers/futures';
import { useTranslation } from 'next-i18next';
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';

const FuturesOrderTypes = memo(({ currentType, orderTypes, setCurrentType }) => {
    const { t } = useTranslation();

    // ? Helper
    const getTypesLabel = (type) => {
        switch (type) {
            case OrderTypes.Limit:
                return t('trade:order_types.limit');
            case OrderTypes.StopLimit:
                return t('trade:order_types.stop_limit');
            case OrderTypes.Market:
                return t('trade:order_types.market');
            case OrderTypes.StopMarket:
                return t('trade:order_types.stop_market');
            case OrderTypes.TrailingStopMarket:
                return t('trade:order_types.trailing_stop');
            default:
                return '--';
        }
    };

    const orderFilter = orderTypes;
    return (
        <div className="relative flex items-center select-none ">
            <div className="relative z-20 overflow-hidden w-full">
                <Tabs tab={currentType} className="gap-6 border-b border-divider dark:border-divider-dark">
                    {orderFilter?.map((tab, i) => (
                        <TabItem key={i} V2 className="!text-left !px-0" value={tab} onClick={(isClick) => isClick && setCurrentType(tab)}>
                            {getTypesLabel(tab)}
                        </TabItem>
                    ))}
                </Tabs>
            </div>
        </div>
    );
});

export default FuturesOrderTypes;
