import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { find, isNumber } from 'lodash';
import { countDecimals, eToNumber, shortHashAddress, formatNumber } from 'redux/actions/utils';
import { WITHDRAW_RESULT, withdrawHelper } from 'redux/actions/helper';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import OtpInput from 'react-otp-input';
import ModalV2 from 'components/common/V2/ModalV2';
import styled from 'styled-components';
import colors from 'styles/colors';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { AddressInput, AmountInput, Information, MemoInput, NetworkInput } from 'components/screens/Wallet/Exchange/Withdraw';
import WithdrawHistory from 'components/screens/Wallet/Exchange/Withdraw/WithdrawHistory';
import classNames from 'classnames';
import { roundToDown } from 'round-to';
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';
import toast from 'utils/toast';
import { CopyIcon } from 'components/svg/SvgIcon';
import Countdown from 'react-countdown-now';
import CustomOtpInput from '../../components/CustomOtpInput';
import { MODE_OTP } from 'constants/constants';
import FetchApi from 'utils/fetch-api';
import { ApiStatus, UserSocketEvent, WithdrawResult } from 'redux/actions/const';
import { API_WITHDRAW_V4 } from 'redux/actions/apis';
import { isObject } from 'lodash';

const errorMessageMapper = (t, error, data) => {
    switch (error) {
        case WITHDRAW_RESULT.MissingOtp:
            return t('wallet:withdraw_prompt.input_otp_suggest');
        case WITHDRAW_RESULT.InvalidOtp:
            return t('common:otp_verify_expired');
        case WITHDRAW_RESULT.NotEnoughBalance:
            return t('error:BALANCE_NOT_ENOUGH');
        case WITHDRAW_RESULT.UnsupportedAddress:
            return t('error:INVALID_ADDRESS');
        case WITHDRAW_RESULT.InvalidAddress:
            return t('error:INVALID_ADDRESS');
        case WITHDRAW_RESULT.AmountExceeded:
        case WITHDRAW_RESULT.AmountTooSmall:
            return t('error:INVALID_AMOUNT');
        case WITHDRAW_RESULT.InvalidAsset:
            return t('error:INVALID_CURRENCY');
        case WITHDRAW_RESULT.INVALID_KYC_STATUS:
            return t('error:INVALID_KYC_STATUS');
        case WITHDRAW_RESULT.WithdrawDisabled:
            return t('wallet:errors.withdraw_disabled');
        case WITHDRAW_RESULT.SOTP_INVALID:
            return t('dw_partner:error.invalid_smart_otp', { timesErr: data?.count ?? 1 });
        case WITHDRAW_RESULT.SECRET_INVALID:
            return t('dw_partner:error.invalid_smart_otp', { timesErr: data?.count ?? 1 });
            // return t('dw_partner:error.invalid_secret')
        case WITHDRAW_RESULT.Unknown:
        default:
            return t('error:UNKNOWN_ERROR');
    }
};

// Other error show modal
// const errorShowOnlyMessage = [WITHDRAW_RESULT.MissingOtp, WITHDRAW_RESULT.InvalidOtp];

const PHASE_CONFIRM = {
    INFO: 1,
    OTP: 2,
    RESULT: 3
};

const ModalConfirm = ({ selectedAsset, selectedNetwork, open, address, memo, amount, assetDigit, assetCode, currentTheme, closeModal }) => {
    const [phase, setPhase] = useState(PHASE_CONFIRM.INFO);
    const [loading, setLoading] = useState(false);
    const [loadingResend, setLoadingResend] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [otpMode, setOtpMode] = useState(MODE_OTP.EMAIL);
    const [expiredTime, setExpiredTime] = useState(0);
    const [showAlertDisableSmartOtp, setShowAlertDisableSmartOtp] = useState(false)
    const { t, i18n: { language } } = useTranslation();
    let auth = useSelector((state) => state.auth) || null;
    // const userSocket = useSelector((state) => state.socket.userSocket);

    // useEffect(() => {
    //     if (userSocket) {
    //         userSocket.on(UserSocketEvent.SMART_OTP, (data) => {
    //             // make sure the socket displayingId is the current details/[id] page
    //             console.log("_____data: ", data);
    //             if(data === WITHDRAW_RESULT.PIN_INVALID_EXCEED_TIME) {
    //                 console.log("____PIN_INVALID_EXCEED_TIME");
    //             }
    //         });
    //     }
    //     return () => {
    //         if (userSocket) {
    //             userSocket.removeListener(UserSocketEvent.SMART_OTP, (data) => {
    //                 console.log('socket removeListener SMART_OTP:', data);
    //             });
    //         }
    //     };
    // }, [userSocket]);

    const onClose = () => {
        closeModal();
        setPhase(PHASE_CONFIRM.INFO);
    };

    const alertErr = (errStatus, dataErr) => {
        console.log("______alertErr: ", errStatus, dataErr)

        return toast({
            text: errorMessageMapper(t, errStatus, dataErr),
            type: 'warning',
            duration: 2000
        });
    };

    const handlePostOrder = async (otp) => {
        otp ?  setLoading(true) : setLoadingResend(true);
        try {
            const res = await FetchApi({
                url: API_WITHDRAW_V4,
                options: {
                    method: 'POST'
                },
                params: {
                    assetId: selectedAsset?.assetId,
                    amount,
                    network: selectedNetwork?.network,
                    withdrawTo: address,
                    tag: memo,
                    otp,
                    locale: language
                }
            })

            const { status, data } = res;

            if (status === ApiStatus.SUCCESS) {
                setPhase(PHASE_CONFIRM.OTP);

                if (data?.use_smart_otp) {
                    setOtpMode(MODE_OTP.SMART_OTP);
                } else if (data?.remaining_time) {
                    setExpiredTime(Date.now() + data.remaining_time);
                    setOtpMode(MODE_OTP.EMAIL);
                } else {
                    setShowAlert(true);
                    // if (onClose) onClose();
                }
            } else if(status === WITHDRAW_RESULT.EXCEEDED_SMART_OTP) {
                setShowAlertDisableSmartOtp(true)
            } else if(status === WITHDRAW_RESULT.TOO_MUCH_REQUEST) {
                setExpiredTime(Date.now() + data.remaining_time);
                setPhase(PHASE_CONFIRM.OTP);
                setOtpMode(MODE_OTP.EMAIL);
            } else if (status === ApiStatus.ERROR) {
                if(!isObject(res.data)) alertErr(res?.data)
                else alertErr()
            } else alertErr(res?.status, res?.data)
            return res;
        } catch (error) {
            alertErr(errorMessageMapper(t, error));
        } finally {
            otp ? setLoading(false) : setLoadingResend(false);
        }
    };

    return (
        <>
            <AlertModalV2
                isVisible={showAlert}
                onClose={() => {setShowAlert(false); setTimeout(onClose, 200);}}
                type="success"
                title={t('wallet:withdraw_prompt:title_success')}
                message={t('wallet:withdraw_prompt:desc_success')}
            />
            <ModalV2
                isVisible={open}
                // isVisible={true}
                className="!max-w-[488px]"
                onBackdropCb={onClose}
            >
                {
                    // CONFIRM PHASE
                    phase === PHASE_CONFIRM.INFO && (
                        <>
                            <div className="text-center mb-8">
                                <p className="text-2xl font-semibold">{t('wallet:withdraw_confirmation')}</p>
                            </div>
                            <div className="space-y-2">
                                {[
                                    {
                                        title: t('common:withdraw'),
                                        value: assetCode
                                    },
                                    {
                                        title: t('wallet:receive_address'),
                                        value: shortHashAddress(address, 8, 8)
                                    },
                                    {
                                        title: 'MEMO',
                                        value: shortHashAddress(memo, 8, 8)
                                    },
                                    {
                                        title: t('common:amount'),
                                        value: `${amount ? formatNumber(amount, assetDigit) : '--'} ${assetCode ?? ''}`
                                    },
                                    {
                                        title: t('common:fee'),
                                        value: `${selectedNetwork?.withdrawFee ? formatNumber(selectedNetwork?.withdrawFee, assetDigit) : '--'} ${
                                            assetCode ?? ''
                                        }`
                                    },
                                    {
                                        title: t('wallet:will_receive'),
                                        value: `${
                                            amount - selectedNetwork?.withdrawFee ? formatNumber(amount - selectedNetwork?.withdrawFee, assetDigit) : '--'
                                        } ${assetCode ?? ''}`
                                    },
                                    {
                                        title: t('wallet:network'),
                                        value: selectedNetwork?.name
                                    }
                                ].map((item, index) => {
                                    return (
                                        <div key={index}>
                                            <span className="text-sm text-txtSecondary dark:text-txtSecondary-dark">{item.title}</span>
                                            <span className="float-right font-semibold">{item.value || '--'}</span>
                                        </div>
                                    );
                                })}

                                {!memo && <div className="!mt-6 text-xs text-red">{t('wallet:notes.memo_wdl_tips')}</div>}
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <ButtonV2 variants="secondary" onClick={onClose}>
                                    {t('common:cancel')}
                                </ButtonV2>
                                <ButtonV2 disabled={loadingResend} loading={loadingResend} onClick={() => handlePostOrder()}>
                                    {t('common:continue')}
                                </ButtonV2>
                            </div>
                        </>
                    )
                }

                {
                    // OTP PHASE
                    phase === PHASE_CONFIRM.OTP && (
                        <CustomOtpInput
                            otpExpireTime={expiredTime}
                            loading={loading}
                            onConfirm={(otp) => handlePostOrder(otp)}
                            loadingResend={loadingResend}
                            onResend={() => handlePostOrder()}
                            modeOtp={otpMode}
                            isUse2fa={otpMode === MODE_OTP.EMAIL ? auth.user?.isTfaEnabled : false}
                        />
                    )
                }
            </ModalV2>
            <AlertModalV2
                isVisible={showAlertDisableSmartOtp}
                onClose={() => {
                    setShowAlertDisableSmartOtp(false);
                    setTimeout(onClose, 150);
                    // setPhase(PHASE_CONFIRM.INFO);
                }}
                textButton={t('dw_partner:verify_by_email')}
                onConfirm={() => {
                    handlePostOrder(null);
                    setShowAlertDisableSmartOtp(false)
                }}
                type="error"
                title={t('dw_partner:disabled_smart_otp_title')}
                message={t('dw_partner:disabled_smart_otp_des')}
            />
        </>
    );
};

const INITIAL_STATE = {
    selectedNetwork: null,
    loadingConfigs: false,
    configs: null,
    estimatingFee: false,
    address: '',
    amount: '',
    memo: '',
    validator: null,
    openWithdrawConfirm: false,
    otpModes: [],
    processingWithdraw: false,
    withdrawResult: null,
    emailOtp: null,
    googleOtp: null,
    otp: {},
    errors: null,
    histories: null,
    loadingHistories: false,
    historyPage: 0
};

const CryptoWithdraw = ({ assetId }) => {
    // Init State
    const [resendTimeOut, setResendTimeOut] = useState(null);
    const [state, set] = useState(INITIAL_STATE);
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));

    // Rdx
    const paymentConfigs = useSelector((state) => state.wallet.paymentConfigs);
    const walletAssets = useSelector((state) => state.wallet.SPOT);
    const assetConfigs = useSelector((state) => state.utils.assetConfig);
    const auth = useSelector((state) => state.auth.user);

    // Use Hooks
    const [currentTheme] = useDarkMode();
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const selectedAsset = useMemo(() => find(paymentConfigs, { assetCode: assetId }), [paymentConfigs, assetId]);
    const assetBalance = useMemo(() => walletAssets[selectedAsset?.assetId], [walletAssets, selectedAsset]);
    const assetConfig = useMemo(() => find(assetConfigs, { id: selectedAsset?.assetId }), [assetConfigs, selectedAsset]);

    const otpModes = useMemo(() => {
        const modes = [];
        if (auth?.email) modes.push('email');
        if (auth?.isTfaEnabled) modes.push('tfa');
        return modes;
    }, [auth]);

    const informationData = useMemo(() => {
        const available = assetBalance?.value - assetBalance?.locked_value;
        const min = roundToDown(Math.max(state.selectedNetwork?.withdrawFee, state.selectedNetwork?.withdrawMin), assetConfig?.assetDigit ?? 0);
        const max = roundToDown(Math.min(+state.selectedNetwork?.withdrawMax, available), assetConfig?.assetDigit ?? 0);
        const fee = state.selectedNetwork?.withdrawFee;
        return {
            min,
            max,
            fee,
            available
        };
    }, [state.selectedNetwork, state.amount, assetBalance, assetConfig]);

    const amountErrorMessage = useMemo(() => {
        switch (state.validator?.amount) {
            case AMOUNT.LESS_THAN_MIN:
                return t('wallet:errors.invalid_min_amount', {
                    value: formatNumber(informationData.min, assetConfig?.assetDigit),
                    asset: state.selectedNetwork?.coin
                });
            case AMOUNT.OVER_THAN_MAX:
                return t('wallet:errors.invalid_max_amount', {
                    value: formatNumber(informationData.max, assetConfig?.assetDigit),
                    asset: state.selectedNetwork?.coin
                });
            case AMOUNT.OVER_BALANCE:
                return t('wallet:errors.invalid_insufficient_balance');
            case AMOUNT.OVER_DECIMAL_SCALE:
                return t('wallet:errors.decimal_scale_limit', { value: countDecimals(eToNumber(state.selectedNetwork?.withdrawIntegerMultiple)) });
            default:
                return '';
        }
    }, [state.selectedNetwork, state.validator, assetConfig, informationData]);

    useEffect(() => {
        if (auth) {
            const otpModes = [];
            auth?.email && otpModes.push('email');
            auth?.isTfaEnabled && otpModes.push('tfa');
            otpModes.length && setState({ otpModes });
        }
    }, [auth]);

    useEffect(() => {
        const defaultNetwork = find(selectedAsset?.networkList, 'isDefault') || find(selectedAsset?.networkList, 'withdrawEnable');
        setState({ amount: 0 });
        if (defaultNetwork) {
            setState({ selectedNetwork: defaultNetwork });
        }
    }, [selectedAsset]);

    useEffect(() => {
        setState({
            validator: withdrawValidator(
                selectedAsset?.assetCode,
                +state.amount,
                countDecimals(+state.selectedNetwork?.withdrawIntegerMultiple),
                state.address,
                state.selectedNetwork?.addressRegex,
                state.memo,
                state.selectedNetwork?.memoRegex,
                state.selectedNetwork?.network,
                state.selectedNetwork?.tokenType,
                state.selectedNetwork?.withdrawFee >= state.selectedNetwork?.withdrawMin
                    ? state.selectedNetwork?.withdrawFee
                    : state.selectedNetwork?.withdrawMin,
                state.selectedNetwork?.withdrawMax?.value,
                assetBalance?.value - assetBalance?.locked_value,
                state.selectedNetwork?.withdrawEnable
            )
        });
    }, [selectedAsset, state.amount, state.address, state.memo, state.selectedNetwork, state.selectedNetwork?.withdrawFee, assetBalance]);

    useEffect(() => {
        let interval;
        if (resendTimeOut) {
            interval = setInterval(() => {
                setResendTimeOut((lastTimerCount) => {
                    if (lastTimerCount <= 1) {
                        clearInterval(interval);
                    }
                    return lastTimerCount - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimeOut]);

    return (
        <div>
            <div
                className={classNames(
                    'w-full mx-auto pt-8 p-6 rounded-3xl sm:w-[453px] space-y-4 bg-white nami-light-shadow',
                    'dark:border dark:border-divider-dark dark:bg-dark-dark dark:shadow-none'
                )}
            >
                <AmountInput
                    t={t}
                    amount={state.amount}
                    onAmountChange={(amount) => setState({ amount })}
                    currentAsset={selectedAsset}
                    errorMessage={amountErrorMessage}
                    available={assetBalance?.value - assetBalance?.locked_value}
                    min={informationData.min}
                    max={informationData.max}
                    currentTheme={currentTheme}
                />

                <AddressInput t={t} value={state.address} onChange={(address) => setState({ address })} isValid={state.validator?.address} />

                {state?.selectedNetwork?.memoRegex && (
                    <MemoInput
                        t={t}
                        value={state.memo}
                        onChange={(memo) => setState({ memo })}
                        errorMessage={state.validator.memo ? '' : t('wallet:errors.invalid_memo')}
                    />
                )}

                <NetworkInput
                    t={t}
                    networkList={selectedAsset?.networkList}
                    selected={state.selectedNetwork}
                    onChange={(network) => setState({ selectedNetwork: network })}
                    currentTheme={currentTheme}
                />

                <Information
                    className="!mt-6"
                    assetCode={selectedAsset?.assetCode}
                    min={formatNumber(informationData.min, assetConfig?.assetDigit)}
                    max={formatNumber(informationData.max, assetConfig?.assetDigit)}
                    fee={formatNumber(informationData.fee, assetConfig?.assetDigit)}
                    receive={formatNumber(+state.amount - state.selectedNetwork?.withdrawFee, assetConfig?.assetDigit)}
                />

                <ButtonV2
                    className="!mt-10"
                    disabled={!state.validator?.allPass}
                    onClick={() => state.validator?.allPass && setState({ openWithdrawConfirm: true })}
                >
                    {t('common:withdraw')}
                </ButtonV2>
            </div>
            <ModalConfirm
                otpModes={otpModes}
                selectedAsset={selectedAsset}
                selectedNetwork={state.selectedNetwork}
                // open={true}
                open={state.openWithdrawConfirm}
                closeModal={() => setState({ openWithdrawConfirm: false })}
                address={state.address}
                memo={state.memo}
                amount={state.amount}
                assetDigit={assetConfig?.assetDigit}
                assetCode={assetConfig?.assetCode}
                currentTheme={currentTheme}
            />
            <div>
                <div className="text-2xl font-semibold mb-6 mt-20">{t('common:global_label.history')}</div>
                <WithdrawHistory />
            </div>
        </div>
    );
};

const OtpWrapper = styled.div.attrs({ className: 'mt-6' })`
    > div {
        width: 100%;
        justify-content: space-between;
        gap: 8px;

        div {
            width: 33px;
            height: 30px;
            background-color: ${({ isDark }) => (isDark ? colors.dark['2'] : colors.gray['10'])};
            justify-content: center;
            border-radius: 4px;

            input {
                font-weight: 600;
                font-size: 14px;
                color: ${({ isDark }) => (isDark ? colors.gray[4] : colors.darkBlue)};
                ::placeholder {
                    color: ${({ isDark }) => (isDark ? colors.gray[4] : colors.darkBlue)};
                }
            }

            @media (min-width: 768px) {
                width: 64px;
                height: 64px;
                input {
                    font-size: 24px;
                }
            }
        }
    }
`;

const IGNORE_TOKEN = [
    'XBT_PENDING',
    'TURN_CHRISTMAS_2017_FREE',
    'USDT_BINANCE_FUTURES',
    'SPIN_SPONSOR',
    'SPIN_BONUS',
    'SPIN_CONQUEST',
    'TURN_CHRISTMAS_2017',
    'SPIN_CLONE'
];

const AMOUNT = {
    LESS_THAN_MIN: 0,
    OVER_THAN_MAX: 1,
    OVER_BALANCE: 2,
    OVER_DECIMAL_SCALE: 3,
    OK: 'ok'
};

const Background = styled.div.attrs({ className: 'w-full h-full pt-20' })`
    background-color: ${({ isDark }) => (isDark ? colors.dark.dark : colors.gray['13'])};
`;

function withdrawValidator(
    asset,
    amount,
    decimalLimit,
    address,
    addressRegex,
    memo = undefined,
    memoRegex,
    network,
    networkType,
    min,
    max,
    available,
    isAllow
) {
    const result = {};
    const _addressRegex = new RegExp(addressRegex);
    const _memoRegex = new RegExp(memoRegex);
    const useMemo = memo && !!memoRegex;

    if (asset) {
        result.asset = !!(typeof asset === 'string' && asset.length);
    }

    if (_addressRegex.test(address)) {
        result.address = true;
    } else {
        result.address = false;
    }

    if (memo !== undefined) {
        if (memo && _memoRegex.test(memo)) {
            result.memo = true;
        } else {
            result.memo = false;
        }
    }

    if (isAllow !== undefined) {
        result.allowWithdraw = isAllow;
    }

    if (amount && typeof +amount === 'number') {
        if (isNumber(+min) && (amount < min || +amount === 0 || !+amount)) {
            result.amount = AMOUNT.LESS_THAN_MIN;
        } else if (typeof max === 'number' && amount > max) {
            result.amount = AMOUNT.OVER_THAN_MAX;
        } else if (isNumber(+available) && amount > available) {
            result.amount = AMOUNT.OVER_BALANCE;
        } else if (decimalLimit && countDecimals(+amount) > +decimalLimit) {
            result.amount = AMOUNT.OVER_DECIMAL_SCALE;
        } else {
            result.amount = AMOUNT.OK;
        }
    }

    let isValid;

    if (useMemo) {
        isValid = result.address && result.asset && result?.amount === AMOUNT.OK && result.allowWithdraw && result.memo;
    } else {
        isValid = result.address && result.asset && result?.amount === AMOUNT.OK && result.allowWithdraw;
    }

    if (isValid) {
        result.allPass = true;
    }

    return result;
}

export default CryptoWithdraw;
