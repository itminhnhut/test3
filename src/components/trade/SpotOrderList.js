import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { IconCustomCheckbox } from 'components/common/Icons';
import OpeningOrder from './OpeningOrder';
import OrderHistory from './OrderHistory';

const SpotOrderList = (props) => {
    const { t } = useTranslation(['common', 'spot']);
    const [activeTab, setActiveTab] = useState('open');
    const [height, setHeight] = useState(0);
    const [filterByCurrentPair, setFilterByCurrentPair] = useState(false);
    const elementRef = useRef(null);

    const { query } = useRouter();

    useEffect(() => {
        setHeight(elementRef.current.clientHeight - 90);
    }, [elementRef]);

    return (
        <>
            <div className="bg-bgContainer dark:bg-bgContainer-dark rounded pb-6 h-full" ref={elementRef}>
                <div className="flex items-center justify-between relative">
                    <ul className="tabs pt-6 mb-4 px-3 dragHandleArea flex-1">
                        <li className="tab-item">
                            <a
                                className={'tab-link font-semibold ' + (activeTab === 'open' ? 'active text-black-700' : 'text-black-400')}
                                onClick={() => setActiveTab('open')}
                            > {t('spot:open_orders')}
                            </a>
                        </li>
                        <li className="tab-item">
                            <a
                                className={'tab-link font-semibold ' + (activeTab === 'history' ? 'active text-black-700' : 'text-black-400')}
                                onClick={() => setActiveTab('history')}
                            > {t('spot:order_history')}
                            </a>
                        </li>
                    </ul>
                    <div className="absolute text-sm bottom-6 right-6 flex items-center">
                        <div className="flex items-center justify-center relative">
                            <input
                                type="checkbox"
                                id="pair"
                                onChange={() => setFilterByCurrentPair(!filterByCurrentPair)}
                                checked={filterByCurrentPair}
                                className="appearance-none focus:outline-white w-[18px] h-[18px] border border-gray-200 rounded-[4px] mr-2 checked:bg-[#4021D0] checked:border-[#4021D0]"
                            />
                            <div className="absolute inset-0 top-[5px] left-1 w-min pointer-events-none">
                                <IconCustomCheckbox size={14} />
                            </div>
                        </div>
                        <label htmlFor="pair" className="cursor-pointer">{t('spot:filter_by_current_pair')}</label>
                    </div>
                </div>
                <div className="px-3" style={{ height: 'calc(100% - 120px)' }}>
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
