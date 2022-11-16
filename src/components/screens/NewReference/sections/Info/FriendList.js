import React from 'react'
import PopupModal from '../../PopupModal'
import { formatTime } from 'redux/actions/utils';
import SvgEmpty from '../../../../svg/SvgEmpty';
import { data } from 'autoprefixer';

const FriendList = ({ isShow, onClose }) => {
    const fakeData = [{
        userId: 'Nami112SHT1118',
        date: Date.now()
    }, {
        userId: 'Nami112SHT1118',
        date: Date.now()
    }, {
        userId: 'Nami112SHT1118',
        date: Date.now()
    }, {
        userId: 'Nami112SHT1118',
        date: Date.now()
    },]
    return (
        <PopupModal
            isVisible={isShow}
            onBackdropCb={onClose}
            title='Danh sách bạn bè'
            zIndex={1000}
        >
            {fakeData.length ? <div>
                <div className='flex w-full justify-between text-gray-1 font-normal text-xs mb-3'>
                    <div>
                        NamiID
                    </div>
                    <div>
                        Ngày giới thiệu
                    </div>
                </div>
                <div className='flex flex-col gap-2 justify-center'>
                    {fakeData.map(data => {
                        return (
                            <div className='w-full flex items-center justify-between text-sm font-medium leading-6'>
                                <div>
                                    {data.userId}
                                </div>
                                <div>
                                    {formatTime(data.date, 'dd-MM-yyyy')}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className='mt-2 text-teal underline text-sm font-medium leading-6 text-center cursor-pointer'>
                    Xem thêm danh sách
                </div>
            </div> : <div className='w-full flex flex-col justify-center items-center text-gray-1 font-medium text-sm gap-2'><SvgEmpty />Không có bạn bè</div>}

        </PopupModal>
    )
}

export default FriendList