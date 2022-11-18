import React, { useState } from 'react'
import PopupModal from '../../PopupModal'
import { formatTime } from 'redux/actions/utils';
import { NoData } from '../..';
import { useTranslation } from 'next-i18next';
import { useEffect } from 'react';
import FetchApi from 'utils/fetch-api';
import { API_NEW_REFERRAL_FRIENDS_BY_REF } from 'redux/actions/apis';

const FriendList = ({ isShow, onClose, code }) => {
    const { t } = useTranslation()
    const [friendList, setFriendList] = useState([])

    useEffect(() => {
        FetchApi({
            url: API_NEW_REFERRAL_FRIENDS_BY_REF.replace(':code', code),
            options: {
                method: 'GET',
            },
        }).then(({ data, status }) => {
            if (status === 'ok') {
                setFriendList(data)
            } else {
                setFriendList([])
            }
        });
    }, [code])

    return (
        <PopupModal
            isVisible={isShow}
            onBackdropCb={onClose}
            title={t('reference:referral.friend_list')}
            useAboveAll
        >
            {friendList.length ? <div>
                <div className='flex w-full justify-between text-gray-1 font-normal text-xs mb-3'>
                    <div>
                        NamiID
                    </div>
                    <div>
                        {t('reference:referral.referral_date')}
                    </div>
                </div>
                <div className='flex flex-col gap-2 justify-center'>
                    {friendList.map((data, index) => {
                        return (
                            <div className='w-full flex items-center justify-between text-sm font-medium leading-6' key={index}>
                                <div>
                                    {data.code}
                                </div>
                                <div>
                                    {formatTime(data.invitedAt, 'dd-MM-yyyy')}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className='mt-2 text-teal underline text-sm font-medium leading-6 text-center cursor-pointer'>
                    {t('reference:referral.show_more')}
                </div>
            </div> : <div className='w-full flex flex-col justify-center items-center text-gray-1 font-medium text-sm gap-2'><NoData text={t('reference:referral.no_friends')} /></div>}
        </PopupModal>
    )
}

export default FriendList