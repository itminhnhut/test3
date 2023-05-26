import classNames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import OtpInput from 'react-otp-input';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import Copy from 'components/svg/Copy';

import { Check} from 'react-feather';
import Countdown from 'react-countdown';
import { useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';
import { ApiResultCreateOrder, ApiStatus } from 'redux/actions/const';
import Spinner from 'components/svg/Spinner';
import { MODE_OTP } from 'constants/constants';
import TextButton from 'components/common/V2/ButtonV2/TextButton';

const OTP_REQUIRED_LENGTH = 6;

const INITAL_OTP_STATE = Object.fromEntries(Object.values(MODE_OTP).map((value) => [value, '']));
const INITAL_PASTED_STATE = Object.fromEntries(Object.values(MODE_OTP).map((value) => [value, false]));

const CustomOtpInput = ({ otpExpireTime, loading, loadingResend, onResend, onConfirm, isUse2fa, modeOtp = MODE_OTP.EMAIL }) => {
    const [state, set] = useState({
        otp: INITAL_OTP_STATE,
        pasted: INITAL_PASTED_STATE,
        isError: false,
        modes: []
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
        const listModeAvailable = [modeOtp];
        if (isTfaEnabled && isUse2fa) {
            listModeAvailable.push('tfa');
        }
        setState({ modes: listModeAvailable, isError: false });
    }, [isTfaEnabled, isUse2fa, modeOtp]);

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
        if (mode !== MODE_OTP.TFA && formatVal.length === OTP_REQUIRED_LENGTH && isTfaEnabled) {
            const input = parentTfaRef.current?.firstChild?.firstChild?.firstChild;
            input?.focus();
        }

        if (isValidInput(newOtp)) {
            setTimeout(async () => await onConfirmHandler(newOtp), 100);
        }
    };

    const onConfirmHandler = async (otp) => {
        try {
            const response = await onConfirm(otp);
            // Lưu ý: Hàm onConfirm cần trả về Response
            if(response) {
                if (response?.status === ApiResultCreateOrder.INVALID_OTP || response.status !== ApiStatus.SUCCESS) {
                    onFocusFirstInput();
                    setState({ otp: INITAL_OTP_STATE, isError: true });
                }
            }
        } catch (error) {
            onFocusFirstInput();
            setState({ otp: INITAL_OTP_STATE, isError: true });
        }
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

    useEffect(() => {
        return () => {
            setState({
                otp: INITAL_OTP_STATE,
                pasted: INITAL_PASTED_STATE,
                isError: false,
                modes: []
            });
        };
    }, []);

    return (
        <>
            {state.modes.map((mode) => (
                <div key={mode}>
                    <div className={classNames('mb-6', { '!mb-8': isTfaEnabled })}>
                        {mode !== MODE_OTP.TFA && <div className="txtPri-3"> {mode === MODE_OTP.SMART_OTP ? t('dw_partner:verify_smart_otp') : t('dw_partner:verify')}</div>}
                        {mode !== MODE_OTP.TFA && <div className="txtSecond-2 mt-4">{t(`dw_partner:otp_code_send_to_${mode}`)}</div>}
                    </div>

                    {isTfaEnabled && (
                        <div className="text-sm font-medium mb-4">
                            {mode === MODE_OTP.EMAIL && t('dw_partner:email_verification_code')}
                            {mode === MODE_OTP.TFA && t('dw_partner:verify_2fa')}
                        </div>
                    )}

                    <div ref={mode === MODE_OTP.TFA ? parentTfaRef : undefined}>
                        <OtpInput
                            key={'otp_' + mode}
                            ref={mode !== MODE_OTP.TFA ? otpInputRef : undefined}
                            value={state.otp?.[mode]}
                            onChange={(val) => onChangeHandler(val, mode)}
                            numInputs={OTP_REQUIRED_LENGTH}
                            placeholder={'------'}
                            isInputNum={true}
                            containerStyle="mb-4 w-full justify-between"
                            inputStyle={classNames(
                                '!h-[48px] !w-[48px] sm:!h-[64px] sm:!w-[64px] text-txtPrimary dark:text-gray-4  font-semibold text-[22px] dark:border border-divider-dark rounded-[4px] bg-gray-10 dark:bg-dark-2 ',
                                {
                                    'focus:!border-teal focus:border': !state.isError,
                                    '!border-red': state.isError
                                }
                            )}
                            shouldAutoFocus={mode !== MODE_OTP.TFA}
                            hasErrored={state.isError}
                            errorStyle={classNames('border-red border')}
                        />
                    </div>

                    <div
                        className={classNames('flex items-center justify-between', {
                            '!justify-end': mode === MODE_OTP.TFA || mode === MODE_OTP.SMART_OTP
                        })}
                    >
                        {(mode !== MODE_OTP.TFA && mode !== MODE_OTP.SMART_OTP) && (
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
                                        ) : loadingResend ? (
                                            <Spinner />
                                        ) : (
                                            <TextButton disabled={loadingResend || loading} className="w-auto !bg-transparent" onClick={onResend}>
                                                {t('dw_partner:resend_otp')}
                                            </TextButton>
                                            // <ButtonV2 variants="text" disabled={loadingResend || loading} className="w-auto !bg-transparent" onClick={onResend}>
                                            //     {t('dw_partner:resend_otp')}
                                            // </ButtonV2>
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

            <div className="mt-10">
                <ButtonV2 onClick={async () => await onConfirmHandler(state.otp)} loading={loading || auth?.loadingUser} disabled={!isValidInput(state.otp)}>
                    {t('dw_partner:verify_2')}
                </ButtonV2>
            </div>
        </>
    );
};

export default CustomOtpInput;
