import Tabs, { TabItem } from 'src/components/common/Tabs/Tabs'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useState } from 'react'
import CollapsibleRefCard from '../../CollapsibleRefCard'
import { formatNumber, formatTime } from 'redux/actions/utils';
import { Line, NoData } from '..';
import classNames from 'classnames';
import FetchApi from 'utils/fetch-api';
import { API_NEW_REFERRAL_NEW_COMMISSIONS, API_NEW_REFERRAL_NEW_FRIENDS } from 'redux/actions/apis';


const tier = {
    1: {
        vi: 'Thường',
        en: 'Normal'
    },
    2: {
        vi: 'Chính thức',
        en: 'Offical'
    },
    3: {
        en: 'Gold',
        vi: 'Vàng'
    },
    4: {
        vi: 'Bạch Kim',
        en: 'Platinum'
    },
    5: {
        en: 'Diamond',
        vi: 'Kim Cương'
    },
}
const languages = {
    newUser: {
        en: 'New Friend',
        vi: 'Bạn bè mới'
    },
    refUser: {
        en: 'Referrer',
        vi: 'Người giới thiệu'
    },
    level: {
        en: 'Level',
        vi: 'Cấp bậc'
    },
    tier: {
        en: 'Ranking',
        vi: 'Hạng'
    }
}

const LastedActivities = () => {
    const { t, i18n: { language } } = useTranslation()
    const [lastedCommissions, setLastedCommissions] = useState([])
    const [lastedFriends, setLastedFriends] = useState([])
    const tags = [{
        value: 'receivedCommision',
        content: t('futures:mobile.commission')
    }, {
        value: 'lastedUser',
        content: t('reference:referral.new_friends')
    },]
    const [tab, setTab] = useState(tags[0].value)
    useEffect(() => {
        FetchApi({
            url: API_NEW_REFERRAL_NEW_COMMISSIONS,
            options: {
                method: 'GET',
            },
        }).then(({ data, status }) => {
            if (status === 'ok') {
                setLastedCommissions(data)
            } else {
                setLastedCommissions([])
            }
        });
        FetchApi({
            url: API_NEW_REFERRAL_NEW_FRIENDS,
            options: {
                method: 'GET',
            },
        }).then(({ data, status }) => {
            if (status === 'ok') {
                setLastedFriends(data)
            } else {
                setLastedFriends([])
            }
        });
    }, [])

    const renderData = () => {
        switch (tab) {
            case tags[0].value:
                return !lastedCommissions.length ? <><NoData className='my-20' text={t('reference:referral.no_commission')} /></> : lastedCommissions.map((data, index) =>
                    <div key={index}>
                        <div className='flex flex-col gap-1'>
                            <div className='flex w-full justify-between items-center font-semibold text-sm leading-6'>
                                <div className='text-gray-6'>
                                    {data.formUserCode} ({t('reference:referral.level')} {data.level < 10 ? 0 : null}{data.level})
                                </div>
                                <div className='text-teal'>
                                    +{formatNumber(data.value, 2)} VNDC
                                </div>
                            </div>
                            <div className='flex w-full justify-between items-center !text-gray-7 font-medium text-xs leading-[14px]'>
                                <div>
                                    {formatTime(data.createdAt, 'yyyy-MM-dd HH:mm:ss')}
                                </div>
                                <div>
                                    {t('reference:referral.type')}: {data.kind}
                                </div>
                            </div>
                        </div>
                        {lastedCommissions.length === index + 1 ? null : <Line className='my-4' />}
                    </div>
                )
            case tags[1].value:
                return !lastedFriends.length ? <><NoData className='my-20' text={t('reference:referral.no_friends')} /></> : lastedFriends.map(data =>
                    <div key={data.userId}>
                        <div className='flex gap-2 items-center'>
                            <UserIcon isMobile />
                            <div className='font-semibold text-sm leading-6 text-gray-6'>
                                {t('reference:referral.new_friend')}: {data.code}
                            </div>
                        </div>
                        <div>
                            <RefInfo data={data} language={language} className='mb-6 mt-4' isMobile/>
                        </div>
                    </div>
                )
            default:
                return null
        }

    }

    return (
        <div className='px-4'>
            <CollapsibleRefCard title={t('reference:referral.recent_activities')} isBlack >
                <div className='w-auto'>
                    <Tabs tab={tab} className='text-sm font-medium flex justify-start gap-7' isMobile >
                        {tags.map((e, index) =>
                            <div key={index}>
                                <TabItem value={e.value} onClick={() => setTab(e.value)} className='w-auto justify-start !px-0'>
                                    {e.content}
                                </TabItem>
                            </div>
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

export const UserIcon = ({ isMobile = false }) => <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="28" rx="14" fill={!isMobile ? '#00C8BC' : "#47cc85"} />
    <g clipPath="url(#clip0_15284_45563)">
        <path d="M14.5 12C14.5 10.895 13.605 10 12.5 10C11.395 10 10.5 10.895 10.5 12C10.5 13.105 11.395 14 12.5 14C13.605 14 14.5 13.105 14.5 12ZM15.5 13V14H17V15.5H18V14H19.5V13H18V11.5H17V13H15.5ZM8.5 17V18H16.5V17C16.5 15.67 13.835 15 12.5 15C11.165 15 8.5 15.67 8.5 17Z" fill="#F6F6F6" />
    </g>
    <defs>
        <clipPath id="clip0_15284_45563">
            <rect width="12" height="12" fill="white" transform="translate(8 8)" />
        </clipPath>
    </defs>
</svg>

export const RefInfo = ({ data, language, className, isMobile = false }) => (
    <div className={classNames(' border-[1px] border-gray-2 border-opacity-[0.15] rounded-md p-3 font-medium z-1 overflow-visible', className, { 'text-gray-7 !font-semibold': isMobile, 'text-gray-1': !isMobile })}>
        <div className={classNames('text-xs mt-[-24px] px-1 -ml-1 z-2 relative w-fit', {
            'bg-darkBlue3': isMobile,
            'bg-white': !isMobile
        })}>
            {languages.refUser[language]}:
        </div>
        <div className='text-sm leading-6'>
            <div className='flex justify-between w-full mt-1'>
                <div>
                    NamiID
                </div>
                <div className={isMobile ? 'text-gray-6' : 'text-darkBlue'}>
                    {data.invitedBy?.code}
                </div>
            </div>
            <Line className='my-1' />
            <div className='flex justify-between w-full mt-1'>
                <div>
                    {languages.level[language]}
                </div>
                <div className={isMobile ? 'text-gray-6' : 'text-darkBlue'}>
                    {data.rank < 10 ? 0 : null}{data.rank}
                </div>
            </div>
            <Line className='my-1' />
            <div className='flex justify-between w-full mt-1'>
                <div>
                    {languages.tier[language]}
                </div>
                <div className={isMobile ? 'text-gray-6' : 'text-darkBlue'}>
                    {tier[data.rank][language]}
                </div>
            </div>
        </div>
    </div>
)

export default LastedActivities
