import React from 'react'
import CollapsibleRefCard, { FilterContainer, FilterIcon } from '../CollapsibleRefCard'
import { formatNumber, formatTime } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import classNames from 'classnames';
import { Line } from '..';
import ReferralLevelIcon from '../../../svg/DiamondIcon';

const languages = {
    isKYC: {
        'true': {
            en: 'Đã KYC',
            vi: 'Đã KYC'
        },
        'false': {
            en: 'Chưa KYC',
            vi: 'Chưa KYC'
        }
    },
    people: {
        vi: 'Người',
        en: 'People'
    }
}

const title = {
    en: 'Friend list',
    vi: 'Danh sách bạn bè'
}

const FriendList = () => {
    const { t, i18n: { language } } = useTranslation()

    const fakeData = [{
        userId: 'Nami112SHT1118',
        date: Date.now(),
        kyc: true,
        invited: 8,
        rate: 5,
        directCommission: 741115000,
        indirectCommission: 41116,
        level: 4,
        symbol: 'VNDC'
    }, {
        userId: 'Nami112SHT1118',
        date: Date.now(),
        kyc: false,
        invited: 8,
        rate: 5,
        directCommission: 741115000,
        indirectCommission: 41116,
        level: 3,
        symbol: 'VNDC'
    }, {
        userId: 'Nami112SHT1118',
        date: Date.now(),
        kyc: false,
        invited: 8,
        rate: 5,
        directCommission: 741115000,
        indirectCommission: 41116,
        level: 1,
        symbol: 'VNDC'
    }, {
        userId: 'Nami112SHT1118',
        date: Date.now(),
        kyc: true,
        invited: 8,
        rate: 5,
        directCommission: 741115000,
        indirectCommission: 41116,
        level: 2,
        symbol: 'VNDC'
    },{
        userId: 'Nami112SHT1118',
        date: Date.now(),
        kyc: true,
        invited: 8,
        rate: 5,
        directCommission: 741115000,
        indirectCommission: 41116,
        level: 5,
        symbol: 'VNDC'
    },]

    const renderData = () => {
        return fakeData.map((data, index) => (
            <div>
                <div className='flex justify-between'>
                    <div className='flex flex-col justify-center items-start'>
                        <div className='leading-6 font-semibold text-sm text-darkBlue flex gap-1 items-center'>
                            {data.userId} {ReferralLevelIcon(data.level)}
                        </div>
                        <div className='leading-[14px] font-medium text-xs text-gray-1' >
                            Ngày giới thiệu: {formatTime(data.date, 'yyyy-MM-dd hh:mm:ss')}
                        </div>
                    </div>
                    <div>
                        <div className={classNames('px-2 py-1 rounded-md font-semibold text-sm leading-6', data.kyc ? 'text-teal bg-teal/[.05]' : 'text-gray-1 bg-gray-1/[.05]')}>
                            {languages.isKYC[data.kyc][language]}
                        </div>
                    </div>
                </div>
                <div className='my-3 py-2 rounded-md border-[1px] border-gray-2/[.15] flex'>
                    <div className='w-full text-center border-r-[1px]'>
                        <div className='font-medium text-sm text-gray-1'>
                            Đã giới thiệu
                        </div>
                        <div className='text-darkBlue'>
                            {data.invited} {languages.people[language]}
                        </div>
                    </div>
                    <div className='w-full text-center border-r-[1px]'>
                        <div className='font-medium text-sm text-gray-1'>
                            Tỷ lệ hoa hồng
                        </div>
                        <div className='text-darkBlue'>
                            {data.rate} %
                        </div>
                    </div>
                </div>
                <div className='text-sm font-medium flex flex-col gap-1'>
                    <div className='flex justify-between w-full'>
                        <div>
                            Tổng hoa hồng trực tiếp
                        </div>
                        <div className='text-teal'>
                            +{formatNumber(data.directCommission, data.symbol.includes('VNDC') ? 2 : 4)} {data.symbol}
                        </div>
                    </div>
                    <div className='flex justify-between w-full'>
                        <div>
                            Tổng hoa hồng gián tiếp
                        </div>
                        <div className='text-teal'>
                            +{formatNumber(data.indirectCommission, data.symbol.includes('VNDC') ? 2 : 4)} {data.symbol}
                        </div>
                    </div>
                </div>
                {fakeData.length === index + 1 ? null : <Line className='my-4' />}
            </div>
        ))
    }

    return (
        <div className='px-4'>
            <CollapsibleRefCard title={title[language]} >
                <div className='w-auto'>
                    <div className='flex flex-wrap gap-2'>
                        <FilterContainer>
                            <FilterIcon /> Lọc kêt quả
                        </FilterContainer>
                        <FilterContainer>
                            Ngày giới thiệu: 22/02/2022
                        </FilterContainer>
                        <FilterContainer>
                            Tình trạng: Tất cả
                        </FilterContainer>
                        <FilterContainer>
                            Tổng HH: 22/02/2022 - 30/02/2022
                        </FilterContainer>
                    </div>
                </div>
                <div className='mt-6'>
                    {renderData()}
                </div>
            </CollapsibleRefCard>
        </div>
    )
}


export default FriendList