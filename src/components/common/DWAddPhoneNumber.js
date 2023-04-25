import { useTranslation } from 'next-i18next';
import { ArrowForwardIcon } from 'components/svg/SvgIcon';
import ModalV2 from 'components/common/V2/ModalV2';
import { useState } from 'react';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { ApiStatus } from 'redux/actions/const';
import { API_CHECK_PHONE_NUMBER_DUPLICATE, API_SET_PHONE_REQUEST, API_SET_PHONE_VERIFY } from '../../redux/actions/apis';
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';
import { useRouter } from 'next/router';
import InputV2 from './V2/InputV2';
import FetchApi from 'utils/fetch-api';
import toast from 'utils/toast';
import { X } from 'react-feather';
import colors from 'styles/colors';
import CustomOtpInput from 'components/screens/WithdrawDeposit/components/CustomOtpInput';

const phoneNumberPattern = /^\d{10}$/;

const toRegionPhone = (phoneNumber) => (phoneNumber ? '+84' + phoneNumber.slice(1) : '');

const actionModal = {
    PHONE_INPUT: 1,
    VERIFY_OTP: 2
};

const CustomHeader = ({ onBackAction, onClose, isDark, couldBack }) => (
    <div className="sticky top-0 z-10 flex items-center justify-between mb-6">
        <div>
            {couldBack && (
                <button onClick={onBackAction}>
                    <ArrowForwardIcon color={isDark ? colors.gray['4'] : colors.gray['15']} className="rotate-180" />
                </button>
            )}
        </div>
        <X onClick={onClose} className="cursor-pointer" size={24} color={isDark ? colors.gray['4'] : colors.gray['15']} />
    </div>
);

const DWAddPhoneNumber = ({ isVisible, onBackdropCb }) => {
    const { t } = useTranslation();
    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    const router = useRouter();

    // Main handle
    const [curAction, setCurAction] = useState(actionModal.PHONE_INPUT);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [helperText, setHelperText] = useState('');
    const [isShowAlert, setIsShowAlert] = useState(false);

    const [isValidating, setIsValidating] = useState(false);

    const [otpInfo, setOtpInfo] = useState(null);
    const [loadingResend, setLoadingResend] = useState(false);
    const [isConfirmPhoneYet, setIsConfirmPhoneYet] = useState(false);

    const handleChangePhoneNumber = (value = '') => {
        if (value.length > 10) return;

        onValidatePhoneNumber(value);
        setPhoneNumber(value);
    };

    const onValidatePhoneNumber = (value) => {
        try {
            if (!value) {
                setIsConfirmPhoneYet(false);
                setHelperText(t('dw_partner:error.missing_phone'));
                return;
            }

            if (value) setHelperText('');

            if (phoneNumberPattern.test(value)) {
                setIsValidating(true);
                setHelperText('');

                FetchApi({
                    url: API_CHECK_PHONE_NUMBER_DUPLICATE,
                    options: {
                        method: 'POST'
                    },
                    params: { phone: toRegionPhone(value) }
                })
                    .then(({ data, status, message }) => {
                        if (status !== ApiStatus.SUCCESS) setHelperText(t('dw_partner:error.phone_existed'));
                        else {
                            onSubmitPhoneNumber();
                            // setHelperText('');
                        }
                    })
                    .finally(() => {
                        setIsValidating(false);
                        setIsConfirmPhoneYet(true);
                    });
            } else if (isConfirmPhoneYet) {
                setHelperText(t('dw_partner:error.invalid_phone'));
            }
        } catch (e) {
            console.log(e);
        }
    };

    const onSubmitPhoneNumber = () => {
        if (curAction === actionModal.VERIFY_OTP) setLoadingResend(true);
        FetchApi({
            url: API_SET_PHONE_REQUEST,
            options: {
                method: 'POST'
            },
            params: { phone: toRegionPhone(phoneNumber) }
        })
            .then(({ data, status, message }) => {
                if (status !== ApiStatus.SUCCESS) {
                    if (message === 'PHONE_EXSITED') setHelperText(setHelperText(t('dw_partner:error.phone_existed')));
                } else {
                    // set OTP if not in remaining
                    if (data?.success) {
                        setOtpInfo(data);
                    }
                    // Open modal OTP code
                    setCurAction(actionModal.VERIFY_OTP);
                }
            })
            .finally(() => {
                setIsValidating(false);
                setLoadingResend(false);
            });
    };

    const handleBackAction = () => {
        setHelperText('');
        const prevAction = curAction - 1;
        if (prevAction < 1) {
            router.back();
        } else {
            setCurAction(prevAction);
        }
    };

    const onSubmitOtp = async (code) => {
        setIsValidating(true);
        try {
            const response = await FetchApi({
                url: API_SET_PHONE_VERIFY,
                options: {
                    method: 'POST'
                },
                params: { phone: toRegionPhone(phoneNumber), code: code?.phone }
            });
            if (response?.status === ApiStatus.SUCCESS) setIsShowAlert(true);
            else toast({ text: t('dw_partner:error.invalid_otp'), type: 'warning', duration: 1500 });
            return response;
        } catch (error) {
            console.error('ERROR WHEN SUBMIT OTP CODE: ', error);
        } finally {
            setIsValidating(false);
        }
    };

    if (!isVisible) return null;

    return (
        <>
            <ModalV2
                isVisible={isVisible}
                onBackdropCb={onBackdropCb}
                className="!max-w-[488px]"
                wrapClassName="p-8 flex flex-col text-gray-1 dark:text-gray-7 tracking-normal"
                customHeader={() => (
                    <CustomHeader onBackAction={handleBackAction} onClose={onBackdropCb} isDark={isDark} couldBack={curAction !== actionModal.PHONE_INPUT} />
                )}
            >
                {curAction === actionModal.PHONE_INPUT && (
                    <>
                        <h1 className="!text-2xl txtPri-3">{t('dw_partner:add_phone')}</h1>
                        <div className="mt-4 mb-6">{t('dw_partner:add_phone_description')}</div>
                        <InputV2
                            // onHitEnterButton={() => (!helperText && !isValidating ? onSubmitPhoneNumber(false) : null)}
                            className="!pb-10"
                            value={phoneNumber}
                            onChange={handleChangePhoneNumber}
                            label={t('dw_partner:phone')}
                            placeholder={t('dw_partner:phone_placeholder')}
                            allowClear={true}
                            error={helperText}
                            type="number"
                        />
                        <ButtonV2 disabled={!!helperText || isValidating || !phoneNumber} loading={isValidating} onClick={() => onSubmitPhoneNumber(false)}>
                            {t('common:confirm')}
                        </ButtonV2>
                    </>
                )}

                {curAction === actionModal.VERIFY_OTP && (
                    <CustomOtpInput
                        otpExpireTime={otpInfo?.expiredAt - otpInfo?.remaining_time * 4}
                        loading={isValidating}
                        onConfirm={(otp) => onSubmitOtp(otp)}
                        loadingResend={loadingResend}
                        onResend={onSubmitPhoneNumber}
                        modeOtp="phone"
                    />
                )}
            </ModalV2>

            <AlertModalV2
                isVisible={isShowAlert}
                onClose={() => {
                    setIsShowAlert(false);
                    setTimeout(() => {
                        onBackdropCb();
                    }, 200);
                }}
                type="success"
                title={t('common:success')}
                message={t('dw_partner:add_phone_success')}
            />
        </>
    );
};

export default DWAddPhoneNumber;
