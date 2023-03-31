import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import OtpInput from 'react-otp-input';
import ModalV2 from 'components/common/V2/ModalV2';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import Copy from 'components/svg/Copy';

import { Check } from 'react-feather';
import { useRouter } from 'next/router';
import Countdown from 'react-countdown';
import { useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';
import { ApiResultCreateOrder } from 'redux/actions/const';

const OTP_REQUIRED_LENGTH = 6;
const INITAL_OTP_STATE = {
    email: '',
    tfa: ''
};

const ModalOtp = ({ isVisible, onClose, otpExpireTime, loading, otpMode, setOtpMode, onConfirm }) => {
    const [state, set] = useState({
        otp: INITAL_OTP_STATE,
        pasted: false,
        isError: false
    });

    const setState = (_state) => set((prev) => ({ ...prev, ..._state }));

    const { t } = useTranslation();
    const auth = useSelector((state) => state.auth) || null;
    const otpRef = useRef(state.otp);

    const isTfaEnabled = auth.user?.isTfaEnabled;

    const onChangeHandler = (value) => {
        if (state.isError) setState({ isError: false });
        const formatVal = value.replace(/\D/g, '').slice(0, 6);
        setState({
            otp: {
                ...otpRef.current,
                [otpMode]: formatVal
            }
        });
        otpRef.current = {
            ...otpRef.current,
            [otpMode]: formatVal
        };
        if (formatVal.length === OTP_REQUIRED_LENGTH) {
            setTimeout(confirm, 100);
        }
    };

    const doPaste = async () => {
        try {
            const data = await navigator?.clipboard?.readText();
            if (!data) return;
            onChangeHandler(data);
            setState({ pasted: true });
            setTimeout(() => setState({ pasted: false }), 500);
        } catch {}
    };

    const onConfirmHandler = async () => {
        try {
            const response = await onConfirm(otpRef.current);
            if (response === ApiResultCreateOrder.INVALID_OTP) {
                setState({ isError: true });
                // onChangeHandler('');
            }
        } catch (error) {}
    };

    const confirm = async () => {
        if (isTfaEnabled) {
            if (otpMode === 'email') setOtpMode('tfa');
            else await onConfirmHandler();
            return;
        }
        await onConfirmHandler();
    };

    return (
        <ModalV2
            isVisible={isVisible}
            wrapClassName=""
            onBackdropCb={() => {
                onClose();
                setState({ otp: INITAL_OTP_STATE });
            }}
            className={classNames(`w-[90%] !max-w-[488px] overflow-y-auto select-none border-divider`)}
        >
            <div className="mb-6">
                <div className="txtPri-3 mb-4">{otpMode === 'email' ? t('dw_partner:verify') : t('dw_partner:verify_2fa')}</div>
                <div className="txtSecond-2 border-">
                    {otpMode === 'email' ? t('dw_partner:otp_code_send_to_email') : t('dw_partner:verify_2fa_description')}
                </div>
            </div>
            <OtpInput
                value={state.otp?.[otpMode]}
                onChange={onChangeHandler}
                numInputs={OTP_REQUIRED_LENGTH}
                placeholder={'------'}
                isInputNum={true}
                containerStyle="mb-7 w-full justify-between"
                inputStyle={classNames(
                    '!h-[48px] !w-[48px] sm:!h-[64px] sm:!w-[64px] text-txtPrimary dark:text-gray-4  font-semibold text-[22px] dark:border border-divider-dark rounded-[4px] bg-gray-10 dark:bg-dark-2 '
                )}
                focusStyle={classNames('border ', {
                    '!border-red': state.isError,
                    '!border-teal': !state.isError
                })}
                // shouldAutoFocus
                hasErrored={state.isError}
                errorStyle={classNames('border-red border')}
            />

            <div
                className={classNames('flex items-center', {
                    'justify-between': otpMode === 'email',
                    'justify-end': otpMode === 'tfa'
                })}
            >
                {otpMode === 'email' && (
                    <div className="flex items-center space-x-2">
                        <span className="txtSecond-2">{t('dw_partner:not_received_otp')}</span>
                        {otpExpireTime && (
                            <Countdown date={otpExpireTime} renderer={({ props, ...countdownProps }) => props.children(countdownProps)}>
                                {(props) => {
                                    return (
                                        <button
                                            onClick={() => onConfirm()}
                                            disabled={!props.completed}
                                            className="text-dominant cursor-pointer disabled:text-txtDisabled dark:disabled:text-txtDisabled-dark disabled:cursor-default font-semibold !w-auto"
                                        >
                                            {t('dw_partner:resend_otp')}
                                        </button>
                                    );
                                }}
                            </Countdown>
                        )}
                    </div>
                )}

                <div className="flex items-center space-x-2 cursor-pointer text-dominant" onClick={state.pasted ? undefined : async () => await doPaste()}>
                    <div className="w-4 h-4">{state.pasted ? <Check size={16} /> : <Copy color="currentColor" />}</div>

                    <ButtonV2 variants="text" className="font-semibold text-base">
                        {t('common:paste')}
                    </ButtonV2>
                </div>
            </div>
            <div className="mt-[52px]">
                <ButtonV2
                    onClick={confirm}
                    loading={loading || auth?.loadingUser}
                    disabled={
                        (isTfaEnabled && otpMode === 'tfa' && state.otp['tfa'].length !== OTP_REQUIRED_LENGTH) ||
                        (otpMode === 'email' && state.otp['email']?.length !== OTP_REQUIRED_LENGTH)
                    }
                >
                    {t('common:confirm')}
                </ButtonV2>
            </div>
        </ModalV2>
    );
};

export default ModalOtp;
