import { useState, useEffect } from 'react';
import GroupTextFilter, { listTimeFilter } from 'components/common/GroupTextFilter';
import HeaderTooltip from './HeaderTooltip';
import { formatNanNumber, formatPrice } from 'redux/actions/utils';
import Tooltip from 'components/common/Tooltip';

const deltaClipPath = 0.8;

const TooltipProfit = ({ type, totalProfit, totalProfitPosition, isVndc, t, ...rest }) => (
    <Tooltip {...rest} id={`${type}_profit_tooltip`} place="top" className="max-w-[520px] !p-3">
        <div>
            <div className="text-sm text-txtSecondary dark:text-txtSecondary-dark">Lệnh lãi</div>
            <ul className="list-disc marker:text-xs ml-5 mt-2">
                <li>{`Tổng vị thế: ${totalProfitPosition}`}</li>
                <li>
                    {'Tổng lãi: '} <span className="red-2 font-semibold">{formatNanNumber(totalProfit, isVndc ? 0 : 4)}</span>
                </li>
            </ul>
        </div>
    </Tooltip>
);

const TooltipLoss = ({ type, totalLoss, totalLossPosition, isVndc, t, ...rest }) => (
    <Tooltip {...rest} id={`${type}_loss_tooltip`} place="top" className="max-w-[520px] !p-3">
        <div>
            <div className="text-sm text-txtSecondary dark:text-txtSecondary-dark">Lệnh lỗ</div>
            <ul className="list-disc marker:text-xs ml-5 mt-2">
                <li>{`Tổng vị thế: ${totalLossPosition}`}</li>
                <li>
                    {'Tổng lỗ: '} <span className="red-2 font-semibold">{formatNanNumber(totalLoss, isVndc ? 0 : 4)}</span>
                </li>
            </ul>
        </div>
    </Tooltip>
);

const PositionInfo = ({ type = 'buy', t, api = '', total, totalLoss, totalProfit, totalLossPosition, totalProfitPosition, isNeverTrade, isVndc = true }) => {
    const percentClipPath = (totalLossPosition / total) * 100;
    return (
        <div className="p-8 rounded-xl bg-gray-12 dark:bg-dark-4 static">
            <HeaderTooltip
                title={t(`common:position:${type.toLowerCase()}`)}
                tooltipContent={'This is tooltip content'}
                tooltipId={`${type}_position_tooltip`}
            />
            <div className="mt-12 mb-6 text-2xl font-semibold">
                {t(`common:position:sum_${type.toLowerCase()}`)}: {total}
            </div>

            {isNeverTrade ? (
                <div className="w-full h-2 bg-dark-7 dark:bg-dark-6" />
            ) : percentClipPath === 100 ? (
                <>
                    <div className="w-full h-2 bg-red-2" data-for={`${type}_loss_tooltip`} data-tip="" />
                    <TooltipLoss totalLoss={totalLoss} totalLossPosition={totalLossPosition} isVndc={isVndc} type={type} t={t} />
                </>
            ) : percentClipPath === 0 ? (
                <>
                    <div className="w-full h-2 bg-green-3 dark:bg-green-2" data-for={`${type}_profit_tooltip`} data-tip="" />
                    <TooltipProfit totalProfit={totalProfit} totalProfitPosition={totalProfitPosition} isVndc={isVndc} type={type} t={t} />
                </>
            ) : (
                <div className="w-full h-2 relative" id={`${type}_bar`}>
                    <div
                        style={{
                            clipPath: `polygon(0 0,${percentClipPath}% 0, ${percentClipPath - deltaClipPath}% 100%, 0% 100%)`
                        }}
                        className="h-full bg-red-2 w-full absolute right-0"
                        data-for={`${type}_loss_tooltip`}
                        data-tip=""
                    />
                    <div
                        style={{
                            clipPath: `polygon(${percentClipPath + deltaClipPath}% 0, 100% 0, 100% 100%, ${percentClipPath}% 100%)`
                        }}
                        className="h-full bg-green-3 dark:bg-green-2 w-full absolute left-0"
                        data-for={`${type}_profit_tooltip`}
                        data-tip=""
                    />
                    <TooltipLoss
                        overridePosition={(e) => {
                            var element = document.getElementById(`${type}_bar`);
                            var positionInfo = element.getBoundingClientRect();
                            var width = positionInfo.width;
                            var widthLoss = (width * percentClipPath) / 100;
                            var widthProfit = width - widthLoss;
                            let delta;
                            if (percentClipPath < 50) {
                                delta = widthLoss / 2 + (widthProfit - width / 2);
                            } else {
                                delta = width / 2 - widthLoss / 2
                            }
                            return {
                                left: e.left - delta,
                                top: e.top
                            };
                        }}
                        totalLoss={totalLoss}
                        totalLossPosition={totalLossPosition}
                        isVndc={isVndc}
                        type={type}
                        t={t}
                    />
                    <TooltipProfit
                        overridePosition={(e) => {
                            var element = document.getElementById(`${type}_bar`);
                            var positionInfo = element.getBoundingClientRect();
                            var width = positionInfo.width;
                            var widthLoss = (width * percentClipPath) / 100;
                            var widthProfit = width - widthLoss;
                            let delta;
                            if (percentClipPath < 50) {
                                delta = width / 2 - widthProfit / 2;
                            } else {
                                delta = widthProfit / 2 + (widthLoss - width / 2);
                            }
                            return {
                                left: e.left + delta,
                                top: e.top
                            };
                        }}
                        totalProfit={totalProfit}
                        totalProfitPosition={totalProfitPosition}
                        isVndc={isVndc}
                        type={type}
                        t={t}
                    />
                </div>
            )}
            <div className="flex items-center justify-between mt-3 py-1">
                <div className="txtSecond-3">Lệnh lỗ: {formatNanNumber((totalLossPosition / total) * 100, 2)}%</div>
                <div className="txtSecond-3">Lệnh lãi: {formatNanNumber((totalProfitPosition / total) * 100, 2)}%</div>
            </div>
        </div>
    );
};

export default PositionInfo;
