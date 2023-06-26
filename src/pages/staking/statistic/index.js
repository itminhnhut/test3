import { useCallback, useState } from 'react';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import Header from 'components/staking/statistic/Header';
import TabV2 from 'components/common/V2/TabV2';
import Spinner from 'components/svg/Spinner';

const InterestEstimate = dynamic(() => import('components/staking/statistic/InterestEstimate', { ssr: false }));
const NotAuth = dynamic(() => import('components/staking/statistic/NotAuth', { ssr: false }));
const HistoryStaking = dynamic(() => import('components/staking/statistic/History', { ssr: false }));

export const ASSET = {
    VNDC: 72,
    USDT: 22
};
const ASSET_TABS = Object.keys(ASSET).map((assetCode) => ({ children: assetCode, key: ASSET[assetCode] }));

const index = () => {
    const [assetId, setAssetId] = useState(ASSET.VNDC);
    const { loadingUser, user: isAuth } = useSelector((state) => state.auth);

    const toggleAsset = (newAssetId) => setAssetId(newAssetId);

    const renderPage = useCallback(() => {
        if (loadingUser)
            return (
                <div className="flex justify-center items-center ">
                    <Spinner size={40} />
                </div>
            );
        if (!isAuth) return <NotAuth />;
        return (
            <section>
                <TabV2 wrapperClassName="!gap-3" chipClassName="bg-gray-12" activeTabKey={assetId} onChangeTab={toggleAsset} tabs={ASSET_TABS} />

                <div className="h-8" />

                <InterestEstimate assetId={assetId} />

                <HistoryStaking assetId={assetId} />
            </section>
        );
    }, [assetId, loadingUser, isAuth]);

    return (
        <MaldivesLayout>
            <main className="bg-gray-13 dark:bg-shadow">
                <div className="max-w-screen-v3 2xl:max-w-screen-xxl pt-[85px] pb-[120px] mx-auto px-4 md:px-0">
                    <Header />
                    {renderPage()}
                </div>
            </main>
        </MaldivesLayout>
    );
};
export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'navbar', 'footer', 'staking', 'reference']))
    }
});
export default index;
