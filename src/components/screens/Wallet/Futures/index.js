import { useCallback, useEffect, useState } from 'react'
import { formatWallet, getS3Url, getV1Url, walletLinkBuilder } from 'redux/actions/utils'
import { useTranslation } from 'next-i18next'
import { getAllWallet } from 'redux/actions/user'
import { useSelector } from 'react-redux'
import { Check, Eye, EyeOff, Search, X } from 'react-feather'
import { log, SECRET_STRING } from 'utils'

import useWindowSize from 'hooks/useWindowSize'
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'
import MCard from 'components/common/MCard'
import Link from 'next/link'
import AssetLogo from 'components/wallet/AssetLogo'
import ReTable, { RETABLE_SORTBY } from 'components/common/ReTable'
import { orderBy } from 'lodash'
import Skeletor from 'components/common/Skeletor'
import Empty from 'components/common/Empty'
import { WalletType } from 'redux/actions/const'
import { EXCHANGE_ACTION } from 'pages/wallet'

const INITIAL_STATE = {
    hideAsset: false,
    hideSmallAsset: false,
    tableData: null,
    search: '',
    currentPage: 1,
    action: null, // action = null is wallet overview
    allAssets: null,
}

const AVAILBLE_KEY = 'futures_available'
const FUTURES_ASSET = ['VNDC', 'NAMI', 'NAC', 'USDT']

const FuturesWallet = ({ estBtc, estUsd }) => {
    // Init State
    const [state, set] = useState(INITIAL_STATE)
    const setState = state => set(prevState => ({...prevState, ...state}))

    // Rdx
    const wallets = useSelector(state => state.wallet.FUTURES)
    const assetConfig = useSelector((state) => state.utils.assetConfig) || null

    // Use Hooks
    const [currentTheme, ] = useDarkMode()
    const { width } = useWindowSize()
    const { t } = useTranslation()

    // Helper
    const walletMapper = (allWallet, assetConfig) => {
        if (!allWallet || !assetConfig) return
        const mapper = []
        if (Array.isArray(assetConfig) && assetConfig?.length) {
            const futures = assetConfig.filter(o => FUTURES_ASSET.includes(o?.assetCode))
            futures && futures.forEach(item => allWallet?.[item.id]
                && mapper.push(
                    {
                        ...item,
                        [AVAILBLE_KEY]: allWallet?.[item?.id]?.value - allWallet?.[item?.id]?.locked_value,
                        wallet: allWallet?.[item?.id]
                    }))
        }
        setState({ allAssets: orderBy(mapper, [AVAILBLE_KEY, 'displayWeight'], ['desc']) })
    }

    // Render Handler
    const renderAssetTable = useCallback(() => {
        let tableStatus

        if (!state.tableData || !state.tableData?.length) {
            tableStatus = <Empty/>
        }

        return (
            <ReTable
                sort
                defaultSort={{ key: 'total', direction: 'desc' }}
                useRowHover
                data={state.tableData || []}
                columns={columns}
                rowKey={item => item?.key}
                loading={!state.tableData?.length}
                scroll={{ x: true }}
                tableStatus={tableStatus}
                tableStyle={{
                    paddingHorizontal: width >= 768 ? '1.75rem' : '0.75rem',
                    tableStyle: { minWidth: '888px !important' },
                    headerStyle: {},
                    rowStyle: {},
                    shadowWithFixedCol: width < 1366,
                    noDataStyle: {
                        minHeight: '480px'
                    }
                }}
                paginationProps={{
                    hide: true,
                }}
            />
        )
    }, [state.tableData, width])

    const renderEstWallet = useCallback(() => {
        return (
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
                            <span className="mr-1.5">{state.hideAsset ? SECRET_STRING : formatWallet(estBtc?.totalValue, estBtc?.assetDigit)}</span>
                            <span>BTC</span>
                        </div>
                        <div className="font-medium text-sm lg:text-[16px] xl:text-[18px] mt-1 sm:mt-0 sm:ml-4">{state.hideAsset ? `(${SECRET_STRING})` : `($ ${formatWallet(estUsd?.totalValue, estUsd?.assetDigit)})`}</div>
                    </div>
                </div>
                <div style={currentTheme === THEME_MODE.LIGHT ? { boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.04)' } : undefined}
                     className="px-3 py-2 flex items-center rounded-lg dark:bg-darkBlue-4 lg:px-5 lg:py-4 lg:rounded-xl mt-4 max-w-[368px] lg:max-w-max">
                    <div className="font-medium text-xs lg:text-sm pr-3 lg:pr-5 border-r border-divider dark:border-divider-dark">
                        <span className="text-txtSecondary dark:text-txtSecondary-dark">Available: </span> <span>{state.hideAsset ? `${SECRET_STRING}` : formatWallet(estBtc?.value, estBtc?.assetDigit)} BTC</span>
                    </div>
                    <div className="font-medium text-xs lg:text-sm pl-3 lg:pl-5">
                        <span className="text-txtSecondary dark:text-txtSecondary-dark">In Order: </span> <span>{state.hideAsset ? `${SECRET_STRING}` :formatWallet(estBtc?.locked, estBtc?.assetDigit)} BTC</span>
                    </div>
                </div>
            </div>
        )
    }, [state.hideAsset, currentTheme, estUsd, estBtc])

    useEffect(() => {
        walletMapper(wallets, assetConfig)
    }, [wallets, assetConfig])

    useEffect(() => {
        if (state.allAssets && Array.isArray(state.allAssets)) {
            const origin = dataHandler(state.allAssets, t)
            let tableData = origin
            if (state.hideSmallAsset) {
                tableData = origin.filter(item => item?.sortByValue?.total > 1)
            }
            tableData && setState({ tableData })
        }
    }, [state.allAssets, state.hideSmallAsset])

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="t-common whitespace-nowrap">
                    {t('common:overview')}
                </div>
                <div className="flex flex-wrap sm:flex-nowrap items-center w-full mt-3 sm:mt-0 sm:w-auto">
                    <Link href="/wallet/exchange/transfer?from=futures" prefetch>
                        <a className="py-1.5 md:py-2 text-center w-[45%] max-w-[180px] sm:w-[80px] md:w-[120px] sm:mr-0 sm:ml-2 bg-bgContainer dark:bg-bgContainer-dark rounded-md font-medium text-xs xl:text-sm text-dominant border border-dominant hover:text-white hover:!bg-dominant cursor-pointer">
                            {t('common:transfer')}
                        </a>
                    </Link>
                </div>
            </div>
            <MCard addClass="mt-5 !p-6 xl:!p-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    {renderEstWallet()}
                    <div className="hidden md:block">
                        <img src={getS3Url('/images/screen/wallet/wallet_overview_grp.png')} width="140" height="140" alt=""/>
                    </div>
                </div>
            </MCard>

            <div className="mt-16 sm:flex sm:items-center sm:justify-between">
                <div className="t-common">
                    Futures
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center select-none cursor-pointer"
                         onClick={() => setState({ hideSmallAsset: !state.hideSmallAsset })}>
                        <span className={state.hideSmallAsset ?
                            'inline-flex items-center justify-center w-[16px] h-[16px] rounded-[4px] border border-dominant bg-dominant'
                            : 'inline-flex items-center justify-center w-[16px] h-[16px] rounded-[4px] border border-gray-3 dark:border-darkBlue-4'}>
                            {state.hideSmallAsset ? <Check size={10} color="#FFFFFF"/> : null}
                        </span>
                        <span className="ml-3 text-xs">
                                Hide small balances
                            </span>
                    </div>
                </div>
            </div>

            <MCard
                style={currentTheme === THEME_MODE.LIGHT ? { boxShadow: '0px 7px 23px rgba(0, 0, 0, 0.05)' } : {}}
                addClass="mt-5 mb-32 pt-0 pb-0 px-0 overflow-hidden">
                {renderAssetTable()}
            </MCard>
        </div>
    )
}

const columns = [
    { key: 'asset', dataIndex: 'asset', title: 'Asset', fixed: 'left', align: 'left', width: 80 },
    { key: 'total', dataIndex: 'total', title: 'Total', align: 'right', width: 95 },
    { key: 'available', dataIndex: 'available', title: 'Available', align: 'right', width: 95 },
    { key: 'in_order', dataIndex: 'in_order', title: 'In Order', align: 'right', width: 95 },
    { key: 'operation', dataIndex: 'operation', title: '', align: 'left', width: 220 },
]
const ASSET_ROW_LIMIT = 8

const dataHandler = (data, translator) => {
    if (!data || !data?.length) {
        const skeleton = []
        for (let i = 0; i < ASSET_ROW_LIMIT; ++i) {
            skeleton.push({ ...ROW_LOADING_SKELETON, key: `asset_loading__skeleton_${i}`})
        }
        return skeleton
    }

    const result = []

    data.forEach(item => {
        result.push({
            key: `exchange_asset___${item?.assetName}`,
            asset: <div className="flex items-center">
                <AssetLogo assetCode={item?.assetName} size={32}/>
                <div className="ml-2">
                    <span>{item?.assetName}</span>
                </div>
            </div>,
            total: <span>{item?.wallet?.value ? formatWallet(item?.wallet?.value) : '0.0000'}</span>,
            available: <span>{item?.wallet?.value ? formatWallet(item?.wallet?.value - item?.wallet?.locked_value, 5, true) : '0.0000'}</span>,
            in_order: <span>{item?.wallet?.locked_value ? formatWallet(item?.wallet?.locked_value, 5, true) : '0.0000'}</span>,
            operation: renderOperationLink(item?.assetName, translator),
            [RETABLE_SORTBY]: {
                asset: item?.assetName,
                total: +item?.wallet?.value,
                available: +item?.wallet?.value - +item?.wallet?.locked_value,
                in_order: item?.wallet?.locked_value
            }
        })
    })

    return result
}

const ROW_LOADING_SKELETON = {
    asset: <Skeletor width={65}/>,
    total: <Skeletor width={65}/>,
    available: <Skeletor width={65}/>,
    in_order: <Skeletor width={65}/>,
    operation: <Skeletor width={125}/>
}


const renderOperationLink = (assetName, translator) => {
    return (
        <Link href={walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.TRANSFER, { from: 'futures', to: '', asset: assetName })} prefetch={false}>
            <a className="ml-10 py-1.5 w-[90px] flex items-center justify-center text-xs lg:text-sm text-dominant rounded-md border border-dominant hover:bg-dominant hover:text-white">
                {translator('common:transfer')}
            </a>
        </Link>
    )
}


export default FuturesWallet
