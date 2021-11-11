import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { IconCustomCheckbox } from 'components/common/Icons';
import OpeningOrder from './OpeningOrder';
import OrderHistory from './OrderHistory';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'

const SpotOrderList = (props) => {
    const { t } = useTranslation(['common', 'spot']);
    const [activeTab, setActiveTab] = useState('open');
    const [height, setHeight] = useState(0);
    const [filterByCurrentPair, setFilterByCurrentPair] = useState(false);
    const elementRef = useRef(null);

    const { query } = useRouter();
    const [currentTheme, ] = useDarkMode()

    useEffect(() => {
        setHeight(elementRef.current.clientHeight - 90);
    }, [elementRef]);

    return (
        <>
            <div className="bg-bgContainer dark:bg-bgContainer-dark pb-6 h-full" ref={elementRef}>
                <div className="flex items-center justify-between relative">
                    <ul className="tabs pt-6 mb-4 px-3 dragHandleArea flex-1">
                        <li className="tab-item">
                            <a
                                className={'tab-link font-semibold ' + (activeTab === 'open' ? 'active text-black-700' : 'text-txtSecondary dark:text-txtSecondary-dark')}
                                onClick={() => setActiveTab('open')}
                            > {t('spot:open_orders')}
                            </a>
                        </li>
                        <li className="tab-item">
                            <a
                                className={'tab-link font-semibold ' + (activeTab === 'history' ? 'active text-black-700' : 'text-txtSecondary dark:text-txtSecondary-dark')}
                                onClick={() => setActiveTab('history')}
                            > {t('spot:order_history')}
                            </a>
                        </li>
                    </ul>
                    <div className="absolute text-sm bottom-6 right-6 flex items-center">
                        <div className="flex items-center justify-center relative cursor-pointer">
                            <input
                                type="checkbox"
                                id="pair"
                                onChange={() => setFilterByCurrentPair(prevState => !prevState)}
                                checked={filterByCurrentPair}
                                className="appearance-none w-[18px] h-[18px] border border-divider dark:border-divider-dark
                                           rounded-[4px] mr-2 checked:bg-[#09becf] checked:border-[#09becf] cursor-pointer"
                            />
                            <div className="absolute inset-0 top-[5px] left-1 w-min pointer-events-none">
                                {filterByCurrentPair && <IconCustomCheckbox size={14}/>}
                            </div>
                        </div>
                        <label htmlFor="pair" className="cursor-pointer text-xs">{t('spot:filter_by_current_pair')}</label>
                    </div>
                </div>
                <div className={`px-3 ${currentTheme === THEME_MODE.LIGHT ? 'rdt_light' : 'rdt_dark'}`} style={{ height: 'calc(100% - 120px)' }}>
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
