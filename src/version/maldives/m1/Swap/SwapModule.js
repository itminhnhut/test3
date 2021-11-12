import SwapReverse from 'components/svg/SwapReverse'
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'
import AssetLogo from 'components/wallet/AssetLogo'
import fetchAPI from 'utils/fetch-api'
import SvgIcon from 'components/svg'
import colors from 'styles/colors'
import Link from 'next/link'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { getSwapEstimatePrice } from 'redux/actions/market'
import { useTranslation } from 'next-i18next'
import { formatWallet } from 'redux/actions/utils'
import { useSelector } from 'react-redux'
import { RefreshCw } from 'react-feather'
import { ApiStatus } from 'redux/actions/const'
import { find } from 'lodash'
import { useDebounce } from 'react-use'

const DEFAULT_PAIR = {
    fromAsset: 'USDT',
    toAsset: 'BTC'
}

const DEBOUNCE_TIMEOUT = 500

const SwapModule = ({ width }) => {
    // Init State
    const [state, set] = useState({
        init: false,
        loading: false,
        loadingEstRate: false,
        swapConfigs: null,
        estRate: null,
        shouldRefreshRate: false,
        fromAsset: DEFAULT_PAIR.fromAsset,
        fromAmount: null,
        toAsset: DEFAULT_PAIR.toAsset,
        toAmount: null,
        fromErrors: {},
        focus: 'from',

    })
    const setState = state => set(prevState => ({...prevState, ...state}))

    // Get state from Rdx
    const wallets = useSelector(state => state.wallet.SPOT)

    // Memmoized Variable
    // CURRENT SWAP PAIRS CONFIG
    const config = useMemo(() => {
        return find(state.swapConfigs, sw => sw?.fromAsset === state.fromAsset && sw?.toAsset === state.toAsset) || {}
    }, [state.swapConfigs, state.fromAsset, state.toAsset])

    // AVAILABEL ASSET
    const availabelAsset = useMemo(() => {
        if (!config || !wallets) return { fromAsset: '00.0000', toAsset: '00.0000' }
        return {
            fromAsset: formatWallet(wallets?.[config?.fromAssetId]?.value - wallets?.[config?.fromAssetId]?.locked_value),
            toAsset: formatWallet(wallets?.[config?.toAssetId]?.value - wallets?.[config?.toAssetId]?.locked_value)
        }
    }, [config, wallets])


    // Use Hooks
    const { t } = useTranslation(['navbar', 'common'])
    const [currentTheme, ] = useDarkMode()

    // Helper
    const getSwapConfigs = async () => {
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
    }

    const fetchEstimateRate = async (requestQty, requestAsset, updateQty = true) => {
        setState({ loadingEstRate: true, estRate: null })

        try {
            const {status, data: estRate} = await getSwapEstimatePrice({
                fromAsset: state.fromAsset.toString(),
                toAsset: state.toAsset.toString(),
                requestQty,
                requestAsset,
            })

            if (status === ApiStatus.SUCCESS && estRate) {
                setState({ estRate })

                if (updateQty && estRate?.price) {
                   if (requestAsset === state.fromAsset) {
                      setState({ toAmount: requestQty / estRate.price })
                   }
                   if (requestAsset === state.toAsset) {
                     setState({ fromAmount: requestQty / estRate.price })
                   }
                }
            }
        } catch (e) {
            console.log(`Can't estimate rate `, e)
        } finally {
             setState({ loadingEstRate: false, shouldRefreshRate: false })
        }
    }

    // Render Handler
    const renderDepositLink = useCallback(() => {
        return (
            <Link href="/">
                <a className="font-medium text-dominant text-[14px] hover:!underline">
                    {t('common:deposit')} <span className="uppercase">{state.fromAsset}</span>
                </a>
            </Link>
        )
    }, [state.fromAsset])

    const renderFromInput = useCallback(() => {
        return (
            <div className="flex items-center">
                <div className="mt-1 flex items-center cursor-pointer">
                    <AssetLogo assetCode={null} size={20}/>
                    <span className="mx-2 font-bold uppercase">{state.fromAsset}</span>
                    <SvgIcon name="chevron_down" size={15}/>
                </div>
                <input className="w-2/3 px-[6px] text-[18px] md:text-[20px] text-right font-medium"
                       type="number"
                       placeholder="0.00"
                />
                <div className="uppercase text-dominant cursor-pointer font-bold hover:opacity-50">
                    max
                </div>
            </div>
        )
    }, [state.fromAsset])

    const renderToInput = useCallback(() => {
        return (
            <div className="flex items-center">
                <div className="mt-1 flex items-center cursor-pointer">
                    <AssetLogo assetCode={null} size={20}/>
                    <span className="mx-2 font-bold uppercase">{state.toAsset}</span>
                    <SvgIcon name="chevron_down" size={15}/>
                </div>
                <input className="w-2/3 px-[6px] text-[18px] md:text-[20px] text-right font-medium"
                       type="number"
                       placeholder="0.00"
                />
                <div className="uppercase text-dominant cursor-pointer font-bold hover:opacity-50">
                    max
                </div>
            </div>
        )
    }, [state.toAsset])

    // Side Effect
    useEffect(() => {
        getSwapConfigs()
    }, [])

    useEffect(() => {
        if (!state.swapConfigs || init) return
        const sizeFilter = find(config?.filters, { filterType: 'LOT_SIZE' })
        if (sizeFilter?.minQty > 0) {
            fetchEstimateRate(sizeFilter?.minQty, state.fromAsset, false);
            setState({ init: true });
        }
    }, [state.swapConfigs, state.fromAsset])

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

    }, DEBOUNCE_TIMEOUT, [state.fromAmount, state.fromAmount, config, availabelAsset])

    useDebounce(() => {
        if (['from', 'to'].includes(state.focus)) {
            fetchEstimateRate(state.fromAmount, state.fromAsset)
        }
    }, DEBOUNCE_TIMEOUT, [state.fromAsset, state.toAsset, state.fromAmount, state.focus])

    useDebounce(() => {
        if (state.focus === 'to') {
            if (!(+state.fromAmount > 0)) setState({ fromAmount: '' })
            fetchEstimateRate(state.fromAmount, state.toAsset)
        }
    }, DEBOUNCE_TIMEOUT, [state.toAmount, state.toAsset, state.focus])

    return (
        <div className="flex items-center justify-center w-full h-full lg:block lg:w-auto lg:h-auto">
            <div className="p-4 pb-10 md:p-6 lg:p-8 min-w-[305px] md:w-[380px] xl:w-[454px] bg-bgContainer dark:bg-bgContainer-dark rounded-xl">
                <div className="flex mb-3 items-center justify-between font-bold">
                    {t('navbar:submenu.swap')}
                    {renderDepositLink()}
                </div>

                {/*INPUT WRAPPER*/}
                <div className="relative">
                    <div className="pt-[14px] pb-[18px] px-[20px] rounded-xl border border-divider dark:border-divider-dark">
                        <div className="flex items-center justify-between text-[14px]">
                        <span className="text-txtSecondary dark:text-txtSecondary-dark">
                            {t('common:available_balance')}: {availabelAsset?.fromAsset}
                        </span>
                            <span className="font-bold">
                                {t('common:from')}
                        </span>
                        </div>
                        {renderFromInput()}
                    </div>
                    <div className="pt-[14px] pb-[18px] px-[20px] rounded-xl border border-divider dark:border-divider-dark mt-2">
                        <div className="flex items-center justify-between text-[14px]">
                        <span className="text-txtSecondary dark:text-txtSecondary-dark">
                            {t('common:available_balance')}: {availabelAsset?.toAsset}
                        </span>
                            <span className="font-bold">
                               {t('common:to')}
                        </span>
                        </div>
                        {renderToInput()}
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer">
                        <SwapReverse color={currentTheme === THEME_MODE.DARK ? colors.darkBlue3 : undefined}
                                     size={width < 1280 && 26}
                        />
                    </div>
                </div>
                {/*END:INPUT WRAPPER*/}

                {/*SWAP RATE*/}
                <div className="flex items-center justify-center mt-5">
                    <div className="text-sm">
                        {t('common:rate')}: <span className="font-bold">1 VNDC = 999,999,999 USDT</span>
                    </div>
                    <div className="ml-2 pt-2 pr-2 pb-2 cursor-pointer">
                        <RefreshCw size={16} color={currentTheme === THEME_MODE.DARK ? colors.grey1 : colors.darkBlue5}/>
                    </div>
                </div>
                {/*END:SWAP RATE*/}

                {/*SWAP BUTTON*/}
                <div className="mt-6 py-3 w-full rounded-xl text-center text-white text-sm font-bold bg-dominant cursor-pointer hover:opacity-80">
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
