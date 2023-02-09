import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import React, { useEffect, useState } from 'react';
import { Line, NoData } from '../..';
import PopupModal, { CopyIcon } from 'components/screens/NewReference/PopupModal';
import FriendList from './FriendList';
import AddNewRef from './AddNewRef';
import EditNote from './EditNote';
import { API_NEW_REFERRAL, API_NEW_REFERRAL_SET_DEFAULT } from 'redux/actions/apis';
import FetchApi from 'utils/fetch-api';
import { commisionConfig } from 'config/referral';
import showNotification from 'utils/notificationService';
import _ from 'lodash';
import styled from 'styled-components';
import { CheckIcon } from '../FriendList';
import colors from 'styles/colors';

const RefDetail = ({ isShow = false, onClose, rank, defaultRef }) => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    const { t } = useTranslation();
    const [refs, setRefs] = useState([]);
    const [showAddRef, setShowAddRef] = useState(false);
    const [showFriendList, setShowFriendList] = useState(false);
    const [showEditNote, setShowEditNote] = useState(false);
    const [doRefresh, setDoRefresh] = useState(false);
    const [code, setCode] = useState('');
    const [currentNote, setCurrentNote] = useState('');

    useEffect(() => {
        if (!isShow) return;
        FetchApi({
            url: API_NEW_REFERRAL,
            options: {
                method: 'GET'
            }
        }).then(({ data, status }) => {
            if (status === 'ok') {
                data.sort((e) => e.status);
                setRefs(data);
            } else {
                setRefs([]);
            }
        });
    }, [isShow, doRefresh]);

    const handleSetDefault = _.throttle(async (code) => {
        const { status } = await FetchApi({
            url: API_NEW_REFERRAL_SET_DEFAULT.replace(':code', code),
            options: {
                method: 'PATCH'
            }
        });
        if (status === 'ok') {
            showNotification(
                {
                    title: t('reference:referral.update_success'),
                    // title: t('common:success'),
                    type: 'success',
                    position: 'top',
                    container: 'top-left'
                },
                1800
            );
            // setDoRefresh(!doRefresh)
            setRefs(
                refs.map((e) => {
                    if (e.code === code) e.status = 1;
                    else e.status = 0;
                    return e;
                })
            );
        } else {
        }
    }, 1000);

    return (
        <PopupModal
            contentClassname="overflow-hidden"
            isVisible={isShow}
            onBackdropCb={onClose}
            title={t('reference:referral.referral_code_management')}
            useFullScreen
            isMobile
        >
            <div>
                {showAddRef && (
                    <AddNewRef
                        // totalRate={commisionConfig?.[rank].direct.futures ?? 20}
                        isShow={showAddRef}
                        onClose={() => setShowAddRef(false)}
                        doRefresh={() => setDoRefresh(!doRefresh)}
                        defaultRef={defaultRef}
                    />
                )}
                {showFriendList && <FriendList isShow={showFriendList} onClose={() => setShowFriendList(false)} code={code} />}
                {showEditNote && (
                    <EditNote
                        isShow={showEditNote}
                        currentNote={currentNote}
                        onClose={() => setShowEditNote(false)}
                        code={code}
                        doRefresh={() => setDoRefresh(!doRefresh)}
                    />
                )}
                <Container className="!overflow-auto no-scrollbar pb-[112px] relative">
                    {!refs.length ? (
                        <NoData text="No data" className="mt-4" />
                    ) : (
                        refs.map((data, index) => (
                            <div key={data.code}>
                                <div className="flex w-full justify-between font-semibold text-sm leading-6 items-center">
                                    <div className="flex gap-2 items-center text-gray-6">
                                        {data.code}
                                        <CopyIcon data={data.code} size={16} className="cursor-pointer" />
                                    </div>
                                    <div onClick={data.status ? null : () => handleSetDefault(data.code)}>
                                        <div
                                            className={classNames(
                                                'px-3 py-1 rounded-[100px] font-normal text-xs flex items-center',
                                                data.status
                                                    ? 'text-namiapp-green-1 bg-namiapp-green-1 bg-opacity-10'
                                                    : 'text-gray-7 bg-namiapp-black-4 bg-opacity-50'
                                            )}
                                        >
                                            {data.status ? <CheckIcon className={'mr-1'} /> : null}
                                            {data.status ? t('reference:referral.default') : t('reference:referral.set_default')}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 font-medium leading-5 flex flex-col gap-2">
                                    <div className="w-full flex justify-between items-center">
                                        <div className="text-gray-7 text-xs ">{t('reference:referral.you_friends_get')}</div>
                                        <div className="text-namiapp-green-1 text-sm">
                                            {100 - data.remunerationRate}% / {data.remunerationRate}%
                                        </div>
                                    </div>
                                    <div className="w-full flex justify-between items-center">
                                        <div className="text-gray-7 text-xs">{t('reference:referral.link')}</div>
                                        <div className="text-gray-6 text-sm flex gap-2 justify-end items-center w-fit">
                                            <div className="max-w-[140px] truncate">https://nami.exchange/ref/{data.code}</div>
                                            <CopyIcon
                                                data={`https://nami.exchange/ref/${data.code}`}
                                                size={13.5}
                                                className="cursor-pointer"
                                                color={colors.namiv2.gray[2]}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full flex justify-between items-center">
                                        <div className="text-gray-7 text-xs ">{t('reference:referral.friends')}</div>
                                        <div
                                            className="text-gray-6 text-sm flex items-center gap-1"
                                            onClick={() => {
                                                setCode(data.code);
                                                setShowFriendList(true);
                                            }}
                                        >
                                            {data.invitedCount ?? 0} <FriendListIcon color={colors.namiv2.gray[2]} />
                                        </div>
                                    </div>
                                    <div className="w-full flex justify-between items-center">
                                        <div className="text-gray-7 text-xs ">{t('reference:referral.note')}</div>
                                        <div
                                            className="text-gray-6 text-sm flex items-center gap-1"
                                            onClick={() => {
                                                setCode(data.code);
                                                setCurrentNote(data.note ?? '');
                                                setShowEditNote(true);
                                            }}
                                        >
                                            {data.note} <NoteIcon color={colors.namiv2.gray[2]} />
                                        </div>
                                    </div>
                                </div>
                                {refs.length === index + 1 ? null : <Line className="my-4" />}
                            </div>
                        ))
                    )}
                </Container>
                <div
                    className="h-[116px] z-20 bg-namiapp-black w-full flex justify-center pt-6 pb-12 px-4 absolute bottom-0 left-0 border-t-[1px] border-namiapp-black-4"
                    style={{
                        boxShadow: '0 -7px 23px 0 rgba(0, 0, 0, 0.05)'
                    }}
                >
                    <div
                        className={classNames('h-11 bg-namiapp-green-1 rounded-md w-full flex items-center justify-center text-white font-semibold text-sm', {
                            '!bg-gray-3': refs.length >= 20
                        })}
                        onClick={refs.length >= 20 ? null : () => setShowAddRef(true)}
                    >
                        {t('reference:referral.add_ref_code')}
                    </div>
                </div>
            </div>
        </PopupModal>
    );
};

export const FriendListIcon = ({ size= 12, color = '#718096' }) => (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 3h6.5M4 6h6.5M4 9h6.5M1.5 3h.005M1.5 6h.005M1.5 9h.005" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const NoteIcon = ({ size= 12, color = '#8694B3' }) => (
    <svg width={size} height={size} viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M13.196 4.934c.252-.252.39-.587.39-.943s-.138-.69-.39-.942L12.139 1.99a1.324 1.324 0 0 0-.943-.39c-.356 0-.69.138-.942.39L3.166 9.057V12h2.942l7.088-7.066zm-2-2 1.058 1.057-1.06 1.056-1.057-1.057 1.059-1.056zm-6.697 7.733V9.61L9.193 4.93 10.25 5.99l-4.693 4.678H4.5zm-1.333 2.666h10.667v1.334H3.166v-1.334z"
            fill={color}
        />
    </svg>
);

export const Container = styled.div`
    overflow-y: auto;
    height: calc(var(--vh, 1vh) * 100 - 230px);
`;

export default RefDetail;
