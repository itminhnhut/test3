import { useTranslation } from 'next-i18next';
import React, { useMemo, useRef, useState } from 'react';
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';
import Info from './sections/Info';
import Overview from './sections/Overview';
import styled from 'styled-components';
import LastedActivities from './sections/LastedActivities';
import Chart from './sections/Chart';
import FriendList from './sections/FriendList';
import CommissionHistory from './sections/CommissionHistory';
import QnA from './sections/QnA';
import Term from './sections/Term';
import { useEffect } from 'react';
import FetchApi from 'utils/fetch-api';
import { API_NEW_REFERRAL_OVERVIEW, API_NEW_REFERRAL_CONFIG } from 'redux/actions/apis';
import SvgEmpty from 'components/svg/SvgEmpty';
import classNames from 'classnames';
import _ from 'lodash';
import { commisionConfig } from 'config/referral';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import 'swiper/css'
import { useSelector } from 'react-redux';

const tabs = {
    Overview: 'overview',
    // LastedActivities: 'lasted_activities',
    Chart: 'chart',
    FriendList: 'friendlist',
    CommissionHistory: 'commissionhistory',
    FAQandTerm: 'faq',
};


function NewReference() {
    const { t } = useTranslation();
    const [tab, setTab] = useState(tabs.Overview);
    const [overviewData, setOverviewData] = useState();
    const [config, setConfig] = useState(commisionConfig)
    const tabRef = useRef(null);
    const [swiper, setSwiper] = useState(null);
    const slideTo = (index) => swiper.slideTo(index);
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
    }, []);

    const handleClickTab = (tabId) => {
        slideTo(Object.values(tabs).indexOf(tabId))
        setTab(tabId);
    };

    const newRenderContent = useMemo(() => {
        return (
            // <Container className='no-scrollbar gap-[100px]' style={{ flexFlow: 'row nowrap' }} id='refSectionContainer' >

            // </Container>
            <Swiper
                className="flex"
                slidesPerView={1}
                onSlideChange={({ activeIndex }) => {
                    const thisTabs = {
                        0: 'overview',
                        // LastedActivities: 'lasted_activities',
                        1: 'chart',
                        2: 'friendlist',
                        3: 'commissionhistory',
                        4: 'faq',
                    };
                    setTab(thisTabs[activeIndex])
                }}
                onSwiper={setSwiper}
            >
                <SwiperSlide id={tabs.Overview} key={0}>
                    <div className='overflow-y-auto overflow-x-hidden no-scrollbar max-h-[calc(100vh-45px)] w-screen pb-12'>
                        <Overview data={overviewData} commisionConfig={config} user={user} />
                        <div className='h-8'></div>
                        <Info data={overviewData} user={user} />
                        <div className='h-8'></div>
                        <LastedActivities />
                    </div>
                </SwiperSlide>
                <SwiperSlide id={tabs.Chart} key={1}>
                    <div className='overflow-y-auto overflow-x-hidden no-scrollbar max-h-[calc(100vh-45px)] pb-12 pt-8'>
                        <Chart user={user} />
                    </div>
                </SwiperSlide>
                <SwiperSlide id={tabs.FriendList} key={2}>
                    <div className='overflow-y-auto overflow-x-hidden no-scrollbar max-h-[calc(100vh-45px)] pb-12 pt-8'>
                        <FriendList commisionConfig={config} />,
                    </div>
                </SwiperSlide>
                <SwiperSlide id={tabs.CommissionHistory} key={3}>
                    <div className='overflow-y-auto overflow-x-hidden no-scrollbar max-h-[calc(100vh-45px)] pb-12 pt-8'>
                        <CommissionHistory />
                    </div>
                </SwiperSlide>
                <SwiperSlide id={tabs.FAQandTerm} key={4}>
                    <div className='overflow-y-auto overflow-x-hidden no-scrollbar max-h-[calc(100vh-45px)] pb-12 pt-8'>
                        <QnA />
                    </div>
                </SwiperSlide>
            </Swiper>
        )
    }, [overviewData])

    return (
        <MobileFont>
            <div className="bg-namiapp h-full overflow-hidden">
                <div className={classNames('bg-namiapp z-10')}>
                    <Tabs ref={tabRef} tab={tab} isMobile>
                        <TabItem value={tabs.Overview} onClick={() => handleClickTab(tabs.Overview)} isMobile>
                            {t('reference:referral.info')}
                        </TabItem>
                        {/* <TabItem value={tabs.LastedActivities} onClick={() => handleClickTab(tabs.LastedActivities)}>
                            {t('reference:referral.recent_activities')}
                        </TabItem> */}
                        <TabItem value={tabs.Chart} onClick={() => handleClickTab(tabs.Chart)} isMobile>
                            {t('reference:referral.statistic')}
                        </TabItem>
                        <TabItem value={tabs.FriendList} onClick={() => handleClickTab(tabs.FriendList)} isMobile>
                            {t('reference:referral.friend_list')}
                        </TabItem>
                        <TabItem value={tabs.CommissionHistory} onClick={() => handleClickTab(tabs.CommissionHistory)} isMobile>
                            {t('reference:referral.commission_histories')}
                        </TabItem>
                        <TabItem value={tabs.FAQandTerm} onClick={() => handleClickTab(tabs.FAQandTerm)} isMobile>
                            FAQ
                        </TabItem>
                    </Tabs>
                </div>
                {newRenderContent}
            </div>
        </MobileFont>
    )
}

export const Line = styled.div.attrs(({ className, isMobile = false }) => ({
    className
}))`
    width: 100%;
    height: 1px;
    flex-grow: 0;
    transform: rotate(-360deg);
    background-color: ${({ isMobile }) => isMobile ? 'rgba(34, 41, 64, 0.5)' : 'rgba(160, 174, 192, 0.15)'};
`;

export const MobileFont = styled.div.attrs(({ className }) => ({
    className
}))`
    font-family: 'Manrope', sans-serif;
    background-color: #0c0e14;
`;


export default NewReference;

export const FilterTabs = ({ tabs, type, setType, reversed = false, className = '', isMobile = false }) => {
    const bgColor = reversed ? 'bg-white' : 'bg-gray-4';
    return (
        <>
            {tabs.map((tab, index) => {
                return (
                    <div
                        key={index}
                        className={classNames(
                            `flex items-center justify-center text-xs font-medium leading-5 cursor-pointer border-namiapp-green`, className, {
                            'text-gray-1 py-1 px-2': !isMobile,
                            'text-gray-7 !px-4 !py-2 font-normal': isMobile,
                            'bg-gray-4 rounded-md text-darkBlue': type === tab.value && !isMobile,
                            'bg-namiapp-black-2 text-namiapp-green-1 rounded-[100px] font-semibold border-[1px] !font-semibold': type === tab.value && isMobile,
                        }
                        )}
                        onClick={_.debounce(() => {
                            setType(tab.value), 200;
                        })}
                    >
                        {tab.title}
                    </div>
                );
            })}
        </>
    );
};

export const RefButton = ({ title, onClick }) => (
    <div className="w-full h-11 rounded-md flex justify-center items-center bg-namiapp-green-1 text-sm font-semibold text-white leading-6" onClick={onClick}>
        {title}
    </div>
);

export const NoData = ({ text, className, width, height }) => (
    <div className={classNames('w-full flex flex-col justify-center items-center text-gray-7 font-medium text-sm gap-2', className)}>
        <SvgEmpty width={width} height={height} />
        {text}
    </div>
);

const Container = styled.div`
    display: flex;
    scroll-snap-type: x mandatory;
    scroll-snap-stop: always;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
`;
const Section = styled.div`
    scroll-snap-align: center;
    scroll-snap-stop: always;
    width: 100vw;
`;
