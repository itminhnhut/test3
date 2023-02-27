import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import OpeningOrder from './OpeningOrder';
import OrderHistory from './OrderHistory';
import SpotFund from './SpotFund';
import TradeHistory from './TradeHistory';
import CheckBox from 'components/common/CheckBox';
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';

const SpotOrderList = (props) => {
    const { t } = useTranslation(['common', 'spot']);
    const [activeTab, setActiveTab] = useState('open');
    const [height, setHeight] = useState(0);
    const elementRef = useRef(null);

    const { query } = useRouter();
    const [currentTheme] = useDarkMode();
    const [hideOther, setHideOther] = useState(false);

    useEffect(() => {
        setHeight(elementRef.current.clientHeight - 90);
    }, [elementRef]);

    const _renderTab = useMemo(() => {
        const tabs = [
            {
                label: t('spot:open_orders'),
                value: 'open'
            },
            {
                label: t('spot:order_history'),
                value: 'order_history'
            },
            {
                label: t('spot:trade_history'),
                value: 'trade_history'
            },
            {
                label: t('spot:funds'),
                value: 'fund'
            }
        ];
        return (
            <Tabs tab={activeTab} className="gap-8 border-b border-divider dark:border-divider-dark px-6">
                {tabs?.map((tab) => (
                    <TabItem key={tab.value} V2 className="!text-left !px-0" value={tab.value} onClick={(isClick) => isClick && setActiveTab(tab.value)}>
                        {tab.label}
                    </TabItem>
                ))}
                <CheckBox
                    onChange={() => setHideOther(!hideOther)}
                    isV3
                    active={hideOther}
                    className="absolute right-6 h-full"
                    label={t('common:hide_other_symbols')}
                />
            </Tabs>
        );
    }, [activeTab, hideOther]);

    return (
        <>
            <div className="bg-bgSpotContainer dark:bg-bgSpotContainer-dark pb-6 h-full" ref={elementRef}>
                <div className="flex items-center justify-between relative dragHandleArea">{_renderTab}</div>
                <div className={`${currentTheme === THEME_MODE.LIGHT ? 'rdt_light' : 'rdt_dark'}`}>
                    {activeTab === 'open' && (
                        <OpeningOrder
                            filterByCurrentPair={hideOther}
                            height={height}
                            orderListWrapperHeight={props.orderListWrapperHeight}
                            currentPair={query?.id}
                            isPro={props.isPro}
                        />
                    )}
                    {activeTab === 'order_history' && (
                        <OrderHistory
                            isPro={props.isPro}
                            filterByCurrentPair={hideOther}
                            height={height}
                            orderListWrapperHeight={props.orderListWrapperHeight}
                            currentPair={query?.id}
                        />
                    )}
                    {activeTab === 'trade_history' && (
                        <TradeHistory
                            filterByCurrentPair={hideOther}
                            height={height}
                            orderListWrapperHeight={props.orderListWrapperHeight}
                            currentPair={query?.id}
                        />
                    )}
                    {activeTab === 'fund' && (
                        <SpotFund
                            filterByCurrentPair={hideOther}
                            isPro={props.isPro}
                            height={height}
                            orderListWrapperHeight={props.orderListWrapperHeight}
                            currentPair={query?.id}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default SpotOrderList;
