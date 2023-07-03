import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { useRouter } from 'next/router';
import { API_GET_ME } from 'redux/actions/apis';
import { MODAL_TYPE } from 'redux/reducers/withdrawDeposit';
import { useTranslation } from 'next-i18next';
import useMakeOrder from './hooks/useMakeOrder';
import FetchApi from 'utils/fetch-api';
import { ModalConfirm } from './DetailOrder';
import { MODE } from './constants';
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';
import { find } from 'lodash';
import DWAddPhoneNumber from 'components/common/DWAddPhoneNumber';
import ModalOtp from './components/ModalOtp';
import ModalProcessSuggestPartner from './ModalProcessSuggestPartner';

const ButtonBuySell = ({ canSubmit }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const [state, set] = useState({
        loadingConfirm: false,
        showOtp: false,
        otpExpireTime: null,
        isUseSmartOtp: false,
        showAlertDisableSmartOtp: false,
        showProcessSuggestPartner: null
    });
    const setState = (_state) => set((prev) => ({ ...prev, ..._state }));
    const { fee, input, loadingPartner, isCanSubmitOrder, modal: modalProps } = useSelector((state) => state.withdrawDeposit);
    const router = useRouter();
    const { side, assetId } = router.query;
    const configs = useSelector((state) => state.utils.assetConfig);
    const assetCode = find(configs, { id: +assetId })?.assetCode || '';

    const { onMakeOrderHandler, setModalState } = useMakeOrder({ setState, input, fee });

    const [loadingConfirm, setLoadingConfirm] = useState(false);
    const [isOpenModalAddPhone, setIsOpenModalAddPhone] = useState(false);

    const handleSubmitOrder = () => {
        setLoadingConfirm(true);
        try {
            FetchApi({
                url: API_GET_ME,
                options: {
                    method: 'GET'
                },
                params: {
                    resetCache: true
                }
            })
                .then(({ status, data }) => {
                    if (status === 'ok') {
                        !data?.phone ? setIsOpenModalAddPhone(true) : onMakeOrderHandler(null, null, fee);
                    }
                })
                .finally(() => setLoadingConfirm(false));
        } catch (error) {
            console.error('ERROR WHEN HANDLE SUBMIT ORDER: ', error);
            toast({
                text: 'System error, please try again in a few minutes',
                type: 'error'
            });
        }
    };

    useEffect(() => {
        return () => {
            setModalState(MODAL_TYPE.AFTER_CONFIRM, {
                visible: false
            });
        };
    }, []);

    return (
        <>
            <ButtonV2
                loading={loadingConfirm || loadingPartner}
                onClick={handleSubmitOrder}
                disabled={!isCanSubmitOrder || !canSubmit}
                className="disabled:cursor-default mt-10"
            >
                {t(`common:${side.toLowerCase()}`) + ` ${assetCode}`}
            </ButtonV2>
            <DWAddPhoneNumber isVisible={isOpenModalAddPhone} onBackdropCb={() => setIsOpenModalAddPhone(false)} />
            <ModalOtp
                onConfirm={(otp) => onMakeOrderHandler(otp, language, fee)}
                isVisible={state.showOtp}
                otpExpireTime={state.otpExpireTime}
                onClose={() => {
                    setState({ showOtp: false });
                }}
                loading={state.loadingConfirm}
                isUseSmartOtp={state.isUseSmartOtp}
            />
            <ModalConfirm
                mode={MODE.USER}
                modalProps={modalProps[MODAL_TYPE.AFTER_CONFIRM]}
                onClose={() => {
                    setModalState(MODAL_TYPE.AFTER_CONFIRM, {
                        visible: false
                    });
                }}
            />
            <AlertModalV2
                isVisible={state.showAlertDisableSmartOtp}
                onClose={() => setState({ showAlertDisableSmartOtp: false, showOtp: false })}
                textButton={t('dw_partner:verify_by_email')}
                onConfirm={() => {
                    setState({ showAlertDisableSmartOtp: false, showOtp: true, isUseSmartOtp: false });
                    onMakeOrderHandler(null, null, fee);
                }}
                type="error"
                title={t('dw_partner:disabled_smart_otp_title')}
                message={t('dw_partner:disabled_smart_otp_des')}
            />
            <ModalProcessSuggestPartner
                showProcessSuggestPartner={state.showProcessSuggestPartner}
                onBackdropCb={() => {
                    setState({ showProcessSuggestPartner: null });
                    state.showOtp &&
                        setTimeout(() => {
                            setState({ showOtp: false });
                        }, 200);
                }}
            />
        </>
    );
};

export default ButtonBuySell;
