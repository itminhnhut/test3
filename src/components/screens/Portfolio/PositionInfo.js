import { useState, useEffect } from 'react';
import GroupTextFilter, { listTimeFilter } from 'components/common/GroupTextFilter';
import HeaderTooltip from './HeaderTooltip';
import { formatNanNumber, formatPrice } from 'redux/actions/utils';

const deltaClipPath = 0.8;

const PositionInfo = ({ type = 'buy', t, api = '', total, totalLoss, totalProfit, isNeverTrade }) => {
    const percentClipPath = (totalLoss / total) * 100;
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
                <div className="w-full h-2 relative bg-dark-7 dark:bg-dark-6" />
            ) : percentClipPath === 100 ? (
                <div className="w-full h-2 relative bg-red-2" />
            ) : percentClipPath === 0 ? (
                <div className="w-full h-2 relative bg-green-3 dark:bg-green-2" />
            ) : (
                <div className="w-full h-2 relative">
                    <div
                        style={{
                            clipPath: `polygon(0 0,${percentClipPath}% 0, ${percentClipPath - deltaClipPath}% 100%, 0% 100%)`
                        }}
                        className="h-full bg-red-2 w-full absolute right-0"
                    />
                    <div
                        style={{
                            clipPath: `polygon(${percentClipPath + deltaClipPath}% 0, 100% 0, 100% 100%, ${percentClipPath}% 100%)`
                        }}
                        className="h-full bg-green-3 dark:bg-green-2 w-full absolute left-0"
                    />
                </div>
            )}
            <div className="flex items-center justify-between mt-3 py-1">
                <div className="txtSecond-3">Lệnh lỗ: {formatNanNumber((totalLoss / total) * 100, 2)}%</div>
                <div className="txtSecond-3">Lệnh lãi: {formatNanNumber((totalProfit / total) * 100, 2)}%</div>
            </div>
        </div>
    );
};

export default PositionInfo;
