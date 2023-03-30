import classNames from 'classnames';
import React, { useState } from 'react';
import OtpInput from 'react-otp-input';
import styled from 'styled-components';
import colors from 'styles/colors';
import ModalV2 from 'components/common/V2/ModalV2';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import Copy from 'components/svg/Copy';

import { Check } from 'react-feather';
import { ApiStatus } from 'redux/actions/const';
import { useRouter } from 'next/router';
import toast from 'utils/toast';
import Countdown from 'react-countdown';
const OTP_REQUIRED_LENGTH = 6;
const ModalOtp = ({ isVisible, onClose, className, otpExpireTime, loading, assetCode, onConfirm, t }) => {
    const [otp, setOtp] = useState('');
    const [pasted, setPasted] = useState(false);
    const router = useRouter();

    const doPaste = async () => {
        try {
            const data = await navigator?.clipboard?.readText();
            if (!data) return;
            setOtp(data.replace(/\D/g, '').slice(0, 6));
            setPasted(true);
            setTimeout(() => setPasted(false), 500);
        } catch {}
    };

    return (
        <ModalV2
            isVisible={isVisible}
            // isVisible={true}
            wrapClassName=""
            onBackdropCb={() => {
                onClose();
                setOtp('');
            }}
            className={classNames(`w-[90%] !max-w-[488px] overflow-y-auto select-none border-divider`, { className })}
        >
            <div className="mb-6">
                <div className="txtPri-3 mb-4">{t('dw_partner:verify')}</div>
                <div className="txtSecond-2">{t('dw_partner:otp_code_send_to_email')}</div>
            </div>
            <OtpInput
                value={otp}
                onChange={(otp) => setOtp(otp.replace(/\D/g, ''))}
                numInputs={OTP_REQUIRED_LENGTH}
                placeholder={'------'}
                isInputNum={true}
                containerStyle="mb-7 w-full justify-between"
                inputStyle={classNames(
                    '!h-[48px] !w-[48px] sm:!h-[64px] sm:!w-[64px] text-txtPrimary dark:text-gray-4 font-semibold text-[22px] dark:border border-divider-dark rounded-[4px] bg-gray-10 dark:bg-dark-2 focus:!border-teal'
                    // { 'border-red': isError }
                )}
            />
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <span className="txtSecond-2">{t('dw_partner:not_received_otp')}</span>
                    {otpExpireTime && (
                        <Countdown date={new Date().getTime() + otpExpireTime} renderer={({ props, ...countdownProps }) => props.children(countdownProps)}>
                            {(props) => {
                                return (
                                    <button
                                        onClick={onConfirm}
                                        disabled={!props.completed}
                                        className="text-dominant disabled:text-txtDisabled dark:text-txtDisabled-dark cursor-default font-semibold !w-auto"
                                    >
                                        {t('dw_partner:resend_otp')}
                                    </button>
                                );
                            }}
                        </Countdown>
                    )}
                </div>

                <div className="flex items-center space-x-2 cursor-pointer text-dominant" onClick={pasted ? undefined : async () => await doPaste()}>
                    <div className="w-4 h-4">{pasted ? <Check size={16} /> : <Copy color="currentColor" />}</div>

                    <ButtonV2 variants="text" className="font-semibold text-base">
                        {t('common:paste')}
                    </ButtonV2>
                </div>
            </div>
            <div className="mt-[52px]">
                <ButtonV2
                    onClick={() =>
                        onConfirm({
                            email: otp
                        })
                    }
                    loading={loading}
                    disabled={otp.length !== OTP_REQUIRED_LENGTH}
                >
                    {t('common:confirm')}
                </ButtonV2>
            </div>
        </ModalV2>
    );
};

export default ModalOtp;
