import { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { useSelector } from 'react-redux'
import { useDebounce } from 'react-use'
import { useRouter } from 'next/router'
import { ApiStatus, PublicSocketEvent } from 'redux/actions/const'
import { API_GET_WALLET_CONFIG } from 'redux/actions/apis'
import { WALLET_SCREENS } from 'pages/wallet'
import { Check, Search, X } from 'react-feather'
import { find, get } from 'lodash'
import { formatWallet } from 'redux/actions/utils'

import MaldivesLayout from 'components/common/layouts/MaldivesLayout'
import useOutsideClick from 'hooks/useOutsideClick'
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'
import NumberFormat from 'react-number-format'
import ChevronDown from 'components/svg/ChevronDown'
import AssetLogo from 'components/wallet/AssetLogo'
import MCard from 'components/common/MCard'
import Empty from 'components/common/Empty'
import Link from 'next/link'
import Skeletor from 'components/common/Skeletor'
import Axios from 'axios'
import styled from 'styled-components'
import colors from 'styles/colors'
import Emitter from 'redux/actions/emitter'
import { log } from 'utils'

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

    // ... Add new state
}

const TYPE = {
    fiat: 0,
    crypto: 1
}

const ExchangeWithdraw = () => {
    // Init State
    const [state, set] = useState(INITIAL_STATE)
    const setState = state => set(prevState => ({...prevState, ...state}))

    const cryptoListRef = useRef()
    const networkListRef = useRef()

    // Rdx
    const allAssets = useSelector(state => state.wallet.SPOT) || null
    const userSocket = useSelector(state => state.socket.userSocket) || null
    const assetConfig = useSelector(state => state.utils.assetConfig) || null

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
                setState({ configs: Object.values(data.data) })
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
                withdrawFee => setState({ withdrawFee }))
        } catch (e) {
            console.log(`Can't estimate withdraw fee `, e)
        } finally {
            setState({ estimatingFee: false })
        }
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

    const onChangeAsset = () => {
        setState({ address: '', search: '', openList: {}, selectedNetwork: null, withdrawFee: null })
    }

    const getTokenType = (tokenType) => {
        switch (tokenType) {
            case 'KARDIA_CHAIN_NATIVE':
                return 'KRC20'
            default:
                return tokenType
        }
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
                }}>
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
                          href={withdrawLinkBuilder(state.type, cfg?.assetCode)}>
                        <a className={state.selectedAsset?.assetCode === cfg?.assetCode ?
                            'flex items-center justfify-between w-full px-3.5 py-2.5 md:px-5 bg-teal-opacity cursor-pointer'
                            : 'flex items-center justfify-between w-full px-3.5 py-2.5 md:px-5 hover:bg-teal-opacity cursor-pointer'}
                           onClick={onChangeAsset}>
                            <div className="flex items-center w-full">
                                <AssetLogo assetCode={null} size={24}/>
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
                               onChange={e => setState({ search: e.target?.value })}
                               placeholder={t('wallet:search_asset')}/>
                        <X size={16} onClick={() => setState({ search: '' })} className="cursor-pointer"/>
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
                <div className="flex items-center">
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
            >
                <input className="w-full font-medium text-sm pr-3"
                       placeholder={t('wallet:receiver_address')}
                       value={state.address}
                       onChange={e => setState({ address: e?.target.value })}
                       onFocus={() => setState({ focus: 'address' })}
                       onBlur={() => setState({ focus: null })}
                />
                <X size={16} className={state.address ? '' : 'invisible'}
                   onClick={() => setState({ address: '' })}/>
            </div>
        )
    }, [state.address, state.focus])

    const renderAmountInput = useCallback(() => {
        return (
            <div className={state.focus === 'amount' ?
                'min-h-[55px] lg:min-h-[62px] px-3.5 py-2.5 md:px-5 md:py-4 flex items-center justify-between rounded-xl border border-dominant cursor-pointer select-none'
                :'min-h-[55px] lg:min-h-[62px] px-3.5 py-2.5 md:px-5 md:py-4 flex items-center justify-between rounded-xl border border-divider dark:border-divider-dark cursor-pointer select-none hover:!border-dominant'}
            >
                <NumberFormat
                    thousandSeparator
                    allowNegative={false}
                    className="w-full text-sm pr-3 font-medium"
                    placeholder={t('wallet:input_amount')}
                    value={state.amount}
                    onValueChange={({ value: amount }) => setState({ amount })}
                    onFocus={() => setState({ focus: 'amount' })}
                    onBlur={() => setState({ focus: null })}
                />
                <X size={16} className={state.amount ? '' : 'invisible'}
                   onClick={() => setState({ amount: '' })}/>
            </div>
        )
    }, [state.amount, state.focus])

    const renderMemoInput = useCallback(() => {
        if (!state.selectedNetwork) return null

        if (!MEMO_INPUT.includes(state.selectedNetwork?.network)) {
            return null
        }

        return (
            <div className="relative mt-5">
                <div className="mb-1.5 text-sm font-medium text-txtPrimary dark:text-txtPrimary-dark">
                    <span className="mr-1.5">Memo</span>({t('common:optional')})
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
                    <X size={16} className={state.memo ? '' : 'invisible'}
                       onClick={() => setState({ memo: '' })}/>
                </div>
            </div>
        )
    }, [state.selectedNetwork, state.memo, state.focus])

    const renderNetworkList = useCallback(() => {
        if (!state.networkList) return null

        const items = []

        state.networkList.forEach(nw => {
            items.push(
                <div key={`wdl_networkList___${nw?.tokenType}`}
                     className="flex items-center justify-between px-3.5 py-3 md:px-5 hover:bg-teal-opacity cursor-pointer"
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
        const _ = !assetBalance ?
            <div className="-mt-1.5"><Skeletor width={65}/></div>
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
        let inner = '--'

        if (state.withdrawFee && state.configs) {
            const cfg = state.configs.filter(e => e.id === state.withdrawFee?.[0]?.currency)
            inner = `${state.withdrawFee?.[0]?.amount ? formatWallet(state.withdrawFee?.[0].amount, cfg?.[0]?.assetDigit) : '--'} ${cfg?.[0]?.assetCode || '--'}`
        }

        return (
            <div className="flex items-center text-sm mt-2.5">
                <span className="text-txtSecondary dark:text-txtSecondary-dark">
                    {t('wallet:withdraw_fee')}
                </span>
                <span className="font-bold ml-2">
                    {inner}
                </span>
            </div>
        )
    }, [state.configs, state.withdrawFee])

    const renderMinWdl = useCallback(() => {
        return (
            <div className="flex items-center text-sm mt-2.5">
                <span className="text-txtSecondary dark:text-txtSecondary-dark">
                    {t('wallet:min_withdraw')}
                </span>
                <span className="font-bold ml-2">
                    {state.selectedNetwork?.minWithdraw ?
                        formatWallet(state.selectedNetwork.minWithdraw, state.selectedNetwork?.assetDigit)
                        : '--'}
                </span>
            </div>
        )
    }, [state.selectedNetwork])

    const renderWdlButton = useCallback(() => {
        return (
            <div className="mt-5 w-full bg-dominant rounded-xl py-3 text-sm text-center text-white font-bold hover:opacity-80 cursor-pointer">
                {t('common:withdraw')}
            </div>
        )
    }, [])

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
        const asset = get(router?.query, 'asset', null)
        const type = get(router?.query, 'type', 'crypto')

        if (asset && typeof asset === 'string' && asset.length) {
            setState({ asset })
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
            const { tokenType, allowWithdraw, network, displayNetwork, minWithdraw, assetDigit } = state.selectedAsset
            if (allowWithdraw && allowWithdraw.length) {
                allowWithdraw.forEach((isAllow, index) => isAllow
                    && networkList.push({
                        allowWithdraw: isAllow,
                        assetDigit,
                        minWithdraw: minWithdraw[index],
                        tokenType: tokenType[index],
                        network: network[index],
                        displayNetwork: displayNetwork[index],
                    }))
            }
            setState({ networkList })
        }
    }, [state.selectedAsset])

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
                                        <div
                                            className="mb-1.5 text-sm font-medium text-txtPrimary dark:text-txtPrimary-dark">
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
                                        <div className="mb-1.5 text-sm font-medium text-txtPrimary dark:text-txtPrimary-dark">
                                            {t('wallet:receive_address')}
                                        </div>
                                        {renderAddressInput()}
                                    </div>
                                    {renderMemoInput()}
                                    <div className="relative mt-5">
                                        <div className="mb-1.5 text-sm font-medium text-txtPrimary dark:text-txtPrimary-dark">
                                            {t('common:amount')}
                                        </div>
                                        {renderAmountInput()}
                                    </div>
                                    <div className="relative mt-5">
                                        <div className="mb-1.5 text-sm font-medium text-txtPrimary dark:text-txtPrimary-dark">
                                            {t('wallet:blockchain_network')}
                                        </div>
                                        <div className="min-h-[55px] lg:min-h-[62px] px-3.5 py-2.5 md:px-5 md:py-4 flex items-center justify-between
                                                    rounded-xl border border-divider dark:border-divider-dark cursor-pointer select-none hover:!border-dominant"
                                             onClick={() => state.configs && setState({ openList: { networkList: !state.openList?.networkList } })}>
                                            {renderNetworkInput()}
                                        </div>
                                        {state.openList?.networkList && renderNetworkList()}
                                    </div>
                                    <div className="mt-4">
                                        {renderAssetAvailable()}
                                        {renderWdlFee()}
                                        {renderMinWdl()}
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
            </Background>
        </MaldivesLayout>
    )
}

const Background = styled.div.attrs({ className: 'w-full h-full pt-10' })`
  background-color: ${({ isDark }) => isDark ? colors.darkBlue1 : '#F8F9FA'};
`

const IGNORE_TOKEN = ['XBT_PENDING', 'TURN_CHRISTMAS_2017_FREE', 'USDT_BINANCE_FUTURES', 'SPIN_SPONSOR', 'SPIN_BONUS',
    'SPIN_CONQUEST', 'TURN_CHRISTMAS_2017', 'SPIN_CLONE']

const MEMO_INPUT = ['BinanceChain', 'VITE_CHAIN']

export default ExchangeWithdraw
