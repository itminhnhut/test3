import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import React, { useState } from 'react'
import { Line } from '../..'
import PopupModal, { copy, CopyIcon } from '../../PopupModal'
import FriendList from './FriendList'
import AddNewRef from './AddNewRef'
import EditNote from './EditNote'

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
const RefDetail = ({ isShow = false, onClose }) => {
    const { t, i18n: { language } } = useTranslation()
    const [showAddRef, setShowAddRef] = useState(false)
    const [showFriendList, setShowFriendList] = useState(false)
    const [showEditNote, setShowEditNote] = useState(false)
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

    return (
        <PopupModal
            isVisible={isShow}
            onBackdropCb={onClose}
            title='Quản lý Referral'
            useFullScreen
        >
            <div>
                <AddNewRef isShow={showAddRef} onClose={() => setShowAddRef(false)} />
                <FriendList isShow={showFriendList} onClose={() => setShowFriendList(false)} />
                <EditNote isShow={showEditNote} onClose={() => setShowEditNote(false)} />
                <div className='!max-h-[calc(100vh-206px)] !overflow-auto no-scrollbar'>
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
                                <div onClick={() => {}}>
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
                                    <div className='text-darkBlue text-sm flex items-center gap-1'
                                        onClick={() => setShowFriendList(true)}
                                    >
                                        {data.totalFriends} <FriendListIcon />
                                    </div>
                                </div>
                                <div className='w-full flex justify-between items-center'>
                                    <div className='text-gray-1 text-xs '>
                                        Ghi chú
                                    </div>
                                    <div className='text-darkBlue text-sm flex items-center gap-1'
                                        onClick={() => setShowEditNote(true)}
                                    >
                                        {data.note} <NoteIcon />
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
                    <div className='h-11 bg-teal rounded-md w-full flex items-center justify-center text-white font-semibold text-sm'
                        onClick={() => setShowAddRef(true)}
                    >
                        Thêm Referral mới
                    </div>
                </div>
            </div>
        </PopupModal>
    )
}

const FriendListIcon = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 3h6.5M4 6h6.5M4 9h6.5M1.5 3h.005M1.5 6h.005M1.5 9h.005" stroke="#718096" stroke-linecap="round" stroke-linejoin="round" />
</svg>

const NoteIcon = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#s8m7dixeoa)" stroke="#718096" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5.5 2H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V6.5" />
        <path d="M10 .94a1.06 1.06 0 0 0-.75.31L4.5 6 4 8l2-.5 4.75-4.75A1.06 1.06 0 0 0 10 .94z" />
    </g>
    <defs>
        <clipPath id="s8m7dixeoa">
            <path fill="#fff" d="M0 0h12v12H0z" />
        </clipPath>
    </defs>
</svg>


export default RefDetail