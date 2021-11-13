import showNotification from 'utils/notificationService'
import SwapReverse from 'components/svg/SwapReverse'
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'
import NumberFormat from 'react-number-format'
import AssetLogo from 'components/wallet/AssetLogo'
import fetchAPI from 'utils/fetch-api'
import SvgIcon from 'components/svg'
import colors from 'styles/colors'
import Link from 'next/link'
import * as Error from '../../../../redux/actions/apiError'
import Skeletor from 'components/common/Skeletor'
import useOutsideClick from 'hooks/useOutsideClick'

import { createRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAsync, useDebounce } from 'react-use'
import { getSwapEstimatePrice } from 'redux/actions/market'
import { useTranslation } from 'next-i18next'
import { find, orderBy } from 'lodash'
import { formatSwapValue, formatWallet, getDecimalScale, getV1Url, safeToFixed } from 'redux/actions/utils'
import { useSelector } from 'react-redux'
import { RefreshCw } from 'react-feather'
import { ApiStatus } from 'redux/actions/const'


const FEE_RATE = 0.1 / 100
const DEBOUNCE_TIMEOUT = 500

const DEFAULT_PAIR = {
    fromAsset: 'USDT',
    toAsset: 'BTC'
}
const REJECT_PREORDER = [
    'BROKER_ERROR',
    'PRICE_CHANGED',
    'INVALID_SWAP_REQUEST_ID',
    'INSTRUMENT_NOT_LISTED_FOR_TRADING_YET',
]

const fromAssetRef = createRef()
const toAssetRef = createRef()

const SwapModule = ({ width, pair }) => {
    // Init State
    const [state, set] = useState({
        init: false,
        loading: false,
        swapConfigs: null,
        estRate: null,
        loadingEstRate: false,
        shouldRefreshRate: false,
        preOrder: null,
        processingOrder: false,
        invoice: null,
        fromAsset: DEFAULT_PAIR.fromAsset,
        fromAmount: null,
        fromAssetList: null,
        toAsset: DEFAULT_PAIR.toAsset,
        toAmount: null,
        toAssetList: null,
        fromErrors: {},
        focus: 'from',
        inputHighlighted: null,
        changeEstRatePosition: false,
        openAssetList: {},
        openModal: false,
        //... Add new state here
    })
    const setState = state => set(prevState => ({...prevState, ...state}))

    // Get state from Rdx
    const wallets = useSelector(state => state.wallet.SPOT)

    // Refs
    const fromAssetListRef = useRef()
    const toAssetListRef = useRef()
    const fromAssetBtnRef = useRef()
    const toAssetBtnRef = useRef()
    const cancelBtnRef = useRef()

    // Memmoized Variable
    // CURRENT SWAP PAIRS CONFIG
    const config = useMemo(() => {
        return find(state.swapConfigs, sw => sw?.fromAsset === state.fromAsset && sw?.toAsset === state.toAsset) || {}
    }, [state.swapConfigs, state.fromAsset, state.toAsset])

    // AVAILABEL ASSET
    const availabelAsset = useMemo(() => {
        if (!config || !wallets) return { fromAsset: 0, toAsset: 0 }
        return {
            fromAsset: wallets?.[config?.fromAssetId]?.value - wallets?.[config?.fromAssetId]?.locked_value,
            toAsset: wallets?.[config?.toAssetId]?.value - wallets?.[config?.toAssetId]?.locked_value
        }
    }, [config, wallets])

    // Use Hooks
    const { t } = useTranslation(['navbar', 'common', 'error', 'convert'])
    const [currentTheme, ] = useDarkMode()

    useOutsideClick(fromAssetListRef, () => state.openAssetList?.from && setState({ openAssetList: { from: false } }))
    useOutsideClick(toAssetListRef, () => state.openAssetList?.to && setState({ openAssetList: { to: false } }))

    // Helper
    const fetchEstimateRate = async (requestQty, requestAsset, updateQty = true) => {
        if (!(requestQty && requestAsset)) return
        setState({ loadingEstRate: true, estRate: null })

        const { data, status } = await fetchAPI({
            url: '/api/v3/swap/estimate_price',
            options: {
                method: 'GET',
            },
            params: {
                fromAsset: state.fromAsset,
                toAsset: state.toAsset,
                requestQty,
                requestAsset,
            },
        })

        data && setState({ estRate: data })
        if (status === ApiStatus.SUCCESS && updateQty) {
            if (requestAsset === state.fromAsset) {
                setState({ toAmount: requestQty * data?.price })
            }
            if (requestAsset === state.toAsset) {
                setState({ fromAmount: requestQty / data?.price })
            }
        }

        setState({ loadingEstRate: false, shouldRefreshRate: false })
    }

    const fetchPreSwapOrder = async () => {
        setState({ loadingEstRate: true })

            const { status, data, code } = await fetchAPI({
                url: '/api/v3/swap/pre_order',
                options: {
                    method: 'POST',
                },
                params: {
                    fromAsset: state.fromAsset,
                    toAsset: state.toAsset,
                    fromQty: state.fromAmount,
                },
            })

            if (status === ApiStatus.SUCCESS && data) {
                setState({ preOrder: data, shouldRefreshRate: false })
                setTimeout(() => setState({ openModal: true }), 200)
            } else {
                const e = find(Error, { code })
                const msg = e ? t(`error:${e?.message}`) : t('error:COMMON_ERROR')
                showNotification({
                    message: `(${code}) ${msg}`,
                    title: t('common:failure'),
                    type: 'failure'
                })
            }

            setState({ loadingEstRate: false })
    }

    const onConfirmOrder = async () => {
        setState({ processingOrder: true })
        const result = await fetchAPI({
            url: '/api/v3/swap/confirm_order',
            options: {
                method: 'POST',
            },
            params: {
                preOrderId: preOrderData?.preOrderId,
            },
        })
        setState({ processingOrder: false })

        if (result?.status === ApiStatus.SUCCESS && result?.data) {
            const { displayingId, fromAsset, toAsset, fromQty, toQty, displayingPrice } = result?.data
            let msg = t('convert:swap_success', { fromQty, fromAsset, toQty, toAsset, displayingPrice })

            setState({ invoiceId: displayingId })
            showNotification({ msg, title: t('common:success'), type: 'success' })
        } else {
            const error = find(Error, { code: result?.code })
            if (REJECT_PREORDER.includes(error.message)) {
                setTimeout(() => setState({ openModal: false }), 200)
            }

            const description = error ? t(`error:${error.message}`) : t('error:COMMON_ERROR')
            showNotification({
                message: `(${result?.code}) ${description}`,
                title: 'Failure', type: 'failure'
            })

        }

    }

    const onClickFromAsset = (fromAsset) => {
        if (!state.swapConfigs?.length) return

        setState({ fromAsset, search: '', fromErrors: {} })
        fromAssetBtnRef?.current?.click()

        let result = state.swapConfigs.filter(sw => sw?.fromAsset === fromAsset)
        if (result) {
            result = result.map(r => ({
                ...sw,
                availabel: wallets?.[r.toAssetId]?.value - wallets?.[r?.toAssetId]?.locked_value
            }))
            result = orderBy(result, ['available', 'toAsset'], ['desc', 'asc'])
            if (result?.length) setState({ toAsset: result[0]?.toAsset })
        }
    }

    const onClickToAsset = (toAsset) => {
        setState({ toAsset, search: '' })
        toAssetBtnRef?.current?.click()
    }

    const onReverse = () => {
        if (state.focus === 'from') {
            fromAssetRef?.current?.focus()
        } else {
            toAssetRef?.current?.focus()
        }

        const bridge = state.fromAmount
        setState({
            fromAmount: state.toAmount,
            toAmount: bridge,
            fromAsset: state.toAsset,
            toAsset: state.fromAsset
        })
    }

    const onMaxiumQty = (mode = 'from', availabelAsset) => {
        if (!availabelAsset) return
        const _qty = availabelAsset

        if (mode === 'from') {
            if ((!_qty > 0)) return
            let max = +_qty
            if (state.fromAsset === config?.displayPriceAsset) {
                max = +_qty * (1 - FEE_RATE)
            }
            setState({ fromAmount: safeToFixed(max, getDecimalScale(+config.filters?.[0].stepSize)) })
        }

        if (mode === 'to') {
            if ((!_qty > 0)) return
            let max = +_qty
            if (state.toAsset === config?.displayPriceAsset) {
                max = +_qty * (1 - FEE_RATE)
            }
            setState({ toAmount: safeToFixed(max, getDecimalScale(+config.filters?.[0].stepSize)) })
        }
    }

    // Render Handler
    const renderDepositLink = useCallback(() => {
        return (
            <Link href={getV1Url(`/wallet?action=deposit&symbol=${state.fromAsset}`)}>
                <a className="font-medium text-dominant text-[14px] hover:!underline">
                    {t('common:deposit')} <span className="uppercase">{state.fromAsset}</span>
                </a>
            </Link>
        )
    }, [state.fromAsset])

    const renderFromInput = useCallback(() => {
        return (
            <div className="flex items-center">
                <div className="mt-1 flex items-center cursor-pointer select-none"
                     onClick={() => setState({ openAssetList: { from: !state.openAssetList?.from } })}>
                    <AssetLogo assetCode={null} size={20}/>
                    <span className="mx-2 font-bold uppercase">{state.fromAsset}</span>
                    <span className={state.openAssetList?.from ? 'rotate-180' : ''}>
                        <SvgIcon name="chevron_down" size={15}/>
                    </span>
                </div>
                <div className="flex items-center">
                    <NumberFormat
                        thousandSeparator
                        allowNegative={false}
                        getInputRef={fromAssetRef}
                        className="w-full px-[6px] text-[18px] md:text-[20px] text-right font-medium"
                        value={state.fromAmount}
                        onFocus={() => setState({ focus: 'from', inputHighlighted: 'from' })}
                        onBlur={() => setState({ inputHighlighted: null })}
                        onValueChange={({ value }) => setState({ fromAmount: value }) }
                        placeholder="0.0000"
                        decimalScale={getDecimalScale(+config.filters?.[0].stepSize)}
                    />
                    <div className="uppercase text-dominant cursor-pointer font-bold hover:opacity-50"
                         onClick={() => onMaxiumQty('from', availabelAsset?.fromAsset)}>
                        max
                    </div>
                </div>
            </div>
        )
    }, [state.fromAsset, state.fromAmount, state.openAssetList, availabelAsset])

    const renderFromAssetList = useCallback(() => {
        if (!state.openAssetList?.from) return null
        return (
            <div className="from_asset__list absolute left-4 top-full p-4 mt-2 w-full px-[20px] z-20 rounded-xl border
                            border-divider dark:border-divider-dark bg-gray-5 dark:bg-darkBlue-3 drop-shadow-common
                            dark:drop-shadow-none"
                 ref={fromAssetListRef}>
                Dropdown Here
            </div>
        )
    }, [state.fromAssetList, state.openAssetList])

    const renderToInput = useCallback(() => {
        return (
            <div className="flex items-center">
                <div className="mt-1 flex items-center cursor-pointer select-none"
                     onClick={() => setState({ openAssetList: { to: !state.openAssetList?.to } })}>
                    <AssetLogo assetCode={null} size={20}/>
                    <span className="mx-2 font-bold uppercase">{state.toAsset}</span>
                    <span className={state.openAssetList?.to ? 'rotate-180' : ''}>
                        <SvgIcon name="chevron_down" size={15}/>
                    </span>
                </div>
                <div className="flex items-center">
                    <NumberFormat
                        thousandSeparator
                        allowNegative={false}
                        getInputRef={toAssetRef}
                        className="w-full px-[6px] text-[18px] md:text-[20px] text-right font-medium"
                        value={state.toAmount}
                        onFocus={() => setState({ focus: 'to', inputHighlighted: 'to' })}
                        onBlur={() => setState({ inputHighlighted: null })}
                        onValueChange={({ value }) => setState({ toAmount: value })}
                        placeholder="0.0000"
                    />
                    <div className="uppercase text-dominant cursor-pointer font-bold hover:opacity-50"
                         onClick={() => onMaxiumQty('to', availabelAsset?.toAsset)}>
                        max
                    </div>
                </div>
            </div>
        )
    }, [state.toAsset, state.toAmount, state.openAssetList, availabelAsset])

    const renderToAssetList = useCallback(() => {
        if (!state.openAssetList?.to) return null
        return (
            <div className="to_asset__list absolute left-4 top-full p-4 mt-2 w-full px-[20px] z-20 rounded-xl border
                            border-divider dark:border-divider-dark bg-gray-5 dark:bg-darkBlue-3 drop-shadow-common
                            dark:drop-shadow-none"
                 ref={toAssetListRef}>
                Dropdown Here
            </div>
        )
    }, [state.toAssetList, state.openAssetList])

    const renderReverseBtn = useCallback(() => {
        return (
            <div className={state.openAssetList?.from ?
                'absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer invisible'
                : 'absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer'}
                 onClick={onReverse}>
                <SwapReverse color={currentTheme === THEME_MODE.DARK ? colors.darkBlue3 : undefined}
                             size={width < 1280 && 26}
                />
            </div>
        )
    }, [state.openAssetList, currentTheme])

    const renderRate = useCallback(() => {
        let price = 0

        const leftUnit = state.changeEstRatePosition ? state.toAsset : state.fromAsset
        const rightUnit = state.changeEstRatePosition ? state.fromAsset : state.toAsset

        if (
            state.estRate?.price &&
            state.estRate?.fromAsset === state.fromAsset &&
            state.estRate?.toAsset === state.toAsset
        ) {
            price = state.changeEstRatePosition ?
                    formatSwapValue(1 / state.estRate?.price)
                    : formatSwapValue(state.estRate?.price)
        }

        if ((!state.fromAmount > 0)) {
            return <span className="font-bold">{t('convert:please_input')}</span>
        }

        if (price === 0) {
            return <Skeletor width={100}/>
        }

        return (
            <span className="font-bold">
                1<span className="ml-2">{leftUnit}</span>
                <span className="mx-2">=</span>
                <span className="mr-2">{price}</span>
                <span>{rightUnit}</span>
            </span>
        )
    }, [config, state.fromAsset, state.fromAmount, state.toAsset, state.estRate, state.changeEstRatePosition])

    // Side Effect
    useAsync(async () => {
        !state.swapConfigs && setState({ loading: true })
        try {
            const options = {
                url: '/api/v3/swap/config',
                options: {
                    method: 'GET',
                },
            }
            const { status, data } = await fetchAPI(options)

            if (status === ApiStatus.SUCCESS && data) {
                setState({ swapConfigs: data })
            }
        } catch (e) {
            console.log(`Can't get swap config `, e)
        } finally {
            setState({ loading: false })
        }
    }, [])

    useEffect(() => {
        fromAssetRef?.current?.focus()
    }, [])

    useEffect(() => {
        if (pair && pair?.fromAsset && pair?.toAsset) {
            setState({
                fromAsset: pair?.fromAsset,
                toAsset: pair?.toAsset
            })
        }
    }, [pair])

    useEffect(() => {
        if (!state.swapConfigs || state.init) return
        const sizeFilter = find(config?.filters, { filterType: 'LOT_SIZE' })
        if (sizeFilter?.minQty > 0) {
            fetchEstimateRate(sizeFilter?.minQty, state.fromAsset, false)
            setState({ init: true })
        }
    }, [config, state.swapConfigs, state.fromAsset])

    useDebounce(() => {
        setState({ fromErrors: {} })
        const value = +state.fromAmount

        if (config?.filters && config.filters.length && value) {
            const min = +config?.filters[0].minQty
            const max = +config?.filters[0].maxQty
            const available = availabelAsset?.fromAsset

            if (value < min) {
                setState({ fromErrors: { min } })
            } else if (value > available) {
                setState({ fromErrors: { insufficient: available } })
            } else if (value > max) {
                setState({ fromErrors: { max } })
            }
        }

        if (state.focus === 'from') {
            if (!(+state.fromAmount > 0)) setState({ toAmount: '' })
            fetchEstimateRate(state.fromAmount, state.fromAsset)
        }
    }, DEBOUNCE_TIMEOUT, [state.fromAmount, state.fromAmount, state.focus, config, availabelAsset])

    useDebounce(() => {
        if (['from', 'to'].includes(state.focus)) {
            fetchEstimateRate(state.fromAmount, state.fromAsset)
        }
    }, DEBOUNCE_TIMEOUT, [`${state.fromAsset}_${state.toAsset}`])

    useDebounce(() => {
        if (state.focus === 'to') {
            if (!(+state.toAmount > 0)) setState({ fromAmount: '' })
            fetchEstimateRate(state.toAmount, state.toAsset)
        }
    }, DEBOUNCE_TIMEOUT, [state.toAmount, state.toAsset])

    return (
        <div className="flex items-center justify-center w-full h-full lg:block lg:w-auto lg:h-auto">
            <div className="relative p-4 pb-10 md:p-6 lg:p-8 min-w-[305px] md:w-[380px] xl:w-[454px] bg-bgContainer dark:bg-bgContainer-dark rounded-xl">
                <div className="flex mb-3 items-center justify-between font-bold">
                    {t('navbar:submenu.swap')}
                    {renderDepositLink()}
                </div>

                {/*INPUT WRAPPER*/}
                <div className="relative">
                    <div className={state.inputHighlighted === 'from' ?
                        'pt-[14px] pb-[18px] px-[20px] rounded-xl relative border border-dominant'
                        : 'pt-[14px] pb-[18px] px-[20px] rounded-xl relative border border-divider dark:border-divider-dark'}>
                        <div className="flex items-center justify-between text-[14px]">
                        <span className="text-txtSecondary dark:text-txtSecondary-dark">
                            {t('common:available_balance')}: {formatWallet(availabelAsset?.fromAsset)}
                        </span>
                            <span className="font-bold">
                                {t('common:from')}
                        </span>
                        </div>
                        {renderFromInput()}
                        {renderFromAssetList()}
                    </div>
                    <div className={state.inputHighlighted === 'to' ?
                        'pt-[14px] pb-[18px] px-[20px] rounded-xl border relative mt-2 border-dominant'
                        : 'pt-[14px] pb-[18px] px-[20px] rounded-xl border relative mt-2 border-divider dark:border-divider-dark'}>
                        <div className="flex items-center justify-between text-[14px]">
                        <span className="text-txtSecondary dark:text-txtSecondary-dark">
                            {t('common:available_balance')}: {formatWallet(availabelAsset?.toAsset)}
                        </span>
                            <span className="font-bold">
                               {t('common:to')}
                        </span>
                        </div>
                        {renderToInput()}
                        {renderToAssetList()}
                    </div>
                    {renderReverseBtn()}
                </div>
                {/*END:INPUT WRAPPER*/}

                {/*SWAP RATE*/}
                <div className="flex items-center justify-center mt-5">
                    <div className="text-sm flex items-center">
                        <span className="mr-1 text-txtSecondary dark:text-txtSecondary-dark">{t('common:rate')}:</span> {renderRate()}
                    </div>
                    <div className={(state.estRate && state.fromAmount) ?
                        'ml-2 p-1 rounded-md cursor-pointer ease-in duration-100 hover:bg-bgSecondary dark:hover:bg-bgSecondary-dark'
                        : 'ml-2 p-1 rounded-md cursor-not-allowed ease-in duration-100 hover:bg-bgSecondary dark:hover:bg-bgSecondary-dark'}
                         onClick={() => setState({ changeEstRatePosition: !state.changeEstRatePosition })}
                         onMouseOver={() => setState({ onHoverEstRateBtn: true })}
                         onMouseOut={() => setState({ onHoverEstRateBtn: false })}>
                        <RefreshCw
                            className={state?.onHoverEstRateBtn ? 'text-dominant' : 'text-txtSecondary dark:text-txtSecondary-dark'}
                            size={16}/>
                    </div>
                </div>
                {/*END:SWAP RATE*/}

                {/*SWAP BUTTON*/}
                <div className="mt-6 py-3 w-full rounded-xl text-center text-white text-sm font-bold bg-dominant select-none cursor-pointer hover:opacity-80">
                    {t('navbar:submenu.swap')}
                </div>
                {/*END:SWAP BUTTON*/}

                <div className="mt-5 text-center text-sm text-txtSecondary dark:text-txtSecondary-dark font-bold">
                    By using Nami Swap, you’re agree to the<br/>
                    <Link href="/">
                        <a className="text-dominant hover:!underline">Terms and Conditions</a>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SwapModule
