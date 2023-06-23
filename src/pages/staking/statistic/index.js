import { useCallback, useState } from 'react';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dist/shared/lib/dynamic';

const initState = {
    VNDC: 72,
    USDT: 22
};

const StaticsStaking = dynamic(() => import('components/staking/statistical', { ssr: false }));
const HistoryStaking = dynamic(() => import('components/staking/statistical/History', { ssr: false }));

const index = () => {
    const [assetID, setAssetID] = useState(initState.VNDC);

    const toggleAsset = useCallback((value) => setAssetID(value), []);

    return (
        <MaldivesLayout>
            <main className="bg-white dark:bg-shadow">
                <div className="max-w-screen-v3 2xl:max-w-screen-xxl mt-[85px] mb-[120px] mx-auto px-4">
                    <StaticsStaking assetID={assetID} onToggle={toggleAsset} />
                    <HistoryStaking />
                </div>
            </main>
        </MaldivesLayout>
    );
};
export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'navbar', 'footer', 'staking']))
    }
});
export default index;
