import { useTranslation } from 'next-i18next'
import React, { useMemo, useState } from 'react'
import styledComponents from 'styled-components'
import { Line } from '../..'
import RefCard from '../../RefCard'
import RefDetail from './RefDetail'
import { formatNumber } from 'redux/actions/utils';

const rank = {
    '0': { vi: 'THƯỜNG', en: 'CASUAL' },
    '1': { vi: 'CHÍNH THỨC', en: 'OFFICAL' },
    '2': { vi: 'BẠC', en: 'SILVER' },
    '3': { vi: 'VÀNG', en: 'GOLD' },
    '4': { vi: 'BẠCH KIM', en: 'PLATINUM' },
    '5': { vi: 'KIM CƯƠNG', en: 'DIAMOND' },
}

const formatter = Intl.NumberFormat('en', {
    notation: 'compact',
})

const Info = ({ data }) => {
    const [showRef, setShowRef] = useState(false)
    const { t, i18n: { language } } = useTranslation()
    return (
        <div className='w-full px-4'>
            <RefDetail isShow={showRef} onClose={() => setShowRef(false)} rank={data?.rank ?? 1}/>
            <RefCard>
                <div className='flex h-12 gap-4'>
                    <div className='bg-red h-full w-12 rounded-full'>
                    </div>
                    <div className='h-full flex flex-col justify-center'>
                        <div className='font-semibold text-base text-darkBlue'>
                            {data?.name ?? t('common:unknown')}
                        </div>
                        <div className='font-medium text-xs text-gray-1'>
                            CAP BAC: <span className='text-teal font-semibold'>{rank[data?.rank?.toString() ?? '0'][language]}</span>
                        </div>
                    </div>
                </div>
                <Line className='mt-4 mb-[18px]' />
                <div className='flex flex-col gap-1' >
                    <div className='h-6 flex items-center w-full justify-between font-medium text-sm'>
                        <div className='font-medium text-sm text-gray-1'>
                            Giao dich Spot
                        </div>
                        <div className='text-darkBlue'>
                            +{formatNumber(data?.volume?.mine?.spot, 2)} VNDC
                        </div>
                    </div>
                    <div className='flex w-full justify-between font-medium text-sm'>
                        <div className='text-gray-1'>
                            Giao dich Futures
                        </div>
                        <div className='text-darkBlue'>
                            +{formatNumber(data?.volume?.mine?.futures, 2)} VNDC VNDC
                        </div>
                    </div>
                </div>
                <Line className='mt-4 mb-[18px]' />
                <div className='flex flex-col gap-2'>
                    <div className='w-full flex h-6 items-center justify-between text-gray-1 font-medium text-xs'>
                        <div>
                            Volume hien tai
                        </div>
                        <div>
                            Cap tiep theo
                        </div>
                    </div>
                    <div className='w-full bg-[#f2f4f7]'>
                        <Progressbar
                            background='#00C8BC'
                            percent={
                                ((50) / 100) * 100
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
                        Quản lý Referral
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