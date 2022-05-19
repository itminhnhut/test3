import React, { useState } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import LayoutMobile from 'components/common/layouts/LayoutMobile'
import CoinPairs from 'components/svg/CoinPairs'
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'
import colors from 'styles/colors'
import DollarCoin from 'components/svg/DollarCoin'
import cn from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { getS3Url } from 'redux/actions/utils'
import AssetLogo from 'components/wallet/AssetLogo'
import {values} from "lodash/object";

const TABS = {
    SPOT: 'SPOT',
    FUTURES: 'FUTURES',
}
const MarketScreen = () => {
    // * Initial State
    const [tabActive, setTabActive] = useState(TABS.SPOT)
    const [data, setData] = useState([])

    const [search, setSearch] = useState('')
    const [referencePrice, setReferencePrice] = useState([])

    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user) || {}
    const favoritePairs = useSelector((state) => state.futures.favoritePairs)
    const walletSpots = useSelector(state => values(state.wallet?.SPOT)) || [];
    const walletFutures = useSelector(state => state.wallet?.FUTURES) || [];

    const [themeMode] = useDarkMode()
    const router = useRouter()
    const { t } = useTranslation(['common'])

    const tabTitles = {
        [TABS.SPOT]: t('wallet:spot'),
        [TABS.FUTURES]: t('wallet:futures'),
    }

    console.log(walletSpots, '0000000000000')

    return (
        <LayoutMobile>
            <div className='h-[calc(100vh-80px)]'>
                <div className='market-mobile'>
                    <div className='p-4'>
                        <div className='flex items-center'>
                            <div className='flex items-center flex-1'>
                                <div className='w-[3.75rem] h-[3.75rem] rounded-full'>
                                    <img
                                        className='w-full h-full'
                                        src={user.avatar}
                                        alt={user.name}
                                    />
                                </div>
                                <div className='flex-1 ml-3'>
                                    <p className='text-txtPrimary dark:text-txtPrimary-dark font-semibold whitespace-nowrap'>
                                        Xin chào, {user.username}
                                    </p>
                                    <span className='text-txtSecondary dark:text-txtSecondary-dark font-medium'>
                                        {user.code}
                                    </span>
                                </div>
                            </div>
                            <div className='flex rounded p-2 border border-teal cursor-pointer'>
                                <img
                                    src={getS3Url(
                                        '/images/logo/nami_maldives.png'
                                    )}
                                    width='16'
                                    alt=''
                                />
                                <span className='text-xs font-medium text-teal ml-2'>
                                    Tải App
                                </span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='flex space-x-8 px-4 mt-6'>
                            {Object.values(TABS).map((t) => {
                                return (
                                    <div
                                        key={t}
                                        className='flex cursor-pointer text-txtSecondary dark:text-txtSecondary-dark'
                                        onClick={() => setTabActive(t)}
                                    >
                                        <span
                                            className={cn(
                                                'font-medium ml-2 pb-3 relative',
                                                {
                                                    'tab-active text-txtPrimary dark:text-txtPrimary-dark':
                                                        t === tabActive,
                                                }
                                            )}
                                        >
                                            {tabTitles[t]}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className='market-list flex flex-col flex-1 min-h-0 px-4 pt-6 bg-white dark:bg-darkBlue-2'>
                        <div>
                            <p className='text-txtSecondary dark:text-txtSecondary-dark'>
                                Total Balance
                            </p>
                            <div>
                                <span className='text-teal font-medium mr-1'>
                                    1.2345554 BTC
                                </span>
                                <span className='font-medium'>
                                    (33,850.29 USDT)
                                </span>
                            </div>
                        </div>
                        <div>
                            {[].map(asset => {
                                return <div className='flex justify-between my-4'>
                                    <div className='flex items-center'>
                                        <AssetLogo assetCode='ETH' />
                                        <div className='flex flex-col ml-3'>
                                        <span className='font-bold text-sm leading-5'>
                                            ETH
                                        </span>
                                            <span className='text-xs leading-4'>
                                            Ethereum
                                        </span>
                                        </div>
                                    </div>
                                    <div className='flex flex-col items-end'>
                                        <img
                                            width={10}
                                            src='/images/icon/ic_exchange_mobile.png'
                                            alt='Exchange icon'
                                        />
                                        <span className='font-medium text-sm'>
                                        1,1235.123
                                    </span>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </LayoutMobile>
    )
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                'common',
                'navbar',
                'wallet',
            ])),
        },
    }
}

export default MarketScreen
