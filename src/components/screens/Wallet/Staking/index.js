import { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { getS3Url } from 'redux/actions/utils'
import { Check, Eye, EyeOff } from 'react-feather'
import { SECRET_STRING } from 'utils'

import useWindowSize from 'hooks/useWindowSize'
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'
import MCard from 'components/common/MCard'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { EarnWalletType } from 'redux/actions/const'

const INITIAL_STATE = {
    hideAsset: false,
    hideSmallAsset: false,
    tableData: null,
    search: '',
    currentPage: 1,
    action: null, // action = null is wallet overview
    allAssets: null,
}

const StakingWallet = () => {
    // Init State
    const [state, set] = useState(INITIAL_STATE)
    const setState = state => set(prevState => ({...prevState, ...state}))

    // Rdx


    // Use Hooks
    const [currentTheme, ] = useDarkMode()
    const { width } = useWindowSize()
    const { t } = useTranslation()

    useEffect(() => {

    }, [])

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="t-common whitespace-nowrap">
                    {t('common:overview')}
                </div>
                {/*<div className="flex flex-wrap sm:flex-nowrap items-center w-full mt-3 sm:mt-0 sm:w-auto">*/}
                {/*    <Link href="/wallet/exchange/transfer?from=futures" prefetch>*/}
                {/*        <a className="py-1.5 md:py-2 text-center w-[45%] max-w-[180px] sm:w-[80px] md:w-[120px] sm:mr-0 sm:ml-2 bg-bgContainer dark:bg-bgContainer-dark rounded-md font-medium text-xs xl:text-sm text-dominant border border-dominant hover:text-white hover:!bg-dominant cursor-pointer">*/}
                {/*            {t('common:transfer')}*/}
                {/*        </a>*/}
                {/*    </Link>*/}
                {/*</div>*/}
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
                            <div className="rounded-md bg-teal-lightTeal dark:bg-teal-5 min-w-[35px] min-h-[35px] md:min-w-[40px] md:min-h-[40px] flex items-center justify-center">
                                <img className="-ml-0.5" src={getS3Url('/images/icon/ic_wallet_2.png')} height={width >= 768 ? '25' : '14'} width={width >= 768 ? '25' : '14'} alt=""/>
                            </div>
                            <div className="ml-3 md:ml-6 sm:flex items-center">
                                <div className="font-bold text-[24px] lg:text-[28px] xl:text-[36px] text-dominant flex flex-wrap">
                                    <span className="mr-1.5">{state.hideAsset ? SECRET_STRING : '0,085334734'}</span>
                                    <span>BTC</span>
                                </div>
                                <div className="font-medium text-sm lg:text-[16px] xl:text-[18px] mt-1 sm:mt-0 sm:ml-4">{state.hideAsset ? SECRET_STRING : '($59,983.45867)'}</div>
                            </div>
                        </div>
                        <div style={currentTheme === THEME_MODE.LIGHT ? { boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.04)' } : undefined}
                             className="px-3 py-2 flex items-center rounded-lg dark:bg-darkBlue-4 lg:px-5 lg:py-4 lg:rounded-xl mt-4 max-w-[368px] lg:max-w-max">
                            <div className="font-medium text-xs lg:text-sm pr-3 lg:pr-5 border-r border-divider dark:border-divider-dark">
                                <span className="text-txtSecondary dark:text-txtSecondary-dark">Available: </span> <span>1.0011223344 BTC</span>
                            </div>
                            <div className="font-medium text-xs lg:text-sm pl-3 lg:pl-5">
                                <span className="text-txtSecondary dark:text-txtSecondary-dark">In Order: </span> <span>1.0011223344 BTC</span>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <img src={getS3Url('/images/screen/wallet/wallet_overview_grp.png')} width="140" height="140" alt=""/>
                    </div>
                </div>
            </MCard>

            <div className="mt-16 sm:flex sm:items-center sm:justify-between">
                <div className="t-common">
                    Futures
                </div>
                {/*<div className="flex items-center justify-between">*/}
                {/*    <div className="flex items-center select-none cursor-pointer"*/}
                {/*         onClick={() => setState({ hideSmallAsset: !state.hideSmallAsset })}>*/}
                {/*        <span className={state.hideSmallAsset ?*/}
                {/*            'inline-flex items-center justify-center w-[16px] h-[16px] rounded-[4px] border border-dominant bg-dominant'*/}
                {/*            : 'inline-flex items-center justify-center w-[16px] h-[16px] rounded-[4px] border border-gray-3 dark:border-darkBlue-4'}>*/}
                {/*            {state.hideSmallAsset ? <Check size={10} color="#FFFFFF"/> : null}*/}
                {/*        </span>*/}
                {/*        <span className="ml-3 text-xs">*/}
                {/*                Hide small balances*/}
                {/*            </span>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        </div>
    )
}

export default StakingWallet
