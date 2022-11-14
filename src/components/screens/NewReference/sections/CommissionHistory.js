import React, { useMemo, useState } from 'react'
import CollapsibleRefCard, { FilterContainer, FilterIcon } from '../CollapsibleRefCard'
import AssetLogo from 'components/wallet/AssetLogo';
import { formatNumber, formatTime } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import { Line } from '..';

const commissionTypes = {
    0: 'Spot',
    1: 'Futures'
}
const languages = {
    name: {
        vi: 'Hoa hồng',
        en: 'Commission'
    },
    level: {
        vi: 'Cấp',
        en: 'Level'
    },
    type: {
        vi: 'Loại hoa hồng',
        en: 'Commission type'
    }
}

const CommissionHistory = () => {
    const { t, i18n: { language } } = useTranslation()
    const [showMore, setShowMore] = useState(5)

    const fakeData = [{
        name: 'commision',
        type: 0,
        profit: 41115,
        currency: 72,
        date: Date.now(),
        level: 1
    }, {
        name: 'commision',
        type: 0,
        profit: 41115,
        currency: 72,
        date: Date.now(),
        level: 1
    }, {
        name: 'commision',
        type: 0,
        profit: 41115,
        currency: 72,
        date: Date.now(),
        level: 1
    }, , {
        name: 'commision',
        type: 0,
        profit: 41115,
        currency: 72,
        date: Date.now(),
        level: 1
    }, {
        name: 'commision',
        type: 0,
        profit: 41115,
        currency: 72,
        date: Date.now(),
        level: 1
    }, {
        name: 'commision',
        type: 0,
        profit: 41115,
        currency: 72,
        date: Date.now(),
        level: 1
    }, {
        name: 'commision',
        type: 0,
        profit: 41115,
        currency: 72,
        date: Date.now(),
        level: 1
    }, {
        name: 'commision',
        type: 0,
        profit: 41115,
        currency: 72,
        date: Date.now(),
        level: 1
    }, {
        name: 'commision',
        type: 0,
        profit: 41115,
        currency: 72,
        date: Date.now(),
        level: 1
    }, {
        name: 'commision',
        type: 0,
        profit: 41115,
        currency: 72,
        date: Date.now(),
        level: 1
    },]

    const handleShowMore = () => {
        setShowMore(showMore + 5)
    }

    const filteredData = useMemo(() => {
        return fakeData.slice(0, showMore + 1)
    }, [showMore])

    const renderData = () => {
        return filteredData.map((data, index) =>
            <>
                <div className='flex items-center w-full justify-between gap-2'>
                    <div className='flex items-center gap-2'>
                        <AssetLogo size={36} assetId={data.currency} />
                        <div>
                            <div className='font-semibold text-sm leading-6 text-darkBlue'>
                                {languages.name[language]} ({languages.level[language]} {data.level})
                            </div>
                            <div className='font-medium text-xs text-gray-1'>
                                {formatTime(data.date, 'yyyy-MM-dd hh:mm:ss')}
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col items-end'>
                        <div className='text-teal font-semibold text-sm'>
                            +{formatNumber(data.profit, data.symbol?.includes('VNDC') ? 2 : 4)} {data.symbol} VNDC
                        </div>
                        <div className='font-medium text-xs text-gray-1'>
                            {languages.type[language]}: {commissionTypes[data.type]}
                        </div>
                    </div>
                </div>
                {filteredData.length === index + 1 ? null : <Line className='my-4' />}
            </>
        )
    }

    return (
        <div className='px-4'>
            <CollapsibleRefCard title='Lịch sử hoàn phí hoa hồng' >
                <div className='w-auto'>
                    <div className='flex flex-wrap gap-2'>
                        <FilterContainer>
                            <FilterIcon /> Lọc kêt quả
                        </FilterContainer>
                        <FilterContainer>
                            Thời gian: 22/02/2022  - 30/02/2022
                        </FilterContainer>
                        <FilterContainer>
                            Cấp: Tất cả
                        </FilterContainer>
                        <FilterContainer>
                            Sản phẩm: Tất cả
                        </FilterContainer>
                        <FilterContainer>
                            Tài sản: Tất cả
                        </FilterContainer>
                    </div>
                </div>
                <div className='mt-6'>
                    {renderData()}
                </div>
                <div className='mt-6 text-center text-sm font-medium text-teal underline'
                    onClick={() => handleShowMore()}
                >
                    {fakeData.length <= showMore + 1 ? null : language === 'vi' ? 'Xem thêm danh sách' : 'Show morre'}
                </div>
            </CollapsibleRefCard>
        </div>
    )
}

export default CommissionHistory