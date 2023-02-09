import React, { useState, useRef } from 'react';
import PopupModal from 'components/screens/NewReference/PopupModal';
import FetchApi from 'utils/fetch-api';
import _ from 'lodash';
import { API_NEW_REFERRAL_EDIT_NOTE } from 'redux/actions/apis';
import { useTranslation } from 'next-i18next';
import { scrollFocusInput } from 'redux/actions/utils';
import classNames from 'classnames';

const EditNote = ({ isShow = false, onClose, doRefresh, code, currentNote, isDesktop }) => {
    const { t } = useTranslation();
    const [note, setNote] = useState(currentNote ?? '');
    const refInput = useRef(null);
    const timer = useRef(null);
    const handleInputNote = (e) => {
        const text = e?.target?.value;
        if (text.length > 30) return;
        setNote(text);
    };

    const doClose = () => {
        refInput.current.blur();
        // const elements = document.getElementsByTagName('input');
        // elements[0].value = '';
        setTimeout(() => {
            onClose();
        }, 100);
        // setNote('');
    };

    const handleSubmitEditNote = _.throttle(async () => {
        const { status } = await FetchApi({
            url: API_NEW_REFERRAL_EDIT_NOTE.replace(':code', code),
            options: {
                method: 'PATCH'
            },
            params: {
                note
            }
        });
        if (status === 'ok') {
            doClose();
            doRefresh();
        } else {
        }
    }, 1000);

    const onFocus = (e) => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            scrollFocusInput;
        }, 100);
    };

    return isDesktop ?
        <PopupModal
            isVisible={isShow}
            onBackdropCb={doClose}
            title={t('reference:referral.modify_note')}
            useAboveAll
            isDesktop={isDesktop}
            useCenter={isDesktop}
            contentClassname={isDesktop ? "!rounded !w-[390px] !px-0" : undefined}
        >
            <div className={classNames("font-medium text-sm text-gray-1 leading-6 flex flex-col gap-4", { 'px-4': isDesktop })}>
                <div>
                    {t('reference:referral.note')}
                    <div className="mt-1 rounded-[4px] px-3 h-11 flex justify-between items-center bg-gray-4 font-medium text-sm leading-6 gap-4">
                        <div className="flex justify-between items-center w-full">
                            <input
                                onFocus={onFocus}
                                className="text-darkBlue w-full font-medium text-sm leading-6"
                                maxLength={30}
                                onChange={handleInputNote}
                                value={note ?? ''}
                                ref={refInput}
                                autoFocus
                            />
                            {note.length ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => setNote('')}>
                                    <path d="m6 6 12 12M6 18 18 6" stroke="#718096" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            ) : null}
                        </div>
                        <div className="w-10">{note.length}/30</div>
                    </div>
                </div>
                <div
                    className="w-full h-11 mt-4 bg-teal rounded-md text-white font-semibold text-sm leading-6 flex items-center justify-center cursor-pointer"
                    onClick={() => handleSubmitEditNote()}
                >
                    {t('common:confirm')}
                </div>
            </div>
        </PopupModal>
        :
        <PopupModal
            isVisible={isShow}
            onBackdropCb={doClose}
            title={t('reference:referral.modify_note')}
            useAboveAll
            isDesktop={isDesktop}
            useCenter={isDesktop}
            contentClassname={isDesktop ? "!rounded !w-[390px] !px-0" : undefined}
            isMobile
        >
            <div className={classNames("font-medium text-sm text-gray-7 leading-6 flex flex-col gap-4", { 'px-4': isDesktop })}>
                <div>
                    {t('reference:referral.note')}
                    <div className="mt-1 rounded-[6px] px-3 h-11 flex justify-between items-center bg-namiv2-black-2 font-medium text-sm leading-6 gap-4">
                        <div className="flex justify-between items-center w-full">
                            <input
                                onFocus={onFocus}
                                className="text-gray-6 w-full font-medium text-sm leading-6"
                                maxLength={30}
                                onChange={handleInputNote}
                                value={note ?? ''}
                                ref={refInput}
                                autoFocus
                                style={{
                                    outline: 'none'
                                }}
                            />
                            {note.length ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => setNote('')}>
                                    <path d="m6 6 12 12M6 18 18 6" stroke="#718096" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            ) : null}
                        </div>
                        <div className="w-10">{note.length}/30</div>
                    </div>
                </div>
                <div
                    className="w-full h-11 mt-4 bg-namiv2-green-1 rounded-md font-semibold text-sm leading-6 flex items-center justify-center cursor-pointer text-white"
                    onClick={() => handleSubmitEditNote()}
                >
                    {t('common:confirm')}
                </div>
            </div>
        </PopupModal>
};

export default EditNote;
