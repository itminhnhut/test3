import { memo } from 'react';

import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import dynamic from 'next/dist/shared/lib/dynamic';
import TabV2 from 'components/common/V2/TabV2';
import { ASSET } from 'pages/staking/statistic';

const InterestEstimate = dynamic(() => import('./InterestEstimate.js', { ssr: false }));

const ASSET_TABS = Object.keys(ASSET).map((assetCode) => ({ children: assetCode, key: ASSET[assetCode] }));

const StaticsStaking = ({ assetId, onToggle }) => {
    return (
        <div className="mb-[60px]">
            <section className="mb-8">
                <div className="flex items-center justify-between mb-[30px]">
                    <div className="text-4xl font-semibold">Thống kê lãi qua đêm</div>
                    <ButtonV2 className="w-auto" variants="text">
                        Thông tin Staking Daily
                    </ButtonV2>
                </div>
                <TabV2 wrapperClassName="!gap-3" activeTabKey={assetId} onChangeTab={(asset) => onToggle(asset)} tabs={ASSET_TABS} />
            </section>
            <InterestEstimate assetId={assetId} />
        </div>
    );
};

export default memo(StaticsStaking);
