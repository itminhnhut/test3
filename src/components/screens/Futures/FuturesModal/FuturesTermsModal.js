import CheckBox from 'components/common/CheckBox';
import React, { useEffect, useState } from 'react';
import ModalV2 from 'components/common/V2/ModalV2';
import { ChevronRight } from 'react-feather';
import Button from 'components/common/V2/ButtonV2/Button';
import { useTranslation } from 'next-i18next';

const FuturesTermsModal = () => {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);
    const [state, setState] = useState({
        terms: false,
        trade: false
    });

    useEffect(() => {
        const accepted = localStorage.getItem('ACCEPTED_FUTURES');
        setVisible(!accepted);
    }, []);

    const onContinue = () => {
        localStorage.setItem('ACCEPTED_FUTURES', true);
        setVisible(false);
    };

    return (
        <ModalV2 canBlur={false} closeButton={false} className="!max-w-[488px]" isVisible={visible} onBackdropCb={() => setVisible(false)}>
            <div className="text-2xl font-semibold mb-4">{t('common:term')}</div>
            <div className="text-txtSecondary dark:text-txtSecondary-dark">Để tiếp tục vui lòng đồng ý với điều khoản của Nami</div>
            <div className="mt-8 mb-10 space-y-4">
                <CheckBox
                    onChange={() => setState({ ...state, terms: !state.terms })}
                    active={state.terms}
                    label={
                        <div className="flex flex-col space-y-[6px]">
                            <span>Đồng ý thoả thuận sử dụng của Nami</span>
                            <div className="text-teal font-semibold flex items-center space-x-2">
                                <span>{t('common:read_more')}</span>
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    }
                />
                <CheckBox
                    active={state.trade}
                    onChange={() => setState({ ...state, trade: !state.trade })}
                    label={
                        <div className="flex flex-col space-y-[6px]">
                            <span>Đồng ý thoả thuận giao dịch tại Nami Futures</span>
                            <div className="text-teal font-semibold flex items-center space-x-2">
                                <span>{t('common:read_more')}</span>
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    }
                />
            </div>
            <Button onClick={onContinue} disabled={!(state.terms && state.trade)}>
                {t('common:continue')}
            </Button>
        </ModalV2>
    );
};

export default FuturesTermsModal;
