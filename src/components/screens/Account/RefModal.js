import React, { useRef, useState, useEffect } from 'react';
import Modal from 'components/common/ReModal';
import { useTranslation } from 'next-i18next';
import { X } from 'react-feather';
import Button from 'components/common/Button';
import classNames from 'classnames';
import showNotification from 'utils/notificationService';
import { API_NEW_REFERRAL_CREATE_INVITE, API_CHECK_REFERRAL } from 'redux/actions/apis';
import fetchApi from 'utils/fetch-api';
import { ApiStatus } from 'redux/actions/const';
import { useDispatch } from 'react-redux';
import { getMe } from 'redux/actions/user';

const RefModal = ({ onClose }) => {
    const { t } = useTranslation();
    const [refCode, setRefCode] = useState('');
    const [error, setError] = useState(false);
    const timer = useRef(null);
    const [loading, setLoading] = useState(false);
    const userInfo = useRef(null);
    const dispatch = useDispatch();

    const onChange = (e) => {
        setError(false);
        setRefCode(String(e.target.value).trim().toUpperCase());
    };

    useEffect(() => {
        if (refCode && refCode.length >= 6) {
            clearTimeout(timer.current);
            setLoading(true);
            timer.current = setTimeout(() => {
                checkRef(refCode);
            }, 500);
        }
    }, [refCode]);

    const checkRef = async (ref) => {
        try {
            const { data } = await fetchApi({
                url: API_CHECK_REFERRAL,
                params: { code: ref }
            });
            userInfo.current = data;
            setError(!data);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const onPaste = async () => {
        const pasteCode = await navigator.clipboard.readText();
        setRefCode(pasteCode);
    };

    const onSave = async () => {
        setLoading(true);
        try {
            const { data, status } = await fetchApi({
                url: API_NEW_REFERRAL_CREATE_INVITE,
                options: {
                    method: 'POST'
                },
                params: { code: refCode }
            });
            if (status === ApiStatus.SUCCESS) await dispatch(getMe());
            const message = status === ApiStatus.SUCCESS ? t('profile:ref_success', { value: '#' + userInfo.current?.username }) : t('common:failed');
            showNotification({ message, title: t('common:success'), type: status === ApiStatus.SUCCESS ? 'success' : 'error' }, 2500, 'bottom', 'bottom-right');
        } catch (error) {
        } finally {
            setLoading(false);
            if (onClose) onClose();
        }
    };

    return (
        <Modal containerClassName="w-[448px] !p-8" isVisible={true} onBackdropCb={onClose}>
            <div className="flex justify-end">
                <X onClick={onClose} className="cursor-pointer" />
            </div>
            <div className="text-xl my-6">{t('reference:referral:referrer')}</div>
            <div className="space-y-2 flex flex-col relative pb-6">
                <label className="text-txtSecondary dark:text-txtSecondary-dark">
                    {t('reference:referral:referrer')} ({String(t('common:optional')).toLowerCase()})
                </label>
                <div
                    className={classNames(
                        'px-3 py-2 bg-gray-5 dark:bg-darkBlue-3 rounded-md hover:ring-teal hover:ring-1 flex items-center space-x-3',
                        'text-txtSecondary dark:text-txtSecondary-dark',
                        {
                            '!ring-red ring-1': error
                        }
                    )}
                >
                    <input
                        value={refCode}
                        onChange={onChange}
                        maxLength={8}
                        placeholder={t('profile:ref_placeholder')}
                        className="w-full text-gray-1 dark:text-gray-4"
                    />
                    {userInfo.current?.username ?? (
                        <span onClick={onPaste} className="text-teal font-semibold cursor-pointer select-none">
                            {t('reference:referral:partner:paste')}
                        </span>
                    )}
                </div>
                {error && <div className="text-red text-xs absolute bottom-0">{t('reference:referral:addref_error_2')}</div>}
            </div>
            <Button
                disabled={refCode.length < 6 || error || loading}
                onClick={onSave}
                componentType="button"
                type="primary"
                className="mt-4"
                title={t('common:confirm')}
            ></Button>
        </Modal>
    );
};

export default RefModal;
