import React, {Fragment, useState} from 'react';
import SocketLayout from 'components/screens/Mobile/Futures/SocketLayout';
import { formatNumber, getS3Url } from 'redux/actions/utils';
import { roundTo } from 'round-to';
import classNames from 'classnames';
import ms from "ms";
import { listTimeFrame } from "components/KlineChart/kline.service";
import { Popover, Transition } from "@headlessui/react";
import ModelMarketMobile from "components/screens/Mobile/Market/ModelMarket";

const candleList = [
    { value: 'candle_solid', text: 'Solid' },
    { value: 'candle_stroke', text: 'Stroke' },
    { value: 'candle_up_stroke', text: 'Up Stroke' },
    { value: 'candle_down_stroke', text: 'Down Stroke' },
    { value: 'ohlc', text: 'OHLC' },
    { value: 'area', text: 'Area Chart' }
]
const ChartTimer = ({
    pairConfig, pair, isVndcFutures, resolution, setResolution,
    candle, setCandle
}) => {
    if (!pairConfig) return null;
    const [showModelMarket, setShowModelMarket] = useState(false)
    return (
        <div className="min-h-[64px] chart-timer flex items-center justify-between px-[10px]">
            <div className="flex items-center cursor-pointer" onClick={() => setShowModelMarket(true)}>
                <img src={getS3Url('/images/icon/ic_exchange_mobile.png')} height={16} width={16} />
                <div className="pl-[10px] font-semibold text-sm">{pairConfig?.baseAsset + '/' + pairConfig?.quoteAsset}</div>
                <SocketLayout pairConfig={pairConfig} pair={pair} >
                    <Change24h pairConfig={pairConfig} isVndcFutures={isVndcFutures} />
                </SocketLayout>
            </div>
            <div className="flex items-center">
                <MenuTime
                    value={resolution}
                    onChange={setResolution}
                    keyValue="value"
                    displayValue="text"
                    options={listTimeFrame}
                    classNameButton="px-[10px]"
                    icon={<div className="uppercase text-sm text-gray dark:text-txtSecondary-dark font-medium">{ms(resolution)}</div>}
                />
                <MenuTime
                    value={candle}
                    onChange={setCandle}
                    keyValue="value"
                    displayValue="text"
                    options={candleList}
                    classNameButton="pl-[10px]"
                    classNamePanel="right-[-10px]"
                    icon={<img src={getS3Url('/images/icon/ic_menu_chart.png')} height={24} width={24} />}
                />

            </div>
            <ModelMarketMobile
                visible={showModelMarket}
                onClose={() => setShowModelMarket(false)}
            />
        </div>
    );
};

const Change24h = ({ pairConfig, pair, pairPrice, isVndcFutures }) => {

    return (
        <div className='flex items-center'>
            <div
                className={classNames('pl-2 text-dominant font-medium',
                    {
                        '!text-red':
                            pairPrice?.priceChangePercent < 0,
                    })}
            >
                {pairPrice?.priceChangePercent < 0 ? '' : '+'}
                {formatNumber(
                    roundTo(
                        pairPrice?.priceChangePercent * (isVndcFutures ? 100 : 1) || 0,
                        2
                    ),
                    2,
                    2,
                    true
                )}
                %
            </div>
        </div>
    )

}



const MenuTime = ({ value, onChange, options, icon, keyValue, displayValue, classNameButton, classNamePanel }) => {
    return (
        <Popover className="relative">
            {({ open, close }) => (
                <>
                    <Popover.Button className={`flex ${classNameButton}`}>
                        {icon}
                    </Popover.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className={`absolute z-50 bg-white dark:bg-bgPrimary-dark ${classNamePanel}`}>
                            <div className="overflow-y-auto px-[12px] py-[8px] shadow-onlyLight font-medium text-xs flex flex-col">
                                {options?.map(item => {
                                    return (
                                        <div onClick={() => {
                                            onChange(item[keyValue])
                                            close()
                                        }}
                                            className={classNames(
                                                'pb-2 w-max text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs cursor-pointer ',
                                                {
                                                    '!text-txtPrimary dark:!text-txtPrimary-dark':
                                                        item[keyValue] === value,
                                                }
                                            )}
                                        >
                                            {item[displayValue]}
                                        </div>
                                    )
                                })}
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    )
}

export default ChartTimer;
