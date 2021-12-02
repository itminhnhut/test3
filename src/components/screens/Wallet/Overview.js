import { useCallback, useMemo, useState } from 'react'
import { formatNumber as formatWallet, getS3Url, getV1Url, setTransferModal } from 'redux/actions/utils'
import { Trans, useTranslation } from 'next-i18next'
import { Eye, EyeOff } from 'react-feather'
import { SECRET_STRING } from 'utils'
import { useDispatch } from 'react-redux'

import MCard from 'components/common/MCard'
import useWindowSize from 'hooks/useWindowSize'
import AssetLogo from 'components/wallet/AssetLogo'
import wallet from 'redux/reducers/wallet'
import Link from 'next/link'
import { WalletType } from 'redux/actions/const'
import AssetValue from 'components/common/AssetValue'
import AssetName from 'components/wallet/AssetName'

const INITIAL_STATE = {
    hideAsset: false,

    // ...
}

const OverviewWallet = (props) => {
    const { allAssets,
        stakingConfig,
        farmingConfig,
        exchangeEstBtc,
        exchangeRefPrice,
        futuresEstBtc,
        futuresRefPrice,
        stakingEstBtc,
        stakingRefPrice,
        farmingEstBtc,
        farmingRefPrice
    } = props

    // Init State
    const [state, set] = useState(INITIAL_STATE)
    const setState = state => set(prevState => ({...prevState, ...state}))

    // Use Hooks
    const { t } = useTranslation()
    const { width } = useWindowSize()
    const dispatch = useDispatch()

    // Memmoized
    const limitExchangeAsset = useMemo(() => {
        let limit = 5
        if (width >= 1280) limit = 7
        return limit
    }, [width])

    // Render Handler
    const renderExchangeAsset = useCallback(() => {
        if (!allAssets) return
        const items = []
        for (let i = 0; i < limitExchangeAsset; ++i) {
            const key = `overview__spot_${i}`
            items.push(
                <Link key={key}
                      href={`/wallet/exchange/deposit?type=crypto&asset=${allAssets[i]?.assetName}`}
                      prefetch={false}>
                    <a className="mr-3">
                        <AssetLogo assetCode={allAssets[i]?.assetName} size={30}/>
                    </a>
                </Link>
            )
        }

        return items
    }, [limitExchangeAsset, allAssets])

    const renderStakingList = useCallback(() => {
        if (!stakingConfig) return
        return stakingConfig.map(stk => {
            return (
                <Link key={`overview_staking__${stk?.asset_name}`}
                      href={`/wallet/staking?asset=${stk?.asset_name === 'NAC' ? 'NAMI' : stk?.asset_name}`}
                      prefetch={false}
                >
                    <a
                        className="mr-3">
                        <AssetLogo assetCode={stk?.asset_name === 'NAC' ? 'NAMI' : stk?.asset_name} size={30}/>
                    </a>
                </Link>
            )
        })
    }, [stakingConfig])

    const renderFarmingList = useCallback(() => {
        if (!farmingConfig) return
        return farmingConfig.map(frm => {
            return (
                <Link key={`overview_farming__${frm?.asset_name}`}
                      href={`/wallet/farming?asset=${frm?.asset_name === 'NAC' ? 'NAMI' : frm?.asset_name}`}
                      prefetch={false}>
                    <a  className="mr-3">
                        <AssetLogo assetCode={frm?.asset_name} size={30}/>
                    </a>
                </Link>
            )
        })
    }, [farmingConfig])

    return (
        <div className="pb-32">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="t-common whitespace-nowrap">
                    {t('common:overview')}
                </div>
                <div className="flex items-center w-full mt-3 sm:mt-0 sm:w-auto">
                    <Link href="/wallet/exchange/deposit?type=crypto" prefetch>
                        <a className="py-1.5 md:py-2 text-center w-[30%] max-w-[100px] sm:w-[100px] mr-2 sm:mr-0 sm:ml-2 bg-bgContainer dark:bg-bgContainer-dark rounded-md font-medium text-xs xl:text-sm text-dominant border border-dominant hover:text-white hover:!bg-dominant cursor-pointer">
                            {t('common:deposit')}
                        </a>
                    </Link>
                    <Link href="/wallet/exchange/withdraw?type=crypto" prefetch>
                        <a className="py-1.5 md:py-2 text-center w-[30%] max-w-[100px] sm:w-[100px] mr-2 sm:mr-0 sm:ml-2 bg-bgContainer dark:bg-bgContainer-dark rounded-md font-medium text-xs xl:text-sm text-dominant border border-dominant hover:text-white hover:!bg-dominant cursor-pointer">
                            {t('common:withdraw')}
                        </a>
                    </Link>
                    {/*<Link href="/wallet/exchange/transfer" prefetch>*/}
                        <div className="py-1.5 md:py-2 text-center w-[30%] max-w-[100px] sm:w-[100px] mr-2 sm:mr-0 sm:ml-2 bg-bgContainer dark:bg-bgContainer-dark rounded-md font-medium text-xs xl:text-sm text-dominant border border-dominant hover:text-white hover:!bg-dominant cursor-pointer"
                             onClick={() => dispatch(setTransferModal({ isVisible: true }))}>
                            {t('common:transfer')}
                        </div>
                    {/*</Link>*/}
                </div>
            </div>

            <MCard addClass="mt-5 !p-6 xl:!p-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center font-medium text-sm">
                            <div className="mr-2">{t('wallet:est_balance')}</div>
                            <div className="flex items-center text-txtSecondary dark:text-txtSecondary-dark cursor-pointer hover:opacity-80 select-none"
                                 onClick={() => setState({ hideAsset: !state.hideAsset })}>
                                {state.hideAsset ? <EyeOff size={16} className="mr-[4px]"/> : <Eye size={16} className="mr-[4px]"/>} {t('wallet:hide_asset')}
                            </div>
                        </div>
                        <div className="mt-5 flex items-center">
                            <div className="rounded-md bg-teal-lightTeal dark:bg-teal-5 min-w-[55px] min-h-[55px] md:min-w-[85px] md:min-h-[85px] flex items-center justify-center">
                                <img className="-ml-0.5" src={getS3Url('/images/icon/ic_wallet_2.png')} height={width >= 768 ? '48' : '28'} width={width >= 768 ? '48' : '28'} alt=""/>
                            </div>
                            <div className="ml-3 md:ml-6">
                                <div className="font-bold text-[24px] lg:text-[28px] xl:text-[36px] text-dominant flex flex-wrap">
                                    <span className="mr-1.5">{state.hideAsset ? SECRET_STRING
                                        : formatWallet(exchangeEstBtc?.value + exchangeEstBtc?.value, exchangeEstBtc?.assetDigit) }</span>
                                    <span>BTC</span>
                                </div>
                                <div className="font-medium text-sm lg:text-[16px] xl:text-[18px] mt-1 md:mt-3 xl:mt-5">
                                    {state.hideAsset ? SECRET_STRING
                                        : `$ ${formatWallet(exchangeRefPrice?.value + futuresRefPrice?.value, 2)}`}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <img src={getS3Url('/images/screen/wallet/wallet_overview_grp.png')} width="140" height="140" alt=""/>
                    </div>
                </div>
            </MCard>

            <div className="mt-16 t-common">
                {t('wallet:asset_balance')}
            </div>
            <MCard addClass="mt-5 !p-0">
                <div className="px-6 py-6 xl:px-10 xl:pl-6 xl:pr-5 flex flex-col lg:flex-row border-b border-divider dark:border-divider-dark">
                    <div className="md:w-1/3 flex items-center">
                        <div className="min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px]">
                            <img src={getS3Url('/images/icon/ic_exchange.png')} width="32" height="32" alt=""/>
                        </div>
                        <div className="ml-4 xl:ml-6">
                            <div className="flex flex-wrap items-center font-medium text-xs md:text-sm">
                                <span className="mr-4">Exchange</span>
                                <span className="inline-flex items-center">
                                    <img src={getS3Url('/images/icon/ic_piechart.png')} width="16" height="16" alt=""/>
                                    <a href={getV1Url('/wallet/account?type=portfolio')} className="ml-1 text-dominant hover:!underline">
                                         {t('common:portfolio')}
                                    </a>
                                </span>
                            </div>
                            <div className="text-txtPrimary dark:text-txtPrimary-dark text-sm md:text-[16px] xl:text-[18px] mt-0.5 whitespace-nowrap">
                                <span className="font-bold">{formatWallet(exchangeEstBtc?.value, exchangeEstBtc?.assetDigit)}</span> <span className="text-xs font-medium">BTC <span className="text-txtSecondary dark:text-txtSecondary-dark ">~ $ {formatWallet(exchangeRefPrice?.value, 2)}</span></span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col lg:pl-4 xl:pl-7 sm:flex-row sm:items-center sm:justify-between sm:w-full lg:w-2/3 lg:border-l-2 lg:border-divider dark:lg:border-divider-dark">
                        <div className="flex items-center mt-4 lg:mt-0">
                            {renderExchangeAsset()}
                            <Link href="/wallet/exchange/deposit?type=crypto" prefetch={false}>
                                <a className="mr-3">
                                    <div className="min-w-[31px] min-h-[31px] w-[31px] h-[31px] flex items-center justify-center text-medium text-xs rounded-full border border-gray-5 dark:border-divider-dark bg-white dark:bg-darkBlue-3">
                                        +6
                                    </div>
                                </a>
                            </Link>
                        </div>
                        <div className="flex items-center mt-4 lg:mt-0">
                            <Link href={`/wallet/exchange/deposit?type=crypto`} prefetch={false}>
                                <a  className="w-[90px] h-[32px] mr-2 flex items-center justify-center cursor-pointer rounded-md bg-bgContainer dark:bg-bgContainer-dark text-xs xl:text-sm text-medium text-center py-1.5 border border-dominant text-dominant                                                           hover:text-white hover:!bg-dominant">
                                    {t('common:deposit')}
                                </a>
                            </Link>
                            <Link href={`/wallet/exchange/withdraw?type=crypto`} prefetch={false}>
                                <a  className="w-[90px] h-[32px] mr-2 flex items-center justify-center cursor-pointer rounded-md bg-bgContainer dark:bg-bgContainer-dark text-xs xl:text-sm text-medium text-center py-1.5 border border-dominant text-dominant                                                           hover:text-white hover:!bg-dominant">
                                    {t('common:withdraw')}
                                </a>
                            </Link>
                            <div className="w-[90px] h-[32px] mr-2 flex items-center justify-center cursor-pointer rounded-md bg-bgContainer dark:bg-bgContainer-dark text-xs xl:text-sm text-medium text-center py-1.5 border border-dominant text-dominant                                                           hover:text-white hover:!bg-dominant"
                                 onClick={() => dispatch(setTransferModal({ isVisible: true }))}>
                                {t('common:transfer')}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-6 xl:px-10 xl:pl-6 xl:pr-5 flex flex-col lg:flex-row border-b border-divider dark:border-divider-dark">
                    {/*border-b*/}
                    <div className="md:w-1/3 flex items-center">
                        <div className="min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px]">
                            <img src={getS3Url('/images/icon/ic_futures.png')} width="32" height="32" alt=""/>
                        </div>
                        <div className="ml-4 xl:ml-6">
                            <div className="flex flex-wrap items-center font-medium text-xs md:text-sm">
                                <span className="mr-4">Futures</span>
                                <span className="inline-flex items-center">
                                    <img src={getS3Url('/images/icon/ic_piechart.png')} width="16" height="16" alt=""/>
                                    <a href={getV1Url('/wallet/account?type=futures')} className="ml-1 text-dominant hover:!underline">
                                         {t('common:portfolio')}
                                    </a>
                                </span>
                            </div>
                            <div className="text-txtPrimary dark:text-txtPrimary-dark text-sm md:text-[16px] xl:text-[18px] mt-0.5 whitespace-nowrap">
                                <span className="font-bold">{formatWallet(futuresEstBtc?.value, futuresEstBtc?.assetDigit)}</span> <span className="text-xs font-medium">BTC <span className="text-txtSecondary dark:text-txtSecondary-dark ">~ $ {formatWallet(futuresRefPrice?.value, 2)}</span></span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col lg:pl-4 xl:pl-7 sm:flex-row sm:items-center sm:justify-between sm:w-full lg:w-2/3 lg:border-l-2 lg:border-divider dark:lg:border-divider-dark">
                        <div className="flex items-center mt-4 pr-4 font-medium lg:mt-0 text-xs lg:text-sm">
                            <Trans>
                                {t('wallet:futures_overview')}
                            </Trans>
                        </div>
                        <div className="flex items-center mt-4 lg:mt-0">
                            <div onClick={() => dispatch(setTransferModal({ isVisible: true, fromWallet: WalletType.FUTURES, toWallet: WalletType.SPOT }))}
                               className="w-[90px] h-[32px] mr-2 flex items-center justify-center cursor-pointer rounded-md bg-bgContainer dark:bg-bgContainer-dark text-xs xl:text-sm text-medium text-center py-1.5 border border-dominant text-dominant hover:text-white hover:!bg-dominant">
                                {t('common:transfer')}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-6 xl:px-10 xl:pl-6 xl:pr-5 flex flex-col lg:flex-row border-b border-divider dark:border-divider-dark">
                    <div className="md:w-1/3 flex items-center">
                        <div className="min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px]">
                            <img src={getS3Url('/images/icon/ic_staking.png')} width="32" height="32" alt=""/>
                        </div>
                        <div className="ml-4 xl:ml-6">
                            <div className="flex flex-wrap items-center font-medium text-xs md:text-sm">
                                <span className="mr-4">Staking</span>
                                {/*<span className="inline-flex items-center">*/}
                                {/*    <Image src="/images/icon/ic_piechart.png" width="16" height="16"/>*/}
                                {/*    <a href={`/wallet/exchange?action=${EXCHANGE_ACTION.PORTFOLIO}`} className="ml-1 text-dominant hover:!underline">View Portfolio</a>*/}
                                {/*</span>*/}
                            </div>
                            <div className="text-txtPrimary dark:text-txtPrimary-dark text-sm md:text-[16px] xl:text-[18px] mt-0.5 whitespace-nowrap">
                                <span className="font-bold">
                                    <AssetValue assetCode="BTC"
                                                value={stakingEstBtc?.totalValue}/>
                                </span> <span className="text-xs font-medium"> <AssetName assetCode="BTC"/> <span className="text-txtSecondary dark:text-txtSecondary-dark ">
                                ~ $<AssetValue assetCode="USDT" assetDigit={2} value={stakingRefPrice?.totalValue}/>
                                </span></span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col lg:pl-4 xl:pl-7 sm:flex-row sm:items-center sm:justify-between sm:w-full lg:w-2/3 lg:border-l-2 lg:border-divider dark:lg:border-divider-dark">
                        {/*<div className="flex items-center mt-4 font-medium lg:mt-0 text-xs lg:text-sm">*/}
                        {/*    {renderStakingList()}*/}
                        {/*</div>*/}
                        <div className="flex items-center mt-4 pr-4 font-medium lg:mt-0 text-xs lg:text-sm">
                            {t('wallet:staking_overview')}
                        </div>
                        <div className="flex items-center mt-4 lg:mt-0">
                            <Link href={`/wallet/staking`} prefetch={false}>
                                <a className="w-[90px] h-[32px] mr-2 flex items-center justify-center cursor-pointer rounded-md bg-bgContainer dark:bg-bgContainer-dark text-xs xl:text-sm text-medium text-center py-1.5 border border-dominant text-dominant                                                           hover:text-white hover:!bg-dominant">
                                    {t('common:read_more')}
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-6 xl:px-10 xl:pl-6 xl:pr-5 flex flex-col lg:flex-row">
                    <div className="md:w-1/3 flex items-center">
                        <div className="min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px]">
                            <img src={getS3Url('/images/icon/ic_farming.png')} width="32" height="32" alt=""/>
                        </div>
                        <div className="ml-4 xl:ml-6">
                            <div className="flex flex-wrap items-center font-medium text-xs md:text-sm">
                                <span className="mr-4">Farming</span>
                                {/*<span className="inline-flex items-center">*/}
                                {/*    <Image src="/images/icon/ic_piechart.png" width="16" height="16"/>*/}
                                {/*    <a href={`/wallet/exchange?action=${EXCHANGE_ACTION.PORTFOLIO}`} className="ml-1 text-dominant hover:!underline">View Portfolio</a>*/}
                                {/*</span>*/}
                            </div>
                            <div className="text-txtPrimary dark:text-txtPrimary-dark text-sm md:text-[16px] xl:text-[18px] mt-0.5 whitespace-nowrap">
                                <span className="font-bold">
                                    <AssetValue assetCode="BTC"
                                                value={farmingEstBtc?.totalValue}/>
                                </span> <span className="text-xs font-medium"> <AssetName assetCode="BTC"/> <span className="text-txtSecondary dark:text-txtSecondary-dark ">
                                ~ $<AssetValue assetCode="USDT" assetDigit={2} value={farmingRefPrice?.totalValue}/>
                                </span></span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col lg:pl-4 xl:pl-7 sm:flex-row sm:items-center sm:justify-between sm:w-full lg:w-2/3 lg:border-l-2 lg:border-divider dark:lg:border-divider-dark">
                        {/*<div className="flex items-center mt-4 font-medium lg:mt-0 text-xs lg:text-sm">*/}
                        {/*    {renderFarmingList()}*/}
                        {/*</div>*/}
                        <div className="flex items-center mt-4 pr-4 font-medium lg:mt-0 text-xs lg:text-sm">
                            {t('wallet:farming_overview')}
                        </div>
                        <div className="flex items-center mt-4 lg:mt-0">
                            <Link href={`/wallet/farming`} prefetch={false}>
                                <a className="w-[90px] h-[32px] mr-2 flex items-center justify-center cursor-pointer rounded-md bg-bgContainer dark:bg-bgContainer-dark text-xs xl:text-sm text-medium text-center py-1.5 border border-dominant text-dominant                                                           hover:text-white hover:!bg-dominant">
                                    {t('common:read_more')}
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
            </MCard>

        </div>
    )
}

// const SvgWallet = () => {
//     return (
//
//     )
// }

export default OverviewWallet
