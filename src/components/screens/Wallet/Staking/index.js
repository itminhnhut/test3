import { useCallback, useEffect, useState } from 'react'
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
    tableTab: 0, // 0. staking, 1. redeem history

    // ...
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

    // Render Handler
    const renderTableTab = useCallback(() => {
        return (
            <div className="flex items-center px-4 md:px-5">
                <div className="flex flex-col items-center justify-center mr-8 lg:mr-12 cursor-pointer select-none"
                     onClick={() => setState({ tableTab: 0 })}>
                    <div className={state.tableTab === 0 ? 'font-bold text-sm lg:text-[16px] pb-2 lg:pb-4'
                        : 'font-bold text-txtSecondary dark:text-txtSecondary-dark text-sm lg:text-[16px] pb-2 lg:pb-4'}>
                        Staking
                    </div>
                    <div className={state.tableTab === 0 ? 'w-[30px] lg:w-[40px] h-[2px] bg-dominant' : 'w-[30px] lg:w-[40px] h-[2px] bg-dominant invisible'}/>
                </div>
                <div className="flex flex-col items-center justify-center cursor-pointer select-none"
                     onClick={() => setState({ tableTab: 1 })}>
                    <div className={state.tableTab === 1 ? 'font-bold text-sm lg:text-[16px] pb-2 lg:pb-4'
                        : 'font-bold text-txtSecondary dark:text-txtSecondary-dark text-sm lg:text-[16px] pb-2 lg:pb-4'}>
                        Redeem History
                    </div>
                    <div className={state.tableTab === 1 ? 'w-[30px] lg:w-[40px] h-[2px] bg-dominant' : 'w-[30px] lg:w-[40px] h-[2px] bg-dominant invisible'}/>
                </div>
            </div>
        )
    }, [state.tableTab])

    useEffect(() => {

    }, [])

    return (
        <div>
            <div className="flex items-center">
                <div className="t-common">
                    Staking
                </div>
                <div className="ml-5 pt-1.5 text-xs text-sm flex items-center text-txtSecondary dark:text-txtSecondary-dark cursor-pointer hover:opacity-80 select-none"
                     onClick={() => setState({ hideAsset: !state.hideAsset })}>
                    {state.hideAsset ? <EyeOff size={16} className="mr-1.5"/> : <Eye size={16} className="mr-1.5"/>}
                    <span>{t('wallet:hide_asset')}</span>
                </div>
            </div>

            <div style={currentTheme === THEME_MODE.DARK ? {backgroundColor: 'rgba(0, 200, 188, 0.2)'} : undefined}
                 className="mt-8 px-6 py-4 lg:px-8 lg:py-6 rounded-xl bg-teal-lightTeal">
                <div className="md:max-w-[88%] flex flex-wrap">
                    <div className="w-full sm:w-1/2 md:w-1/3">
                        <div className="max-w-[135px] font-medium text-sm lg:text-[16px] whitespace-nowrap border-b-2 border-dominant pb-1">
                            Staking Total Balance
                        </div>
                        <div className="mt-2 font-bold text-[24px] xl:mt-4 xl:text-[34px]">
                            0.04305009 BTC
                        </div>
                        <div className="mt-1.5 text-sm xl:mt-3 lg:text-[16px] xl:text-[18px] text-txtSecondary dark:text-txtSecondary-dark">
                            $2,509.31
                        </div>
                    </div>
                    <div className="mt-4 w-full sm:mt-0 sm:w-1/2 md:w-1/3">
                        <div className="max-w-[135px] font-medium text-sm lg:text-[16px] whitespace-nowrap border-b-2 border-dominant pb-1">
                            Estimate Interest
                        </div>
                        <div className="mt-2 font-bold text-[24px] xl:mt-4 xl:text-[34px]">
                            0.04305009 BTC
                        </div>
                        <div className="mt-1.5 text-sm xl:mt-3 lg:text-[16px] xl:text-[18px] text-txtSecondary dark:text-txtSecondary-dark">
                            $2,509.31
                        </div>
                    </div>
                    <div className="mt-4 w-full sm:w-1/2 md:mt-0 md:w-1/3">
                        <div className="max-w-[135px] font-medium text-sm lg:text-[16px] whitespace-nowrap border-b-2 border-dominant pb-1">
                            Total Interest Earned
                        </div>
                        <div className="mt-2 font-bold text-[24px] xl:mt-4 xl:text-[34px]">
                            0.04305009 BTC
                        </div>
                        <div className="mt-1.5 text-sm xl:mt-3 lg:text-[16px] xl:text-[18px] text-txtSecondary dark:text-txtSecondary-dark">
                            $2,509.31
                        </div>
                    </div>
                    <div className="mt-4 w-full sm:w-1/2 md:mt-6 md:w-1/3">
                        <div className="max-w-[135px] font-medium text-sm lg:text-[16px] whitespace-nowrap border-b-2 border-dominant pb-1">
                            Today's Interest Earned
                        </div>
                        <div className="mt-2 font-bold text-dominant text-[24px] xl:mt-4 xl:text-[34px]">
                            0.04305009 BTC
                        </div>
                        <div className="mt-1.5 text-sm xl:mt-3 lg:text-[16px] xl:text-[18px] text-txtSecondary dark:text-txtSecondary-dark">
                            $2,509.31
                        </div>
                    </div>
                </div>
            </div>

            <MCard addClass="mt-16 pt-10 pb-0 px-0 rounded-bl-none rounded-br-none overflow-hidden">
                {renderTableTab()}
            </MCard>
        </div>
    )
}

export default StakingWallet
