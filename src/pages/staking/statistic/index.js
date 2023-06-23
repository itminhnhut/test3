import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import TabV2 from 'components/common/V2/TabV2';
import MadivesLayout from 'components/common/layouts/MaldivesLayout';
import InterestEstimate from 'components/staking/statistic/InterestEstimate';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useState } from 'react';

const index = () => {
    const [assetId, setAssetId] = useState(72);

    return (
        <MadivesLayout>
            <main className="bg-white dark:bg-shadow">
                <div className="max-w-screen-v3 2xl:max-w-screen-xxl mt-[85px] mb-[120px] mx-auto px-4">
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-[30px]">
                            <div className="text-4xl font-semibold">Thống kê lãi qua đêm</div>
                            <ButtonV2 className="w-auto" variants="text">
                                Thông tin Staking Daily
                            </ButtonV2>
                        </div>
                        <TabV2
                            wrapperClassName="!gap-3"
                            activeTabKey={assetId}
                            onChangeTab={(asset) => setAssetId(asset)}
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
                    <InterestEstimate assetId={assetId} />
                </div>
            </main>
        </MadivesLayout>
    );
};
export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'navbar', 'footer', 'staking']))
    }
});
export default index;
