import React, { useState } from 'react'
import PopupModal from '../../PopupModal'
import FetchApi from 'utils/fetch-api';
import _ from 'lodash';
import { API_NEW_REFERRAL_EDIT_NOTE } from 'redux/actions/apis';

const EditNote = ({ isShow = false, onClose, doRefresh, code }) => {
    const [note, setNote] = useState('')
    const handleInputNote = (e) => {
        const text = e?.target?.value
        if (text.length > 30) return
        setNote(text)
    }

    const doClose = () => {
        const elements = document.getElementsByTagName("input");
        elements[0].value = "";
        onClose()
        setNote('')
    }

    const handleSubmitEditNote = _.throttle(async() => {
        const { status } = await FetchApi({
            url: API_NEW_REFERRAL_EDIT_NOTE.replace(':code', code),
            options: {
                method: 'PATCH',
            },
            params: {
                note
            }
        })
        if (status === 'ok') {
            doClose()
            doRefresh()
        } else {
        }
    }, 1000)

    return (
        <PopupModal
            isVisible={isShow}
            onBackdropCb={doClose}
            title='Thêm giới thiệu mới'
            zIndex={1000}
        >
            <div className='font-medium text-sm text-gray-1 leading-6 flex flex-col gap-4'>
                <div>
                    Ghi chú
                    <div className='mt-1 rounded-[4px] px-3 h-11 flex justify-between items-center bg-gray-4 font-medium text-sm leading-6'>
                        <input className='text-darkBlue w-full' maxLength={30} onChange={handleInputNote} />
                        <div className='w-10'>
                            {note.length}/30
                        </div>
                    </div>
                </div>
                <div className='w-full h-11 mt-4 bg-teal rounded-md text-white font-semibold text-sm leading-6 flex items-center justify-center cursor-pointer'
                    onClick={() => handleSubmitEditNote()}
                >
                    Xác nhận
                </div>
            </div>
        </PopupModal>
    )
}

export default EditNote