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

const tabs = {
    Overview: 'overview',
    LastedActivities: 'lasted_activities',
    Chart: 'chart',
    FriendList: 'friend_list',
    CommissionHistory: 'commission_history',
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


    const handleClickTab = (tab) => {
        setTab(tab)
        setDoScroll(!doScroll)
    }

    useEffect(() => {
        const scrollTo = document.getElementById(tab)
        scrollTo.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, [doScroll])

    return (
        <div className="bg-[#f5f6f7] pb-[68px]">
            <div className="bg-white">
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
                </Tabs>
            </div>
            <div className='flex flex-col gap-8'>
                <Overview data={overviewData} id={tabs.Overview} t={t}/>
                <Info data={overviewData} t={t} />
                <LastedActivities id={tabs.LastedActivities} t={t}/>
                <Chart id={tabs.Chart} t={t}/>
                <FriendList id={tabs.FriendList} t={t}/>
                <CommissionHistory id={tabs.CommissionHistory} t={t}/>
                <QnA t={t}/>
                <Term t={t}/>
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
                            `flex items-center py-1 px-2 justify-center text-xs font-medium leading-5 cursor-pointer ${type === tab.value
                                ? `bg-gray-4 rounded-md text-darkBlue`
                                : 'text-darkBlue-5'
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
