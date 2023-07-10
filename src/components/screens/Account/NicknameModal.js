import ModalV2 from 'components/common/V2/ModalV2';
import React, { useEffect, useRef, useState } from 'react';
import InputV2 from 'components/common/V2/InputV2';
import Button from 'components/common/V2/ButtonV2/Button';
import { useTranslation } from 'next-i18next';
import fetchApi from 'utils/fetch-api';
import { API_SET_NICKNAME } from 'redux/actions/apis';
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';
import useUpdateEffect from 'hooks/useUpdateEffect';
import { useDispatch } from 'react-redux';
import { getMe } from 'redux/actions/user';

const NicknameModal = ({ isVisible, onClose }) => {
    const { t } = useTranslation();
    const [value, setValue] = useState('');
    const [error, setError] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const message = useRef({
        type: '',
        title: '',
        message: ''
    });

    useEffect(() => {
        setValue('');
    }, [isVisible]);

    const checkValid = (e) => {
        const format = /^[a-z0-9._]{1,30}$/;
        return format.test(e);
    };

    useUpdateEffect(() => {
        setError(value && !checkValid(value) ? t('profile:nickname:placeholder') : '');
    }, [value]);

    const onSave = async () => {
        setLoading(true);
        try {
            const { status } = await fetchApi({
                url: API_SET_NICKNAME,
                options: {
                    method: 'POST'
                },
                params: { nickname: value }
            });
            if (status === 'nickname_existed') {
                setError(t(`profile:nickname:${status}`));
            } else {
                switch (status) {
                    case 'ok':
                        message.current = {
                            type: 'success',
                            title: t('common:success'),
                            message: t('profile:nickname:content')
                        };
                        dispatch(getMe(true));
                        break;
                    case 'already_has_nickname':
                        message.current = {
                            type: 'error',
                            title: t('common:failed'),
                            message: t(`profile:nickname:${status}`)
                        };
                        break;
                    default:
                        break;
                }
                onClose();
                setShowAlert(true);
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AlertModalV2
                isVisible={showAlert}
                onClose={() => {
                    setShowAlert(false);
                }}
                type={message.current.type}
                title={message.current.title}
                message={message.current.message}
                isButton={false}
            />
            <ModalV2 className="!max-w-[488px]" isVisible={isVisible} onBackdropCb={onClose}>
                <div className="text-xl mb-6 font-medium">{t('profile:nickname:add_nickname')}</div>
                <InputV2
                    className="pb-0"
                    value={value}
                    onChange={(e) => setValue(String(e).toLowerCase())}
                    label={t('profile:nickname:title')}
                    placeholder={t('profile:nickname:placeholder')}
                    allowClear={true}
                    error={error}
                    maxLength={30}
                />
                <Button onClick={onSave} loading={loading} disabled={error || !value} className="mt-10">
                    {t('common:confirm')}
                </Button>
            </ModalV2>
        </>
    );
};

export default NicknameModal;
