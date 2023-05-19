import classNames from 'classnames';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import OtpInput from 'react-otp-input';
import ModalV2 from 'components/common/V2/ModalV2';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import Copy from 'components/svg/Copy';

import { Check, X } from 'react-feather';
import { useRouter } from 'next/router';
import Countdown from 'react-countdown';
import { useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';
import { ApiResultCreateOrder, ApiStatus } from 'redux/actions/const';
import Spinner from 'components/svg/Spinner';
import CustomOtpInput from './CustomOtpInput';
import { MODE_OTP } from 'constants/constants';

const OTP_REQUIRED_LENGTH = 6;

const INITAL_OTP_STATE = {
    email: '',
    tfa: ''
};

const OTP_MODE = ['email', 'tfa'];

const ModalOtp = ({ isVisible, onClose, otpExpireTime, loading, onConfirm, isUseSmartOtp }) => {
    const [state, set] = useState({
        otp: INITAL_OTP_STATE,
        pasted: {
            email: false,
            tfa: false
        },
        isError: false,
        modes: OTP_MODE,
        validateSmartOtp: false,
        errorTimes: 0
    });


    const setState = (_state) => set((prev) => ({ ...prev, ..._state }));

    const { t } = useTranslation();
    let auth = useSelector((state) => state.auth) || null;
    const otpInputRef = useRef();
    const parentTfaRef = useRef();

    // set focus on first input
    const onFocusFirstInput = () => otpInputRef?.current?.focusInput(0);
    const isTfaEnabled = auth.user?.isTfaEnabled;

    useEffect(() => {
        if (!isTfaEnabled) {
            setState({ modes: OTP_MODE.slice(0, 1) });
        }
    }, [isTfaEnabled]);
    const isValidInput = useCallback(
        (otpState) => {
            return state.modes.reduce((result, mode) => {
                return result && otpState[mode].length === OTP_REQUIRED_LENGTH;
            }, true);
        },
        [state.modes]
    );

    const onChangeHandler = (value, mode) => {
        if (state.isError) setState({ isError: false });
        const formatVal = value.replace(/\D/g, '').slice(0, 6);
        const newOtp = {
            ...state['otp'],
            [mode]: formatVal
        };
        setState({ otp: newOtp });

        // change focus to first tfa input
        if (mode === 'email' && formatVal.length === OTP_REQUIRED_LENGTH && isTfaEnabled) {
            const input = parentTfaRef.current?.firstChild?.firstChild?.firstChild;
            input.focus();
        }

        if (isValidInput(newOtp)) {
            setTimeout(async () => await onConfirmHandler(newOtp), 100);
        }
    };

    const onConfirmHandler = async (otp) => {
        try {
            const response = await onConfirm(otp);
            if (response?.status === ApiResultCreateOrder.INVALID_OTP) {
                onFocusFirstInput();
                setState({ otp: INITAL_OTP_STATE, isError: true });
            }
        } catch (error) {}
    };

    const doPaste = async (mode) => {
        try {
            const data = await navigator?.clipboard?.readText();
            if (!data) return;
            onChangeHandler(data, mode);
            const pastedState = (newState) => ({ ...state.pasted, [mode]: newState });
            setState({ pasted: pastedState(true) });
            setTimeout(() => setState({ pasted: pastedState(false) }), 300);
        } catch {}
    };


    const onSubmitSmartOtp = async (code) => {
        setState({validateSmartOtp: true})

        try {
            const response = await onConfirm({ smartOtp: code?.smartOtp });
            // if (response?.status !== ApiStatus.SUCCESS) toast({ text: t('dw_partner:error.invalid_otp'), type: 'warning', duration: 1500 });
            return response;
        } catch (error) {
            console.error('ERROR WHEN SUBMIT OTP CODE: ', error);
        } finally {
            setState({ validateSmartOtp: false })
        }
    };

    return (
        <ModalV2
            animateModal={false}
            isVisible={isVisible}
            wrapClassName=""
            onBackdropCb={() => {
                onClose();
                setState({ otp: INITAL_OTP_STATE, isError: false });
            }}
            className={classNames(`w-[90%] !max-w-[488px] overflow-y-auto select-none border-divider`)}
            customHeader={() => (
                <div className="pt-8 pb-6 flex justify-end">
                    <div
                        className="cursor-pointer hover:opacity-80"
                        onClick={() => {
                            onClose();
                            setState({ otp: INITAL_OTP_STATE, isError: false });
                        }}
                    >
                        <X size={24} />
                    </div>
                </div>
            )}
        >
            {isUseSmartOtp ? (
                <CustomOtpInput loading={state.validateSmartOtp} onConfirm={(otp) => onSubmitSmartOtp(otp)} modeOtp={MODE_OTP.SMART_OTP} />
            ) : (
                <>
                    {state.modes.map((mode) => (
                        <div key={mode}>
                            <div className={classNames('mb-6', { '!mb-8': isTfaEnabled })}>
                                {mode === 'email' && <div className="txtPri-3 mb-4"> {t('dw_partner:verify')}</div>}
                                {mode === 'email' && <div className="txtSecond-2 mb-4">{t('dw_partner:otp_code_send_to_email')}</div>}
                            </div>

                            {isTfaEnabled && (
                                <div className="text-sm font-medium mb-4">
                                    {mode === 'email' ? t('dw_partner:email_verification_code') : t('dw_partner:verify_2fa')}
                                </div>
                            )}
                            <div ref={mode === 'tfa' ? parentTfaRef : undefined}>
                                <OtpInput
                                    key={mode}
                                    ref={mode === 'email' ? otpInputRef : undefined}
                                    value={state.otp?.[mode]}
                                    onChange={(val) => onChangeHandler(val, mode)}
                                    numInputs={OTP_REQUIRED_LENGTH}
                                    placeholder={'------'}
                                    isInputNum={true}
                                    containerStyle="mb-7 w-full justify-between"
                                    inputStyle={classNames(
                                        '!h-[48px] !w-[48px] sm:!h-[64px] sm:!w-[64px] text-txtPrimary dark:text-gray-4  font-semibold text-[22px] dark:border border-divider-dark rounded-[4px] bg-gray-10 dark:bg-dark-2 ',
                                        {
                                            'focus:!border-teal focus:border': !state.isError,
                                            '!border-red': state.isError
                                        }
                                    )}
                                    shouldAutoFocus={mode === 'email'}
                                    hasErrored={state.isError}
                                    errorStyle={classNames('border-red border')}
                                />
                            </div>

                            <div
                                className={classNames('flex items-center', {
                                    'justify-between': mode === 'email',
                                    'justify-end': mode === 'tfa'
                                })}
                            >
                                {mode === 'email' && (
                                    <div className="flex items-center space-x-2">
                                        <span className="txtSecond-2">{t('dw_partner:not_received_otp')}</span>
                                        <Countdown
                                            key={otpExpireTime?.toString()}
                                            now={() => Date.now()}
                                            date={otpExpireTime}
                                            renderer={({ completed, formatted: { minutes, seconds } }) =>
                                                !completed ? (
                                                    <span className="font-semibold text-teal">
                                                        {minutes}:{seconds}
                                                    </span>
                                                ) : loading ? (
                                                    <Spinner />
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            onConfirm();
                                                        }}
                                                        disabled={loading}
                                                        className="text-dominant cursor-pointer disabled:text-txtDisabled dark:disabled:text-txtDisabled-dark disabled:cursor-default font-semibold !w-auto"
                                                    >
                                                        {t('dw_partner:resend_otp')}
                                                    </button>
                                                )
                                            }
                                        />
                                    </div>
                                )}

                                <div
                                    className="flex items-center space-x-2 cursor-pointer text-dominant"
                                    onClick={state.pasted[mode] ? undefined : async () => await doPaste(mode)}
                                >
                                    <div className="w-4 h-4">{state.pasted[mode] ? <Check size={16} /> : <Copy color="currentColor" />}</div>

                                    <ButtonV2 variants="text" className="font-semibold text-base">
                                        {t('common:paste')}
                                    </ButtonV2>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="mt-[52px]">
                        <ButtonV2
                            onClick={async () => await onConfirmHandler(state.otp)}
                            loading={loading || auth?.loadingUser}
                            disabled={!isValidInput(state.otp)}
                        >
                            {t('common:confirm')}
                        </ButtonV2>
                    </div>
                </>
            )}
        </ModalV2>
    );
};

export default ModalOtp;
