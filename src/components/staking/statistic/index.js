import { memo } from 'react';

import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import dynamic from 'next/dist/shared/lib/dynamic';
import TabV2 from 'components/common/V2/TabV2';

const InterestEstimate = dynamic(() => import('./InterestEstimate.js', { ssr: false }));

const StaticsStaking = ({ assetID, onToggle }) => {
    return (
        <>
            <div className="mb-8">
                <div className="flex items-center justify-between mb-[30px]">
                    <div className="text-4xl font-semibold">Thống kê lãi qua đêm</div>
                    <ButtonV2 className="w-auto" variants="text">
                        Thông tin Staking Daily
                    </ButtonV2>
                </div>
                <TabV2
                    wrapperClassName="!gap-3"
                    activeTabKey={assetID}
                    onChangeTab={(asset) => onToggle(asset)}
                    tabs={[
                        {
                            key: 72,
                            assetCode: 'VNDC'
                        },
                        {
                            key: 22,
                            assetCode: 'USDT'
                        }
                    ].map((asset) => ({
                        key: asset.key,
                        children: asset.assetCode
                    }))}
                />
            </div>
            <InterestEstimate assetId={assetID} />
        </>
    );
};

export default memo(StaticsStaking);
