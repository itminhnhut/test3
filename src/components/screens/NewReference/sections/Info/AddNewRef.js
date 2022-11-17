import React, { useState } from 'react'
import Slider from 'components/trade/InputSlider'
import PopupModal from '../../PopupModal'

const AddNewRef = ({ isShow = false, onClose }) => {
    const [percent, setPercent] = useState(25)
    const onPercentChange = ({ x }) => {
        setPercent(x)
    }
    const [refCode, setRefCode] = useState('')
    const [note, setNote] = useState('')
    const [isDefault, setIsDefault] = useState(false)
    const handleInputRefCode = (e) => {
        const text = e?.target?.value
        if (text.length > 8) return
        setRefCode(text.toUpperCase())
    }
    const handleInputNote = (e) => {
        const text = e?.target?.value
        if (text.length > 30) return
        setNote(text)
    }
    const handleCheckDefault = (e) => {
        setIsDefault(e.checked)
    }
    return (
        <PopupModal
            isVisible={isShow}
            onBackdropCb={onClose}
            title='Thêm giới thiệu mới'
            useAboveAll
        >
            <div className='font-medium text-sm text-gray-1 leading-6 flex flex-col gap-4'>
                <div>
                    Tỷ lệ hoa hồng
                    <div className='mt-4 mb-2'>
                        <Slider axis='x' x={percent} xmax={100} onChange={onPercentChange} />
                    </div>
                    <div className='flex justify-between items-center font-medium text-xs leading-5'>
                        <div>
                            Bạn nhận 15%
                        </div>
                        <div>
                            Bạn bè nhận 5%
                        </div>
                    </div>
                </div>
                <div>
                    RefCode
                    <div className='mt-1 rounded-[4px] px-3 h-11 flex justify-between items-center bg-gray-4 font-medium text-sm leading-6'>
                        <input className='text-darkBlue' maxLength={8} style={{ textTransform: "uppercase" }} placeholder='FGJSH986' onChange={handleInputRefCode} />
                        <div>
                            {refCode.length}/8
                        </div>
                    </div>
                </div>
                <div>
                    Ghi chú
                    <div className='mt-1 rounded-[4px] px-3 h-11 flex justify-between items-center bg-gray-4 font-medium text-sm leading-6'>
                        <input className='text-darkBlue' maxLength={30} onChange={handleInputNote} />
                        <div>
                            {note.length}/30
                        </div>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <input type="checkbox" id="vehicle1" height={16} width={16} className='rounded-sm' name="isDefault" onChange={handleCheckDefault} checked={isDefault} />
                    Đặt làm mặc định
                </div>
                <div className='w-full h-11 mt-4 bg-teal rounded-md text-white font-semibold text-sm leading-6 flex items-center justify-center cursor-pointer'>
                    Xác nhận
                </div>
            </div>
        </PopupModal>
    )
}

export default AddNewRef