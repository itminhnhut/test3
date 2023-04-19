import { useTranslation } from 'next-i18next';
import { LogoIcon, BxChevronDown, ArrowForwardIcon } from 'components/svg/SvgIcon';
import ModalV2 from 'components/common/V2/ModalV2';
import { useState, useEffect } from 'react';
import * as Error from 'redux/actions/apiError';
import CheckBox from 'components/common/CheckBox';
import { formatNumber as formatWallet, CopyText } from 'redux/actions/utils';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import Spiner from 'components/common/V2/LoaderV2/Spiner';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
// import { NoDataDarkIcon } from 'components/common/V2/TableV2/NoData';
import { find, isEmpty, isFunction, keys, pickBy } from 'lodash';
import NamiCircle from 'components/svg/NamiCircle';
import TagV2 from 'components/common/V2/TagV2';
import { ApiStatus } from 'redux/actions/const';
import fetchAPI from 'utils/fetch-api';
import {
    API_CHECK_PHONE_NUMBER_DUPLICATE,
    API_CONFIRM_ORDER_CONVERT_SMALL_BALANCE,
    API_GET_NAMI_RATE,
    API_PREFETCH_ORDER_CONVERT_SMALL_BALANCE,
    API_SET_PHONE_REQUEST,
    API_SET_PHONE_VERIFY
} from '../../redux/actions/apis';
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';
import ModalNeedKyc from 'components/common/ModalNeedKyc';
import { useSelector } from 'react-redux';
import router, { useRouter } from 'next/router';
import { WALLET_SCREENS } from 'pages/wallet';
import InputV2 from './V2/InputV2';
import FetchApi from 'utils/fetch-api';
import ModalOtp from 'components/screens/WithdrawDeposit/components/ModalOtp';
import OtpInput from 'react-otp-input';
import classNames from 'classnames';
import toast from 'utils/toast';
import { X } from 'react-feather';
import colors from 'styles/colors';

const otpLength = 6;

const phoneNumberPattern = /^\d{10}$/;

const toRegionPhone = (phoneNumber) => '+84' + phoneNumber.slice(1);

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
    const [isShowPoppup, setIsShowPoppup] = useState(false);
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [currentTheme] = useDarkMode();
    const [listCheck, setListCheck] = useState([]);
    const [listAsset, setListAsset] = useState([]);
    const [isShowModalConfirm, setIsShowModalConfirm] = useState(false);
    const [isShowModalSuccess, setIsShowModalSuccess] = useState(false);
    const [namiRate, setNamiRate] = useState(null);
    const [isOpenModalKyc, setIsOpenModalKyc] = useState(false);
    const auth = useSelector((state) => state.auth.user) || null;

    const isDark = currentTheme === THEME_MODE.DARK;

    const router = useRouter();

    // Main handle
    const [curAction, setCurAction] = useState(actionModal.PHONE_INPUT);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [helperText, setHelperText] = useState('');
    const [isShowAlert, setIsShowAlert] = useState(false);

    const [isValidating, setIsValidating] = useState(false);

    const [otp, setOtp] = useState(null);

    const handleChangePhoneNumber = (value = '') => {
        onValidatePhoneNumber(value);
        setPhoneNumber(value);
    };

    const onValidatePhoneNumber = (value) => {
        try {
            if (phoneNumberPattern.test(value)) {
                setIsValidating(true);
                FetchApi({
                    url: API_CHECK_PHONE_NUMBER_DUPLICATE,
                    options: {
                        method: 'POST'
                    },
                    params: { phone: toRegionPhone(value) }
                })
                    .then(({ data, status, message }) => {
                        if (status !== ApiStatus.SUCCESS) setHelperText('Phone number existed.');
                        else setHelperText('');
                    })
                    .finally(() => {
                        setIsValidating(false);
                    });
            } else setHelperText('Invalid phone number.');
        } catch (e) {
            console.log(e);
        }
    };

    const onSubmitPhoneNumber = () => {
        FetchApi({
            url: API_SET_PHONE_REQUEST,
            options: {
                method: 'POST'
            },
            params: { phone: toRegionPhone(phoneNumber) }
        })
            .then(({ data, status, message }) => {
                if (status !== ApiStatus.SUCCESS) {
                    if (message === 'PHONE_EXSITED') setHelperText('Phone number existed.');
                } else {
                    // Open modal OTP code
                    setOtp(null);
                    setCurAction(actionModal.VERIFY_OTP);
                }
            })
            .finally(() => {
                setIsValidating(false);
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

    const onSubmitOtp = () => {
        setIsValidating(true);
        FetchApi({
            url: API_SET_PHONE_VERIFY,
            options: {
                method: 'POST'
            },
            params: { phone: toRegionPhone(phoneNumber), code: otp }
        })
            .then(({ data, status, message }) => {
                if (status === 'ok') {
                    setIsShowAlert(true);
                    if (onBackdropCb) onBackdropCb();
                } else {
                    // setOtp('');
                    setHelperText('error');
                    toast({
                        text: t('wallet:errors.wrong_otp'),
                        type: 'error'
                    });
                }
            })
            .finally(() => {
                setIsValidating(false);
            });
    };

    const handleChangeOtp = (value) => {
        const formatedValue = value.replace(/\D/g, '');
        setOtp(formatedValue);
        // if (formatedValue.length === otpLength && !helperText && !isValidating) {
        //     onSubmitOtp();
        // }
    };

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
                        <h1 className="!text-2xl txtPri-3">Thêm số điện thoại</h1>
                        <div className="mt-4 mb-6">
                            Để hỗ trợ thực hiện giao dịch thông qua đối tác nạp rút của Nami Exchange. Vui lòng bạn cung cấp số điện thoại để giao dịch tốt
                            nhất.
                        </div>
                        <InputV2
                            className="!pb-10"
                            value={phoneNumber}
                            onChange={handleChangePhoneNumber}
                            label={t('reference:referral.partner.phone')}
                            placeholder="Vui lòng nhập số điện thoại"
                            allowClear={true}
                            error={helperText}
                            type="number"
                        />
                        <ButtonV2 loading={isValidating} onClick={onSubmitPhoneNumber}>
                            {t('common:confirm')}
                        </ButtonV2>
                    </>
                )}
                {curAction === actionModal.VERIFY_OTP && (
                    <>
                        <h1 className="!text-2xl txtPri-3">{t('dw_partner:verify')}</h1>
                        <div className="mt-4 mb-6">Vui lòng nhập mã xác minh đã được gửi đến số điện thoại của bạn để thực hiện.</div>
                        <OtpInput
                            value={otp}
                            onChange={handleChangeOtp}
                            numInputs={otpLength}
                            placeholder={'------'}
                            isInputNum
                            containerStyle="mt-4 w-full justify-between"
                            inputStyle={classNames(
                                '!h-[48px] !w-[48px] sm:!h-[64px] sm:!w-[64px] text-txtPrimary dark:text-gray-4 font-semibold text-[22px] dark:border border-divider-dark rounded-[4px] bg-gray-10 dark:bg-dark-2 focus:!border-teal',
                                { 'border-red': helperText }
                            )}
                        />
                        <div className="mt-4 mb-10 py-3 flex items-center gap-x-2">
                            <span>Không nhận được?</span>
                            <ButtonV2 variants="text" className="w-auto" onClick={() => {}}>
                                Gửi lại mã
                            </ButtonV2>
                        </div>
                        <ButtonV2 disabled={helperText || isValidating || otp?.length < otpLength} loading={isValidating} onClick={onSubmitOtp}>
                            {t('common:confirm')}
                        </ButtonV2>
                    </>
                )}
            </ModalV2>

            <AlertModalV2
                isVisible={isShowAlert}
                onClose={() => {
                    setIsShowAlert(false);
                    onBackdropCb();
                }}
                type="success"
                title={t('common:success')}
                message="Bạn đã xác minh thành công số điện thoại của mình. Vui lòng tiếp tục thực hiện lệnh của mình."
            />
        </>
    );
};

export default DWAddPhoneNumber;
