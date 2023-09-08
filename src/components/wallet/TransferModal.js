import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dwLinkBuilder, formatNumber, formatWallet, getLoginUrl, getS3Url, setTransferModal } from 'redux/actions/utils';
import { ApiStatus, WalletType } from 'redux/actions/const';
import { useTranslation } from 'next-i18next';
import { API_FUTURES_CAMPAIGN_TRANSFER_STATUS, POST_WALLET_TRANSFER } from 'redux/actions/apis';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { getUserFuturesBalance, getUserPartnersBalance, getWallet } from 'redux/actions/user';
import { orderBy } from 'lodash';

import axios from 'axios';
import useOutsideClick from 'hooks/useOutsideClick';
import AssetLogo from 'components/wallet/AssetLogo';
import { useRouter } from 'next/router';
import isNil from 'lodash/isNil';
import ModalV2 from 'components/common/V2/ModalV2';
import {
    AddCircleColorIcon,
    ArrowDropDownIcon,
    ArrowForwardIcon,
    CheckCircleIcon,
    FutureInsurance,
    NAOIconDisable,
    PartnersIcon,
    SyncAltIcon
} from 'components/svg/SvgIcon';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import SvgWalletFutures from 'components/svg/SvgWalletFutures';
import SvgWalletExchange from 'components/svg/SvgWalletExchange';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';
import Notice from 'components/svg/Notice';
import { TYPE_DW } from 'components/screens/WithdrawDeposit/constants';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import classNames from 'classnames';
import TradingInputV2 from 'components/trade/TradingInputV2';
import Image from 'next/image';

const DEFAULT_STATE = {
    fromWallet: WalletType.SPOT,
    toWallet: WalletType.FUTURES,
    asset: 'VNDC'
};

const ALLOWED_WALLET_FROM = {
    SPOT: WalletType.SPOT,
    FUTURES: WalletType.FUTURES,
    NAO_FUTURES: WalletType.NAO_FUTURES,
    INSURANCE: WalletType.INSURANCE,
    BROKER: WalletType.BROKER
};

const ALLOWED_WALLET_TO = {
    SPOT: WalletType.SPOT,
    FUTURES: WalletType.FUTURES,
    NAO_FUTURES: WalletType.NAO_FUTURES,
    INSURANCE: WalletType.INSURANCE
};

const ALLOWED_INSURANCE_WALLET_TRANSFER = {
    SPOT: WalletType.SPOT
};

const TransferWalletResult = {
    INVALID_AMOUNT: 'INVALID_AMOUNT',
    INVALID_WALLET_TYPE: 'INVALID_WALLET_TYPE',
    INVALID_CURRENCY: 'INVALID_CURRENCY',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

export const WalletTypeV1 = {
    SPOT: 0,
    MARGIN: 1,
    FUTURES: 2,
    P2P: 3,
    POOL: 4,
    PARTNERS: 8,
    NAO_FUTURES: 9,
    INSURANCE: 10
};

export const MinTransferFromBroker = {
    NAMI: 500,
    VNDC: 100000,
    VNST: 100000,
    USDT: 5,
    NAO: 100
};

const ALLOWED_ASSET = ['VNDC', 'NAMI', 'USDT', 'NAC', 'NAO', 'VNST'];
const ALLOWED_ASSET_FUTURES = ['VNDC', 'NAMI', 'USDT', 'NAC', 'VNST'];
const ALLOWED_ASSET_INSURANCE = ['USDT'];

const INITIAL_STATE = {
    fromWallet: null,
    toWallet: null,
    asset: null,
    openList: {},
    amount: '',
    allWallets: null,
    focus: {},
    errors: {},
    isPlacingOrder: false,
    resultTransfer: null
    // ...
};

const getTitleWallet = (wallet, t, language) => {
    let _strTitleWallet = '';
    switch (wallet) {
        case WalletType.SPOT:
            _strTitleWallet = t('common:wallet', { wallet: 'Nami Spot' });
            break;
        case WalletType.FUTURES:
            _strTitleWallet = t('common:wallet', { wallet: 'Nami Futures' });
            break;
        case WalletType.BROKER:
            _strTitleWallet = t('common:wallet', { wallet: language === 'vi' ? 'hoa hồng Nami' : 'Nami Commission' });
            break;
        case WalletType.NAO_FUTURES:
            _strTitleWallet = t('common:wallet', { wallet: 'NAO Futures' });
            break;
        case WalletType.INSURANCE:
            _strTitleWallet = t('common:wallet', { wallet: 'Insurance' });
            break;
        case WalletType.PARTNERS:
            _strTitleWallet = t('common:partners');
            break;
        default:
            _strTitleWallet = wallet;
            break;
    }

    return _strTitleWallet;
    s;
};

const TransferModal = ({ isMobile, alert }) => {
    // Init State
    const router = useRouter();
    const [state, set] = useState(INITIAL_STATE);
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));

    const fromWalletRef = useRef();
    const toWalletRef = useRef();
    const assetListRef = useRef();

    const [currentTheme] = useDarkMode();
    const isDarkMode = currentTheme === THEME_MODE.DARK;

    // Check Kyc before redirect to page Deposit / Withdraw
    const handleKycRequest = (href) => {
        onClose();
        return router.push(href);
    };

    // Use Hooks
    const dispatch = useDispatch();
    const {
        t,
        i18n: { language }
    } = useTranslation(['common', 'wallet', 'error']);

    useOutsideClick(
        fromWalletRef,
        () =>
            state.openList?.fromWalletList &&
            setState({
                openList: {
                    ...state.openList,
                    fromWalletList: false
                }
            })
    );
    useOutsideClick(
        toWalletRef,
        () =>
            state.openList?.toWalletList &&
            setState({
                openList: {
                    ...state.openList,
                    toWalletList: false
                }
            })
    );
    useOutsideClick(
        assetListRef,
        () =>
            state.openList?.assetList &&
            setState({
                openList: {
                    ...state.openList,
                    assetList: false
                }
            })
    );
    // Rdx
    const { isVisible, fromWallet, toWallet, asset } = useSelector((state) => state.utils.transferModal) || {};
    const auth = useSelector((state) => state.auth?.user);
    const allExchangeWallet = useSelector((state) => state.wallet?.SPOT) || null;
    const allFuturesWallet = useSelector((state) => state.wallet?.FUTURES) || null;
    const allInsuranceWallet = useSelector((state) => state.wallet?.INSURANCE) || null;
    const allPartnersWallet = useSelector((state) => state.wallet?.PARTNERS) || null;
    const allNAOsWallet = useSelector((state) => state.wallet.NAO_FUTURES) || null;
    const assetConfig = useSelector((state) => state.utils.assetConfig) || null;

    const currentWallet = useMemo(() => {
        let _ = state.allWallets?.find((o) => o?.assetCode === state.asset);
        let available = _?.wallet?.value - _?.wallet?.locked_value;
        if (state?.maxValue > 0) {
            available = Math.min(available, state.maxValue);
        }

        return {
            ..._,
            available: isNaN(available) || available < 0 ? 0 : available
        };
    }, [state.asset, state.allWallets, state.maxValue, isVisible]);

    const assetDigit = useMemo(() => {
        return assetConfig.find((i) => i.assetCode === state.asset)?.assetDigit ?? 0;
    }, [state.asset, assetConfig]);

    const getWithdrawstatusInfo = async (asset) => {
        const WalletCurrency = {
            VNDC: 72,
            USDT: 22
        };
        const { data } = await axios.get(API_FUTURES_CAMPAIGN_TRANSFER_STATUS, { params: { currency: WalletCurrency[asset] } });
        if (data?.status === ApiStatus.SUCCESS) {
            const { status, value } = data.data;
            if (status === 'limited') {
                setState({
                    maxValue: value,
                    limitData: data.data
                });
            } else {
                setState({
                    maxValue: -1,
                    limitData: null
                });
            }
        }
    };

    useEffect(() => {
        if (state.fromWallet === WalletType.FUTURES && ['USDT', 'VNDC'].includes(state.asset)) {
            getWithdrawstatusInfo(state.asset);
        } else {
            setState({ maxValue: -1 });
        }
    }, [state.fromWallet, state.asset]);

    // Helper
    const onTransfer = async (currency, from_wallet, to_wallet, amount, utils) => {
        setState({ isPlacingOrder: true });
        try {
            const { data } = await axios.post(POST_WALLET_TRANSFER, {
                from_wallet,
                to_wallet,
                currency,
                amount
            });

            if (data.status === 'ok') {
                const { amount } = data.data;
                // const fromWallet = utils?.fromWallet;
                // const toWallet = utils?.toWallet;
                const message = t('wallet:transfer_success', {
                    amount: formatWallet(+amount, currentWallet?.assetDigit),
                    assetCode: utils?.assetName,
                    selectedSource: getTitleWallet(state.fromWallet, t, language),
                    selectedDestination: getTitleWallet(state.toWallet, t, language)
                });

                setState({ message });
                dispatch(getWallet());
                dispatch(getUserFuturesBalance());
                dispatch(getUserPartnersBalance());
                onOpenAlertResultTransfer({
                    msg: message,
                    type: 'success',
                    title: t('common:success'),
                    duration: 1500
                });
            } else {
                // Process error
                let message = 'Error occur, please try again';
                switch (data.status) {
                    case TransferWalletResult.INVALID_WALLET_TYPE: {
                        message = t('error:INVALID_USER');
                        break;
                    }
                    case TransferWalletResult.INVALID_AMOUNT: {
                        message = t('wallet:errors.invalid_amount');
                        break;
                    }
                    case TransferWalletResult.INVALID_CURRENCY: {
                        message = t('error:ASSET_NOT_SUPPORT', { ['function']: language === LANGUAGE_TAG.VI ? `để Chuyển Ví` : `for Transfer` });
                        break;
                    }
                }
                onOpenAlertResultTransfer({
                    msg: message,
                    type: 'warning',
                    title: t('common:failure')
                });
            }
        } catch (e) {
            console.error('Swap error: ', e);
        } finally {
            setState({
                isPlacingOrder: false,
                amount: ''
            });
        }
    };

    const onClose = () => {
        dispatch(
            setTransferModal({
                isVisible: false,
                fromWallet: null,
                toWallet: null,
                asset: null
            })
        );
        setState({
            openList: {},
            amount: ''
        });
    };

    const isFromWalletSwitchable = Boolean(ALLOWED_WALLET_TO?.[state.fromWallet]);

    const onSetWallet = (targetWallet, walletType) => {
        let otherWallet = targetWallet === 'fromWallet' ? 'toWallet' : 'fromWallet';

        if (state[targetWallet])
            if (state?.[otherWallet] === walletType) {
                // thực hiện hoán đổi fromWallet và toWallet nếu như targetWallet === otherWallet
                // If fromWallet not able to switch
                // toWallet will be the first wallet in the allow_wallet_to list
                if (!isFromWalletSwitchable) {
                    setState({
                        fromWallet: state.toWallet,
                        toWallet: Object.values(ALLOWED_WALLET_TO).find((allowWallet) => allowWallet !== state.toWallet)
                    });
                    return;
                }
                revertWallet();
                return;
            }

        setState({
            [targetWallet]: walletType,
            openList: {}
        });
    };

    const revertWallet = () => {
        if (!isFromWalletSwitchable) return;
        if (state.fromWallet && state.toWallet) {
            const _newState = {
                fromWallet: state.toWallet,
                toWallet: state.fromWallet
            };
            setState({
                ..._newState
            });
        }
    };

    const onSetMax = () => {
        const format = formatNumber(currentWallet?.available, assetDigit, 0, true).replace(/,/g, '');
        setState({ amount: format });
        return null;
    };

    // render wallet type
    const renderWalletWithType = useCallback(
        ({ side, isOpenList, walletType, isDisable, isDropdown = true, dropList }) => {
            let iconMode = 'normal';
            if (isDisable) {
                iconMode = isDarkMode ? 'disabled_dm' : 'disabled_lm';
            }

            const WALLET = {
                [WalletType.SPOT]: { icon: <SvgWalletExchange size={24} mode={iconMode} />, type: t('wallet:spot_short') },
                [WalletType.FUTURES]: { icon: <SvgWalletFutures size={24} mode={iconMode} />, type: t('wallet:nami_futures_short') },
                [WalletType.BROKER]: { icon: <PartnersIcon size={24} mode={iconMode} />, type: t('wallet:commission') },
                [WalletType.NAO_FUTURES]: {
                    icon: isDisable ? <NAOIconDisable size={24} mode={iconMode} /> : <Image width={24} height={24} src={getS3Url('/images/nao/ic_nao.png')} />,
                    type: 'NAO Futures'
                },
                [WalletType.INSURANCE]: {
                    icon: <FutureInsurance mode={iconMode} size={24} />,
                    type: 'Insurance'
                }
            };

            const renderWallet = () => {
                if (!WALLET?.[walletType]) return WALLET[WalletType.SPOT];
                return WALLET[walletType];
            };

            return (
                <div className="flex w-full space-x-3 items-center ">
                    <div className="flex items-center ">{renderWallet().icon}</div>
                    {side && <div className="text-sm md:text-base w-10 ">{side}</div>}

                    <div className="relative flex-grow text-sm md:text-base font-semibold flex items-center">
                        <span className={`${isDisable ? 'text-txtDisabled dark:text-txtDisabled-dark' : ''}`}>{renderWallet().type}</span>

                        {isDropdown && (
                            <span
                                className={classNames('ml-1 text-txtSecondary dark:text-txtSecondary-dark transition-transform duration-50', {
                                    'rotate-180': isOpenList
                                })}
                            >
                                <ArrowDropDownIcon color="currentColor" size={16} />
                            </span>
                        )}
                        {dropList?.()}
                    </div>
                </div>
            );
        },
        [t]
    );

    // Render Handler
    const renderWalletSelect = useCallback(() => {
        const isFromInsuranceWallet = state.fromWallet === WalletType.INSURANCE;
        const isToInsuranceWallet = state.toWallet === WalletType.INSURANCE;

        const isFromInsuranceAllowWallet = Boolean(ALLOWED_INSURANCE_WALLET_TRANSFER?.[state.fromWallet]);
        const isToInsuranceAllowWallet = Boolean(ALLOWED_INSURANCE_WALLET_TRANSFER?.[state.toWallet]);

        const allowWalletTo = isFromInsuranceWallet ? ALLOWED_INSURANCE_WALLET_TRANSFER : ALLOWED_WALLET_TO;

        return (
            <div className="px-4 py-3 rounded-md bg-dark-12 dark:bg-bgBtnV2-tonal_dark mt-6 ">
                <div
                    className="relative flex items-center w-full cursor-pointer select-none  rounded-xl"
                    ref={fromWalletRef}
                    onClick={() => setState({ openList: { fromWalletList: !state.openList?.fromWalletList } })}
                >
                    {renderWalletWithType({
                        side: t('common:from'),
                        isOpenList: state.openList?.fromWalletList,
                        walletType: state.fromWallet,
                        dropList: () =>
                            state.openList?.fromWalletList && (
                                <div className="shadow-card_light space-y-3 absolute z-20 mt-1 rounded-xl py-4 left-0 top-full w-full bg-bgPrimary dark:bg-dark-4 overflow-hidden gap-y-3">
                                    {Object.keys(ALLOWED_WALLET_FROM).map((walletType) => {
                                        // disable
                                        const isDisable =
                                            (isToInsuranceWallet && !ALLOWED_INSURANCE_WALLET_TRANSFER?.[walletType]) ||
                                            (!isToInsuranceAllowWallet && walletType === WalletType.INSURANCE);
                                        return (
                                            <div
                                                key={`wallet_type_from__${walletType}`}
                                                className={classNames('flex items-center justify-between text-sm py-3 px-4 sm:py-2.5 ', {
                                                    ' text-txtDisabled dark:text-txtDisabled-dark  ': isDisable,
                                                    'hover:bg-hover-1 dark:hover:bg-hover-dark cursor-pointer': !isDisable
                                                })}
                                                onClick={() => !isDisable && onSetWallet('fromWallet', walletType)}
                                            >
                                                {renderWalletWithType({ isDisable, walletType: ALLOWED_WALLET_FROM[walletType], isDropdown: false })}
                                                {ALLOWED_WALLET_FROM[walletType] === state.fromWallet && (
                                                    <CheckCircleIcon
                                                        size={16}
                                                        color={currentTheme === THEME_MODE.DARK ? '#E2E8F0' : '#1E1E1E'}
                                                        checkColor={currentTheme === THEME_MODE.DARK ? '#1E1E1E' : '#E2E8F0'}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )
                    })}
                </div>
                <div className="flex justify-between items-center w-full my-3">
                    <div className="text-txtSecondary dark:text-txtSecondary-dark rotate-90">
                        <ArrowForwardIcon color="currentColor" size={16} />
                    </div>
                    <button
                        disabled={!isFromWalletSwitchable}
                        className={classNames('rounded-full transition select-none text-green-3 dark:text-teal', {
                            'cursor-not-allowed opacity-60': !isFromWalletSwitchable,
                            'hover:opacity-75 cursor-pointer': isFromWalletSwitchable
                        })}
                        onClick={revertWallet}
                    >
                        <SyncAltIcon size={24} color="currentColor" />
                    </button>
                </div>

                <div
                    className="relative w-full cursor-pointer select-none "
                    ref={toWalletRef}
                    onClick={() => setState({ openList: { toWalletList: !state.openList?.toWalletList } })}
                >
                    {renderWalletWithType({
                        side: t('common:to'),
                        isOpenList: state.openList?.toWalletList,
                        walletType: state.toWallet,
                        dropList: () =>
                            state.openList?.toWalletList && (
                                <div className="shadow-card_light space-y-3 absolute py-4 z-20 mt-1 rounded-xl left-0 top-full w-full bg-bgPrimary dark:bg-[#141921] overflow-hidden gap-y-3">
                                    {Object.keys(allowWalletTo)
                                        .filter((wallet) => {
                                            if (!isFromInsuranceAllowWallet) {
                                                return wallet !== WalletType.INSURANCE && wallet !== state.fromWallet;
                                            }
                                            return wallet !== state.fromWallet;
                                        })
                                        .map((walletType) => {
                                            return (
                                                <div
                                                    key={`wallet_type_to__${walletType}`}
                                                    className="flex items-center justify-between font-normal text-sm hover:bg-hover-1 dark:hover:bg-hover-dark py-3 px-4 sm:py-2.5 cursor-pointer"
                                                    onClick={() => onSetWallet('toWallet', walletType)}
                                                >
                                                    {renderWalletWithType({ walletType: ALLOWED_WALLET_TO[walletType], isDropdown: false })}
                                                    {ALLOWED_WALLET_TO[walletType] === state.toWallet && (
                                                        <CheckCircleIcon
                                                            size={16}
                                                            color={currentTheme === THEME_MODE.DARK ? '#E2E8F0' : '#1E1E1E'}
                                                            checkColor={currentTheme === THEME_MODE.DARK ? '#1E1E1E' : '#E2E8F0'}
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}
                                </div>
                            )
                    })}
                </div>
            </div>
        );
    }, [state?.fromWallet, state?.toWallet, state.openList]);

    const renderAssetSelect = useCallback(() => {
        return (
            <div
                ref={assetListRef}
                className="rounded-md px-4 py-3 bg-dark-12 dark:bg-bgBtnV2-tonal_dark relative flex justify-between items-center cursor-pointer select-none w-full"
                onClick={() => {
                    setState({ openList: { assetList: !state.openList?.assetList } });
                }}
            >
                <div className="flex items-center">
                    <AssetLogo assetCode={state.asset} size={24} />
                    <div className="ml-2 text-base">{state.asset}</div>
                </div>
                <div className={`text-txtSecondary dark:text-txtSecondary-dark transition-transform duration-50 ${state.openList?.assetList && 'rotate-180'}`}>
                    <ArrowDropDownIcon color="currentColor" size={16} />
                </div>
                {renderAssetList()}
            </div>
        );
    }, [state.asset, state.openList]);

    const formatAvl = (value, decimal) => {
        if (+value < 0 || Math.abs(+value) < 1e-8 || isNil(value) || !value) return '0';
        return formatNumber(value, decimal, 0, true);
    };

    const renderAssetList = useCallback(() => {
        if (!state.openList?.assetList) return null;

        return (
            <div className="absolute right-0 top-full mt-2 z-20 py-4 rounded-lg border border-divider dark:border-divider-dark  w-full overflow-hidden bg-bgPrimary dark:bg-bgContainer-dark font-normal text-base ">
                {state.allWallets?.map((wallet, index) => {
                    const available = wallet?.wallet?.value - wallet?.wallet?.locked_value;
                    const _assetDigit = assetConfig.find((i) => i.assetCode === wallet?.assetCode)?.assetDigit ?? 0;

                    return (
                        <div
                            key={`transfer_asset__list_${wallet?.assetCode}_${state.asset}`}
                            className={classNames(
                                'px-4 py-3 flex items-center justify-between cursor-pointer first:mt-0 mt-3 hover:bg-hover-1 dark:hover:bg-hover-dark',
                                { 'bg-hover-1 dark:bg-hover-dark': state.asset === wallet?.assetCode }
                            )}
                            onClick={() => {
                                if (state.asset === wallet?.assetCode) return;
                                setState({
                                    asset: wallet?.assetCode,
                                    openList: {}
                                });
                            }}
                        >
                            <div className="flex justify-center">
                                <AssetLogo assetCode={wallet?.assetCode} size={24} />
                                <span className="ml-2">{wallet?.assetCode}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-txtSecondary dark:text-txtSecondary-dark">{formatAvl(available, _assetDigit)}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }, [state.allWallets, state.openList, state.asset, assetConfig]);

    const renderAvailableWallet = useCallback(() => {
        const available = currentWallet?.available;

        return formatAvl(available, assetDigit);
    }, [state.asset, currentWallet, assetDigit]);

    const renderTransferButton = useCallback(() => {
        const isErrors = !Object.values(state.errors)?.findIndex((item) => item?.length);
        const isAmountEmpty = !+state.amount;
        const isInsufficient = currentWallet?.available < +state.amount;
        if (!auth) {
            return (
                <a
                    href={getLoginUrl('sso')}
                    className="mt-8 flex whitespace-nowrap items-center justify-center rounded-md font-semibold text-[14px] leading-[18px] md:text-base w-full py-3 px-6 bg-green-3 hover:bg-green-4 dark:bg-green-2 dark:hover:bg-green-4 text-white hover:text-white"
                >
                    {t('common:sign_in')}
                </a>
            );
        }

        const isInsuranceWalletSelected = [state.fromWallet, state.toWallet].includes(WalletType.INSURANCE);
        const isSpotWalletSelected = [state.fromWallet, state.toWallet].includes(WalletType.SPOT);
        let shouldDisable = (isInsuranceWalletSelected && !isSpotWalletSelected) || isErrors || isAmountEmpty || isInsufficient || state.isPlacingOrder;

        return (
            <ButtonV2
                loading={state.isPlacingOrder}
                disabled={shouldDisable}
                onClick={() =>
                    !shouldDisable &&
                    !state.isPlacingOrder &&
                    onTransfer(currentWallet?.id, convertToWalletV1Type(state.fromWallet), convertToWalletV1Type(state.toWallet), +state.amount, {
                        assetName: state.asset
                    })
                }
                className="mt-10"
            >
                {t('common:transfer')}
            </ButtonV2>
        );
    }, [state.errors, state.amount, state.fromWallet, state.toWallet, state.isPlacingOrder, state.asset, currentWallet, auth]);

    const renderNotice = useCallback(() => {
        const data = state?.limitData;
        if (state?.limitData?.status === 'limited') {
            return (
                <div className="mt-4 p-4 rounded bg-gray-10 dark:bg-bgContainer-dark">
                    <div className="flex items-center text-txtPrimary dark:text-txtPrimary-dark font-semibold gap-2">
                        <div className="text-txtSecondary dark:text-txtSecondary-dark">
                            <Notice color="currentColor" />
                        </div>

                        {t('wallet:transfer_limit:notice')}
                    </div>
                    <div className="text-txtSecondary dark:text-txtSecondary-dark">
                        {t('wallet:transfer_limit:description', {
                            volume: data?.volume_threshold,
                            asset: state.asset,
                            campaign: data?.promotion_description?.[language || 'en']
                        })}
                    </div>
                    <div className="mt-6 text-txtPrimary dark:text-txtPrimary-dark">
                        {t('wallet:transfer_limit:volume', {
                            volume: data?.volume,
                            asset: state.asset,
                            campaign: data?.promotion_description?.[language || 'en']
                        })}
                    </div>
                </div>
            );
        }

        return null;
    }, [auth, state.fromWallet, state.toWallet, state.asset, state.limitData]);

    const validator = useMemo(() => {
        let error = null;

        for (const key of Object.keys(state.errors)) {
            if (state?.errors?.[key]) {
                error = state.errors[key];
                break;
            }
        }
        return { isValid: !Boolean(error), msg: error, isError: Boolean(error) };
    }, [state.errors]);

    useEffect(() => {
        if (!Boolean(isVisible)) {
            dispatch(
                setTransferModal({
                    isVisible: false,
                    fromWallet: null,
                    toWallet: null,
                    asset: null
                })
            );
        }
    }, [isVisible]);

    useEffect(() => {
        fromWallet ? setState({ fromWallet }) : setState({ fromWallet: DEFAULT_STATE.fromWallet });
        toWallet ? setState({ toWallet }) : setState({ toWallet: DEFAULT_STATE.toWallet });
    }, [fromWallet, toWallet]);

    useEffect(() => {
        if (asset) {
            setState({ asset });
        }
    }, [asset]);

    useEffect(() => {
        if (allExchangeWallet && allExchangeWallet && assetConfig) {
            let allWallets;

            const currentWalletMapping = {
                [ALLOWED_WALLET_FROM.SPOT]: allExchangeWallet,
                [ALLOWED_WALLET_FROM.FUTURES]: allFuturesWallet,
                [ALLOWED_WALLET_FROM.BROKER]: allPartnersWallet,
                [ALLOWED_WALLET_FROM.NAO_FUTURES]: allNAOsWallet,
                [ALLOWED_WALLET_FROM.INSURANCE]: allInsuranceWallet
            };

            const currentWallets = currentWalletMapping?.[state.fromWallet];

            const isFuturesWalletSelected = [state.fromWallet, state.toWallet].includes(WalletType.FUTURES);
            const isInsuranceWalletSelected = [state.fromWallet, state.toWallet].includes(WalletType.INSURANCE);

            const getAllowedAssets = () => {
                let allowAssets = ALLOWED_ASSET;
                if (isFuturesWalletSelected) allowAssets = ALLOWED_ASSET_FUTURES;
                if (isInsuranceWalletSelected) allowAssets = ALLOWED_ASSET_INSURANCE;
                return allowAssets;
            };

            const allowAssets = getAllowedAssets();

            allWallets = assetConfig
                .filter((asset) => {
                    return allowAssets.includes(asset?.assetCode);
                })
                ?.map((item) => ({
                    ...item,
                    wallet: currentWallets?.[item?.id]
                }));
            allWallets = orderBy(allWallets, (o) => o?.wallet?.value - o?.wallet?.locked_value, 'desc');

            // RESET asset to first allow asset list
            const selectAsset = !allowAssets.includes(state.asset) ? allowAssets[0] : state.asset;

            setState({ allWallets, asset: selectAsset });
        }
    }, [state.asset, state.fromWallet, state.toWallet, allFuturesWallet, allPartnersWallet, allExchangeWallet, allNAOsWallet, assetConfig]);

    useEffect(() => {
        const _errors = {};
        const minAmount = MinTransferFromBroker[state.asset];

        if (state.fromWallet === WalletType.BROKER && +minAmount > 0 && +state.amount < +minAmount) {
            _errors.minAmount = t('wallet:errors.minimum_amount', { min: `${formatNumber(minAmount)} ${state.asset}` });
        } else {
            _errors.minAmount = null;
        }

        if (currentWallet?.available >= 0 && +state.amount >= 0) {
            if (currentWallet?.available < +state.amount) {
                _errors.insufficient = t('wallet:errors.invalid_insufficient_balance');
            } else {
                _errors.insufficient = null;
            }
        } else {
            _errors.insufficient = null;
        }

        setState({
            errors: {
                ...state.errors,
                ..._errors
            }
        });
    }, [state.amount, currentWallet]);

    const renderAlertNotification = useCallback(() => {
        if (!state?.resultTransfer) return null;

        setTimeout(() => {
            onCloseAlertResultTransfer();
        }, state?.duration || 5000);

        return (
            <AlertModalV2
                isVisible={!!state.resultTransfer}
                onClose={onCloseAlertResultTransfer}
                type={state?.resultTransfer?.type}
                title={state?.resultTransfer?.title}
                message={state?.resultTransfer?.msg}
            />
        );
    }, [state.resultTransfer]);

    const onOpenAlertResultTransfer = ({ msg, type, title, duration }) => {
        set((prevState) => ({
            ...prevState,
            resultTransfer: {
                msg,
                type,
                title,
                duration
            }
        }));
    };

    const onCloseAlertResultTransfer = () => {
        if (state.resultTransfer) {
            set((prevState) => ({
                ...prevState,
                resultTransfer: null
            }));
        }
    };

    return (
        <ModalV2
            isVisible={!!isVisible}
            onBackdropCb={onClose}
            wrapClassName={'p-8 h-full bg-white dark:bg-dark text-base rounded-xl'}
            className="sm:!max-w-[488px] bg-bgPrimary dark:bg-bgPrimary-dark !overflow-visible"
            btnCloseclassName="!pt-0"
            noButton
        >
            <div className="flex items-center justify-between">
                <span className="font-semibold text-2xl">{t('common:transfer')}</span>
            </div>
            <div className="space-y-4 mb-8">
                {renderWalletSelect()}
                {renderAssetSelect()}
            </div>
            <div className="">
                <div className="flex items-center justify-between mb-2">
                    <div className="txtSecond-3">{t('common:amount')}</div>
                    <div className="txtSecond-3 flex justify-center items-center gap-2">
                        <span>{t('common:available_balance')}: </span>
                        <div onClick={onSetMax} className="font-semibold text-txtPrimary dark:text-txtPrimary-dark">
                            {renderAvailableWallet()}
                        </div>
                        <AddCircleColorIcon
                            className="cursor-pointer text-green-3 dark:text-teal"
                            onClick={() => handleKycRequest(dwLinkBuilder(TYPE_DW.CRYPTO, SIDE.BUY))}
                            size={16}
                            color="currentColor"
                        />
                    </div>
                </div>

                <TradingInputV2
                    value={state.amount}
                    allowNegative={false}
                    thousandSeparator={true}
                    containerClassName="bg-dark-12 dark:bg-bgBtnV2-tonal_dark !px-4 !py-3"
                    inputClassName="!text-left !ml-0"
                    onValueChange={({ value }) => setState({ amount: value })}
                    errorTooltip={false}
                    decimalScale={assetDigit}
                    allowedDecimalSeparators={[',', '.']}
                    clearAble
                    validator={validator}
                    placeHolder={'Nhập số lượng tài sản'}
                    renderTail={
                        <ButtonV2 variants="text" onClick={onSetMax} className="uppercase font-semibold text-teal text-sm">
                            MAX
                        </ButtonV2>
                    }
                />
            </div>
            {/* {renderIssues()} */}
            {renderNotice()}
            {/* {renderHelperText()} */}
            {renderTransferButton()}
            {renderAlertNotification()}
        </ModalV2>
    );
};

const convertToWalletV1Type = (walletType) => {
    switch (walletType) {
        case WalletType.SPOT:
            return WalletTypeV1.SPOT;
        case WalletType.FUTURES:
            return WalletTypeV1.FUTURES;
        case WalletType.BROKER:
            return WalletTypeV1.PARTNERS;
        case WalletType.PARTNERS:
            return WalletTypeV1.PARTNERS;
        case WalletType.NAO_FUTURES:
            return WalletTypeV1.NAO_FUTURES;
        case WalletType.INSURANCE:
            return WalletTypeV1.INSURANCE;
        default:
            return null;
    }
};

export default TransferModal;
