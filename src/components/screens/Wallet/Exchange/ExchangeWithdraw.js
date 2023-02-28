import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { find, isNumber } from 'lodash';
import {
    countDecimals, eToNumber, formatWallet, shortHashAddress
} from 'redux/actions/utils';
import { WITHDRAW_RESULT, withdrawHelper } from 'redux/actions/helper';
import { PATHS } from 'constants/paths';

import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import OtpInput from 'react-otp-input';
import ModalV2 from 'components/common/V2/ModalV2';

import styled from 'styled-components';
import colors from 'styles/colors';
import useWindowFocus from 'hooks/useWindowFocus';
import HrefButton from 'components/common/V2/ButtonV2/HrefButton';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import {
    AddressInput, AmountInput, ErrorMessage, Information, MemoInput, NetworkInput
} from 'components/screens/Wallet/Exchange/Withdraw';
import WithdrawHistory from 'components/screens/Wallet/Exchange/Withdraw/WithdrawHistory';
import classNames from 'classnames';
import WarningTriangle from 'components/svg/WarningTriangle';
import ModalNeedKyc from 'components/common/ModalNeedKyc';


const errorMessageMapper = (t, error) => {
    switch (error) {
        case WITHDRAW_RESULT.MissingOtp:
            return t('wallet:withdraw_prompt.input_otp_suggest');
        case WITHDRAW_RESULT.InvalidOtp:
            return t('wallet:errors.wrong_otp');
        case WITHDRAW_RESULT.NotEnoughBalance:
            return t('error:BALANCE_NOT_ENOUGH');
        case WITHDRAW_RESULT.UnsupportedAddress:
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
        case WITHDRAW_RESULT.Unknown:
        default:
            return t('error:UNKNOWN_ERROR');
    }
};

// Other error show modal
const errorShowOnlyMessage = [WITHDRAW_RESULT.MissingOtp, WITHDRAW_RESULT.InvalidOtp];

const PHASE_CONFIRM = {
    INFO: 1,
    OTP: 2,
    RESULT: 3
};

const ModalConfirm = ({
    otpModes = [],
    selectedAsset,
    selectedNetwork,
    open,
    address,
    memo,
    amount,
    assetDigit,
    assetCode,
    onConfirmWithDraw,
    currentTheme,
    closeModal
}) => {
    const [phase, setPhase] = useState(PHASE_CONFIRM.INFO);
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState({
        email: '',
        tfa: ''
    });
    const [withdrawResult, setWithdrawResult] = useState(null);

    const onClose = () => {
        closeModal();
        setOtp({
            email: '',
            otp: ''
        });
        setWithdrawResult(null);
        setPhase(PHASE_CONFIRM.INFO);
    };

    const { t } = useTranslation();

    const postData = async () => {
        setLoading(true);
        const result = await withdrawHelper(selectedAsset?.assetId, amount, selectedNetwork?.network, address, memo, otp);
        setLoading(false);
        return result;
    };

    const onConfirmInfo = () => postData()
        .then(() => {
            setPhase(PHASE_CONFIRM.OTP);
        });

    const onConfirmOTP = async () => {
        const result = await postData();
        if (result.status === 'ok') {
            setWithdrawResult(result.data);
            if (!errorShowOnlyMessage.includes(result.data)) {
                setPhase(PHASE_CONFIRM.RESULT);
            }
        }
    };

    return <ModalV2
        isVisible={open}
        className='!max-w-[488px]'
        onBackdropCb={onClose}
    >
        { // CONFIRM PHASE
            phase === PHASE_CONFIRM.INFO && <>
                <div className='text-center mb-4'>
                    <p className='text-xl font-semibold'>{t('wallet:withdraw_confirmation')}</p>
                </div>
                <div className='space-y-2'>
                    {[{
                        title: t('common:withdraw'),
                        value: assetCode
                    }, {
                        title: t('wallet:receive_address'),
                        value: shortHashAddress(address, 8, 8)
                    }, {
                        title: 'MEMO',
                        value: shortHashAddress(memo, 8, 8)
                    }, {
                        title: t('common:amount'),
                        value: `${formatWallet(amount, assetDigit)} ${assetCode}`
                    }, {
                        title: t('common:fee'),
                        value: `${formatWallet(selectedNetwork?.withdraFee, assetDigit)} ${assetCode}`
                    }, {
                        title: t('wallet:will_receive'),
                        value: `${formatWallet(amount - selectedNetwork?.withdraFee, assetDigit)} ${assetCode}`
                    }, {
                        title: t('wallet:network'),
                        value: selectedNetwork?.name
                    }].map((item, index) => {
                        return <div key={index}>
                            <span className='text-sm text-txtSecondary dark:text-txtSecondary-dark'>{item.title}</span>
                            <span className='float-right font-semibold'>{item.value || '--'}</span>
                        </div>;
                    })}

                    {!memo && <div className='!mt-6 text-xs text-red'>{t('wallet:notes.memo_wdl_tips')}</div>}
                </div>
                <div className='grid grid-cols-2 gap-4 mt-6'>
                    <ButtonV2 variants='none' onClick={onClose}>{t('common:cancel')}</ButtonV2>
                    <ButtonV2
                        loading={loading}
                        onClick={onConfirmInfo}
                    >{t('common:continue')}</ButtonV2>
                </div>
            </>}

        { // OTP PHASE
            phase === PHASE_CONFIRM.OTP && <div className='space-y-6'>
                <p className='text-xl font-semibold'>Xác minh 2FA</p>
                <div className={classNames('hidden', { '!block': otpModes.includes('email') })}>
                    <div className='font-medium'>{t('common:email_authentication')}</div>
                    <span
                        className='text-txtSecondary dark:text-txtSecondary'> {t('wallet:withdraw_prompt.email_description')}
                    </span>
                    <OtpWrapper isDark={currentTheme === THEME_MODE.DARK}>
                        <OtpInput
                            value={otp?.email}
                            onChange={(value) => setOtp({
                                ...otp,
                                'email': value
                            })}
                            numInputs={6}
                            placeholder='------'
                            isInputNum
                        />
                    </OtpWrapper>
                </div>
                <div className={classNames('hidden', { '!block': otpModes.includes('tfa') })}>
                    <div className='font-medium'>{t('common:tfa_authentication')}</div>
                    <div
                        className='text-txtSecondary dark:text-txtSecondary'>{t('wallet:withdraw_prompt.google_description')}</div>
                    <OtpWrapper isDark={currentTheme === THEME_MODE.DARK}>
                        <OtpInput
                            value={otp?.tfa}
                            onChange={(value) => setOtp({
                                ...otp,
                                'tfa': value
                            })}
                            numInputs={6}
                            placeholder='------'
                            isInputNum
                        />
                    </OtpWrapper>
                </div>
                <ErrorMessage
                    message={errorMessageMapper(t, withdrawResult?.data)}
                    show={errorShowOnlyMessage.includes(withdrawResult?.data)}
                />
                <ButtonV2
                    className='!mt-10'
                    onClick={onConfirmOTP}
                    loading={loading}
                >{t('common:confirm')}</ButtonV2>
            </div>}
        { // RESULT PHASE
            phase === PHASE_CONFIRM.RESULT && <div className='flex flex-col items-center text-center'>
                <WarningTriangle size={64} />
                <p className='text-2xl mt-8 mb-4 font-semibold'>{t('wallet:withdraw_failed_title')}</p>
                <span
                    className='text-txtSecondary dark:text-txtSecondary-dark'>{errorMessageMapper(t, withdrawResult?.data)}</span>
            </div>}
    </ModalV2>;
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

const ExchangeWithdraw = () => {
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
    const router = useRouter();
    const focused = useWindowFocus();

    const selectedAsset = useMemo(() => find(paymentConfigs, { assetCode: router?.query?.asset }), [paymentConfigs, router.query]);
    const assetBalance = useMemo(() => walletAssets[selectedAsset?.assetId], [walletAssets, selectedAsset]);
    const assetConfig = useMemo(() => find(assetConfigs, { id: selectedAsset?.assetId }), [assetConfigs.selectedAsset]);

    const otpModes = useMemo(() => {
        const modes = [];
        if (auth?.email) modes.push('email');
        if (auth?.isTfaEnabled) modes.push('tfa');
        return modes;
    }, [auth]);

    const informationData = useMemo(() => {
        const available = assetBalance?.value - assetBalance?.locked_value;
        const min = Math.max(state.selectedNetwork?.withdrawFee, state.selectedNetwork?.withdrawMin);
        const max = Math.min(+state.selectedNetwork?.withdrawMax, available);
        const fee = state.selectedNetwork?.withdrawFee;
        return {
            min,
            max,
            fee,
            available
        };
    }, [state.selectedNetwork, state.amount, assetBalance]);

    const amountErrorMessage = useMemo(() => {
        switch (state.validator?.amount) {
            case AMOUNT.LESS_THAN_MIN:
                return t('wallet:errors.invalid_min_amount', {
                    value: formatWallet(Math.max(state.selectedNetwork?.withrawFee, state.selectedNetwork?.withdrawMin), assetConfig?.assetDigit),
                    asset: state.selectedNetwork?.coin
                });
            case AMOUNT.OVER_THAN_MAX:
                return t('wallet:errors.invalid_max_amount', {
                    value: formatWallet(state.selectedNetwork?.withdrawMax?.value, assetConfig?.assetDigit),
                    asset: state.selectedNetwork?.coin
                });
            case AMOUNT.OVER_BALANCE:
                return t('wallet:errors.invalid_insufficient_balance');
            case AMOUNT.OVER_DECIMAL_SCALE:
                return t('wallet:errors.decimal_scale_limit', { value: countDecimals(eToNumber(state.selectedNetwork?.withdrawIntegerMultiple)) });
            default:
                return '';
        }
    }, [state.selectedNetwork, state.validator, assetConfig]);

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
        if (defaultNetwork) {
            setState({ selectedNetwork: defaultNetwork });
        }
    }, [selectedAsset]);

    useEffect(() => {
        setState({
            validator: withdrawValidator(selectedAsset?.assetCode, +state.amount, countDecimals(+state.selectedNetwork?.withdrawIntegerMultiple), state.address, state.selectedNetwork?.addressRegex, state.memo, state.selectedNetwork?.memoRegex, state.selectedNetwork?.network, state.selectedNetwork?.tokenType, state.selectedNetwork?.withdrawFee >= state.selectedNetwork?.withdrawMin ? state.selectedNetwork?.withdrawFee : state.selectedNetwork?.withdrawMin, state.selectedNetwork?.withdrawMax?.value, assetBalance?.value - assetBalance?.locked_value, state.selectedNetwork?.withdrawEnable)
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

    // Handle check KYC:
    const isOpenModalKyc = useMemo(() => {
        return auth?.kyc_status !== 2
    }, [auth])

    return (<MaldivesLayout>
        <Background isDark={currentTheme === THEME_MODE.DARK}>
            <div className='mal-container px-4'>
                <div className='flex items-center justify-between mb-10'>
                    <span className='font-semibold text-[2rem] leading-[3rem]'>{t('common:withdraw')}</span>
                    <div
                        className='flex items-center font-semibold text-teal cursor-pointer'
                        onClick={() => {
                            router.push(PATHS.WALLET.EXCHANGE.DEPOSIT + '?asset=' + selectedAsset?.assetCode);
                        }}
                    >
                        <span className='mr-2'>{t('wallet:deposit_crypto')}</span>
                        <ChevronRight size={16} color={colors.teal} />
                    </div>
                </div>
                <div
                    className={classNames('w-full mx-auto pt-8 p-6 rounded-3xl w-[453px] space-y-4 bg-white nami-light-shadow', 'dark:border dark:border-divider-dark dark:bg-dark-dark dark:shadow-none')}>
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

                    <AddressInput
                        t={t}
                        value={state.address}
                        onChange={(address) => setState({ address })}
                        isValid={state.validator?.address}
                    />

                    <NetworkInput
                        t={t}
                        networkList={selectedAsset?.networkList}
                        selected={state.selectedNetwork}
                        onChange={(network) => setState({ selectedNetwork: network })}
                        currentTheme={currentTheme}
                    />

                    {state?.selectedNetwork?.memoRegex && <MemoInput
                        t={t}
                        value={state.memo}
                        onChange={(memo) => setState({ memo })}
                        errorMessage={state.validator.memo ? '' : t('wallet:errors.invalid_memo')}
                    />}

                    <Information
                        className='!mt-6'
                        assetCode={selectedAsset?.assetCode}
                        min={formatWallet(informationData.min, assetConfig?.assetDigit)}
                        max={formatWallet(informationData.max, assetConfig?.assetDigit)}
                        fee={formatWallet(informationData.fee, assetConfig?.assetDigit)}
                        receive={formatWallet(+state.amount - state.selectedNetwork?.withdrawFee, assetConfig?.assetDigit)}
                    />

                    <ButtonV2
                        className='!mt-10'
                        disabled={!state.validator?.allPass}
                        onClick={() => state.validator?.allPass && setState({ openWithdrawConfirm: true })}
                    >{t('common:withdraw')}</ButtonV2>
                </div>
                <ModalConfirm
                    otpModes={otpModes}
                    selectedAsset={selectedAsset}
                    selectedNetwork={state.selectedNetwork}
                    open={state.openWithdrawConfirm}
                    closeModal={() => setState({ openWithdrawConfirm: false })}
                    address={state.address}
                    memo={state.memo}
                    amount={state.amount}
                    assetDigit={assetConfig?.assetDigit}
                    assetCode={assetConfig?.assetCode}
                    currentTheme={currentTheme}
                />
                <div className='mb-32'>
                    <div className='text-2xl font-semibold mb-6 mt-20'>{t('wallet:withdraw_history')}</div>
                    <WithdrawHistory />
                </div>
            </div>
        </Background>
        <ModalNeedKyc isOpenModalKyc={isOpenModalKyc} />
    </MaldivesLayout>);
};

const OtpWrapper = styled.div.attrs({ className: 'mt-4' })`
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
                color: ${colors.darkBlue};
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

const IGNORE_TOKEN = ['XBT_PENDING', 'TURN_CHRISTMAS_2017_FREE', 'USDT_BINANCE_FUTURES', 'SPIN_SPONSOR', 'SPIN_BONUS', 'SPIN_CONQUEST', 'TURN_CHRISTMAS_2017', 'SPIN_CLONE'];

const AMOUNT = {
    LESS_THAN_MIN: 0,
    OVER_THAN_MAX: 1,
    OVER_BALANCE: 2,
    OVER_DECIMAL_SCALE: 3,
    OK: 'ok'
};

const Background = styled.div.attrs({ className: 'w-full h-full pt-20' })`
    background-color: ${({ isDark }) => isDark ? colors.dark.dark : colors.gray['13']};
`;

function withdrawValidator(asset, amount, decimalLimit, address, addressRegex, memo = undefined, memoRegex, network, networkType, min, max, available, isAllow) {
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

export default ExchangeWithdraw;
