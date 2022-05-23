import React, { forwardRef, useImperativeHandle, useState, useRef, useMemo } from 'react';
import Modal from 'components/common/ReModal';
import Button from 'components/common/Button';
import { useTranslation } from 'next-i18next';
import { getS3Url } from 'redux/actions/utils';

const AlertModal = forwardRef((props, ref) => {
    const { t } = useTranslation();
    const [isVisible, setVisible] = useState(false);
    const options = useRef({
        type: '',
        title: '',
        messages: ''
    })
    const actions = useRef({
        onConfirm: null, onCancel: null
    })
    
    useImperativeHandle(ref, () => ({
        show: onShow
    }))

    const onShow = (type, title, messages, onConfirm, onCancel, _options) => {
        options.current = { type, title, messages, ..._options };
        actions.current.onConfirm = onConfirm;
        actions.current.onCancel = onCancel;
        setVisible(true);
    }

    const onConfirm = () => {
        if (actions.current.onConfirm) actions.current.onConfirm();
        options.current = {}
        setVisible(false);
    }

    const onCancel = () => {
        options.current = {}
        if (actions.current.onCancel) actions.current.onCancel();
        setVisible(false);
    }

    const getImage = (type) => {
        switch (type) {
            case 'success':
                return '/images/icon/success.png';
            case 'error':
                return '/images/icon/errors.png';
            case 'warning':
                return '/images/icon/warning.png';
            default:
                return '/images/icon/success.png';
        }
    }

    const className = useMemo(() => {
        return window.innerWidth > 330 ? 'w-[340px]' : 'w-[300px]'
    }, [isVisible])

    if (!options.current.title) return null;


    return (
        <Modal isVisible={isVisible} onBackdropCb={onCancel}
            containerClassName={`px-[24px] py-[34px] top-[50%] flex flex-col items-center ${className}`}>
            <div className='mb-[30px]'>
                <img src={getS3Url(getImage(options.current.type))} width={66} height={66} />
            </div>
            <div className='text-lg font-semibold mb-[12px]'>
                {options.current.title}
            </div>
            <div className='text-sm mb-[30px] text-center'>
                {options.current.messages}
            </div>
            {/* <Button
                title={t('futures:leverage:confirm')}
                type="primary"
                className={`!h-[44px] !text-sm !font-semibold`}
                componentType="button"
                onClick={onConfirm}
            /> */}
            <Button
                title={t('common:close')}
                className={`mt-[8px] !h-[44px] !text-sm !font-semibold`}
                componentType="button"
                onClick={onCancel}
            />
        </Modal>
    );
});

export default AlertModal;