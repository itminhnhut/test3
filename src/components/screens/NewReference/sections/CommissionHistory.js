import React, { useMemo, useState } from 'react'
import CollapsibleRefCard, { FilterContainer, FilterIcon } from '../CollapsibleRefCard'
import AssetLogo from 'components/wallet/AssetLogo';
import { formatNumber, formatTime } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import { FilterTabs, Line, RefButton } from '..';
import PopupModal, { CalendarIcon } from '../PopupModal';

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
const title = {
    vi: 'Lịch sử hoàn phí hoa hồng',
    en: 'Commission history'
}
const levelTabs = [
    { title: 'Tất cả', value: 1 },
    { title: '01', value: 2 },
    { title: '02', value: 3 },
    { title: '03', value: 4 },
    { title: '04', value: 5 },
    { title: '05', value: 6 },
]
const typeTabs = [
    { title: 'Tất cả', value: 1 },
    { title: 'Spot', value: 2 },
    { title: 'Futures', value: 3 },
]
const assetTabs = [
    { title: 'Tất cả', value: 1 },
    { title: 'VNDC', value: 2 },
    { title: 'USDT', value: 3 },
    { title: 'NAO', value: 4 },
    { title: 'NAMI', value: 5 },
]

const CommissionHistory = ({ id }) => {
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

    const [showFilter, setShowFilter] = useState(false)
    const [levelTab, setLevelTab] = useState(levelTabs[0].value)
    const [typeTab, setTypeTab] = useState(typeTabs[0].value)
    const [assetTab, setAssetTab] = useState(assetTabs[0].value)

    const renderFilterModal = useMemo(() => {
        return (
            <PopupModal
                isVisible={showFilter}
                onBackdropCb={() => setShowFilter(false)}
                title='Lọc kết quả'
            >
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-1 font-medium text-sm leading-6 text-gray-1'>
                        <div>
                            Ngày giới thiệu
                        </div>
                        <div>
                            <div className='p-3 flex gap-2 items-center bg-gray-4 rounded-[4px]'>
                                <CalendarIcon />
                                <div className='text-darkBlue'>22/03/2022</div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-3 font-medium text-sm leading-6 text-gray-1'>
                        <div>
                            Cấp
                        </div>
                        <div className='flex'>
                            <FilterTabs className='!px-4 !py-3 !font-medium !text-sm' tabs={levelTabs} type={levelTab} setType={setLevelTab} />
                        </div>
                    </div>
                    <div className='flex flex-col gap-3 font-medium text-sm leading-6 text-gray-1'>
                        <div>
                            Sản phẩm
                        </div>
                        <div className='flex'>
                            <FilterTabs className='!px-4 !py-3 !font-medium !text-sm' tabs={typeTabs} type={typeTab} setType={setTypeTab} />
                        </div>
                    </div>
                    <div className='flex flex-col gap-3 font-medium text-sm leading-6 text-gray-1 mb-4'>
                        <div>
                            Tài sản
                        </div>
                        <div className='flex'>
                            <FilterTabs className='!px-4 !py-3 !font-medium !text-sm' tabs={assetTabs} type={assetTab} setType={setAssetTab} />
                        </div>
                    </div>
                    <RefButton title={t('common:confirm')} />
                </div>
            </PopupModal>
        )
    }, [showFilter, assetTab, typeTab, levelTab])


    return (
        <div className='px-4' id={id}>
            {renderFilterModal}
            <CollapsibleRefCard title={title[language]} >
                <div className='w-auto'>
                    <div className='flex flex-wrap gap-2'>
                        <FilterContainer onClick={() => setShowFilter(true)}>
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