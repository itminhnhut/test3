import classNames from 'classnames';
import FetchApi from 'utils/fetch-api';
import { API_NEW_REFERRAL_NEW_COMMISSIONS, API_NEW_REFERRAL_NEW_FRIENDS } from 'redux/actions/apis';
import { Line, NoData } from 'components/screens/NewReference/mobile';
import { formatNumber, formatTime } from 'redux/actions/utils';
import Tabs, { TabItem } from 'components/common/Tabs/Tabs'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useState, useMemo } from 'react'
import { RefInfo, UserIcon } from 'components/screens/NewReference/mobile/sections/LastedActivities';
import RefCard from '../../RefCard';

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

const Commission = ({ t, language, id }) => {
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

    const renderNewFriends = useMemo(() => {
        return !lastedFriends.length ? <><NoData className='my-20' text={t('reference:referral.no_friends')} /></> : lastedFriends.map(data =>
            <div key={data.userId}>
                <div className='flex gap-2'>
                    <UserIcon />
                    <div className='font-semibold text-sm leading-6 text-darkBlue'>
                        {t('reference:referral.new_friend')}: {data.code}
                    </div>
                </div>
                <div>
                    <RefInfo data={data} language={language} className='mb-6 mt-4' />
                </div>
            </div>
        )
    }, [lastedFriends])

    const renderLastedCommissions = useMemo(() => {
        return !lastedCommissions.length ? <><NoData className='my-20' text={t('reference:referral.no_commission')} /></> : lastedCommissions.map((data, index) =>
            <div key={index}>
                <div className='flex flex-col gap-1'>
                    <div className='flex w-full justify-between items-center font-semibold text-sm leading-6'>
                        <div className='text-darkBlue'>
                            {data.formUserCode} ({t('reference:referral.level')} {data.level < 10 ? 0 : null}{data.level})
                        </div>
                        <div className='text-teal'>
                            +{formatNumber(data.value, 2)} VNDC
                        </div>
                    </div>
                    <div className='flex w-full justify-between items-center !text-gray-1 font-medium text-xs leading-[14px]'>
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
    }, [lastedCommissions])

    return (
        <div className='flex gap-8 w-full' id={id}>
            <RefCard wrapperClassName='!p-6 w-full max-h-[624px]'>
                <div className='font-semibold text-[20px] leading-6 mb-6'>
                    {t('reference:referral.new_friends')}
                </div>
                <div className='max-h-[calc(624px-96px)] overflow-y-auto pr-4'>
                    {renderNewFriends}
                </div>
            </RefCard>
            <RefCard wrapperClassName='!p-6 w-full  max-h-[624px]'>
                <div className='font-semibold text-[20px] leading-6 mb-6'>
                    {t('futures:mobile.commission')}
                </div>
                <div className='max-h-[calc(624px-96px)] overflow-y-auto pr-4'>
                    {renderLastedCommissions}
                </div>
            </RefCard>
        </div>
    )
}

export default Commission