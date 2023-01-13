import { useTranslation } from 'next-i18next'
import React, { useMemo, useState } from 'react'
import styledComponents from 'styled-components'
import { Line } from '../..'
import RefCard from 'src/components/screens/NewReference/RefCard'
import RefDetail from './RefDetail'
import ReferralLevelIcon from 'src/components/svg/RefIcons'
import classNames from 'classnames'
import colors from 'styles/colors'
import NeedLogin from 'components/common/NeedLogin'


const formatter = Intl.NumberFormat('en', {
    notation: 'compact',
})

const Info = ({ data, user }) => {
    const { t } = useTranslation()
    const [showRef, setShowRef] = useState(false)
    const rank = {
        '1': t('reference:referral.normal'),
        '2': t('reference:referral.official'),
        '3': t('reference:referral.gold'),
        '4': t('reference:referral.platinum'),
        '5': t('reference:referral.diamond'),
    }
    return (
        <div className='w-full px-4'>
            <RefDetail isShow={showRef} onClose={() => setShowRef(false)} rank={data?.rank ?? 1} defaultRef={data?.defaultRefCode?.code} />
            <RefCard isBlack>
                <div className='flex h-12 gap-4'>
                    <div className='flex relative'>
                        <img src={user?.avatar || "/images/default_avatar.png"} className='h-full w-12 rounded-full' />
                        <div className='absolute bottom-[-3px] right-[-8px]'>
                            {ReferralLevelIcon(data?.rank ?? 1, 22)}
                        </div>
                    </div>
                    <div className='h-full flex flex-col justify-center'>
                        <div className='font-semibold text-base text-gray-6'>
                            {data?.name ?? t('common:unknown')}
                        </div>
                        <div className='font-medium text-xs text-gray-1 uppercase'>
                            {t('reference:referral.ranking')}: <span className='text-namiapp-green font-semibold'>{rank[data?.rank?.toString() ?? '1']}</span>
                        </div>
                    </div>
                </div>
                <Line className='mt-4 mb-[18px]' />

                {user ? <div className='flex flex-col gap-2'>
                    <div className='w-full flex h-6 items-center justify-between text-gray-7 font-medium text-xs'>
                        <div>
                            {t('reference:referral.current_volume')}
                        </div>
                        <div>
                            {data?.rank !== 5 ? t('reference:referral.next_level') : null}
                        </div>
                    </div>
                    <div className='w-full bg-namiapp-black-2 flex'>
                        <Progressbar
                            background={colors.namiapp.green[2]}
                            percent={
                                (data?.volume?.current?.spot / data?.volume?.target?.spot ?? 1) * 100
                            }
                            height={4}
                            className={data?.volume?.current?.futures ? '!rounded-l-lg' : '!rounded-lg'}
                        />
                        <Progressbar
                            background={colors.namiapp.green.DEFAULT}
                            percent={
                                (data?.volume?.current?.futures / data?.volume?.target?.futures ?? 1) * 100
                            }
                            height={4}
                            className='!rounded-r-lg'
                        />
                    </div>
                    <div className='w-full flex flex-col'>
                        <div className='w-full flex justify-between font-medium text-xs text-namiapp-green-2'>
                            <div>
                                Spot: {formatter.format(data?.volume?.current?.spot)} USDT
                            </div>
                            {data?.rank !== 5 ? <div>
                                Spot: {formatter.format(data?.volume?.target?.spot)} USDT
                            </div> : null}

                        </div>
                        <div className='w-full flex justify-between font-medium text-xs text-namiapp-green-1'>
                            <div>
                                Futures: {formatter.format(data?.volume?.current?.futures)} USDT
                            </div>
                            {data?.rank !== 5 ? <div>
                                Futures: {formatter.format(data?.volume?.target?.futures)} USDT
                            </div> : null}
                        </div>
                    </div>
                    <div className='mt-6 text-center leading-6 font-medium text-sm text-namiapp-green-1 underline cursor-pointer'
                        onClick={() => setShowRef(true)}
                    >
                        {t('reference:referral.referral_code_management')}
                    </div>
                </div> : <NeedLogin message={t('reference:user.login_to_view')} isNamiapp addClass='mt-8' />}
            </RefCard>
        </div>
    )
}

export const Progressbar = styledComponents.div.attrs(({ height = 10, className }) => ({
    className: classNames(`transition-all`, className),
}))`
    background: ${({ background }) =>
        background
            ? background
            : "linear-gradient(101.26deg, #093DD1 -5.29%, #49E8D5 113.82%)"};
    width: ${({ percent }) => `${percent > 100 ? 100 : percent}%`};
    height: ${({ height }) => `${height || 6}px`};
`;

export default Info