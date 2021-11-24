import { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { useSelector } from 'react-redux'
import { useDebounce } from 'react-use'
import { useRouter } from 'next/router'
import { ApiStatus, PublicSocketEvent, TokenConfigV1 as TokenConfig } from 'redux/actions/const'
import { API_GET_WALLET_CONFIG } from 'redux/actions/apis'
import { WALLET_SCREENS } from 'pages/wallet'
import { Check, Search, X } from 'react-feather'
import { find, get, isNumber } from 'lodash'
import { formatWallet, getAssetName, hashValidator, shortHashAddress } from 'redux/actions/utils'
import { withdrawHelper } from 'redux/actions/helper'
import { log } from 'utils'

import MaldivesLayout from 'components/common/layouts/MaldivesLayout'
import useOutsideClick from 'hooks/useOutsideClick'
import ScaleThinLoader from 'components/loader/ScaleThinLoader'
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'
import NumberFormat from 'react-number-format'
import ChevronDown from 'components/svg/ChevronDown'
import AssetLogo from 'components/wallet/AssetLogo'
import Skeletor from 'components/common/Skeletor'
import OtpInput from 'react-otp-input'
import MCard from 'components/common/MCard'
import Empty from 'components/common/Empty'
import Modal from 'components/common/Modal'
import Link from 'next/link'

import Emitter from 'redux/actions/emitter'
import styled from 'styled-components'
import colors from 'styles/colors'
import Axios from 'axios'
// import clevertap from 'clevertap-web-sdk'

const INITIAL_STATE = {
    type: 1, // 0. fiat, 1. crypto
    asset: null, // init asset from query
    selectedAsset: null,
    networkList: null,
    selectedNetwork: null,
    loadingConfigs: false,
    configs: null,
    estimatingFee: false,
    withdrawFee: null,
    feeCurrency: null,
    openList: {},
    focus: '',
    search: '',
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
    // ... Add new state
}

const TYPE = {
    fiat: 0,
    crypto: 1
}

const DEFAULT_ASSET = 'VNDC'

const ExchangeWithdraw = () => {
    // Init State
    const [state, set] = useState(INITIAL_STATE)
    const setState = state => set(prevState => ({...prevState, ...state}))

    const cryptoListRef = useRef()
    const networkListRef = useRef()
    const cryptoListSearchRef = useRef()
    const amountInputRef = useRef()
    const addressInputRef = useRef()

    // Rdx
    const auth = useSelector(state => state.auth.user) || null
    const allAssets = useSelector(state => state.wallet.SPOT) || null
    const userSocket = useSelector(state => state.socket.userSocket) || null

    // Use Hooks
    const [currentTheme, ] = useDarkMode()
    const { t } = useTranslation()
    const router = useRouter()

    useOutsideClick(cryptoListRef, () => state.openList?.cryptoList && setState({ openList: {} }))
    useOutsideClick(networkListRef, () => state.openList?.networkList && setState({ openList: {} }))

    // Memmoized
    const assetBalance = useMemo(() => {
        return allAssets && allAssets[state.selectedAsset?.currency]
    }, [allAssets, state.selectedAsset])

    // Helper
    const getWithdrawConfig = async () => {
        setState({ loadingConfigs: true })

        try {
            const { data } = await Axios.get(API_GET_WALLET_CONFIG)
            if (data?.status === ApiStatus.SUCCESS && data?.data) {
                const configs = Object.values(data.data)
                    // .filter(e => e.allowWithdraw.includes(true))
                setState({ configs })
            }
        } catch (e) {
            console.log(`Can't get withdraw config `, e)
        } finally {
            setState({ loadingConfigs: false })
        }
    }

    const getWithdrawFee = async (assetId, amount, network) => {
        if (!assetId || !amount || !network) return

        setState({ estimatingFee: true })
        try {
            log.i('fetching withdraw fee...')
            userSocket && await userSocket.emit('calculate_withdrawal_fee',
                assetId, amount, network,
                withdrawFee => setState({ withdrawFee: withdrawFee?.[0] }))
        } catch (e) {
            console.log(`Can't estimate withdraw fee `, e)
        } finally {
            setState({ estimatingFee: false })
        }
    }

    const withdraw = async (params = {}, cleverProps = {}, isFromOtpModal) => {
        if (!Object.keys(params).length) return

        let otpResult = true

        console.log('namidev-DEBUG: pre-check ', params, cleverProps, isFromOtpModal)
        try {
            setState({ processingWithdraw: true })
            const { address, amount, currency, otp, memo, tokenTypeIndex, networkType } = params
            // _address, _amount, currency, otp, memo, tokenTypeIndex, networkType
            const result = await withdrawHelper(address, amount, currency, otp, memo, tokenTypeIndex, networkType)
            log.i('Withdraw Result => ', result)
            setState({ withdrawResult: result })

            if (result) {
                if (result.status === 'ok') {
                    // clevertap.event.push('Withdraw Success',
                    //     {
                    //         'Service Name': 'Exchange',
                    //         'Crypto Name': cleverProps?.cryptoName,
                    //         'Token Network': cleverProps?.network,
                    //         'Quantity': parseFloat(cleverProps?.amount),
                    //         'Platform': 'Web'
                    //     })
                    // this.setMessage(<Translate id="withdraw.tab_withdraw.noti_wait_transaction"/>)
                } else {
                    // clevertap.event.push('Withdraw Initialized',
                    //     {
                    //         'Service Name': 'Exchange',
                    //         'Crypto Name': cleverProps?.cryptoName,
                    //         'Token Network': cleverProps?.network,
                    //         'Quantity': parseFloat(cleverProps?.amount),
                    //         'Platform': 'Web'
                    //     })
                    if (isFromOtpModal && result.status === TfaResult.INVALID_OTP) {
                        return false
                    } else if (isFromOtpModal && result.status === TfaResult.INVALID_OTP) {
                        return false
                    } else {
                        // this.handleWithdrawResult(result, tokenValue);
                    }
                }
            } else {
                // this.setMessage(<Translate id="withdraw.tab_withdraw.noti_error_process"/>, true)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setState({ processingWithdraw: false })
        }

        // setTimeout(() => {
        //     try {
        //         this.props.reFetchHistoryFirstPage()
        //     } catch (ignored) {}
        // }, 1000);

        return otpResult
    }

    const withdrawLinkBuilder = (type, asset) => {
        switch (type) {
            case TYPE.crypto:
                return `/wallet/exchange/withdraw?type=crypto&asset=${asset}`
            case TYPE.fiat:
                return `/wallet/exchange/withdraw?type=fiat&asset=${asset}`
            default:
                return `/wallet/exchange/withdraw?type=crypto`
        }
    }

    const getTokenType = (tokenType) => {
        switch (tokenType) {
            case 'KARDIA_CHAIN_NATIVE':
                return 'KRC20'
            default:
                return tokenType
        }
    }

    const onChangeAsset = () => {
        setState({
            address: '',
            memo: '',
            search: '',
            openList: {},
            selectedNetwork: null,
            withdrawFee: null,
            feeCurrency: null,
            validator: {},

        })
    }

    const onClearInput = (type) => {
        switch (type) {
            case 'crypto_search':
                setState({ search: '' })
                cryptoListSearchRef?.current?.focus()
                break
            case 'amount_input':
                setState({ amount: '' })
                amountInputRef?.current?.focus()
                break
            case 'address_input':
                setState({ address: '' })
                addressInputRef?.current?.focus()
                break
            default:
                return
        }
    }

    const onCancelWdlOrder = () => {
        setState({ openWithdrawConfirm: false, withdrawResult: null })
    }

    const handleEmailOtp = (emailOtp) => {
        setState({ emailOtp })
    }

    const handleGoogleOtp = (googleOtp) => {
        setState({ googleOtp })
    }

    // Render hander
    const renderTab = useCallback(() => {
        return (
            <div className="mt-5 flex items-end">
                {/*<Link href={{*/}
                {/*    pathname: '/wallet/exchange/withdraw',*/}
                {/*    query: { type: 'fiat' }*/}
                {/*}}>*/}
                    <a className={state.type === TYPE.fiat ?
                        'mr-6 flex flex-col items-center font-bold text-sm lg:text-[16px] text-Primary dark:text-Primary-dark cursor-not-allowed'
                        : 'mr-6 flex flex-col items-center font-medium text-sm lg:text-[16px] text-txtSecondary dark:text-txtSecondary-dark cursor-not-allowed'}
                       title={'Coming soon'}
                    >
                        <div className="pb-2.5">{t('common:sell')} VNDC</div>
                        <div className={state.type === TYPE.fiat ? 'w-[50px] h-[3px] md:h-[2px] bg-dominant' : 'w-[50px] h-[3px] md:h-[2px] bg-dominant invisible'}/>
                    </a>
                {/*</Link>*/}
                <Link href={{
                    pathname: '/wallet/exchange/withdraw',
                    query: { type: 'crypto' }
                }} prefetch={false}>
                    <a className={state.type === TYPE.crypto ?
                        'flex flex-col items-center font-bold text-sm lg:text-[16px] text-Primary dark:text-Primary-dark'
                        : 'flex flex-col items-center font-medium text-sm lg:text-[16px] text-txtSecondary dark:text-txtSecondary-dark'}>
                        <div className="pb-2.5">{t('common:crypto')}</div>
                        <div className={state.type === TYPE.crypto ? 'w-[50px] h-[3px] md:h-[2px] bg-dominant' : 'w-[50px] h-[3px] md:h-[2px] bg-dominant invisible'}/>
                    </a>
                </Link>
            </div>
        )
    }, [router, state.type])

    const renderWithdrawInput = useCallback(() => {
        return (
            <>
                <div className="flex items-center">
                    <AssetLogo assetCode={state.selectedAsset?.assetCode}/>
                    <span className="ml-2 font-bold text-sm text-txtPrimary dark:text-txtPrimary-dark">
                        {state.selectedAsset?.assetCode || '--'}
                    </span>
                    <span className="ml-2 font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark">
                        {state.selectedAsset?.fullName || '--'}
                    </span>
                </div>
                <div className={state.openList?.cryptoList ? 'rotate-180' : ''}>
                    <ChevronDown size={16} color={currentTheme === THEME_MODE.DARK ? colors.grey4 : colors.darkBlue}/>
                </div>
            </>
        )
    }, [state.type, state.selectedAsset, state.openList, currentTheme])

    const renderCryptoList = useCallback(() => {
        if (!state.configs) return null
        let origin = state.configs || []
        let items = []

        if (state.search) {
            origin = state.configs && [...state.configs].filter(e => e?.assetCode?.includes(state.search.toUpperCase()))
        }

        origin.forEach(cfg => {
            if (!IGNORE_TOKEN.includes(cfg?.assetCode)) {
                items.push(
                    <Link key={`wdl_cryptoList__${cfg?.assetCode}`}
                          href={withdrawLinkBuilder(state.type, cfg?.assetCode)}
                          prefetch={false}>
                        <a className={state.selectedAsset?.assetCode === cfg?.assetCode ?
                            'flex items-center justfify-between w-full px-3.5 py-2.5 md:px-5 bg-teal-opacity cursor-pointer'
                            : 'flex items-center justfify-between w-full px-3.5 py-2.5 md:px-5 hover:bg-teal-opacity cursor-pointer'}
                           onClick={onChangeAsset}>
                            <div className="flex items-center w-full">
                                <AssetLogo assetCode={cfg?.assetCode} size={24}/>
                                <span className="font-bold text-sm ml-2">{cfg?.assetCode}</span>
                                <span className="font-medium text-sm ml-2 text-txtSecondary dark:text-txtSecondary-dark">
                                    {cfg?.fullName || cfg?.assetCode}
                                </span>
                            </div>
                            <div>
                                {state.selectedAsset?.assetCode === cfg?.assetCode && <Check size={16}/>}
                            </div>
                        </a>
                    </Link>
                )
            }
        })

        return (
            <div className="pt-3.5 md:pt-4 absolute z-10 top-full mt-1.5 left-0 md:left-[16px] w-full bg-bgContainer
                            dark:bg-bgContainer-dark border border-divider dark:border-divider-dark rounded-xl
                            shadow-common dark:shadow-none overflow-hidden"
                 ref={cryptoListRef}>
                <div className="px-3.5 md:px-5">
                    <div className="flex items-center bg-gray-4 dark:bg-darkBlue-3 px-2.5 py-1.5 mb-3.5 rounded-lg">
                        <Search size={16}/>
                        <input className="w-full px-2.5 text-sm font-medium"
                               value={state.search}
                               ref={cryptoListSearchRef}
                               onChange={e => setState({ search: e.target?.value })}
                               placeholder={t('wallet:search_asset')}/>
                        <X size={16} onClick={() => onClearInput('crypto_search')} className="cursor-pointer"/>
                    </div>
                </div>
                <div className="max-h-[200px] overflow-y-auto">
                    {!items.length ? <div className="py-6"><Empty grpSize={68} message={t('common:not_found')} messageStyle="text-sm"/></div> : items}
                </div>
            </div>
        )
    }, [state.configs, state.type, state.search, state.selectedAsset])

    const renderNetworkInput = useCallback(() => {

        return (
            <>
                <div className={state.selectedNetwork?.allowWithdraw ? 'flex items-center' : 'flex items-center opacity-40'}>
                    <span className="font-bold text-sm text-dominant">
                        {getTokenType(state.selectedNetwork?.tokenType) || '--'}
                    </span>
                    <span className="ml-2 font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark">
                        {state.selectedNetwork && (state.selectedNetwork?.displayNetwork || '--')}
                    </span>
                </div>
                <div className={state.openList?.networkList ? 'rotate-180' : ''}>
                    <ChevronDown size={16} color={currentTheme === THEME_MODE.DARK ? colors.grey4 : colors.darkBlue}/>
                </div>
            </>
        )
    }, [state.selectedNetwork, state.openList])

    const renderAddressInput = useCallback(() => {
        return (
            <div className={state.focus === 'address' ?
                'min-h-[55px] lg:min-h-[62px] px-3.5 py-2.5 md:px-5 md:py-4 flex items-center justify-between rounded-xl border border-dominant cursor-pointer select-none'
                :'min-h-[55px] lg:min-h-[62px] px-3.5 py-2.5 md:px-5 md:py-4 flex items-center justify-between rounded-xl border border-divider dark:border-divider-dark cursor-pointer select-none hover:!border-dominant'}
                onClick={() => addressInputRef?.current?.focus()}>
                <input className="w-full font-medium text-sm pr-3"
                       placeholder={t('wallet:receiver_address')}
                       value={state.address}
                       ref={addressInputRef}
                       onChange={e => setState({ address: e?.target.value })}
                       onFocus={() => setState({ focus: 'address' })}
                       onBlur={() => setState({ focus: null })}
                />
                <span className={state.address ? 'font-bold text-sm text-dominant hover:opacity-80' : 'font-bold text-sm text-dominant hover:opacity-80 invisible'}
                      onClick={() => onClearInput('address_input')}>
                      {t('common:clear')}
                </span>
            </div>
        )
    }, [state.address, state.focus])

    const renderAmountInput = useCallback(() => {
        return (
            <div className={state.focus === 'amount' ?
                'min-h-[55px] lg:min-h-[62px] px-3.5 py-2.5 md:px-5 md:py-4 flex items-center justify-between rounded-xl border border-dominant cursor-pointer select-none'
                :'min-h-[55px] lg:min-h-[62px] px-3.5 py-2.5 md:px-5 md:py-4 flex items-center justify-between rounded-xl border border-divider dark:border-divider-dark cursor-pointer select-none hover:!border-dominant'}
                onClick={() => amountInputRef?.current?.focus()}>
                <NumberFormat
                    thousandSeparator
                    allowNegative={false}
                    getInputRef={ref => amountInputRef.current = ref}
                    className="w-full text-sm pr-3 font-medium"
                    placeholder={t('wallet:input_amount')}
                    value={state.amount}
                    onValueChange={({ value: amount }) => setState({ amount })}
                    onFocus={() => setState({ focus: 'amount' })}
                    onBlur={() => setState({ focus: null })}
                />
                <span className={state.amount ? 'font-bold text-sm text-dominant hover:opacity-80' : 'font-bold text-sm text-dominant hover:opacity-80 invisible'}
                      onClick={() => onClearInput('amount_input')}>
                      {t('common:clear')}
                </span>
            </div>
        )
    }, [state.amount, state.focus])

    const renderNetworkList = useCallback(() => {
        if (!state.networkList) return null

        const items = []

        state.networkList.forEach(nw => {
            items.push(
                <div key={`wdl_networkList___${nw?.tokenType}`}
                     className={nw?.allowWithdraw ?
                         'flex items-center justify-between px-3.5 py-3 md:px-5 hover:bg-teal-opacity cursor-pointer'
                     : 'flex items-center justify-between px-3.5 py-3 md:px-5 cursor-not-allowed opacity-40'}
                     onClick={() => setState({ selectedNetwork: nw, openList: {} })}>
                    <div>
                        <span className="text-sm font-medium">{getTokenType(nw?.tokenType)}</span>
                        <span className="ml-2 text-sm font-medium text-txtSecondary dark:text-txtSecondary-dark">{nw?.displayNetwork}</span>
                    </div>
                    {state.selectedNetwork?.tokenType === nw?.tokenType && <Check size={16}/>}
                </div>
            )
        })

        return (
            <div className="absolute z-10 top-full mt-1.5 left-0 md:left-[16px] w-full bg-bgContainer
                            dark:bg-bgContainer-dark border border-divider dark:border-divider-dark rounded-xl
                            shadow-common dark:shadow-none overflow-hidden"
                 ref={networkListRef}>
                <div className="max-h-[200px] overflow-y-auto">
                    {!items.length ?
                        <div className="py-6 h-full w-full items-center justify-center">Chưa hỗ trợ rút đối với token {state.selectedAsset?.assetCode}</div>
                        : items}
                </div>
            </div>
        )
    }, [state.networkList, state.selectedNetwork])

    const renderWithdrawFiat = useCallback(() => {
        return (
            <div>Fiat Section</div>
        )
    }, [state.type])

    const renderAssetAvailable = useCallback(() => {
        const _ = assetBalance === undefined ?
            <div className="">
                0.0000
                {/*<Skeletor width={65}/>*/}
            </div>
            : formatWallet(assetBalance?.value - assetBalance?.locked_value, state.selectedAsset?.assetDigit)

        return (
            <div className="flex items-center text-sm">
                <span className="text-txtSecondary dark:text-txtSecondary-dark mr-2">
                   {t('common:available_balance')}
                </span>
                <span className="font-bold flex items-center">{_ === '0' ? '0.0000' : _} <span className="ml-1">{state.selectedAsset?.assetCode}</span></span>
            </div>
        )
    }, [assetBalance, state.selectedAsset])

    const renderWdlFee = useCallback(() => {
        return (
            <div className="flex items-center text-sm mt-2.5">
                <span className="text-txtSecondary dark:text-txtSecondary-dark">
                    {t('wallet:withdraw_fee')}
                </span>
                <span className="font-bold ml-2">
                   {state.withdrawFee?.amount ? formatWallet(state.withdrawFee?.amount, state.feeCurrency?.assetDigit) : '--'} {state.withdrawFee && state.feeCurrency ? state.feeCurrency?.assetCode : null}
                </span>
            </div>
        )
    }, [state.configs, state.withdrawFee, state.feeCurrency])

    const renderMinWdl = useCallback(() => {
        return (
            <div className="flex items-center text-sm mt-2.5">
                <span className="text-txtSecondary dark:text-txtSecondary-dark">
                    {t('wallet:min_withdraw')}
                </span>
                <span className="font-bold ml-2">
                    {state.selectedNetwork?.minWithdraw ?
                        (state.selectedNetwork.minWithdraw >= 1 ?
                                formatWallet(state.selectedNetwork.minWithdraw, state.selectedNetwork?.assetDigit)
                                : state.selectedNetwork.minWithdraw
                        )
                        : '--'}
                </span>
            </div>
        )
    }, [state.selectedNetwork])

    const renderMaxWdl = useCallback(() => {
        if (!state.selectedNetwork?.maxWithdraw) return null

        return (
            <div className="flex items-center text-sm mt-2.5">
                <span className="text-txtSecondary dark:text-txtSecondary-dark">
                    {t('wallet:min_withdraw')}
                </span>
                <span className="font-bold ml-2">
                    {state.selectedNetwork?.maxWithdraw ?
                        formatWallet(state.selectedNetwork.maxWithdraw, state.selectedNetwork?.assetDigit)
                        : '--'}
                </span>
            </div>
        )
    }, [state.selectedNetwork])

    const renderWdlButton = useCallback(() => {
        const passedStl = 'mt-8 w-full bg-dominant rounded-xl py-3 text-sm text-center text-white font-bold hover:opacity-80 cursor-pointer'
        const preventStl = 'mt-8 w-full bg-gray-4 dark:bg-darkBlue-4 rounded-xl py-3 text-sm text-center text-gray-1 dark:text-darkBlue-2 font-bold cursor-not-allowed'

        return (
            <div className={state.validator?.allPass ? passedStl : preventStl}
            onClick={() => state.validator?.allPass && setState({ openWithdrawConfirm: true })}>
                {t('common:withdraw')}
            </div>
        )
    }, [state.validator?.allPass])

    const renderInputIssues = useCallback((type) => {
        let inner

        if (type === 'allowWithdraw') {
            if (state?.validator?.hasOwnProperty('allowWithdraw')) {
                if (state?.validator.allowWithdraw) {
                    // inner = <Check className="text-dominant" size={16}/>
                } else {
                    inner = <span className="block w-full font-medium text-red text-xs lg:text-sm text-right mt-2">
                        {t('wallet:errors.network_not_support', { asset: state.selectedAsset?.assetCode, chain: state.selectedNetwork?.tokenType })}
                    </span>
                }
            } else {
                inner = null
            }
        }

        if (type === 'address') {
            if (state?.validator?.hasOwnProperty('address')) {
                if (state?.validator.address) {
                    // inner = <Check className="text-dominant" size={16}/>
                } else {
                    inner = <span className="block w-full font-medium text-red text-xs lg:text-sm text-right mt-2">
                        {t('wallet:errors.invalid_withdraw_address')}
                    </span>
                }
            } else {
                inner = null
            }
        }

        if (type === 'amount') {
            if (state?.validator?.hasOwnProperty('amount')) {
                if (state?.validator.amount === AMOUNT.LESS_THAN_MIN) {
                    inner = <span className="block w-full font-medium text-red text-xs lg:text-sm text-right mt-2">
                        {t('wallet:errors.invalid_min_amount', { value: state.selectedNetwork?.minWithdraw })}
                    </span>
                } else if (state?.validator.amount === AMOUNT.OVER_THAN_MAX) {
                    inner = <span className="block w-full font-medium text-red text-xs lg:text-sm text-right mt-2">
                        {t('wallet:errors.invalid_max_amount', { value: state.selectedNetwork?.maxWithdraw })}
                    </span>
                } else if (state?.validator.amount === AMOUNT.OVER_BALANCE) {
                    inner = <span className="block w-full font-medium text-red text-xs lg:text-sm text-right mt-2">
                        {t('wallet:errors.invalid_insufficient_balance')}
                    </span>
                } else if (state?.validator.amount === AMOUNT.OK) {
                    // inner = <Check className="text-dominant" size={16}/>
                }
            } else {
                inner = null
            }
        }

        if (type === 'memo') {
            if (state?.validator?.hasOwnProperty('memo')) {
                if (state?.validator.memo) {
                    // inner = <Check className="text-dominant" size={16}/>
                } else {
                    inner = <span className="block w-full font-medium text-red text-xs lg:text-sm text-right mt-2">
                        {t('wallet:errors.invalid_memo')}
                    </span>
                }
            } else {
                inner = null
            }
        }

        return <>{inner}</>
    }, [state.validator, state.selectedNetwork, state.selectedAsset])

    const renderMemoInput = useCallback(() => {
        if (!state.selectedNetwork) return null

        if (!MEMO_INPUT.includes(state.selectedNetwork?.network)) {
            return null
        }

        return (
            <div className="relative mt-5">
                <div className="mb-1.5 flex items-center justify-between text-sm font-medium text-txtPrimary dark:text-txtPrimary-dark">
                    <span className="mr-1.5">Memo ({t('common:optional')})</span>
                    <span>{state.validator?.memo === true && <Check size={16} className="text-dominant"/>}</span>
                </div>
                <div className={state.focus === 'memo' ?
                    'min-h-[55px] lg:min-h-[62px] px-3.5 py-2.5 md:px-5 md:py-4 flex items-center justify-between rounded-xl border border-dominant cursor-pointer select-none'
                    :'min-h-[55px] lg:min-h-[62px] px-3.5 py-2.5 md:px-5 md:py-4 flex items-center justify-between rounded-xl border border-divider dark:border-divider-dark cursor-pointer select-none hover:!border-dominant'}
                >
                    <input className="w-full font-medium text-sm pr-3"
                           placeholder={t('wallet:receiver_memo')}
                           value={state.memo}
                           onChange={e => setState({ memo: e?.target.value })}
                           onFocus={() => setState({ focus: 'memo' })}
                           onBlur={() => setState({ focus: null })}
                    />
                    <span className={state.memo ? 'font-bold text-sm text-dominant hover:opacity-80' : 'font-bold text-sm text-dominant hover:opacity-80 invisible'}
                          onClick={() => setState({ memo: '' })}>
                      {t('common:clear')}
                </span>
                </div>
                {renderInputIssues('memo')}
            </div>
        )
    }, [state.selectedNetwork, state.memo, state.focus, state.validator?.memo, renderInputIssues])

    const renderWdlConfirm = useCallback(() => {
        if (state.type !== TYPE.crypto) return null

        const params = {
            address: state.address.trim(),
            amount: +state.amount,
            currency: state.selectedAsset?.id,
            otp: null,
            memo: state.memo,
            tokenTypeIndex: state.selectedNetwork?.tokenTypeIndex,
            networkType: state.selectedNetwork?.network
        }
        const cleverProps = {
            cryptoName: `${state.selectedAsset?.assetCode} ${state.selectedAsset?.fullName ? `(${state.selectedAsset?.fullName})` : ''}`,
            network: `${state.selectedNetwork?.tokenType} (${state.selectedNetwork?.displayNetwork})`,
            amount: +state.amount
        }

        return (
            <Modal type="confirmation"
                   isVisible={state.openWithdrawConfirm}
                   title={t('wallet:withdraw_confirmation')}
                   className="md:px-6 md:pb-6 relative"
                   noButton
            >
                <div className="mt-6 w-[300px] md:min-w-[410px]">
                    {!state.withdrawResult &&
                    <>
                        <div className="text-sm mb-2 flex items-center justify-between">
                            <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('common:withdraw')}</span>
                            <span className="font-medium">{state.selectedAsset?.assetCode} {state.selectedAsset?.fullName &&
                            <span className="ml-1">({state.selectedAsset?.fullName})</span>}</span>
                        </div>
                        <div className="text-sm mb-2 flex items-center justify-between">
                            <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('wallet:receive_address')}</span>
                            <span className="font-medium cursor-pointer"
                                  title={`${t('wallet:receive_address')}: ${state.address}`}>
                            {shortHashAddress(state.address, 8, 8)}
                        </span>
                        </div>
                        {state.memo && <div className="text-sm mb-2 flex items-center justify-between">
                            <span className="text-txtSecondary dark:text-txtSecondary-dark">MEMO</span>
                            <span className="font-medium">{state.memo}</span>
                        </div>}
                        <div className="text-sm mb-2 flex items-center justify-between">
                            <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('common:amount')}</span>
                            <span className="font-medium">{formatWallet(state.amount, state.selectedNetwork?.assetDigit)} {state.selectedAsset?.assetCode}</span>
                        </div>
                        <div className="text-sm mb-2 flex items-center justify-between">
                            <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('common:fee')}</span>
                            <span className="font-medium">{formatWallet(state.withdrawFee?.amount, state.feeCurrency?.assetDigit)} {state.feeCurrency?.assetCode}</span>
                        </div>
                        <div className="text-sm mb-2 flex items-center justify-between">
                            <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('wallet:network')}</span>
                            <span className="font-medium">
                                {state.selectedNetwork?.tokenType}
                                <span className="ml-1.5">({state.selectedNetwork?.displayNetwork})</span>
                            </span>
                        </div>
                    </>}
                    {state.withdrawResult &&
                      <div className="">
                          {state.otpModes.includes('email') &&
                          <div>
                              <div className="font-medium text-sm ">
                                  {t('common:email_authentication')}
                              </div>
                              <div className="mt-0.5 text-xs lg:text-sm text-txtSecondary dark:text-txtSecondary">
                                  {t('wallet:withdraw_prompt.email_description')}
                              </div>
                              <OtpWrapper isDark={currentTheme === THEME_MODE.DARK}>
                                  <OtpInput
                                      value={state.emailOtp}
                                      onChange={handleEmailOtp}
                                      numInputs={6}
                                      placeholder="------"
                                      isInputNum
                                  />
                              </OtpWrapper>
                              {/*<div className="mt-2 text-red text-xs lg:text-sm font-medium text-right">*/}
                              {/*    {t('wallet:withdraw_prompt.email_otp_wrong')}*/}
                              {/*</div>*/}
                          </div>}
                          {state.otpModes.includes('email') &&
                          <div className="mt-6">
                              <div className="font-medium text-sm ">
                                  {t('common:tfa_authentication')}
                              </div>
                              <div className="mt-0.5 text-xs lg:text-sm text-txtSecondary dark:text-txtSecondary">
                                  {t('wallet:withdraw_prompt.google_description')}
                              </div>
                              <OtpWrapper isDark={currentTheme === THEME_MODE.DARK}>
                                  <OtpInput
                                      value={state.googleOtp}
                                      onChange={handleGoogleOtp}
                                      numInputs={6}
                                      placeholder="------"
                                      isInputNum
                                  />
                              </OtpWrapper>
                              {/*<div className="mt-2 text-red text-xs lg:text-sm font-medium text-right">*/}
                              {/*    {t('wallet:withdraw_prompt.google_otp_wrong')}*/}
                              {/*</div>*/}
                          </div>}
                      </div>
                    }
                </div>
                <div className="mt-6 w-[300px] md:min-w-[410px] flex items-center justify-between">
                    <div className="w-[48%] py-2 bg-gray-1 text-center rounded-lg text-sm text-dominant font-medium cursor-pointer hover:opacity-80"
                         onClick={onCancelWdlOrder}>
                         {t('common:cancel')}
                    </div>
                    <div className="w-[48%] py-2 bg-dominant text-center rounded-lg text-sm text-white font-medium cursor-pointer hover:opacity-80"
                         onClick={() => withdraw(params, cleverProps, !!state.withdrawResult)}>
                        {state.withdrawResult ? t('common:confirm') : t('common:continue')}
                    </div>
                </div>
                {state.processingWithdraw && <div style={{ backgroundColor: colors.overlayLight }}
                      className="absolute z-10 w-full h-full left-0 top-0 rounded-xl flex items-center justify-center select-none pointer-event-none">
                    <ScaleThinLoader thin={2} height={20}/>
                </div>}
            </Modal>
        )
    }, [
        currentTheme,
        state.openWithdrawConfirm,
        state.type,
        state.amount,
        state.address,
        state.memo,
        state.selectedAsset,
        state.selectedNetwork,
        state.withdrawFee,
        state.feeCurrency,
        state.processingWithdraw,
        state.withdrawResult,
        state.otpModes,
        state.emailOtp
    ])

    useDebounce( () => {
        if (userSocket && state.selectedAsset?.currency && state.amount && state.selectedNetwork?.network) {
            getWithdrawFee(state.selectedAsset.currency, +state.amount, state.selectedNetwork.network)
        }
    },
    500,
    [userSocket, state.selectedAsset, state.amount, state.selectedNetwork])

    useEffect(() => {
        getWithdrawConfig()
    }, [])

    useEffect(() => {
        if (auth) {
            const otpModes = []
            auth?.email && otpModes.push('email')
            auth?.isTfaEnabled && otpModes.push('tfa')
            otpModes.length && setState({ otpModes })
        }
    }, [auth])

    useEffect(() => {
        const asset = get(router?.query, 'asset', null)
        const type = get(router?.query, 'type', 'crypto')

        if (asset && typeof asset === 'string' && asset.length) {
            setState({ asset })
        } else {
            setState({ asset: DEFAULT_ASSET })
        }

        if (type && type === 'crypto') {
            setState({ type: TYPE.crypto })
        } else {
            setState({ type: TYPE.fiat })
        }

    }, [router])

    useEffect(() => {
        if (state.configs && state.asset) {
            const selectedAsset = find(state.configs, o => o?.assetCode === state.asset)
            selectedAsset && setState({ selectedAsset })
        }
    }, [state.configs, state.asset])

    useEffect(() => {
        if (state.selectedAsset) {
            const networkList = []
            const { tokenType, allowWithdraw, network, displayNetwork, minWithdraw, maxWithdraw, assetDigit } = state.selectedAsset
            if (allowWithdraw && allowWithdraw.length) {
                allowWithdraw.forEach((isAllow, index) =>
                    // isAllow
                    // &&
                    networkList.push({
                        allowWithdraw: isAllow,
                        assetDigit,
                        minWithdraw: minWithdraw[index],
                        maxWithdraw: maxWithdraw[index],
                        tokenType: tokenType[index],
                        tokenTypeIndex: index,
                        network: network[index],
                        displayNetwork: displayNetwork[index],
                    }))
            }
            setState({ networkList })
            if (networkList.length) {
                const index = networkList.findIndex(item => item?.allowWithdraw)
                console.log('namidev-DEBUG: Index ', index)
                index !== -1 && index !== undefined && setState({ selectedNetwork: networkList?.[index] })
            }
        }
    }, [state.selectedAsset])

    useEffect(() => {
        if (state.openList?.cryptoList) {
            cryptoListSearchRef?.current?.focus()
        }
    }, [state.openList])

    useEffect(() => {
        if (state.withdrawFee && state.configs) {
            const cfg = state.configs.filter(e => e.id === state.withdrawFee?.currency)?.[0]
            cfg && setState({ feeCurrency: { assetCode: cfg?.assetCode, assetDigit: cfg?.assetDigit } })
        }
    }, [state.withdrawFee, state.configs])

    useEffect(() => {
        setState({
            validator: withdrawValidator(
                state.selectedAsset?.assetCode,
                +state.amount,
                state.address,
                state.memo,
                state.selectedNetwork?.network,
                state.selectedNetwork?.tokenType,
                state.selectedNetwork?.minWithdraw,
                state.selectedNetwork?.maxWithdraw,
                assetBalance?.value - assetBalance?.locked_value,
                state.selectedNetwork?.allowWithdraw
            )
        })
    }, [
        state.selectedAsset,
        state.amount,
        state.address,
        state.memo,
        state.selectedNetwork,
        assetBalance
    ])

    useEffect(() => {
        log.d(state.validator)
    }, [state.validator])

    return (
        <MaldivesLayout>
            <Background isDark={currentTheme === THEME_MODE.DARK}>
                <div className="mal-container px-4">
                    <div className="t-common">
                        {t('common:withdraw')}
                    </div>
                    {renderTab()}
                    <MCard addClass="pt-8 pb-10">
                        <div className="flex justify-center">
                            <div className="w-full sm:w-[400px] lg:w-[453px]">
                                {state.type === TYPE.fiat && renderWithdrawFiat()}
                                {state.type === TYPE.crypto &&
                                <>
                                    <div className="relative">
                                        <div className="mb-1.5 text-sm font-medium text-txtPrimary dark:text-txtPrimary-dark">
                                            {t('wallet:crypto_select')}
                                        </div>
                                        <div className="min-h-[55px] lg:min-h-[62px] px-3.5 py-2.5 md:px-5 md:py-4 flex items-center justify-between
                                                    rounded-xl border border-divider dark:border-divider-dark cursor-pointer select-none hover:!border-dominant"
                                             onClick={() => state.configs && setState({ openList: { cryptoList: !state.openList?.cryptoList } })}>
                                            {renderWithdrawInput()}
                                        </div>
                                        {state.openList?.cryptoList && renderCryptoList()}
                                    </div>
                                    <div className="relative mt-5">
                                        <div className="mb-1.5 flex items-center justify-between text-sm font-medium text-txtPrimary dark:text-txtPrimary-dark">
                                            {t('wallet:receive_address')}
                                            <span>{state.validator?.address === true && <Check size={16} className="text-dominant"/>}</span>
                                        </div>
                                        {renderAddressInput()}
                                        {renderInputIssues('address')}
                                    </div>
                                    {renderMemoInput()}
                                    <div className="relative mt-5">
                                        <div className="mb-1.5 flex items-center justify-between text-sm font-medium text-txtPrimary dark:text-txtPrimary-dark">
                                            {t('common:amount')}
                                            <span>{state.validator?.amount === AMOUNT.OK && <Check size={16} className="text-dominant"/>}</span>
                                        </div>
                                        {renderAmountInput()}
                                        {renderInputIssues('amount')}
                                    </div>
                                    <div className="relative mt-5">
                                        <div className="mb-1.5 flex items-center justify-between text-sm font-medium text-txtPrimary dark:text-txtPrimary-dark">
                                            {t('wallet:network')}
                                            <span>{state.validator?.allowWithdraw && <Check size={16} className="text-dominant"/>}</span>
                                        </div>
                                        <div className="min-h-[55px] lg:min-h-[62px] px-3.5 py-2.5 md:px-5 md:py-4 flex items-center justify-between
                                                    rounded-xl border border-divider dark:border-divider-dark cursor-pointer select-none hover:!border-dominant"
                                             onClick={() => state.configs && setState({ openList: { networkList: !state.openList?.networkList } })}>
                                            {renderNetworkInput()}
                                        </div>
                                        {renderInputIssues('allowWithdraw')}
                                        {state.openList?.networkList && renderNetworkList()}
                                    </div>
                                    <div className="mt-4">
                                        {renderAssetAvailable()}
                                        {renderWdlFee()}
                                        {renderMinWdl()}
                                        {renderMaxWdl()}
                                    </div>
                                    {renderWdlButton()}
                                </>
                                }
                            </div>
                        </div>
                    </MCard>
                    <div className="t-common mt-11">
                        {t('wallet:withdraw_history')}
                    </div>
                </div>
                {renderWdlConfirm()}
            </Background>
        </MaldivesLayout>
    )
}

const Background = styled.div.attrs({ className: 'w-full h-full pt-10' })`
  background-color: ${({ isDark }) => isDark ? colors.darkBlue1 : '#F8F9FA'};
`

const OtpWrapper = styled.div.attrs({ className: 'mt-4' })`
  > div {
      width: 100%;
      justify-content: space-between;

      div {
          width: 33px;
          height: 30px;
          background-color: ${({ isDark }) => isDark ? colors.darkBlue4 : colors.lightTeal};
          justify-content: center;
          border-radius: 6px;

          input {
              font-weight: 500;
              font-size: 14px;
          }

          @media (min-width: 768px) {
              width: 53px;
              height: 50px;
              input {
                  font-size: 24px;
              }
          }
      }
  }
`

const IGNORE_TOKEN = ['XBT_PENDING', 'TURN_CHRISTMAS_2017_FREE', 'USDT_BINANCE_FUTURES', 'SPIN_SPONSOR', 'SPIN_BONUS',
    'SPIN_CONQUEST', 'TURN_CHRISTMAS_2017', 'SPIN_CLONE']

const MEMO_INPUT = ['BinanceChain', 'VITE_CHAIN']

const AMOUNT = {
    LESS_THAN_MIN: 0,
    OVER_THAN_MAX: 1,
    OVER_BALANCE: 2,
    OK: 'ok'
}

function withdrawValidator(asset, amount, address, memo = undefined, network, networkType, min, max, available, isAllow) {
    const result = {}
    let memoType

    if (network === TokenConfig.Network.BINANCE_CHAIN) memoType = 'BEP2MEMO'
    if (network === TokenConfig.Network.VITE_CHAIN) memoType = 'VITEMEMO'

    if (asset) {
        result.asset = (!!(typeof asset === 'string' && asset.length))
    }

    if (isAllow !== undefined) {
        result.allowWithdraw = isAllow
    }

    if (amount && typeof +amount === 'number') {
        if (isNumber(+min) && (amount < min || +amount === 0 || !+amount)) {
            result.amount = AMOUNT.LESS_THAN_MIN
        } else if (typeof max === 'number' && amount > max) {
            result.amount = AMOUNT.OVER_THAN_MAX
        } else if (isNumber(+available) && amount > available) {
            result.amount = AMOUNT.OVER_BALANCE
        } else {
            result.amount = AMOUNT.OK
        }
    }

    if (address && networkType) {
        result.address = hashValidator(address, networkType)
    }

    if ((network === TokenConfig.Network.BINANCE_CHAIN || network === TokenConfig.Network.VITE_CHAIN)
        && memo && memoType) {
        result.memo = hashValidator(memo, memoType)
    }

    if (result.address && result.asset && (result?.amount === AMOUNT.OK) && result.allowWithdraw) {
        result.allPass = true
    }

    return result
}

export default ExchangeWithdraw
