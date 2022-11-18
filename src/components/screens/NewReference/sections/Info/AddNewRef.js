import React, { useState } from 'react'
import Slider from 'components/trade/InputSlider'
import PopupModal from '../../PopupModal'
import _ from 'lodash'
import FetchApi from 'utils/fetch-api';
import { API_NEW_REFERRAL_ADD_REF } from 'redux/actions/apis';
import { useTranslation } from 'next-i18next';

const AddNewRef = ({ isShow = false, onClose, doRefresh, totalRate = 25 }) => {
    const { t } = useTranslation()

    const [percent, setPercent] = useState(5)
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

    const doClose = () => {
        const elements = document.getElementsByTagName("input");
        elements[0].value = "";
        elements[1].value = "";
        onClose()
        setNote('')
        setRefCode('')
        setIsDefault(false)
    }


    const handleAddNewRef = _.throttle(async () => {
        const { status } = await FetchApi({
            url: API_NEW_REFERRAL_ADD_REF,
            options: {
                method: 'POST',
            },
            params: {
                code: refCode,
                remunerationRate: percent
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
            onBackdropCb={onClose}
            title={t('reference:referral.add_new_referral')}
            useAboveAll
        >
            <div className='font-medium text-sm text-gray-1 leading-6 flex flex-col gap-4'>
                <div>
                    {t('reference:referral.commission_rate')}
                    <div className='mt-4 mb-2'>
                        <Slider axis='x' x={percent} xmax={totalRate} onChange={onPercentChange} />
                    </div>
                    <div className='flex justify-between items-center font-medium text-xs leading-5'>
                        <div>
                            {t('reference:referral.you_get')} {totalRate - percent}%
                        </div>
                        <div>
                            {t('reference:referral.friends_get')} {percent}%
                        </div>
                    </div>
                </div>
                <div>
                    {t('reference:referral.referral_code')}
                    <div className='mt-1 rounded-[4px] px-3 h-11 flex justify-between items-center bg-gray-4 font-medium text-sm leading-6'>
                        <input className='text-darkBlue w-full' maxLength={8} style={{ textTransform: "uppercase" }} placeholder='FGJSH986' onChange={handleInputRefCode} />
                        <div className='w-10'>
                            {refCode.length}/8
                        </div>
                    </div>
                </div>
                <div>
                    {t('reference:referral.note')}
                    <div className='mt-1 rounded-[4px] px-3 h-11 flex justify-between items-center bg-gray-4 font-medium text-sm leading-6'>
                        <input className='text-darkBlue w-full' maxLength={30} onChange={handleInputNote} />
                        <div className='w-10'>
                            {note.length}/30
                        </div>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <input type="checkbox" id="vehicle1" height={16} width={16} className='rounded-sm' name="isDefault" onChange={handleCheckDefault} checked={isDefault} />
                    {t('reference:referral.set_default')}
                </div>
                <div className='w-full h-11 mt-4 bg-teal rounded-md text-white font-semibold text-sm leading-6 flex items-center justify-center cursor-pointer'
                    onClick={() => handleAddNewRef()}
                >
                    {t('common:confirm')}
                </div>
            </div>
        </PopupModal>
    )
}

export default AddNewRef