import { useTranslation } from 'next-i18next';
import React, { useRef, useState, useEffect } from 'react';
import Tabs, { TabItem } from 'src/components/common/Tabs/Tabs';
import FetchApi from 'utils/fetch-api';
import { API_NEW_REFERRAL_OVERVIEW, API_NEW_REFERRAL_CONFIG } from 'redux/actions/apis';
import { useSelector } from 'react-redux';
import { useWindowSize } from 'react-use';
import { commisionConfig } from 'config/referral';
import Commission from './sections/Commission';
import Tables from './sections/Tables';
import Charts from './sections/Charts';
import QnA from './sections/QnA';
import classnames from 'classnames';
import FriendList from 'components/screens/NewReference/desktop/sections/Tables/FriendList';
import CommissionHistory from 'components/screens/NewReference/desktop/sections/Tables/CommissionHistory';

import dynamic from 'next/dynamic';
import { DESKTOP_NAV_HEIGHT } from 'components/common/NavBar/constants';

const Overview = dynamic(() => import('./sections/Overview'), { ssr: false });

const tabs = {
    Overview: 'overview',
    // LastedActivities: 'lasted_activities',
    Chart: 'chart',
    FriendList: 'friendlist',
    CommissionHistory: 'commissionhistory',
    FAQandTerm: 'faq'
};

const RefDesktopScreen = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const { width } = useWindowSize();
    // const [tab, setTab] = useState(tabs.Overview);
    const [tab, setTab] = useState(tabs.FriendList);
    const [overviewData, setOverviewData] = useState();
    const [config, setConfig] = useState(commisionConfig);
    const contentRef = useRef(null);
    const tabRef = useRef(null);
    const user = useSelector(state => state.auth.user) || null;
    const [loadingOverviewData, setLoadingOverviewData] = useState(false)
    const fetchData = () => {
        setLoadingOverviewData(true)
        FetchApi({
            url: API_NEW_REFERRAL_OVERVIEW,
            options: {
                method: 'GET'
            }
        })
            .then(({
                data,
                status
            }) => {
                if (status === 'ok') {
                    setOverviewData(data);
                } else {
                    setOverviewData(null);
                }
            })
            .finally(() => {
                setLoadingOverviewData(false)
            });
        FetchApi({
            url: API_NEW_REFERRAL_CONFIG,
            options: {
                method: 'GET'
            }
        })
            .then(({
                data,
                status
            }) => {
                if (status === 'ok') {
                    const type = {
                        1: 'direct',
                        2: 'indirect',
                        3: 'indirect',
                        4: 'indirect',
                        5: 'indirect',
                        6: 'indirect',
                        7: 'indirect'
                    };
                    const config = commisionConfig;
                    data.sort((pre, current) => pre.rankId - current.rankId);
                    try {
                        data.map(e => {
                            config[e.rankId ?? 1][type[e.commissionFloor ?? 1]][e.type.toLowerCase() ?? 'futures'] = e.commissionRate ?? 0;
                            if (config.commissionLevel < e.commissionFloor) config.commissionLevel = e.commissionFloor;
                        });
                        setConfig(config);
                    } catch (error) {
                        setConfig(commisionConfig);
                    }
                } else {
                }
            });
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleClickTab = (tabId) => {
        setTab(tabId);
    };

    return (
        <div className='h-auto w-full bg-gray-13 dark:bg-transparent' style={{ paddingTop: DESKTOP_NAV_HEIGHT }}>
            <div className='space-y-20' ref={contentRef}>
                <Overview t={t} data={overviewData} refreshData={fetchData} commisionConfig={config} width={width} user={user} loading={loadingOverviewData} />
                <div className='w-full container max-w-screen-v3 2xl:max-w-screen-xxl m-auto px-4 !mb-[7.5rem]'>
                    <Tabs ref={tabRef} tab={tab} className='gap-6 border-b border-divider dark:border-divider-dark mb-12' isMobile>
                        <TabItem className='!text-left !px-0' value={tabs.Overview}
                            onClick={() => handleClickTab(tabs.Overview)}>
                            {t('reference:referral.info')}
                        </TabItem>
                        <TabItem className='!text-left !px-0' value={tabs.Chart}
                            onClick={() => handleClickTab(tabs.Chart)}>
                            {t('reference:referral.statistic')}
                        </TabItem>
                        <TabItem className='!text-left !px-0' value={tabs.FriendList}
                            onClick={() => handleClickTab(tabs.FriendList)}>
                            {t('reference:referral.friend_list')}
                        </TabItem>
                        <TabItem className='!text-left !px-0' value={tabs.CommissionHistory}
                            onClick={() => handleClickTab(tabs.CommissionHistory)}>
                            {t('reference:referral.commission_histories')}
                        </TabItem>
                        <TabItem className='!text-left !px-0' value={tabs.FAQandTerm}
                            onClick={() => handleClickTab(tabs.FAQandTerm)}>
                            FAQ
                        </TabItem>
                    </Tabs>
                    <div className='flex flex-col gap-8'>
                        <div className={classnames('hidden', { '!block': tab === tabs.Overview })}>
                            <Commission t={t} language={language} id={tabs.Overview} />
                        </div>

                        <div className={classnames('hidden', { '!block': tab === tabs.Chart })}>
                            <Charts t={t} id={tabs.Chart} />
                        </div>

                        <div className={classnames('hidden', { '!block': tab === tabs.FriendList })}>
                            <FriendList owner={overviewData} t={t} language={language} commisionConfig={config} id={tabs.FriendList} />
                        </div>

                        <div className={classnames('hidden', { '!block': tab === tabs.CommissionHistory })}>
                            <CommissionHistory t={t} commisionConfig={config} id={tabs.CommissionHistory} />
                        </div>

                        <div className={classnames('hidden', { '!block': tab === tabs.FAQandTerm })}>
                            <QnA t={t} language={language} commisionConfig={config} id={tabs.FAQandTerm} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RefDesktopScreen;
