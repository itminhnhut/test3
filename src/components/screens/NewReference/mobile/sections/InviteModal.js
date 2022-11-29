import React from 'react'
import PopupModal from '../../PopupModal'
import QRCode from 'qrcode.react';
import { useTranslation } from 'next-i18next';

const InviteModal = ({ isShow, onClose, code }) => {
    const { t } = useTranslation()
    return (
        <PopupModal
            isVisible={isShow}
            onBackdropCb={onClose}
            useCenter
            background="url('/images/reference/invite_background.png')"
            contentClassname='!h-[620px] !w-[340px] '
            title={(<img src='/images/logo/nami-logo.png' className='w-auto h-6' />)}
        >
            <div className='font-medium text-sm text-white leading-6 flex flex-col gap-4'>
                <div className=''>
                    {t('reference:referral.invite_your_friends')}
                </div>
                <div className='w-full h-[333px] flex flex-col items-center text-darkBlue'>
                    <div className='text-xs font-medium leading-5 mt-4'>
                        {t('reference:referral.referral_code')}

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
                    <img className='absolute bottom-[75px] w-[124px] h-[120px]' src='/images/icon/ic_nami_icon.png' />
                </div>
            </div>
        </PopupModal>
    )
}

export default InviteModal