import Tabs, { TabItem } from 'src/components/common/Tabs/Tabs'
import { useTranslation } from 'next-i18next'
import React, { useState } from 'react'
import CollapsibleRefCard from '../CollapsibleRefCard'
import { formatNumber, formatTime } from 'redux/actions/utils';
import { Line } from '..';
import classNames from 'classnames';

const tags = [{
    value: 'receivedCommision',
    vi: 'Nhận hoa hồng',
    en: 'Received Commision'
}, {
    value: 'lastedUser',
    vi: 'Người dùng mới nhất',
    en: 'Lasted user'
},]

const tier = {
    0: {
        en: 'Diamond',
        vi: 'Kim cương'
    }
}

const languages = {
    newUser: {
        en: 'New user',
        vi: 'Người dùng mới'
    },
    refUser: {
        en: 'Referral',
        vi: 'Người giới thiệu'
    },
    level: {
        en: 'Level',
        vi: 'Cấp bậc'
    },
    tier: {
        en: 'Tier',
        vi: 'Cấp'
    }
}

const title ={
    en: 'Lasted actitivies',
    vi: 'Hoạt động mới nhất'
}

const LastedActivities = () => {
    const { t, i18n: { language } } = useTranslation()
    const [tab, setTab] = useState(tags[0].value)

    const commissionData = [{
        userId: 'Nami112SHT1118',
        level: 1,
        date: Date.now(),
        type: 'Spot',
        profit: 84115,
        symbol: 'VNDC'
    }, {
        userId: 'Nami112SHT1118',
        level: 1,
        date: Date.now(),
        type: 'Spot',
        profit: 84115,
        symbol: 'VNDC'
    }, {
        userId: 'Nami112SHT1118',
        level: 1,
        date: Date.now(),
        type: 'Spot',
        profit: 84115,
        symbol: 'VNDC'
    }, {
        userId: 'Nami112SHT1118',
        level: 1,
        date: Date.now(),
        type: 'Spot',
        profit: 84115,
        symbol: 'VNDC'
    },]

    const userData = [{
        userId: 'Nami112SHT1118',
        ref: {
            userId: 'Nami112SHT1118',
            level: 1,
            tier: 0
        }
    }, {
        userId: 'Nami112SHT1118',
        ref: {
            userId: 'Nami112SHT1118',
            level: 11,
            tier: 0
        }
    }, {
        userId: 'Nami112SHT1118',
        ref: {
            userId: 'Nami112SHT1118',
            level: 1,
            tier: 0
        }
    },]

    const renderData = () => {
        switch (tab) {
            case tags[0].value:
                return commissionData.map((data, index) =>
                    <>
                        <div className='flex flex-col gap-1'>
                            <div className='flex w-full justify-between items-center font-semibold text-sm leading-6'>
                                <div>
                                    {data.userId} (cấp {data.level < 10 ? 0 : null}{data.level})
                                </div>
                                <div className='text-teal'>
                                    +{formatNumber(data.profit, data.symbol.includes('VNDC') ? 2 : 4)} {data.symbol}
                                </div>
                            </div>
                            <div className='flex w-full justify-between items-center text-gray-1 font-medium text-xs leading-[14px]'>
                                <div>
                                    {formatTime(data.date, 'yyyy-MM-dd hh:mm:ss')}
                                </div>
                                <div>
                                    Loại hoa hồng: {data.type}
                                </div>
                            </div>
                        </div>
                        {commissionData.length === index + 1 ? null : <Line className='my-4' />}
                    </>
                )
            case tags[1].value:
                return userData.map(data =>
                    <>
                        <div className='flex gap-2 items-center'>
                            <UserIcon />
                            <div className='font-semibold text-sm leading-6 text-darkBlue'>
                                {languages.newUser[language]}: {data.userId}
                            </div>
                        </div>
                        <div>
                            <RefInfo data={data} language={language} className='mb-6 mt-4' />
                        </div>
                    </>
                )
            default:
                return null
        }

    }

    return (
        <div className='px-4'>
            <CollapsibleRefCard title={title[language]}  >
                <div className='w-auto'>
                    <Tabs tab={tab} className='text-sm flex justify-start gap-7' >
                        {tags.map(e =>
                            <TabItem value={e.value} onClick={() => setTab(e.value)} className='w-auto justify-start !px-0'>
                                {e[language]}
                            </TabItem>
                        )}
                    </Tabs>
                    <div className='mt-6'>
                        {renderData()}
                    </div>
                </div>
            </CollapsibleRefCard>
        </div>
    )
}

const UserIcon = () => <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="28" rx="14" fill="#00C8BC" />
    <g clip-path="url(#clip0_15284_45563)">
        <path d="M14.5 12C14.5 10.895 13.605 10 12.5 10C11.395 10 10.5 10.895 10.5 12C10.5 13.105 11.395 14 12.5 14C13.605 14 14.5 13.105 14.5 12ZM15.5 13V14H17V15.5H18V14H19.5V13H18V11.5H17V13H15.5ZM8.5 17V18H16.5V17C16.5 15.67 13.835 15 12.5 15C11.165 15 8.5 15.67 8.5 17Z" fill="#F6F6F6" />
    </g>
    <defs>
        <clipPath id="clip0_15284_45563">
            <rect width="12" height="12" fill="white" transform="translate(8 8)" />
        </clipPath>
    </defs>
</svg>

const RefInfo = ({ data, language, className }) => (
    <div className={classNames(' border-[1px] border-gray-2 border-opacity-[0.15] rounded-md p-3 text-gray-1 font-medium', className)}>
        <div className='text-xs mt-[-22px]'>
            {languages.refUser[language]}:
        </div>
        <div className='text-sm leading-6'>
            <div className='flex justify-between w-full mt-1'>
                <div>
                    NamiID
                </div>
                <div className='text-darkBlue'>
                    {data.userId}
                </div>
            </div>
            <Line className='my-1' />
            <div className='flex justify-between w-full mt-1'>
                <div>
                    {languages.level[language]}
                </div>
                <div className='text-darkBlue'>
                    {data.ref?.level < 10 ? 0 : null}{data.ref?.level}
                </div>
            </div>
            <Line className='my-1' />
            <div className='flex justify-between w-full mt-1'>
                <div>
                    {languages.tier[language]}
                </div>
                <div className='text-darkBlue'>
                    {tier[data.ref?.tier][language]}
                </div>
            </div>
        </div>
    </div>
)

export default LastedActivities