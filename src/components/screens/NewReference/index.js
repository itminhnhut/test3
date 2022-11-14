import { useTranslation } from 'next-i18next'
import React, { useMemo, useState } from 'react'
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

const tabs = {
    Overview: 'Overview',
    LastedActivities: 'LastedActivities',
    Chart: 'Chart',
    FriendList: 'FriendList',
    CommissionHistory: 'CommissionHistory',
}

const languages = {
    Overview: {
        en: 'Overview',
        vi: 'Tổng quan'
    },
    LastedActivities: {
        en: 'Lasted Activities',
        vi: 'Hoạt động mới nhất'
    },
    Chart: {
        en: 'Chart',
        vi: 'Biểu đồ'
    },
    FriendList: {
        en: 'Friend List',
        vi: 'Danh sách bạn bè'
    },
    CommissionHistory: {
        en: 'Commission History',
        vi: 'Lịch sử hoàn phí hoa hồng'
    },
}

function NewReference() {
    const { t, i18n: { language } } = useTranslation()
    const [tab, setTab] = useState(tabs.Overview)
    return (
        <div className='bg-[#f5f6f7] pb-[68px]'>
            <div className='bg-white'>
                <Tabs tab={tab}>
                    <TabItem value={tabs.Overview} onClick={() => setTab(tabs.Overview)}>
                        {languages[tabs.Overview][language]}
                    </TabItem>
                    <TabItem value={tabs.LastedActivities} onClick={() => setTab(tabs.LastedActivities)}>
                        {languages[tabs.LastedActivities][language]}
                    </TabItem>
                    <TabItem value={tabs.Chart} onClick={() => setTab(tabs.Chart)}>
                        {languages[tabs.Chart][language]}
                    </TabItem>
                    <TabItem value={tabs.FriendList} onClick={() => setTab(tabs.FriendList)}>
                        {languages[tabs.FriendList][language]}
                    </TabItem>
                    <TabItem value={tabs.CommissionHistory} onClick={() => setTab(tabs.CommissionHistory)}>
                        {languages[tabs.CommissionHistory][language]}
                    </TabItem>
                </Tabs>
            </div>
            <div className='flex flex-col gap-8'>
                <Overview />
                <Info />
                <LastedActivities />
                <Chart />
                <FriendList />
                <CommissionHistory />
                <QnA />
                <Term />
            </div>
        </div>
    )
}

export const Line = styled.div.attrs(({ className }) => ({
    className,
}))`
    width: 100%;
    height: 1px;
    flex-grow: 0;
    transform: rotate(-360deg);
    background-color: rgba(160, 174, 192, 0.15);
`
export default NewReference

export const FilterTabs = ({ tabs, type, setType, reversed = false, className }) => {
    const bgColor = reversed ? 'bg-white' : 'bg-gray-4'
    return (
        <>
            {tabs.map((tab, index) => {
                return (
                    <div className={`flex items-center py-1 px-2 justify-center text-xs font-medium leading-5 cursor-pointer ${type === index + 1 ? `${bgColor} rounded-md text-darkBlue` : 'text-darkBlue-5'} ${className ? className : null}`}
                        onClick={_.debounce(() => {
                            setType(tab.value), 200
                        })}>
                        {tab.title}
                    </div>
                )
            })}
        </>
    )
}

export const RefButton = ({ title, onClick }) => (
    <div className='w-full h-11 rounded-md flex justify-center items-center bg-teal text-sm font-semibold text-white leading-6' onClick={onClick}>
        {title}
    </div>
)