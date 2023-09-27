import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import PoolSection from './sections/PoolSection';
import HistorySection from './sections/HistorySection';
import FAQSection from './sections/FAQSection';
import BannerSection from './sections/BannerSection';
import HotSection from './sections/HotSection';
import EarnModal from './components/EarnModal/EarnModal';
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';
import { useEarnCtx } from './context/EarnContext';

const EarnPage = ({ pool_list, hotPools, assetList, rewardList }) => {
    const [tab, setTab] = useState(0);
    const { t } = useTranslation();
    const { poolInfo, setPoolInfo } = useEarnCtx();

    const TABS = [
        {
            key: 'pool_list',
            localized: 'earn:pool_list',
            component: <PoolSection pool_list={pool_list} />
        },
        {
            key: 'history',
            localized: 'earn:history',
            component: <HistorySection assetList={assetList} rewardList={rewardList} />
        }
    ];
    const activeTab = TABS[tab];

    const closeModal = () => setPoolInfo(undefined);

    return (
        <>
            <BannerSection />
            <div className="max-w-screen-v3 2xl:max-w-screen-xxl mx-auto mb:pb-[7.5rem] pb-20 pt-0 px-4 v3:px-0">
                <HotSection pools={hotPools} />

                <div className="mt-8">
                    <Tabs tab={tab} className="gap-6 border-b border-divider dark:border-divider-dark">
                        {TABS.map((item, idx) => {
                            const active = idx === tab;
                            return (
                                <TabItem
                                    key={item?.key}
                                    className={`text-left !px-0 !text-sm md:!text-base !w-auto first:ml-4 md:first:ml-0`}
                                    value={idx}
                                    onClick={() => setTab(idx)}
                                    isActive={active}
                                >
                                    {t(item.localized)}
                                </TabItem>
                            );
                        })}
                    </Tabs>
                    <div className="mt-8">{activeTab.component}</div>
                </div>

                <FAQSection />
            </div>
            {poolInfo && <EarnModal pool={poolInfo} onClose={closeModal} />}
        </>
    );
};

export default EarnPage;
