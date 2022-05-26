import React, { useState } from 'react';
import Portal from 'components/hoc/Portal'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import { ChevronLeft } from "react-feather";
import KlineChart from 'components/KlineChart/KlineChart'
import ms from 'ms'
import ChartTimer from './Chart/ChartTimer';
import Indicators from './Chart/Indicators';

const OrderDetail = ({ isVisible = true, onClose, order, pairConfig, pairParent, isVndcFutures }) => {
    const { t } = useTranslation()
    const [resolution, setResolution] = useState(ms('1h'))
    const [mainIndicator, setMainIndicator] = useState()
    const [subIndicator, setSubIndicator] = useState()
    const [candle, setCandle] = useState('candle_solid');
    console.log(order)
    return (
        <Portal portalId='PORTAL_MODAL'>
            <div className={classNames(
                'flex flex-col absolute top-0 left-0 h-full w-full z-[20] bg-white dark:bg-darkBlue-1',
                { invisible: !isVisible },
                { visible: isVisible }
            )}
            >
                <div className='flex items-center h-[50px] px-[25px]' onClick={() => onClose()}>
                    <ChevronLeft size={24} />
                    <span className='font-medium text-sm pl-[10px]'>{t('futures:mobile:order_detail')}  </span>

                </div>
                <div className='flex flex-col justify-center items-center py-[25px]'>
                    <span className="text-xs font-medium text-gray-1">Pair</span>
                    <span className="text-xl font-semibold">BNB/VNDC</span>
                    <span className="text-xs text-teal font-medium">Buy / Take Profit</span>
                </div>
                <div className="shadow-order_detail rounded-t-[20px] py-[10px]">
                    <div className="h-full min-h-[300px]">
                        <ChartTimer pair={order.symbol} pairConfig={pairConfig}
                            isVndcFutures={isVndcFutures} resolution={resolution}
                            setResolution={setResolution}
                            candle={candle} setCandle={setCandle}
                            className="py-[10px]"
                        />
                        <div className="h-[300px]">
                            <KlineChart
                                symbolInfo={{ exchange: 'NAMI_FUTURES', symbol: order.symbol, pricePrecision: pairConfig?.pricePrecision ?? 0 }}
                                resolution={resolution}
                                mainIndicator={mainIndicator}
                                subIndicator={subIndicator}
                                chartId={'order-detail'}
                                pairParent={pairParent}
                                candle={candle}
                            />
                        </div>
                        <Indicators
                            setMainIndicator={setMainIndicator} mainIndicator={mainIndicator}
                            setSubIndicator={setSubIndicator} subIndicator={subIndicator} />
                    </div>
                </div>
            </div>
        </Portal>
    );
};

export default OrderDetail;