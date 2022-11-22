import { useTranslation } from 'next-i18next'
import React, { useMemo, useRef, useState } from 'react'
import Tabs, { TabItem } from 'src/components/common/Tabs/Tabs'
import Info from './sections/Info'
import Overview from './sections/Overview'
import styled from 'styled-components'
import LastedActivities from './sections/LastedActivities'
import Chart from './sections/Chart'
import FriendList from './sections/FriendList'
import CommissionHistory from './sections/CommissionHistory'
import QnA from './sections/QnA'
import Term from './sections/Term'
import { useEffect } from 'react'
import FetchApi from 'utils/fetch-api';
import { API_NEW_REFERRAL_OVERVIEW } from 'redux/actions/apis'
import SvgEmpty from 'components/svg/SvgEmpty'
import classNames from 'classnames'
import _ from 'lodash'

const tabs = {
    Overview: 'overview',
    LastedActivities: 'lasted_activities',
    Chart: 'chart',
    FriendList: 'friend_list',
    CommissionHistory: 'commission_history',
    FAQ: 'faq',
    Term: 'Term',
}

function NewReference() {
    const { t } = useTranslation()
    const [tab, setTab] = useState(tabs.Overview)
    const [doScroll, setDoScroll] = useState(false)
    const [overviewData, setOverviewData] = useState()
    useEffect(() => {
        FetchApi({
            url: API_NEW_REFERRAL_OVERVIEW,
            options: {
                method: 'GET',
            },
        }).then(({ data, status }) => {
            if (status === 'ok') {
                setOverviewData(data)
            } else {
                setOverviewData(null)
            }
        });
    }, [])

    const handleClickTab = (tabId) => {
        const scrollTo = document.getElementById(tabId)
        const yOffset = -120;
        const y = scrollTo.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        // scrollTo.scrollIntoView({ behavior: 'smooth' }, true)
        setTimeout(() => setTab(tabId), 500)
        // setDoScroll(!doScroll)
    }

    // useEffect(() => {
    //     const scrollTo = document.getElementById(tab)
    //     scrollTo.scrollIntoView({ behavior: 'smooth', block: 'center' })
    // }, [doScroll])

    // const [fixed, setFixed] = useState(false)
    // const doSetFixed = () => {
    //     console.log(window.scrollY)
    //     if (window.scrollY >= 55) setFixed(true)
    //     else setFixed(false)
    // }

    // useEffect(() => {
    //     window.addEventListener('scroll', doSetFixed)
    //     return () => window.removeEventListener('scroll', doSetFixed)
    // }, [])
    return (
        <div className="bg-[#f5f6f7] pb-[68px]">
            <div className={classNames("bg-white fixed z-10")}>
                <Tabs tab={tab}>
                    <TabItem value={tabs.Overview} onClick={() => handleClickTab(tabs.Overview)}>
                        {t('reference:referral.info')}
                    </TabItem>
                    <TabItem value={tabs.LastedActivities} onClick={() => handleClickTab(tabs.LastedActivities)}>
                        {t('reference:referral.recent_activities')}
                    </TabItem>
                    <TabItem value={tabs.Chart} onClick={() => handleClickTab(tabs.Chart)}>
                        {t('reference:referral.statistic')}
                    </TabItem>
                    <TabItem value={tabs.FriendList} onClick={() => handleClickTab(tabs.FriendList)}>
                        {t('reference:referral.friend_list')}
                    </TabItem>
                    <TabItem value={tabs.CommissionHistory} onClick={() => handleClickTab(tabs.CommissionHistory)}>
                        {t('reference:referral.commission_histories')}
                    </TabItem>
                    <TabItem value={tabs.FAQ} onClick={() => handleClickTab(tabs.FAQ)}>
                        {t('reference:referral.faq')}
                    </TabItem>
                    <TabItem value={tabs.Term} onClick={() => handleClickTab(tabs.Term)}>
                        {t('reference:referral.term')}
                    </TabItem>
                </Tabs>
            </div>
            <div className='flex flex-col gap-8 pt-[44px]'>
                <Overview data={overviewData} id={tabs.Overview} />
                <Info data={overviewData} />
                <LastedActivities id={tabs.LastedActivities} />
                <Chart id={tabs.Chart} />
                <FriendList id={tabs.FriendList} />
                <CommissionHistory id={tabs.CommissionHistory} />
                <QnA id={tabs.FAQ} />
                <Term id={tabs.Term} />
            </div>
        </div >
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
                            `flex items-center py-1 px-2 justify-center text-xs font-medium leading-5 cursor-pointer ${type === tab.value
                                ? `bg-gray-4 rounded-md text-darkBlue`
                                : 'text-gray-1'
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
    <div
        className="w-full h-11 rounded-md flex justify-center items-center bg-teal text-sm font-semibold text-white leading-6"
        onClick={onClick}
    >
        {title}
    </div>
)

export const NoData = ({ text, className }) => (<div className={classNames('w-full flex flex-col justify-center items-center text-gray-1 font-medium text-sm gap-2', className)}><SvgEmpty />{text}</div>)
