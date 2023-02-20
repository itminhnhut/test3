import CheckBox from 'components/common/CheckBox';
import React, { useEffect, useRef, useState } from 'react';
import ModalV2 from 'components/common/V2/ModalV2';
import { ChevronRight } from 'react-feather';
import Button from 'components/common/V2/ButtonV2/Button';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';

const FuturesTermsModal = () => {
    const isAuth = useSelector((state) => state.auth?.user) || null;
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const [visible, setVisible] = useState(false);
    const [state, setState] = useState({
        service: false,
        futures: false
    });

    useEffect(() => {
        const accepted = localStorage.getItem('ACCEPTED_FUTURES');
        if (isAuth) setVisible(!accepted);
    }, [isAuth]);

    const onContinue = () => {
        localStorage.setItem('ACCEPTED_FUTURES', true);
        setVisible(false);
    };

    const flag = useRef(false);
    const onHandleClick = (key) => {
        switch (key) {
            case 'detail_service':
                flag.current = true;
                window.open(`${process.env.NEXT_PUBLIC_APP_URL}/${language}/terms-of-service`, '_blank');
                break;
            case 'detail_futures':
                flag.current = true;
                window.open(`${process.env.NEXT_PUBLIC_APP_URL}/${language}/terms-of-futures`, '_blank');
                break;
            default:
                if (flag.current) {
                    flag.current = false;
                    return;
                }
                setState({ ...state, [key]: !state[key] });
                break;
        }
    };

    return (
        <ModalV2 canBlur={false} closeButton={false} className="!max-w-[488px]" isVisible={visible} onBackdropCb={() => setVisible(false)}>
            <div className="text-2xl font-semibold mb-4">{t('futures:terms:title')}</div>
            <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('futures:terms:desc')}</div>
            <div className="mt-8 mb-10 space-y-4">
                <CheckBox
                    onChange={() => onHandleClick('service')}
                    active={state.service}
                    label={
                        <div className="flex flex-col space-y-[6px]">
                            <span>{t('futures:terms:service')}</span>
                            <div onClick={() => onHandleClick('detail_service')} className="text-teal font-semibold flex items-center space-x-2 w-max">
                                <span>{t('common:details')}</span>
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    }
                />
                <CheckBox
                    active={state.futures}
                    onChange={() => onHandleClick('futures')}
                    label={
                        <div className="flex flex-col space-y-[6px]">
                            <span>{t('futures:terms:futures')}</span>
                            <div onClick={() => onHandleClick('detail_futures')} className="text-teal font-semibold flex items-center space-x-2 w-max">
                                <span>{t('common:details')}</span>
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    }
                />
            </div>
            <Button onClick={onContinue} disabled={!(state.service && state.futures)}>
                {t('common:continue')}
            </Button>
        </ModalV2>
    );
};

export default FuturesTermsModal;
