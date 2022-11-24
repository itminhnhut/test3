import React, { useState } from 'react'
import PopupModal from '../../PopupModal'
import { formatTime } from 'redux/actions/utils';
import { NoData } from '../..';
import { useTranslation } from 'next-i18next';
import { useEffect } from 'react';
import FetchApi from 'utils/fetch-api';
import { API_NEW_REFERRAL_FRIENDS_BY_REF } from 'redux/actions/apis';
import { useRef } from 'react';

const FriendList = ({ isShow, onClose, code }) => {
    const { t } = useTranslation()
    const [friendList, setFriendList] = useState([])
    const [more, setMore] = useState(10)
    const hasNext = useRef(false)

    const doClose = () => {
        setFriendList([])
        onClose()
        setMore(10)
    }

    useEffect(() => {
        FetchApi({
            url: API_NEW_REFERRAL_FRIENDS_BY_REF.replace(':code', code),
            options: {
                method: 'GET',
            },
            params: {
                limit: more
            }
        }).then(({ data, status }) => {
            if (status === 'ok') {
                hasNext.current = data.hasNext
                setFriendList(data.results)
            } else {
                setFriendList([])
            }
        });
    }, [more, code])

    return (
        <PopupModal
            isVisible={isShow}
            onBackdropCb={doClose}
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
                <div className='flex flex-col gap-2 max-h-[400px] h-full overflow-auto no-scrollbar'>
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
                {hasNext.current ? <div className='mt-2 text-teal underline text-sm font-medium leading-6 text-center cursor-pointer'
                    onClick={() => setMore(more + 5)}
                >
                    {t('reference:referral.show_more')}
                </div> : null}
            </div> : <div className='w-full flex flex-col justify-center items-center text-gray-1 font-medium text-sm gap-2'><NoData text={t('reference:referral.no_friends')} /></div>}
        </PopupModal>
    )
}

export default FriendList