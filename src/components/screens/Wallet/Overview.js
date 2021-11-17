import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { Eye, EyeOff } from 'react-feather'
import { EXCHANGE_ACTION} from 'pages/wallet'
import { SECRET_STRING } from 'utils'

import MCard from 'components/common/MCard'
import Image from 'next/image'
import useWindowSize from 'hooks/useWindowSize'
import AssetLogo from 'components/wallet/AssetLogo'

const INITIAL_STATE = {
    hideAsset: false,

}

const OverviewWallet = () => {
    // Init State
    const [state, set] = useState(INITIAL_STATE)
    const setState = state => set(prevState => ({...prevState, ...state}))

    // Use Hooks
    const { t } = useTranslation()
    const { width } = useWindowSize()

    // Memmoized
    const limitExchangeAsset = useMemo(() => {
        let limit = 5
        if (width >= 1280) limit = 7
        return limit
    }, [width])

    // Render Handler
    const renderExchangeAsset = useCallback(() => {
        const items = []
        for (let i = 0; i < limitExchangeAsset; ++i) {
            items.push(
                <a href="/" className="mr-3">
                    <AssetLogo assetCode={null} size={30}/>
                </a>
            )
        }

        return items
    }, [limitExchangeAsset])

    return (
        <div className="pb-32">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="t-common whitespace-nowrap">
                    {t('common:overview')}
                </div>
                <div className="flex items-center w-full mt-3 sm:mt-0 sm:w-auto">
                    <a href={`/wallet/exchange?action=${EXCHANGE_ACTION.DEPOSIT}`}
                       className="py-1.5 md:py-2 text-center w-[30%] max-w-[100px] sm:w-[100px] mr-2 sm:mr-0 sm:ml-2 bg-bgContainer dark:bg-bgContainer-dark rounded-md font-medium text-xs lg:text-sm text-dominant border border-dominant hover:text-white hover:!bg-dominant cursor-pointer">
                        {t('common:deposit')}
                    </a>
                    <a href={`/wallet/exchange?action=${EXCHANGE_ACTION.WITHDRAW}`}
                       className="py-1.5 md:py-2 text-center w-[30%] max-w-[100px] sm:w-[100px] mr-2 sm:mr-0 sm:ml-2 bg-bgContainer dark:bg-bgContainer-dark rounded-md font-medium text-xs lg:text-sm text-dominant border border-dominant hover:text-white hover:!bg-dominant cursor-pointer">
                        {t('common:withdraw')}
                    </a>
                    <a href={`/wallet/exchange?action=${EXCHANGE_ACTION.TRANSFER}`}
                       className="py-1.5 md:py-2 text-center w-[30%] max-w-[100px] sm:w-[100px] mr-2 sm:mr-0 sm:ml-2 bg-bgContainer dark:bg-bgContainer-dark rounded-md font-medium text-xs lg:text-sm text-dominant border border-dominant hover:text-white hover:!bg-dominant cursor-pointer">
                        {t('common:transfer')}
                    </a>
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
                            <div className="rounded-md bg-teal-lightTeal min-w-[55px] min-h-[55px] md:min-w-[85px] md:min-h-[85px] flex items-center justify-center">
                                <Image className="-ml-0.5" src="/images/icon/ic_wallet_2.png" height={width >= 768 ? '48' : '28'} width={width >= 768 ? '48' : '28'}/>
                            </div>
                            <div className="ml-3 md:ml-6">
                                <div className="font-bold text-[24px] md:text-[28px] lg:text-[36px] text-dominant flex flex-wrap">
                                    <span className="mr-1.5">{state.hideAsset ? SECRET_STRING : '0,085334734'}</span>
                                    <span>BTC</span>
                                </div>
                                <div className="font-medium text-sm md:text-[18px] mt-1 md:mt-3 lg:mt-5">{state.hideAsset ? SECRET_STRING : '($59,983.45867)'}</div>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <Image src="/images/screen/wallet/wallet_overview_grp.png" width="140" height="140"/>
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
                            <Image src="/images/icon/ic_exchange.png" width="32" height="32"/>
                        </div>
                        <div className="ml-4 xl:ml-6">
                            <div className="flex flex-wrap items-center font-medium text-xs md:text-sm">
                                <span className="mr-4">Exchange</span>
                                <span className="inline-flex items-center">
                                    <Image src="/images/icon/ic_piechart.png" width="16" height="16"/>
                                    <a href={`/wallet/exchange?action=${EXCHANGE_ACTION.PORTFOLIO}`} className="ml-1 text-dominant hover:!underline">View Portfolio</a>
                                </span>
                            </div>
                            <div className="text-txtPrimary dark:text-txtPrimary-dark text-sm md:text-[18px] mt-0.5 whitespace-nowrap">
                                <span className="font-bold">0.270810996</span> <span className="text-xs font-medium">BTC <span className="text-txtSecondary dark:text-txtSecondary-dark ">~ $16,181.000</span></span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col lg:pl-4 xl:pl-7 sm:flex-row sm:items-center sm:justify-between sm:w-full lg:w-2/3 lg:border-l-2 lg:border-divider dark:lg:border-divider-dark">
                        <div className="flex items-center mt-4 lg:mt-0">
                            {renderExchangeAsset()}
                            <a href="/" className="mr-3">
                                <div className="min-w-[31px] min-h-[31px] w-[31px] h-[31px] flex items-center justify-center text-medium text-xs rounded-full border border-gray-5 dark:border-divider-dark bg-white dark:bg-darkBlue-3">
                                    +6
                                </div>
                            </a>
                        </div>
                        <div className="flex items-center mt-4 lg:mt-0">
                            <a  href={`/wallet/exchange?action=${EXCHANGE_ACTION.DEPOSIT}`}
                                className="w-[90px] h-[32px] mr-2 flex items-center justify-center cursor-pointer rounded-md bg-bgContainer dark:bg-bgContainer-dark text-xs lg:text-sm text-medium text-center py-1.5 border border-dominant text-dominant                                                           hover:text-white hover:!bg-dominant">
                                {t('common:deposit')}
                            </a>
                            <a  href={`/wallet/exchange?action=${EXCHANGE_ACTION.WITHDRAW}`}
                                className="w-[90px] h-[32px] mr-2 flex items-center justify-center cursor-pointer rounded-md bg-bgContainer dark:bg-bgContainer-dark text-xs lg:text-sm text-medium text-center py-1.5 border border-dominant text-dominant                                                           hover:text-white hover:!bg-dominant">
                                {t('common:withdraw')}
                            </a>
                            <a  href={`/wallet/exchange?action=${EXCHANGE_ACTION.TRANSFER}`}
                                className="w-[90px] h-[32px] mr-2 flex items-center justify-center cursor-pointer rounded-md bg-bgContainer dark:bg-bgContainer-dark text-xs lg:text-sm text-medium text-center py-1.5 border border-dominant text-dominant                                                           hover:text-white hover:!bg-dominant">
                                {t('common:transfer')}
                            </a>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-6 xl:px-10 xl:pl-6 xl:pr-5 flex flex-col lg:flex-row border-b border-divider dark:border-divider-dark">
                    <div className="md:w-1/3 flex items-center">
                        <div className="min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px]">
                            <Image src="/images/icon/ic_futures.png" width="32" height="32"/>
                        </div>
                        <div className="ml-4 xl:ml-6">
                            <div className="flex flex-wrap items-center font-medium text-xs md:text-sm">
                                <span className="mr-4">Futures</span>
                                {/*<span className="inline-flex items-center">*/}
                                {/*    <Image src="/images/icon/ic_piechart.png" width="16" height="16"/>*/}
                                {/*    <a href={`/wallet/exchange?action=${EXCHANGE_ACTION.PORTFOLIO}`} className="ml-1 text-dominant hover:!underline">View Portfolio</a>*/}
                                {/*</span>*/}
                            </div>
                            <div className="text-txtPrimary dark:text-txtPrimary-dark text-sm md:text-[18px] mt-0.5 whitespace-nowrap">
                                <span className="font-bold">0.270810996</span> <span className="text-xs font-medium">BTC <span className="text-txtSecondary dark:text-txtSecondary-dark ">~ $16,181.000</span></span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col lg:pl-4 xl:pl-7 sm:flex-row sm:items-center sm:justify-between sm:w-full lg:w-2/3 lg:border-l-2 lg:border-divider dark:lg:border-divider-dark">
                        <div className="flex items-center mt-4 font-medium lg:mt-0 text-xs lg:text-sm">
                            Trade assets using funds provied by third party with a Futures Account.<br/>
                            Transfer funds to your Futures Account to start trading.
                        </div>
                        <div className="flex items-center mt-4 lg:mt-0">
                            <a href={`/wallet/exchange?action=${EXCHANGE_ACTION.TRANSFER}`}
                               className="w-[90px] h-[32px] mr-2 flex items-center justify-center cursor-pointer rounded-md bg-bgContainer dark:bg-bgContainer-dark text-xs lg:text-sm text-medium text-center py-1.5 border border-dominant text-dominant                                                           hover:text-white hover:!bg-dominant">
                                {t('common:transfer')}
                            </a>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-6 xl:px-10 xl:pl-6 xl:pr-5 flex flex-col lg:flex-row border-b border-divider dark:border-divider-dark">
                    <div className="md:w-1/3 flex items-center">
                        <div className="min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px]">
                            <Image src="/images/icon/ic_staking.png" width="32" height="32"/>
                        </div>
                        <div className="ml-4 xl:ml-6">
                            <div className="flex flex-wrap items-center font-medium text-xs md:text-sm">
                                <span className="mr-4">Staking</span>
                                {/*<span className="inline-flex items-center">*/}
                                {/*    <Image src="/images/icon/ic_piechart.png" width="16" height="16"/>*/}
                                {/*    <a href={`/wallet/exchange?action=${EXCHANGE_ACTION.PORTFOLIO}`} className="ml-1 text-dominant hover:!underline">View Portfolio</a>*/}
                                {/*</span>*/}
                            </div>
                            <div className="text-txtPrimary dark:text-txtPrimary-dark text-sm md:text-[18px] mt-0.5 whitespace-nowrap">
                                <span className="font-bold">0.270810996</span> <span className="text-xs font-medium">BTC <span className="text-txtSecondary dark:text-txtSecondary-dark ">~ $16,181.000</span></span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col lg:pl-4 xl:pl-7 sm:flex-row sm:items-center sm:justify-between sm:w-full lg:w-2/3 lg:border-l-2 lg:border-divider dark:lg:border-divider-dark">
                        <div className="flex items-center mt-4 font-medium lg:mt-0 text-xs lg:text-sm">
                            <a href="/" className="mr-3">
                                <AssetLogo assetCode={null} size={30}/>
                            </a>
                            <a href="/" className="mr-3">
                                <AssetLogo assetCode={null} size={30}/>
                            </a>
                        </div>
                        <div className="flex items-center mt-4 lg:mt-0">
                            <a href={`/wallet/exchange?action=${EXCHANGE_ACTION.WITHDRAW}`}
                               className="w-[90px] h-[32px] mr-2 flex items-center justify-center cursor-pointer rounded-md bg-bgContainer dark:bg-bgContainer-dark text-xs lg:text-sm text-medium text-center py-1.5 border border-dominant text-dominant                                                           hover:text-white hover:!bg-dominant">
                                {t('common:withdraw')}
                            </a>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-6 xl:px-10 xl:pl-6 xl:pr-5 flex flex-col lg:flex-row">
                    <div className="md:w-1/3 flex items-center">
                        <div className="min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px]">
                            <Image src="/images/icon/ic_farming.png" width="32" height="32"/>
                        </div>
                        <div className="ml-4 xl:ml-6">
                            <div className="flex flex-wrap items-center font-medium text-xs md:text-sm">
                                <span className="mr-4">Farming</span>
                                {/*<span className="inline-flex items-center">*/}
                                {/*    <Image src="/images/icon/ic_piechart.png" width="16" height="16"/>*/}
                                {/*    <a href={`/wallet/exchange?action=${EXCHANGE_ACTION.PORTFOLIO}`} className="ml-1 text-dominant hover:!underline">View Portfolio</a>*/}
                                {/*</span>*/}
                            </div>
                            <div className="text-txtPrimary dark:text-txtPrimary-dark text-sm md:text-[18px] mt-0.5 whitespace-nowrap">
                                <span className="font-bold">0.270810996</span> <span className="text-xs font-medium">BTC <span className="text-txtSecondary dark:text-txtSecondary-dark ">~ $16,181.000</span></span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col lg:pl-4 xl:pl-7 sm:flex-row sm:items-center sm:justify-between sm:w-full lg:w-2/3 lg:border-l-2 lg:border-divider dark:lg:border-divider-dark">
                        <div className="flex items-center mt-4 font-medium lg:mt-0 text-xs lg:text-sm">
                            <a href="/" className="mr-3">
                                <AssetLogo assetCode={null} size={30}/>
                            </a>
                            <a href="/" className="mr-3">
                                <AssetLogo assetCode={null} size={30}/>
                            </a>
                        </div>
                        <div className="flex items-center mt-4 lg:mt-0">
                            <a href={`/wallet/exchange?action=${EXCHANGE_ACTION.WITHDRAW}`}
                               className="w-[90px] h-[32px] mr-2 flex items-center justify-center cursor-pointer rounded-md bg-bgContainer dark:bg-bgContainer-dark text-xs lg:text-sm text-medium text-center py-1.5 border border-dominant text-dominant                                                           hover:text-white hover:!bg-dominant">
                                {t('common:withdraw')}
                            </a>
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
