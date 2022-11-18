import { useTranslation } from 'next-i18next'
import React, { useMemo, useState } from 'react'
import styledComponents from 'styled-components'
import { Line } from '../..'
import RefCard from '../../RefCard'
import RefDetail from './RefDetail'
import { formatNumber } from 'redux/actions/utils';
import { useSelector } from 'react-redux'


const formatter = Intl.NumberFormat('en', {
    notation: 'compact',
})

const Info = ({ data }) => {
    const { t } = useTranslation()
    const [showRef, setShowRef] = useState(false)
    const rank = {
        '0': t('reference:referral.normal'),
        '1': t('reference:referral.official'),
        '2': t('reference:referral.gold'),
        '3': t('reference:referral.platinum'),
        '4': t('reference:referral.diamond'),
    }
    const user = useSelector(state => state.auth.user) || null;
    return (
        <div className='w-full px-4'>
            <RefDetail isShow={showRef} onClose={() => setShowRef(false)} rank={data?.rank ?? 1} defaultRef={data?.defaultRefCode}/>
            <RefCard>
                <div className='flex h-12 gap-4'>
                    <img src={user?.avatar || "/images/default_avatar.png"} className='h-full w-12 rounded-full' />
                    <div className='h-full flex flex-col justify-center'>
                        <div className='font-semibold text-base text-darkBlue'>
                            {data?.name ?? t('common:unknown')}
                        </div>
                        <div className='font-medium text-xs text-gray-1 uppercase'>
                            {t('reference:referral.ranking')}: <span className='text-teal font-semibold'>{rank[data?.rank?.toString() ?? '0']}</span>
                        </div>
                    </div>
                </div>
                <Line className='mt-4 mb-[18px]' />
                <div className='flex flex-col gap-1' >
                    <div className='h-6 flex items-center w-full justify-between font-medium text-sm'>
                        <div className='font-medium text-sm text-gray-1'>
                            {t('reference:referral.exchange_volume')}
                        </div>
                        <div className='text-darkBlue'>
                            +{formatNumber(data?.volume?.mine?.spot, 2)} VNDC
                        </div>
                    </div>
                    <div className='flex w-full justify-between font-medium text-sm'>
                        <div className='text-gray-1'>
                            {t('reference:referral.futures_volume')}
                        </div>
                        <div className='text-darkBlue'>
                            +{formatNumber(data?.volume?.mine?.futures, 2)} VNDC
                        </div>
                    </div>
                </div>
                <Line className='mt-4 mb-[18px]' />
                <div className='flex flex-col gap-2'>
                    <div className='w-full flex h-6 items-center justify-between text-gray-1 font-medium text-xs'>
                        <div>
                            {t('reference:referral.current_volume')}
                        </div>
                        <div>
                            {t('reference:referral.next_level')}
                        </div>
                    </div>
                    <div className='w-full bg-[#f2f4f7]'>
                        <Progressbar
                            background='#00C8BC'
                            percent={
                                (data?.volume?.current ?? 1 / data?.volume?.target?.spot ?? 1) * 100
                            }
                            height={4}
                        />
                    </div>
                    <div className='w-full flex flex-col'>
                        <div className='w-full flex justify-between font-medium text-xs text-darkBlue-1'>
                            <div>
                                Spot: {formatter.format(data?.volume?.current?.spot)} VNDC
                            </div>
                            <div>
                                Spot: {formatter.format(data?.volume?.target?.spot)} VNDC
                            </div>

                        </div>
                        <div className='w-full flex justify-between font-medium text-xs text-darkBlue-1'>

                            <div>
                                Futures: {formatter.format(data?.volume?.current?.futures)} VNDC
                            </div>
                            <div>
                                Futures: {formatter.format(data?.volume?.target?.futures)} VNDC
                            </div>
                        </div>
                    </div>
                    <div className='mt-6 text-center leading-6 font-medium text-sm text-teal underline cursor-pointer'
                        onClick={() => setShowRef(true)}
                    >
                        {t('reference:referral.referral_code_management')}
                    </div>
                </div>
            </RefCard>
        </div>
    )
}

const Progressbar = styledComponents.div.attrs(({ height = 10 }) => ({
    className: `rounded-lg transition-all`,
}))`
    background: ${({ background }) =>
        background
            ? background
            : "linear-gradient(101.26deg, #093DD1 -5.29%, #49E8D5 113.82%)"};
    width: ${({ percent }) => `${percent > 100 ? 100 : percent}%`};
    height: ${({ height }) => `${height || 6}px`};
`;

export default Info