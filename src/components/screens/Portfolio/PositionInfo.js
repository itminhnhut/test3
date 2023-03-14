import { useState, useEffect } from 'react';
import GroupFilterTime, { listTimeFilter } from 'components/common/GroupFilterTime';

const deltaClipPath = 0.8;

const PositionInfo = ({ type = 'buy', t, api = '' }) => {
    const [curFilter, setCurFilter] = useState(listTimeFilter[0].value);
    const [percentProfit, setPercentProfit] = useState(0.5);

    useEffect(() => {
        // Call api get percentProfit
        setPercentProfit(0.6);
    }, [curFilter]);

    const percentClipPath = (1 - percentProfit) * 100;
    return (
        <div className="p-8 border border-divider dark:border-transparent rounded-xl bg-transparent dark:bg-dark-4 static">
            <div className="flex items-center justify-between w-full">
                <div className="text-2xl font-semibold">{t(`common:position:${type.toLowerCase()}`)}</div>
                <GroupFilterTime curFilter={curFilter} setCurFilter={setCurFilter} GroupKey={type + '_filter_'} t={t} />
            </div>
            <div className="mt-12 mb-6 text-2xl font-semibold">{t(`common:position:sum_${type.toLowerCase()}`)}: 50</div>

            <div className="w-full h-2 relative">
                <div
                    style={{
                        clipPath: `polygon(0 0,${percentClipPath}% 0, ${percentClipPath - deltaClipPath}% 100%, 0% 100%)`
                    }}
                    className="h-full bg-red-2 w-full absolute right-0"
                ></div>
                <div
                    style={{
                        clipPath: `polygon(${percentClipPath + deltaClipPath}% 0, 100% 0, 100% 100%, ${percentClipPath}% 100%)`
                    }}
                    className="h-full bg-green-3 dark:bg-green-2 w-full absolute left-0"
                ></div>
            </div>
            <div className="flex items-center justify-between mt-3 py-1">
                <div className="txtSecond-3">Lệnh lỗ: {(1 - percentProfit) * 100}%</div>
                <div className="txtSecond-3">Lệnh lãi: {percentProfit * 100}%</div>
            </div>
        </div>
    );
};

export default PositionInfo;
