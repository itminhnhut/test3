import React, { useState } from 'react'
import PopupModal from '../../PopupModal'

const EditNote = ({ isShow = false, onClose }) => {
    const [note, setNote] = useState('')
    const handleInputNote = (e) => {
        const text = e?.target?.value
        if (text.length > 30) return
        setNote(text)
    }
    return (
        <PopupModal
            isVisible={isShow}
            onBackdropCb={onClose}
            title='Thêm giới thiệu mới'
            zIndex={1000}
        >
            <div className='font-medium text-sm text-gray-1 leading-6 flex flex-col gap-4'>
                <div>
                    Ghi chú
                    <div className='mt-1 rounded-[4px] px-3 h-11 flex justify-between items-center bg-gray-4 font-medium text-sm leading-6'>
                        <input className='text-darkBlue' maxLength={30} onChange={handleInputNote} />
                        <div>
                            {note.length}/30
                        </div>
                    </div>
                </div>
                <div className='w-full h-11 mt-4 bg-teal rounded-md text-white font-semibold text-sm leading-6 flex items-center justify-center cursor-pointer'>
                    Xác nhận
                </div>
            </div>
        </PopupModal>
    )
}

export default EditNote