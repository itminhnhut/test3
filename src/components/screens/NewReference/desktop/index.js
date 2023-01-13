import { useTranslation } from 'next-i18next';
import React, { useMemo, useRef, useState, useEffect } from 'react';
import Tabs, { TabItem } from 'src/components/common/Tabs/Tabs';
import FetchApi from 'utils/fetch-api';
import { API_NEW_REFERRAL_OVERVIEW, API_NEW_REFERRAL_CONFIG } from 'redux/actions/apis';
import SvgEmpty from 'components/svg/SvgEmpty';
import classNames from 'classnames';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { useWindowSize } from 'react-use';
import { commisionConfig } from 'config/referral';
import Overview from './sections/Overview';
import Commission from './sections/Commission';
import Tables from './sections/Tables';
import Charts from './sections/Charts';
import QnA from './sections/QnA';

const tabs = {
    Overview: 'overview',
    // LastedActivities: 'lasted_activities',
    Chart: 'chart',
    FriendList: 'friendlist',
    CommissionHistory: 'commissionhistory',
    FAQandTerm: 'faq',
};

const RefDesktopScreen = () => {
    const { t, i18n: { language } } = useTranslation()
    const { width } = useWindowSize()
    const [tab, setTab] = useState(tabs.Overview);
    const [overviewData, setOverviewData] = useState();
    const [config, setConfig] = useState(commisionConfig)
    const contentRef = useRef(null);
    const tabRef = useRef(null);
    const isClickTab = useRef(false);
    const user = useSelector(state => state.auth.user) || null;

    useEffect(() => {
        FetchApi({
            url: API_NEW_REFERRAL_OVERVIEW,
            options: {
                method: 'GET'
            }
        }).then(({ data, status }) => {
            if (status === 'ok') {
                setOverviewData(data);
            } else {
                setOverviewData(null);
            }
        });
        FetchApi({
            url: API_NEW_REFERRAL_CONFIG,
            options: {
                method: 'GET'
            }
        }).then(({ data, status }) => {
            if (status === 'ok') {
                const type = {
                    1: 'direct',
                    2: 'indirect',
                    3: 'indirect',
                    4: 'indirect',
                    5: 'indirect',
                    6: 'indirect',
                    7: 'indirect',
                }
                const config = commisionConfig
                data.sort((pre, current) => pre.rankId - current.rankId)
                try {
                    data.map(e => {
                        config[e.rankId ?? 1][type[e.commissionFloor ?? 1]][e.type.toLowerCase() ?? 'futures'] = e.commissionRate ?? 0
                        if (config.commissionLevel < e.commissionFloor) config.commissionLevel = e.commissionFloor
                    })
                    setConfig(config)
                } catch (error) {
                    setConfig(commisionConfig)
                }
            } else {
            }
        });
    }, [user]);


    useEffect(() => {
        document.addEventListener('scroll', onScroll);
        return () => {
            document.removeEventListener('scroll', onScroll);
            inViewObserver.disconnect();
        };
    }, []);

    const inViewObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const _tab = entry.target.getAttribute('id');
                    setTab(_tab);
                    inViewObserver.unobserve(document.getElementById(_tab));
                }
            });
        },
        { root: null, threshold: 0.7, rootMargin: "0px" }
    );

    const timer = useRef(null);
    const onScroll = (e) => {
        clearTimeout(timer.current);
        if (isClickTab.current) {
            timer.current = setTimeout(() => {
                isClickTab.current = false;
            }, 500);
            return;
        }
        tabRef.current?.ref.querySelectorAll('.tab-item').forEach((el) => {
            const id = el.getAttribute('value');
            inViewObserver.observe(document.getElementById(id));
        });
    };

    const handleClickTab = (tabId) => {
        const el = document.getElementById(tabId);
        window.scrollTo({
            top: el.offsetTop - 120,
            behavior: 'smooth'
        });
        // el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        isClickTab.current = true;
        setTab(tabId);
    };

    return (
        <div className="bg-[#f5f6f7] h-auto w-full pt-[76px]">
            <div className={classNames("flex flex-col gap-8")} ref={contentRef}>
                <Overview t={t} data={overviewData} commisionConfig={config} width={width} user={user} />
                <div className='mt-[80px] p-20'>
                    <div className='border-gray-6 border-b-[1px] mb-10'>
                        <Tabs ref={tabRef} tab={tab} className='gap-8'>
                            <TabItem className='!text-left !px-0' value={tabs.Overview} onClick={() => handleClickTab(tabs.Overview)}>
                                {t('reference:referral.info')}
                            </TabItem>
                            {/* <TabItem value={tabs.LastedActivities} onClick={() => handleClickTab(tabs.LastedActivities)}>
                        {t('reference:referral.recent_activities')}
                    </TabItem> */}
                            <TabItem className='!text-left !px-0' value={tabs.Chart} onClick={() => handleClickTab(tabs.Chart)}>
                                {t('reference:referral.statistic')}
                            </TabItem>
                            <TabItem className='!text-left !px-0' value={tabs.FriendList} onClick={() => handleClickTab(tabs.FriendList)}>
                                {t('reference:referral.friend_list')}
                            </TabItem>
                            <TabItem className='!text-left !px-0' value={tabs.CommissionHistory} onClick={() => handleClickTab(tabs.CommissionHistory)}>
                                {t('reference:referral.commission_histories')}
                            </TabItem>
                            <TabItem className='!text-left !px-0' value={tabs.FAQandTerm} onClick={() => handleClickTab(tabs.FAQandTerm)}>
                                FAQ
                            </TabItem>
                        </Tabs>
                    </div>
                    <div className='flex flex-col gap-8'>
                        <Commission t={t} language={language} id={tabs.Overview} />
                        <Charts t={t} id={tabs.Chart} />
                        <Tables t={t} commisionConfig={config} id1={tabs.FriendList} id2={tabs.CommissionHistory}/>
                        <QnA t={t} language={language} commisionConfig={config} id={tabs.FAQandTerm} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RefDesktopScreen