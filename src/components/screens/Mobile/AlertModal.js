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
        messages: '',
        note: '',
    })
    const actions = useRef({
        onConfirm: null, onCancel: null,
    })

    useImperativeHandle(ref, () => ({
        show: onShow
    }))

    const onShow = (type, title, messages, note, onConfirm, onCancel, _options) => {
        options.current = { type, title, messages, note, ..._options };
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
                return '/images/icon/ic_success.png';
            case 'error':
                return '/images/icon/ic_error.png';
            case 'warning':
                return '/images/icon/ic_warning.png';
            case 'expired':
                return '/images/icon/ic_expired.png';
            default:
                return '/images/icon/success.png';
        }
    }

    const className = useMemo(() => {
        return typeof window !== 'undefined' ? window.innerWidth > 330 ? 'w-[340px]' : 'w-[300px]' : 'w-[340px]';
    }, [isVisible])

    if (!options.current.title) return null;


    return (
        <Modal onusMode={true} isVisible={true} onBackdropCb={onCancel}
            containerClassName={`px-[24px] min-h-[363px] py-[34px] top-[50%] flex flex-col items-center justify-between ${className}`}>
            <div className='mb-[30px]'>
                <img src={getS3Url(getImage(options.current.type))} width={80} height={80} />
            </div>
            <div className='text-[20px] font-semibold mb-[12px]'>
                {options.current.title}
            </div>
            <div className=' mb-[10px] text-center text-onus-grey font-normal'>
                {options.current.messages}
            </div>
            <div className='text-gray-1 mb-[30px] text-center'>
                {options.current.note}
            </div>
            <div className='flex items-center w-full mt-[8px] '>
                {!options.current?.hideCloseButton
                    && <Button
                        onusMode={true}
                        title={options.current.closeTitle || t('common:close')}
                        className={`!h-[50px] !text-[16px] !font-semibold`}
                        componentType="button"
                        onClick={onCancel}
                    />
                }
                {actions.current?.onConfirm &&
                    <Button
                        onusMode={true}
                        title={options.current?.confirmTitle || t('futures:leverage:confirm')}
                        type="primary"
                        className={`ml-[7px] !h-[50px] !text-[16px] !font-semibold`}
                        componentType="button"
                        onClick={onConfirm}
                    />
                }
            </div>
        </Modal>
    );
});

export default AlertModal;
