import { useTranslation } from 'next-i18next';
import React, { useMemo, useRef, useState } from 'react';
import Tabs, { TabItem } from 'src/components/common/Tabs/Tabs';
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
import { API_NEW_REFERRAL_OVERVIEW } from 'redux/actions/apis';
import SvgEmpty from 'components/svg/SvgEmpty';
import classNames from 'classnames';
import _ from 'lodash';
import { commisionConfig } from 'config/referral';
import useHorizontalSwipe from 'hooks/useHorizontalSwipe'
import useWindowSize from 'hooks/useWindowSize';

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
    const tabRef = useRef(null);
    const contentRef = useRef(null);
    const isClickTab = useRef(false);

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
    }, []);

    const handleClickTab = (tabId) => {
        const el = document.getElementById(tabId);
        const refSectionContainer = document.getElementById('refSectionContainer');
        refSectionContainer.scrollTo({
            left: el.offsetLeft,
            behavior: 'smooth'
        });
        isClickTab.current = true;
        setTab(tabId);
    };

    useEffect(() => {
        const refSectionContainer = document.getElementById('refSectionContainer');
        refSectionContainer.addEventListener('scroll', onScroll);
        return () => {
            refSectionContainer.removeEventListener('scroll', onScroll);
        };
    }, []);

    const timer = useRef(null)
    const onScroll = (e) => {
        clearTimeout(timer.current);
        if (isClickTab.current) {
            timer.current = setTimeout(() => {
                isClickTab.current = false;
            }, 200);
            return;
        }
        const tabsArray = Object.values(tabs)
        const width = window.innerWidth
        const left = e.currentTarget.scrollLeft
        const index = left / (width + 24)
        if (Math.round(index) === Math.round(index - 0.9)) setTab(tabsArray[Math.round(index + 0.05) ?? 0])

    };

    const newRenderContent = useMemo(() => {
        return (
            <Container className='no-scrollbar gap-6' style={{ flexFlow: 'row nowrap' }} id='refSectionContainer' >
                <Section id={tabs.Overview}>
                    <Overview data={overviewData} commisionConfig={commisionConfig} />
                    <div className='h-8'></div>
                    <Info data={overviewData} />
                    <div className='h-8'></div>
                    <LastedActivities />
                </Section>
                <Section className='pt-8' id={tabs.Chart}>
                    <Chart />,
                </Section>
                <Section className='pt-8' id={tabs.FriendList} >
                    <FriendList />,
                </Section>
                <Section className='pt-8' id={tabs.CommissionHistory}>
                    <CommissionHistory />,
                </Section>
                <Section className='pt-8' id={tabs.FAQandTerm}>
                    <QnA />
                    <div className='h-8'></div>
                    <Term />
                </Section>
            </Container>
        )
    }, [overviewData])

    return (
        <div className="bg-[#f5f6f7] pb-[68px] h-full">
            <div className={classNames('bg-white z-10')}>
                <Tabs ref={tabRef} tab={tab}>
                    <TabItem value={tabs.Overview} onClick={() => handleClickTab(tabs.Overview)}>
                        {t('reference:referral.info')}
                    </TabItem>
                    {/* <TabItem value={tabs.LastedActivities} onClick={() => handleClickTab(tabs.LastedActivities)}>
                        {t('reference:referral.recent_activities')}
                    </TabItem> */}
                    <TabItem value={tabs.Chart} onClick={() => handleClickTab(tabs.Chart)}>
                        {t('reference:referral.statistic')}
                    </TabItem>
                    <TabItem value={tabs.FriendList} onClick={() => handleClickTab(tabs.FriendList)}>
                        {t('reference:referral.friend_list')}
                    </TabItem>
                    <TabItem value={tabs.CommissionHistory} onClick={() => handleClickTab(tabs.CommissionHistory)}>
                        {t('reference:referral.commission_histories')}
                    </TabItem>
                    <TabItem value={tabs.FAQandTerm} onClick={() => handleClickTab(tabs.FAQandTerm)}>
                        FAQ
                    </TabItem>
                </Tabs>
            </div>
            <div className={classNames("flex flex-col gap-8")} ref={contentRef}>
                {newRenderContent}
            </div>
        </div>
    );
}

export const Line = styled.div.attrs(({ className }) => ({
    className
}))`
    width: 100%;
    height: 1px;
    flex-grow: 0;
    transform: rotate(-360deg);
    background-color: rgba(160, 174, 192, 0.15);
`;
export default NewReference;

export const FilterTabs = ({ tabs, type, setType, reversed = false, className = '' }) => {
    const bgColor = reversed ? 'bg-white' : 'bg-gray-4';
    return (
        <>
            {tabs.map((tab, index) => {
                return (
                    <div
                        key={index}
                        className={classNames(
                            `flex items-center py-1 px-2 justify-center text-xs font-medium leading-5 cursor-pointer ${type === tab.value ? `bg-gray-4 rounded-md text-darkBlue` : 'text-gray-1'
                            } ${className}`
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
    <div className="w-full h-11 rounded-md flex justify-center items-center bg-teal text-sm font-semibold text-white leading-6" onClick={onClick}>
        {title}
    </div>
);

export const NoData = ({ text, className }) => (
    <div className={classNames('w-full flex flex-col justify-center items-center text-gray-1 font-medium text-sm gap-2', className)}>
        <SvgEmpty />
        {text}
    </div>
);

const Container = styled.div`
    display: flex;
    scroll-snap-type: x mandatory;
    overflow-y: scroll;
`;
const Section = styled.div`
    scroll-snap-align: center;
    width: 100vw;
`;
