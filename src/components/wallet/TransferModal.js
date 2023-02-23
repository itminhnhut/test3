import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatNumber, formatWallet, getLoginUrl, setTransferModal, walletLinkBuilder } from 'redux/actions/utils';
import { WalletType } from 'redux/actions/const';
import { useTranslation } from 'next-i18next';
import { POST_WALLET_TRANSFER } from 'redux/actions/apis';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { PulseLoader } from 'react-spinners';
import { getUserFuturesBalance, getUserPartnersBalance, getWallet } from 'redux/actions/user';
import { orderBy } from 'lodash';

import Axios from 'axios';
import useOutsideClick from 'hooks/useOutsideClick';
import NumberFormat from 'react-number-format';
import AssetLogo from 'components/wallet/AssetLogo';
import AssetName from 'components/wallet/AssetName';
import showNotification from 'utils/notificationService';
import colors from '../../styles/colors';
import { useRouter } from 'next/router';
import isNil from 'lodash/isNil';
import ModalV2 from 'components/common/V2/ModalV2';
import { AddCircleColorIcon, ArrowDropDownIcon, PartnersIcon, SyncAltIcon } from 'components/svg/SvgIcon';
import CheckSuccess from 'components/svg/CheckSuccess';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import SvgWalletFutures from 'components/svg/SvgWalletFutures';
import SvgWalletExchange from 'components/svg/SvgWalletExchange';
import { EXCHANGE_ACTION } from 'pages/wallet';

const DEFAULT_STATE = {
    fromWallet: WalletType.SPOT,
    toWallet: WalletType.FUTURES,
    asset: 'VNDC'
};

const ALLOWED_WALLET = {
    SPOT: WalletType.SPOT,
    FUTURES: WalletType.FUTURES,
    BROKER: WalletType.BROKER,
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
    POOL: 4
};

export const MinTransferFromBroker = {
    NAMI: 500,
    VNDC: 100000,
    USDT: 5
};

const ALLOWED_ASSET = ['VNDC', 'NAMI', 'NAC', 'USDT'];

const INITIAL_STATE = {
    fromWallet: null,
    toWallet: null,
    asset: null,
    openList: {},
    amount: '',
    allWallets: null,
    focus: {},
    errors: {},
    isPlacingOrder: false

    // ...
};

const TransferModal = ({
    isMobile,
    alert
}) => {
    // Init State
    const router = useRouter();
    const [state, set] = useState(INITIAL_STATE);
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));

    const fromWalletRef = useRef();
    const toWalletRef = useRef();
    const assetListRef = useRef();

    const [currentTheme] = useDarkMode();
    // Use Hooks
    const dispatch = useDispatch();
    const {
        t,
        i18n: { language }
    } = useTranslation(['common', 'wallet', 'error']);

    useOutsideClick(fromWalletRef, () =>   state.openList?.fromWalletList && setState({openList: { ...state.openList, fromWalletList: false }}));
    useOutsideClick(toWalletRef, () => state.openList?.toWalletList && setState({openList: { ...state.openList, toWalletList: false }}));
    useOutsideClick(assetListRef, () => state.openList?.assetList && setState({openList: { ...state.openList, assetList: false }}));
    const isVndcFutures = router.asPath.indexOf('VNDC') !== -1;
    // Rdx
    const {
        isVisible,
        fromWallet,
        toWallet,
        asset
    } = useSelector((state) => state.utils.transferModal) || {};
    const auth = useSelector((state) => state.auth?.user);
    const allExchangeWallet = useSelector((state) => state.wallet?.SPOT) || null;
    const allFuturesWallet = useSelector((state) => state.wallet?.FUTURES) || null;
    const assetConfig = useSelector((state) => state.utils.assetConfig) || null;

    const currentWallet = useMemo(() => {
        let _ = state.allWallets?.find((o) => o?.assetCode === state.asset);
        const available = _?.wallet?.value - _?.wallet?.locked_value;

        return {
            ..._,
            available
        };
    }, [state.asset, state.allWallets, isVisible]);

    const assetDigit = useMemo(() => {
        return assetConfig.find((i) => i.assetCode === state.asset)?.assetDigit ?? 0;
    }, [state.asset, assetConfig]);

    // Helper
    const onTransfer = async (currency, from_wallet, to_wallet, amount, utils) => {
        setState({ isPlacingOrder: true });
        try {
            const { data } = await Axios.post(POST_WALLET_TRANSFER, {
                from_wallet,
                to_wallet,
                currency,
                amount
            });

            if (data.status === 'ok') {
                const { amount } = data.data;
                const fromWallet = utils?.fromWallet;
                const toWallet = utils?.toWallet;
                const message = t('wallet:transfer_success', {
                    amount: formatWallet(+amount, currentWallet?.assetDigit),
                    assetCode: utils?.assetName,
                    selectedSource: fromWallet,
                    selectedDestination: toWallet
                });

                setState({ message });
                dispatch(getWallet());
                dispatch(getUserFuturesBalance());
                dispatch(getUserPartnersBalance());

                setTimeout(() => {
                    onClose();
                    if (isMobile && alert) {
                        alert.show('success', t('common:success'), message);
                    } else {
                        showNotification({
                            message,
                            title: t('common:success'),
                            type: 'success'
                        });
                    }
                }, 300);
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
                if (isMobile && alert) {
                    alert.show('error', t('common:failure'), message);
                } else {
                    showNotification({
                        message,
                        title: t('common:failure'),
                        type: 'failure'
                    });
                }
            }
        } catch (e) {
            console.error('Swap error: ', e);
        } finally {
            setState({ isPlacingOrder: false });
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

    const onFocus = () => setState({
        focus: { amount: true },
        openList: {}
    });

    const onBlur = () => setState({ focus: {} });

    const onSetWallet = (target, walletType) => {
        setState({
            [target]: walletType,
            openList: {}
        });
    };
    const revertWallet = () => {
        console.log('__ vao day', 111);
        if(state.fromWallet && state.toWallet){
            const _newState = {
                fromWallet: state.toWallet,
                toWallet: state.fromWallet
            }
            setState({
                ..._newState
            })
        }
    };


    const onSetMax = useMemo(
        () => () => {
            const format = formatNumber(currentWallet?.available, assetDigit, 0, true)
                .replace(/,/g, '');
            setState({ amount: format });
            return null;
        },
        [currentWallet, assetDigit]
    );

    const getWalletType = (walletType) => {
        switch (walletType) {
            case WalletType.SPOT:
                return <div className="flex justify-center items-center">
                    <SvgWalletExchange size={20}/>
                    <span className="mx-2">{t('wallet:spot_short')}</span>
                </div>;
            case WalletType.FUTURES:
                return <div className="flex justify-center items-center">

                    <SvgWalletFutures size={20}/>
                    <span className="mx-2">{t('wallet:futures_short')}</span>
                </div>;
            case WalletType.BROKER:
                return <div className="flex justify-center items-center">

                    <PartnersIcon size={20}/>
                    <span className="mx-2">{t('wallet:broker_short')}</span>
                </div>;
            default:
                return <div className="flex justify-center items-center">
                    <SvgWalletExchange size={20}/>
                    <span className="mx-2">{t('wallet:spot_short')}</span>
                </div>;
        }
    };

    // Render Handler
    const renderWalletSelect = useCallback(() => {
        return (
            <div className="mt-6 flex flex-col items-center justify-center sm:mt-8 sm:flex-row sm:items-center ">
                <div
                    className="relative w-full p-4 sm:w-1/2 sm:pr-3.5 cursor-pointer select-none border border-divider dark:border-divider-dark rounded-xl"
                    ref={fromWalletRef}
                    onClick={() => setState({ openList: { fromWalletList: !state.openList?.fromWalletList } })}
                >
                    <div
                        className="font-medium text-center text-base text-txtSecondary dark:text-txtSecondary-dark">{t('common:from')}</div>
                    <div
                        className={
                            'mt-2 sm:mt-3.5 text-sm font-semibold flex items-center justify-center border-divider dark:border-divider-dark rounded-xl'}
                    >
                        {getWalletType(state.fromWallet)}
                        <ArrowDropDownIcon size={16} className={
                            state.openList?.fromWalletList
                                ? 'text-txtSecondary text-txtSecondary-dark rotate-180'
                                : 'text-txtSecondary text-txtSecondary-dark'
                        }/>
                    </div>
                    {state.openList?.fromWalletList && (
                        <div
                            className="absolute z-20 mt-2 rounded-lg border border-divider dark:border-divider-dark left-0 top-full w-full bg-bgPrimary dark:bg-[#141921] overflow-hidden gap-y-3">
                            {Object.keys(ALLOWED_WALLET)
                                .map((walletType) => (
                                    <div
                                        key={`wallet_type_from__${walletType}`}
                                        className="flex items-center justify-between font-normal text-sm hover:bg-hover-1 dark:hover:bg-hover-dark py-3 px-4 sm:py-2.5 cursor-pointer"
                                        onClick={() => onSetWallet('fromWallet', walletType)}
                                    >
                                        {getWalletType(ALLOWED_WALLET[walletType])}
                                        {ALLOWED_WALLET[walletType] === state.fromWallet &&
                                            <CheckSuccess size={14}
                                                          color={currentTheme === THEME_MODE.DARK ? '#E2E8F0' : '#1E1E1E'}
                                                          checkColor={currentTheme === THEME_MODE.DARK ? '#1E1E1E' : '#E2E8F0'}/>}
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
                <div className="mx-2 p-2  rounded-full bg-bgSecondary dark:bg-[#1C232E] rotate-90 cursor-pointer" onClick={revertWallet}>
                    <SyncAltIcon size={20} />
                </div>

                <div
                    className="relative w-full p-4 sm:w-1/2 sm:pr-3.5 cursor-pointer select-none border border-divider dark:border-divider-dark rounded-xl"
                    ref={toWalletRef}
                    onClick={() => setState({ openList: { toWalletList: !state.openList?.toWalletList } })}
                >
                    <div
                        className="font-medium text-center text-base text-txtSecondary dark:text-txtSecondary-dark">{t('common:to')}</div>
                    <div
                        className={
                            'mt-2 sm:mt-3.5 text-sm font-semibold flex items-center justify-center border-divider dark:border-divider-dark rounded-xl'}
                    >
                        {getWalletType(state.toWallet)}
                        <ArrowDropDownIcon
                            size={16}
                            className={
                                state.openList?.toWalletList
                                    ? 'text-txtSecondary text-txtSecondary-dark rotate-180'
                                    : 'text-txtSecondary text-txtSecondary-dark'
                            }
                        />
                    </div>
                    {state.openList?.toWalletList && (
                        <div
                            className="absolute z-20 mt-2 rounded-lg border border-divider dark:border-divider-dark left-0 top-full w-full bg-bgPrimary dark:bg-[#141921] overflow-hidden gap-y-3">
                            {Object.keys(ALLOWED_WALLET)
                                .map((walletType) => (
                                    <div
                                        key={`wallet_type_to__${walletType}`}
                                        className="flex items-center justify-between font-normal text-sm hover:bg-hover-1 dark:hover:bg-hover-dark py-3 px-4 sm:py-2.5 cursor-pointer"
                                        onClick={() => onSetWallet('toWallet', walletType)}
                                    >
                                        {getWalletType(ALLOWED_WALLET[walletType])}
                                        {
                                            ALLOWED_WALLET[walletType] === state.toWallet &&
                                            <CheckSuccess size={14}
                                                          color={currentTheme === THEME_MODE.DARK ? '#E2E8F0' : '#1E1E1E'}
                                                          checkColor={currentTheme === THEME_MODE.DARK ? '#1E1E1E' : '#E2E8F0'}/>
                                        }
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }, [state?.fromWallet, state?.toWallet, state.openList]);

    const renderAssetSelect = useCallback(() => {
        return (
            <div
                ref={assetListRef}
                className="relative flex items-center cursor-pointer select-none"
                 onClick={() => {
                     setState({ openList: { assetList: !state.openList?.assetList } })
                 }}>
                <AssetLogo assetCode={state.asset} size={24}/>
                <div className="mx-2 font-bold text-sm">
                    {state.asset}
                </div>
                <ArrowDropDownIcon
                    size={16}
                    className={state.openList?.assetList ? 'text-txtSecondary text-txtSecondary-dark rotate-180' : 'text-txtSecondary text-txtSecondary-dark'}
                />
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
            <div className="absolute right-0 top-[30px] z-20 py-4 rounded-lg border border-divider dark:border-divider-dark  w-[320px] overflow-hidden bg-bgPrimary dark:bg-bgPrimary-dark">
                {state.allWallets?.map((wallet, index) => {
                    const available = wallet?.wallet?.value - wallet?.wallet?.locked_value;
                    const _assetDigit = assetConfig.find((i) => i.assetCode === wallet?.assetCode)?.assetDigit ?? 0;

                    return (
                        <div
                            key={`transfer_asset__list_${wallet?.assetCode}_${state.asset}`}
                            className={
                                `px-4 py-3 font-normal text-md flex items-center justify-between cursor-pointer
                                hover:bg-hover-1 dark:hover:bg-hover-dark 
                                ${state.asset === wallet?.assetCode ? 'bg-hover-1 dark:bg-hover-dark' : ''}`
                            }
                            onClick={() => state.asset !== wallet?.assetCode && setState({
                                asset: wallet?.assetCode,
                                openList: {}
                            })}
                        >
                            <div className="flex justify-center">
                                <AssetLogo assetCode={wallet?.assetCode} size={24}/>
                                <span className="ml-2">{wallet?.assetCode}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-txtSecondary dark:text-txtSecondary-dark">
                                    {formatAvl(available, _assetDigit)}
                                    {/* {available && available > 0 ? formatWallet(available, wallet?.assetDigit) : '0.0000'} */}
                                </span>

                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }, [state.allWallets, state.openList, state.asset, assetConfig]);

    const renderAmountInput = useCallback(() => {
        return (
            <NumberFormat
                thousandSeparator
                allowNegative={false}
                placeholder={Number(0)
                    .toPrecision(assetDigit + 1)}
                className="w-full text-left sm:text-[24px] font-semibold"
                value={state.amount}
                onValueChange={({ value }) => setState({ amount: value })}
                onFocus={onFocus}
                onBlur={onBlur}
                decimalScale={assetDigit}
            />
        );
    }, [state.amount, state.focus, state.asset, assetDigit]);

    const renderAvailableWallet = useCallback(() => {
        const available = currentWallet?.available;

        return formatAvl(available, assetDigit);
    }, [state.asset, currentWallet, assetDigit]);

    const renderTransferButton = useCallback(() => {
        const isErrors = !Object.values(state.errors)
            ?.findIndex((item) => item?.length);
        const isAmountEmpty = !(state.amount?.length && typeof +state.amount === 'number');
        const isInsufficient = currentWallet?.available < +state.amount;
        if (!auth) {
            return (
                <div className="cursor-pointer flex items-center justify-center h-full">
                    <div
                        className="w-full bg-dominant text-white font-medium text-center py-2.5 rounded-lg cursor-pointer hover:opacity-80"
                        onClick={() => window.open(getLoginUrl('sso', 'login'), '_self')}
                    >
                        {t('futures:order_table:login_to_continue')}
                    </div>
                </div>
            );
        }
        return (
            <div
                className={
                    isErrors || isAmountEmpty || isInsufficient
                        ? 'mt-10 py-3.5 font-bold text-center text-sm bg-gray-12 text-txtDisabled dark:bg-dark-2 dark:text-txtDisabled-dark cursor-not-allowed rounded-xl'
                        : 'mt-10 py-3.5 font-bold text-center text-sm bg-dominant text-white cursor-pointer rounded-xl hover:opacity-80'
                }
                onClick={() =>
                    !isErrors &&
                    !isAmountEmpty &&
                    !isInsufficient &&
                    !state.isPlacingOrder &&
                    onTransfer(currentWallet?.id, convertToWalletV1Type(state.fromWallet), convertToWalletV1Type(state.toWallet), +state.amount, {
                        fromWallet: getWalletType(state.fromWallet),
                        toWallet: getWalletType(state.toWallet),
                        assetName: state.asset
                    })
                }
            >
                {state.isPlacingOrder ? <PulseLoader color={colors.white} size={3}/> : t('common:transfer')}
            </div>
        );
    }, [state.errors, state.amount, state.fromWallet, state.toWallet, state.isPlacingOrder, state.asset, currentWallet, auth]);

    const renderIssues = useCallback(() => {
        const errorItems = [];
        Object.values(state.errors)
            ?.forEach((err) => {
                err && errorItems.push(<div className="text-red text-sm">{err}</div>);
            });

        let className = 'mt-3 max-h-0 transition-all ease-in duration-200 ';
        if (errorItems.length) {
            className += 'max-h-[34px] ';
        }

        if (errorItems.length === 1) {
            className += 'text-center';
        }

        return <div className={className}>{errorItems}</div>;
    }, [state.errors]);

    useEffect(() => {
        if (!!!isVisible) {
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
        asset ? setState({ asset }) : setState({ asset: DEFAULT_STATE.asset });
    }, [asset]);

    useEffect(() => {
        // if (state.fromWallet === state.toWallet) {
        //     setState({ toWallet: null });
        // }
    }, [state.fromWallet, state.toWallet]);

    useEffect(() => {
        if (allExchangeWallet && allExchangeWallet && assetConfig) {
            let allWallets;
            let currentWallets;

            if (state.fromWallet === ALLOWED_WALLET.SPOT) {
                currentWallets = allExchangeWallet;
            } else if (state.fromWallet === ALLOWED_WALLET.FUTURES) {
                currentWallets = allFuturesWallet;
            }

            allWallets = assetConfig
                .filter((asset) => ALLOWED_ASSET.includes(asset?.assetCode))
                ?.map((item) => ({
                    ...item,
                    wallet: currentWallets?.[item?.id]
                }));
            allWallets = orderBy(allWallets, (o) => o?.wallet?.value - o?.wallet?.locked_value, 'desc');
            setState({ allWallets });
        }
    }, [state.fromWallet, allFuturesWallet, allExchangeWallet, assetConfig]);

    useEffect(() => {
        const _errors = {fromWallet: null,  toWallet: null, differenceWallet: null}
        if(!state.fromWallet){
            _errors.fromWallet =  t('wallet:errors.transfer_source_wallet_issues')
        }
        if(!state.toWallet){
            _errors.toWallet =  t('wallet:errors.transfer_destination_wallet_issues')
        }
        if(state.fromWallet && state.toWallet && state.fromWallet === state.toWallet){
            _errors.differenceWallet =  t('wallet:errors.transfer_destination_wallet_issues')
        }

        setState({
            errors: {
                ...state.errors,
                ..._errors
            }
        })

    }, [state.fromWallet, state.toWallet]);


    useEffect(() => {
        const _errors = {};
        const minAmount = MinTransferFromBroker[state.asset];
        if (state.fromWallet === WalletType.BROKER && +minAmount > 0 && +state.amount < minAmount) {
            _errors.minAmount = t('wallet:errors.minimum_amount', { min: `${formatNumber(minAmount)} ${state.asset}` });
        } else {
            _errors.minAmount = null;
        }
        if (currentWallet?.available && state.amount) {
            if (currentWallet?.available < +state.amount) {
                _errors.insufficient = t('wallet:errors.invalid_insufficient_balance');

            } else {
                _errors.insufficient = null;
                setState({
                    errors: {
                        ...state.errors,
                        insufficient: null
                    }
                });
            }
        } else {
            _errors.insufficient = null;
        }
        setState({
            errors: {
                ...state.errors,
                ..._errors,
            }
        });
    }, [state.amount, currentWallet]);

    const handleKycRequest = (href) => {
        onClose();
        return router.push(href);
    };

    return (
        <ModalV2
            isVisible={!!isVisible}
            onBackdropCb={onClose}
            wrapClassName={'p-8 h-full bg-white dark:bg-dark text-base rounded-2xl'}
            className="!w-[488px] bg-bgPrimary dark:bg-bgPrimary-dark !overflow-visible"
            noButton
        >
            <div className="flex items-center justify-between">
                <span className="capitalize font-semibold text-2xl">{t('common:transfer')}</span>
            </div>
            {renderWalletSelect()}
            <div
                className={`mt-[50px] p-4 sm:py-3.5 sm:px-5 rounded-xl ${
                    state.focus?.amount
                        ? 'border border-dominant'
                        : 'border border-divider dark:border-divider-dark hover:!border-dominant'
                }
                `}
            >
                <div className="flex items-center justify-between">
                    <div className="text-sm text-txtSecondary dark:text-txtSecondary-dark">{t('common:amount')}</div>
                    <div
                        className="text-sm text-txtSecondary dark:text-txtSecondary-dark flex justify-center items-center gap-2">
                        <span>{t('common:available_balance')}: </span>
                        {renderAvailableWallet()}
                        <AddCircleColorIcon className="cursor-pointer"
                                            onClick={() => handleKycRequest(walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.DEPOSIT, { type: 'crypto' }))}/>
                    </div>
                </div>
                <div className="mt-6 flex items-center">
                    {renderAmountInput()}
                    <div
                        className="font-bold text-dominant text-sm cursor-pointer uppercase pr-3 mr-3 border-r border-divider dark:border-divider-dark"
                        onClick={onSetMax}>
                        {t('common:max')}
                    </div>
                    {renderAssetSelect()}

                </div>

            </div>
            {renderIssues()}
            {renderTransferButton()}
        </ModalV2>
    );
};

const convertToWalletV1Type = (walletType) => {
    switch (walletType) {
        case WalletType.SPOT:
            return WalletTypeV1.SPOT;
        case WalletType.FUTURES:
            return WalletTypeV1.FUTURES;
        default:
            return null;
    }
};

export default TransferModal;
