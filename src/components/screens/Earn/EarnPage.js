import { useTranslation } from 'next-i18next';
import React, { useMemo, useState } from 'react';
import PoolSection from './sections/PoolSection';
import HistorySection from './sections/HistorySection';
import FAQSection from './sections/FAQSection';
import BannerSection from './sections/BannerSection';
import HotSection from './sections/HotSection';
import EarnModal from './components/EarnModal/EarnModal';
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';
import { useEarnCtx } from './context/EarnContext';
import ModalNeedKyc from 'components/common/ModalNeedKyc';
import { useSelector } from 'react-redux';
import { KYC_STATUS } from 'redux/actions/const';
import DefaultMobileView from 'components/common/DefaultMobileView';
import { ONE_DAY } from 'constants/constants';
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';
import format from 'date-fns/format';
import useIsomorphicLayoutEffect from 'hooks/useIsomorphicLayoutEffect';
import Link from 'next/link';
import SvgWallet from 'components/svg/Wallet';

const getUTCToday = () => {
    const now = new Date();
    const d = now.getUTCDate();
    const m = now.getUTCMonth();
    const y = now.getUTCFullYear();
    const utcToday = Date.UTC(y, m, d);
    return utcToday;
};
const suspendDuration = 1800000; // 30 min

const LINKS = {
    BLOG: {
        en: '/announcement/nami-news',
        vi: '/announcement/tin-tuc-ve-nami'
    }
};

const EarnPage = ({ pool_list, hotPools, assetList, rewardList }) => {
    const [tab, setTab] = useState(0);
    const [skipWarning, setSkipWarning] = useState(false);
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const { poolInfo, setPoolInfo } = useEarnCtx();
    const user = useSelector((state) => state.auth?.user || null);
    const kyc_status = user?.kyc_status || 0;
    const [isSuspending, setIsSuspending] = useState(false);

    const earnBlogLink = LINKS.BLOG[language] ?? '/';

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

    const today = getUTCToday();
    useIsomorphicLayoutEffect(() => {
        const now = Date.now();
        let timeout;
        if (now < today + suspendDuration / 2) {
            setIsSuspending(true);
            timeout = setTimeout(() => {
                setIsSuspending(false);
            }, today + suspendDuration / 2 - now);
        } else if (now > today + ONE_DAY - suspendDuration / 2) {
            setIsSuspending(true);
            timeout = setTimeout(() => {
                setIsSuspending(false);
            }, today + ONE_DAY + suspendDuration / 2 - now);
        }
        return () => {
            clearTimeout(timeout);
        };
    }, []);

    const suspend_msg = useMemo(() => {
        const from = format(today - suspendDuration / 2, 'hh:mm');
        const to = format(today + suspendDuration / 2, 'hh:mm');

        return t('earn:suspend_warning', { from, to });
    }, [t]);

    return (
        <>
            <div className="hidden md:block">
                <BannerSection />
                <div className="max-w-screen-v3 2xl:max-w-screen-xxl mx-auto mb:pb-[7.5rem] pb-20 pt-0 px-4 v3:px-0">
                    <HotSection pools={hotPools} />

                    <div className="mt-8">
                        <div className="flex justify-between items-center border-b border-divider dark:border-divider-dark">
                            <Tabs tab={tab} className="gap-6 items-center">
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
                            <div className="flex space-x-6 items-center">
                                {user && (
                                    <Link href="/wallet/earn" passHref>
                                        <a className="cursor-pointer font-semibold text-teal whitespace-nowrap flex items-center space-x-2">
                                            <SvgWallet />
                                            <span>{t('earn:my_earn_wallet')}</span>
                                        </a>
                                    </Link>
                                )}
                                <Link href={earnBlogLink} passHref>
                                    <a className="cursor-pointer font-semibold text-teal whitespace-nowrap">{t('earn:earn_blog')}</a>
                                </Link>
                            </div>
                        </div>
                        <div className="mt-8">{activeTab.component}</div>
                    </div>

                    <FAQSection />
                </div>

                {poolInfo && kyc_status != KYC_STATUS.APPROVED && <ModalNeedKyc onBackdropCb={closeModal} isOpenModalKyc={true} />}

                {poolInfo &&
                    kyc_status === KYC_STATUS.APPROVED &&
                    (skipWarning || !isSuspending ? (
                        <EarnModal pool={poolInfo} onClose={closeModal} isSuspending={isSuspending} />
                    ) : (
                        <AlertModalV2
                            isVisible={!skipWarning}
                            type="warning"
                            onConfirm={() => setSkipWarning(true)}
                            onClose={closeModal}
                            title={t('earn:suspend_title')}
                            textButton={t('common:confirm')}
                            message={suspend_msg}
                        />
                    ))}
            </div>
            <div className="md:hidden">
                <DefaultMobileView />
            </div>
        </>
    );
};

export default EarnPage;
