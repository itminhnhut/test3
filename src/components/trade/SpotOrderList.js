import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { IconCustomCheckbox } from 'components/common/Icons';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import OpeningOrder from './OpeningOrder';
import OrderHistory from './OrderHistory';

const SpotOrderList = (props) => {
    const { t } = useTranslation(['common', 'spot']);
    const [activeTab, setActiveTab] = useState('open');
    const [height, setHeight] = useState(0);
    const [filterByCurrentPair, setFilterByCurrentPair] = useState(false);
    const elementRef = useRef(null);

    const { query } = useRouter();
    const [currentTheme] = useDarkMode();

    useEffect(() => {
        setHeight(elementRef.current.clientHeight - 90);
    }, [elementRef]);

    const _renderTab = useMemo(() => {
        const tabs = [
            {
                label: t('spot:open_orders'),
                value: 'open',
            },
            {
                label: t('spot:order_history'),
                value: 'order_histories',
            },
            {
                label: t('spot:trade_history'),
                value: 'trade_histories',
            },
            {
                label: t('spot:funds'),
                value: 'funds',
            },
        ];
        return (
            <ul className="tabs justify-start mb-2 w-full">
                {tabs.map((tab, index) => {
                    const { label, value } = tab;
                    const isActive = activeTab === value;
                    return (
                        <li className={`tab-item px-2 font-medium ${isActive ? 'active' : ''}`} key={value}>
                            <a
                                className={'tab-link text-txtSecondary dark:text-txtSecondary-dark ' + (isActive ? 'active' : '')}
                                onClick={() => setActiveTab(value)}
                            >
                                {label}
                            </a>
                        </li>);
                })}
            </ul>
        );
    }, [activeTab]);

    return (
        <>
            <div className="bg-bgContainer dark:bg-bgContainer-dark pb-6 h-full" ref={elementRef}>
                <div className="flex items-center justify-between relative dragHandleArea">
                    {_renderTab}
                </div>
                <div className={`px-3 ${currentTheme === THEME_MODE.LIGHT ? 'rdt_light' : 'rdt_dark'}`}>
                    {activeTab === 'open' && <OpeningOrder
                        height={height}
                        orderListWrapperHeight={props.orderListWrapperHeight}
                        currentPair={query?.id}
                        filterByCurrentPair={filterByCurrentPair}
                    />}
                    {activeTab === 'history' && <OrderHistory
                        height={height}
                        orderListWrapperHeight={props.orderListWrapperHeight}
                        currentPair={query?.id}
                        filterByCurrentPair={filterByCurrentPair}
                    />}
                </div>
            </div>

        </>
    );
};

export default SpotOrderList;
