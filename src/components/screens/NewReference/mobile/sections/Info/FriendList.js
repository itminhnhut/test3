import React, { useState } from 'react';
import PopupModal from 'src/components/screens/NewReference/PopupModal';
import { formatTime } from 'redux/actions/utils';
import { NoData } from '../..';
import { useTranslation } from 'next-i18next';
import { useEffect } from 'react';
import FetchApi from 'utils/fetch-api';
import { API_NEW_REFERRAL_FRIENDS_BY_REF } from 'redux/actions/apis';
import { useRef } from 'react';
import { IconLoading } from 'components/common/Icons';
import colors from 'styles/colors';
import ModalV2 from 'components/common/V2/ModalV2';
import InputV2 from 'components/common/V2/InputV2';

import { Search } from 'react-feather';
import classNames from 'classnames';

const FriendList = ({ owner, isShow, onClose, code, isDesktop = false }) => {
    const { t } = useTranslation();
    const [friendList, setFriendList] = useState([]);
    const [more, setMore] = useState(10);
    const [loading, setLoading] = useState(false);
    const hasNext = useRef(false);
    const [search, setSearch] = useState('');

    const doClose = () => {
        setFriendList([]);
        onClose();
        setMore(10);
    };

    const handleListFriend = _.throttle(async () => {
        setLoading(true);
        FetchApi({
            url: API_NEW_REFERRAL_FRIENDS_BY_REF.replace(':code', code),
            options: {
                method: 'GET'
            },
            params: {
                code: search,
                limit: more
            }
        }).then(({ data, status }) => {
            if (status === 'ok') {
                hasNext.current = data.hasNext;
                setFriendList(data.results);
            } else {
                setFriendList([]);
            }
            setLoading(false);
        });
    }, 300);

    useEffect(() => {
        handleListFriend();
    }, [more, code, search]);

    const handleChangeSearch = (value) => {
        setSearch(value);
    };

    return isDesktop ? (
        <ModalV2 isVisible={isShow} onBackdropCb={doClose} className="w-[30rem]">
            <p className="text-[22px] pb-6 font-semibold">{t('reference:referral.friend_list')}</p>
            <InputV2
                allowClear
                value={search}
                placeholder={t('reference:referral.placeholder_search')}
                onChange={handleChangeSearch}
                className={classNames('w-full tracking-[0.005em] pb-0')}
                classNameInput="!placeholder-gray-1 dark:!placeholder-gray-7"
                prefix={<Search strokeWidth={2} className="text-gray-1 w-4 h-4" />}
            />
            <div className="mt-8">
                <div className="flex w-full justify-between text-gray-1 dark:text-gray-7 text-sm mb-6">
                    <div>NamiID</div>
                    <div>{t('reference:referral.referral_date')}</div>
                </div>
                {loading ? (
                    <IconLoading color={colors.teal} />
                ) : friendList.length ? (
                    <>
                        <div className="flex flex-col gap-4 max-h-[400px] h-full overflow-auto no-scrollbar">
                            {friendList.map((data, index) => {
                                return (
                                    <div className="w-full flex items-center justify-between" key={index}>
                                        <div>
                                            <div className="text-gray-15 dark:text-gray-4 font-semibold">{data.username}</div>
                                            <div className=" text-sm text-gray-1 dark:text-gray-7">{data.code}</div>
                                        </div>
                                        <div>{formatTime(data.invitedAt, 'dd-MM-yyyy')}</div>
                                    </div>
                                );
                            })}
                        </div>
                        <div>
                            {hasNext.current ? (
                                <div
                                    className="mt-2 text-teal underline text-sm font-medium leading-6 text-center cursor-pointer"
                                    onClick={() => setMore(99999999999)}
                                >
                                    {t('reference:referral.show_more')}
                                </div>
                            ) : null}
                        </div>
                    </>
                ) : (
                    <div className="w-full h-[300px] flex flex-col justify-center items-center text-txtSecondary dark:text-txtSecondary-dark text-sm gap-2">
                        <NoData text={t('reference:referral.no_friends')} width="120" height="120" />
                    </div>
                )}
            </div>
        </ModalV2>
    ) : (
        <PopupModal
            isVisible={isShow}
            onBackdropCb={doClose}
            title={t('reference:referral.friend_list')}
            useAboveAll
            isDesktop={isDesktop}
            useCenter={isDesktop}
            contentClassname={isDesktop ? '!rounded !w-[390px] !px-0' : undefined}
            isMobile
        >
            {loading ? (
                <IconLoading color={colors.teal} />
            ) : friendList.length ? (
                <div className={isDesktop ? 'px-4' : null}>
                    <div className="flex w-full justify-between text-gray-7 font-normal text-xs mb-3">
                        <div>NamiID</div>
                        <div>{t('reference:referral.referral_date')}</div>
                    </div>
                    <div className="flex flex-col gap-2 max-h-[400px] h-full overflow-auto no-scrollbar text-gray-6 text-sm font-semibold">
                        {friendList.map((data, index) => {
                            return (
                                <div className="w-full flex items-center justify-between text-sm font-medium leading-6" key={index}>
                                    <div>{data.code}</div>
                                    <div>{formatTime(data.invitedAt, 'dd-MM-yyyy')}</div>
                                </div>
                            );
                        })}
                    </div>
                    {hasNext.current ? (
                        <div className="mt-2 text-teal underline text-sm font-medium leading-6 text-center cursor-pointer" onClick={() => setMore(99999999999)}>
                            {t('reference:referral.show_more')}
                        </div>
                    ) : null}
                </div>
            ) : (
                <div className="w-full h-[300px] flex flex-col justify-center items-center text-gray-1 font-medium text-sm gap-2">
                    <NoData text={t('reference:referral.no_friends')} width="120" height="120" />
                </div>
            )}
        </PopupModal>
    );
};

export default FriendList;
