import SvgNamiCoin from 'components/svg/SvgNamiCoin'
import React from 'react'
import PopupModal from '../PopupModal'
import QRCode from 'qrcode.react';

const InviteModal = ({ isShow, onClose, code }) => {
    return (
        <PopupModal
            isVisible={isShow}
            onBackdropCb={onClose}
            useCenter
            background="url('/images/reference/invite_background.png')"
            contentClassname='!h-[620px] !w-[340px]'
            title={(<img src='/images/logo/nami-logo.png' className='w-auto h-6' />)}
        >
            <div className='font-medium text-sm text-white leading-6 flex flex-col gap-4'>
                <div className=''>
                    Đăng ký ngay. Cùng nhau kiếm tiền.
                </div>
                <div className='w-full h-[333px] flex flex-col items-center text-darkBlue'>
                    <div className='text-xs font-medium leading-5 mt-4'>
                        ID giới thiệu
                    </div>
                    <div className='font-semibold text-base leading-8'>
                        {code}
                    </div>
                    <div className='flex w-full h-full items-center justify-center mt-3'>
                        <QRCode
                            value={'https://nami.exchange/ref/' + code}
                            size={190}
                        />
                    </div>
                    <img className='absolute bottom-[100px] w-[90px] h-[85px]' src='/images/icon/ic_nami_icon.png' />
                </div>
            </div>
        </PopupModal>
    )
}

export default InviteModal