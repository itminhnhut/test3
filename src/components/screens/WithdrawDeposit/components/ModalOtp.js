import classNames from 'classnames';
import React, { useState } from 'react';
import OtpInput from 'react-otp-input';
import styled from 'styled-components';
import colors from 'styles/colors';
import ModalV2 from 'components/common/V2/ModalV2';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import Copy from 'components/svg/Copy';

import { Check } from 'react-feather';

const ModalOtp = ({ isVisible, onClose, className }) => {
    const [otp, setOtp] = useState();
    const [pasted, setPasted] = useState(false);

    const doPaste = async () => {
        try {
            const data = await navigator?.clipboard?.readText();
            setOtp(data.replace(/\D/g, '').slice(0, 6));
            setPasted(true);
            setTimeout(() => setPasted(false), 500);
        } catch {}
    };
    return (
        <ModalV2
            isVisible={isVisible}
            wrapClassName=""
            onBackdropCb={onClose}
            className={classNames(`w-[90%] !max-w-[488px] overflow-y-auto select-none border-divider`, { className })}
        >
            <div className="mb-6">
                <div className="txtPri-3 mb-4">Xác minh</div>
                <div className="txtSecond-2">Vui lòng nhập mã xác minh đã được gửi đến email của bạn để tiếp tục rút BNB.</div>
            </div>
            <OtpInput
                value={otp}
                onChange={(otp) => setOtp(otp.replace(/\D/g, ''))}
                numInputs={6}
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
                    <span className="txtSecond-2">Không nhận được?</span>
                    <ButtonV2 variants="text" className="!w-auto">
                        Gửi lại mã
                    </ButtonV2>
                </div>

                <div className="flex items-center space-x-2 cursor-pointer text-dominant" onClick={pasted ? undefined : async () => await doPaste()}>
                    <div className="w-4 h-4">{pasted ? <Check size={16} /> : <Copy color="currentColor" />}</div>

                    <ButtonV2 variants="text" className="font-semibold text-base">
                        Dán
                    </ButtonV2>
                </div>
            </div>
            <div className="mt-[52px]">
                <ButtonV2>Xác nhận</ButtonV2>
            </div>
        </ModalV2>
    );
};

export default ModalOtp;
