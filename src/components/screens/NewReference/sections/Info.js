import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import React, { useMemo, useState } from 'react'
import styledComponents from 'styled-components'
import { Line } from '..'
import PopupModal, { copy, CopyIcon } from '../PopupModal'
import RefCard from '../RefCard'

const languages = {
    isDefault: {
        'true': {
            en: 'Default',
            vi: 'Mặc định'
        },
        'false': {
            en: 'Set default',
            vi: 'Đặt làm mặc định'
        }
    },
}

const Info = () => {
    const [showRef, setShowRef] = useState(false)
    const { t, i18n: { language } } = useTranslation()

    const fakeData = [{
        ref: 'P5V10NRN',
        you: 10,
        they: 5,
        refLink: 'https://app.zeplin.io/project/636ca9563ace7e844c568eb2/screen/636ca981664e172f3b878670',
        totalFriends: 21,
        note: 'TraderSG',
        isDefault: true
    }, {
        ref: 'P5V10NRN',
        you: 10,
        they: 5,
        refLink: 'https://app.zeplin.io/project/636ca9563ace7e844c568eb2/screen/636ca981664e172f3b878670',
        totalFriends: 21,
        note: 'TraderSG',
        isDefault: false
    }, {
        ref: 'P5V10NRN',
        you: 10,
        they: 5,
        refLink: 'https://app.zeplin.io/project/636ca9563ace7e844c568eb2/screen/636ca981664e172f3b878670',
        totalFriends: 21,
        note: 'TraderSG',
        isDefault: false
    }, {
        ref: 'P5V10NRN',
        you: 10,
        they: 5,
        refLink: 'https://app.zeplin.io/project/636ca9563ace7e844c568eb2/screen/636ca981664e172f3b878670',
        totalFriends: 21,
        note: 'TraderSG',
        isDefault: false
    }, {
        ref: 'P5V10NRN',
        you: 10,
        they: 5,
        refLink: 'https://app.zeplin.io/project/636ca9563ace7e844c568eb2/screen/636ca981664e172f3b878670',
        totalFriends: 21,
        note: 'TraderSG',
        isDefault: false
    }, {
        ref: 'P5V10NRN',
        you: 10,
        they: 5,
        refLink: 'https://app.zeplin.io/project/636ca9563ace7e844c568eb2/screen/636ca981664e172f3b878670',
        totalFriends: 21,
        note: 'TraderSG',
        isDefault: false
    }, {
        ref: 'P5V10NRN',
        you: 10,
        they: 5,
        refLink: 'https://app.zeplin.io/project/636ca9563ace7e844c568eb2/screen/636ca981664e172f3b878670',
        totalFriends: 21,
        note: 'TraderSG',
        isDefault: false
    }, {
        ref: 'P5V10NRN',
        you: 10,
        they: 5,
        refLink: 'https://app.zeplin.io/project/636ca9563ace7e844c568eb2/screen/636ca981664e172f3b878670',
        totalFriends: 21,
        note: 'TraderSG',
        isDefault: false
    }, {
        ref: 'P5V10NRN',
        you: 10,
        they: 5,
        refLink: 'https://app.zeplin.io/project/636ca9563ace7e844c568eb2/screen/636ca981664e172f3b878670',
        totalFriends: 21,
        note: 'TraderSG',
        isDefault: false
    }, {
        ref: 'P5V10NRN',
        you: 10,
        they: 5,
        refLink: 'https://app.zeplin.io/project/636ca9563ace7e844c568eb2/screen/636ca981664e172f3b878670',
        totalFriends: 21,
        note: 'TraderSG',
        isDefault: false
    },]

    const renderFilterModal = useMemo(() => {
        return (
            <PopupModal
                isVisible={showRef}
                onBackdropCb={() => setShowRef(false)}
                title='Quản lý Referral'
                useFullScreen
            >
                <div>
                    <div className='max-h-[calc(100vh-206px)] overflow-auto no-scrollbar'>
                        {fakeData.map((data, index) => (
                            <>
                                <div className='flex w-full justify-between font-semibold text-sm leading-6 items-center'>
                                    <div className='flex gap-2 items-center'>
                                        {data.ref}
                                        <CopyIcon
                                            onClick={() => {
                                                copy(data.ref)
                                            }}
                                            size={16}
                                            className="cursor-pointer"
                                        />
                                    </div>
                                    <div>
                                        <div className={classNames('px-2 py-1 rounded-md font-semibold text-sm leading-6', data.isDefault ? 'text-teal bg-teal/[.05]' : 'text-gray-1 bg-gray-1/[.05]')}>
                                            {languages?.isDefault[data.isDefault][language]}
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-3 font-medium leading-5 flex flex-col gap-2'>
                                    <div className='w-full flex justify-between items-center'>
                                        <div className='text-gray-1 text-xs '>
                                            Bạn nhận / Bạn bè nhận
                                        </div>
                                        <div className='text-teal text-sm'>
                                            {data.you}% / {data.they}%
                                        </div>
                                    </div>
                                    <div className='w-full flex justify-between items-center'>
                                        <div className='text-gray-1 text-xs'>
                                            Ref Link
                                        </div>
                                        <div className='text-darkBlue text-sm flex gap-2 justify-end items-center w-fit'>
                                            <div className='max-w-[140px] truncate'>
                                                {data.refLink}
                                            </div>
                                            <CopyIcon
                                                onClick={() => {
                                                    copy(data.refLink)
                                                }}
                                                size={12}
                                                className="cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                    <div className='w-full flex justify-between items-center'>
                                        <div className='text-gray-1 text-xs '>
                                            Bạn bè
                                        </div>
                                        <div className='text-darkBlue text-sm '>
                                            {data.totalFriends}
                                        </div>
                                    </div>
                                    <div className='w-full flex justify-between items-center'>
                                        <div className='text-gray-1 text-xs '>
                                            Ghi chú
                                        </div>
                                        <div className='text-darkBlue text-sm'>
                                            {data.note}
                                        </div>
                                    </div>
                                </div>
                                {fakeData.length === index + 1 ? null : <Line className='my-4' />}
                            </>
                        ))}
                    </div>
                    <div className='h-[116px] w-full flex justify-center pt-6 pb-12 px-4 absolute bottom-0 left-0' style={{
                        boxShadow: '0 -7px 23px 0 rgba(0, 0, 0, 0.05)'
                    }}>
                        <div className='h-11 bg-teal rounded-md w-full flex items-center justify-center text-white font-semibold text-sm'>
                            Thêm Referral mới
                        </div>
                    </div>
                </div>
            </PopupModal>
        )
    }, [showRef])

    return (
        <div className='w-full px-4'>
            {renderFilterModal}
            <RefCard>
                <div className='flex h-12 gap-4'>
                    <div className='bg-red h-full w-12 rounded-full'>

                    </div>
                    <div className='h-full flex flex-col justify-center'>
                        <div className='font-semibold text-base text-darkBlue'>
                            Nguyen Ngoc Hoan My
                        </div>
                        <div className='font-medium text-xs text-gray-1'>
                            CAP BAC: <span className='text-teal font-semibold'>VANG</span>
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
                            500, 000 USDT
                        </div>
                    </div>
                    <div className='flex w-full justify-between font-medium text-sm'>
                        <div className='text-gray-1'>
                            Giao dich Spot
                        </div>
                        <div className='text-darkBlue'>
                            500, 000 USDT
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
                                Spot: 500K USDT
                            </div>
                            <div>
                                Spot: 1M USDT
                            </div>

                        </div>
                        <div className='w-full flex justify-between font-medium text-xs text-darkBlue-1'>

                            <div>
                                Futures: 500K USDT
                            </div>
                            <div>
                                Futures: 1M USDT
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