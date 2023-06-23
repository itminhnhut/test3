import { memo } from 'react';

import ButtonV2 from 'components/common/V2/ButtonV2/Button';

const StaticsStaking = ({ assetID, onToggle }) => {
    return (
        <div className="flex items-center justify-between">
            <div className="text-4xl font-semibold">Thống kê lãi qua đêm</div>
            <ButtonV2 className="w-auto" variants="text">
                Thống kê lãi qua đêm
            </ButtonV2>
        </div>
    );
};

export default memo(StaticsStaking);
