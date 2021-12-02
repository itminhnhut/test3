import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { formatNumber as formatWallet, getS3Url, getV1Url, setTransferModal, walletLinkBuilder } from 'redux/actions/utils'
import { Check, Eye, EyeOff, Search, X } from 'react-feather'
import { EXCHANGE_ACTION } from 'pages/wallet'
import { SECRET_STRING } from 'utils'
import { WalletType } from 'redux/actions/const'
import { useDispatch } from 'react-redux'

import useWindowSize from 'hooks/useWindowSize'
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'
import MCard from 'components/common/MCard'
import ReTable, { RETABLE_SORTBY } from 'components/common/ReTable'
import Empty from 'components/common/Empty'
import Skeletor from 'components/common/Skeletor'
import RePagination from 'components/common/ReTable/RePagination'
import Link from 'next/link'
import AssetLogo from 'components/wallet/AssetLogo'

const INITIAL_STATE = {
    hideAsset: false,
    hideSmallAsset: false,
    reInitializing: false,
    tableData: null,
    search: '',
    currentPage: 1,
    action: null, // action = null is wallet overview
}

const ExchangeWallet = ({ allAssets, estBtc, estUsd }) => {
    // Init State
    const [state, set] = useState(INITIAL_STATE)
    const setState = state => set(prevState => ({...prevState, ...state}))

    // Use Hooks
    const r = useRouter()
    const { t } = useTranslation()
    const { width } = useWindowSize()
    const [currentTheme, ] = useDarkMode()
    const dispatch = useDispatch()

    // Render Handler
    const renderAssetTable = useCallback(() => {
        let tableStatus

        if (!state.tableData || !state.tableData?.length) {
            tableStatus = <Empty/>
        }

        const columns = [
            { key: 'asset', dataIndex: 'asset', title: t('common:asset'), fixed: 'left', align: 'left', width: 80 },
            { key: 'total', dataIndex: 'total', title: t('common:total'), align: 'right', width: 95 },
            { key: 'available', dataIndex: 'available', title: t('common:available_balance'), align: 'right', width: 95 },
            { key: 'in_order', dataIndex: 'in_order', title: t('common:in_order'), align: 'right', width: 95 },
            { key: 'operation', dataIndex: 'operation', title: '', align: 'left', width: 220 },
        ]

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
                    current: state.currentPage,
                    pageSize: ASSET_ROW_LIMIT,
                    onChange: (currentPage) => setState({ currentPage })
                }}
            />
        )
    }, [state.tableData, state.currentPage, width])

    const renderPagination = useCallback(() => {

        return (
            <div className="mt-10 mb-20 flex items-center justify-center">
                <RePagination total={state.tableData?.length}
                              current={state.currentPage}
                              pageSize={ASSET_ROW_LIMIT}
                              onChange={(currentPage) => setState({ currentPage })}
                              name="market_table___list"
                />
            </div>
        )
    }, [state.tableData, state.currentPage])

    const renderEstWallet = useCallback(() => {
        return (
            <>
                <div className="mt-5 flex items-center">
                    <div className="rounded-md bg-teal-lightTeal dark:bg-teal-5 min-w-[35px] min-h-[35px] md:min-w-[40px] md:min-h-[40px] flex items-center justify-center">
                        <img className="-ml-0.5" src={getS3Url('/images/icon/ic_wallet_2.png')} height={width >= 768 ? '25' : '14'} width={width >= 768 ? '25' : '14'} alt=""/>
                    </div>
                    <div className="ml-3 md:ml-6 sm:flex items-center">
                        <div className="font-bold text-[24px] lg:text-[28px] xl:text-[36px] text-dominant flex flex-wrap">
                            <span className="mr-1.5">{state.hideAsset ? SECRET_STRING : formatWallet(estBtc?.totalValue, estBtc?.assetDigit)}</span>
                            <span>BTC</span>
                        </div>
                        <div className="font-medium text-sm lg:text-[16px] xl:text-[18px] mt-1 sm:mt-0 sm:ml-4">{state.hideAsset ? `(${SECRET_STRING})`
                            : `($ ${formatWallet(estUsd?.totalValue, estUsd?.assetDigit)})`}</div>
                    </div>
                </div>
                <div style={currentTheme === THEME_MODE.LIGHT ? { boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.04)' } : undefined}
                     className="px-3 py-2 flex items-center rounded-lg dark:bg-darkBlue-4 lg:px-5 lg:py-4 lg:rounded-xl mt-4 max-w-[368px] lg:max-w-max">
                    <div className="font-medium text-xs lg:text-sm pr-3 lg:pr-5 border-r border-divider dark:border-divider-dark">
                        <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('common:available_balance')}: </span> <span>{state.hideAsset ? `${SECRET_STRING}`
                        : formatWallet(estBtc?.value, estBtc?.assetDigit)} BTC</span>
                    </div>
                    <div className="font-medium text-xs lg:text-sm pl-3 lg:pl-5">
                        <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('common:in_order')}: </span> <span>{state.hideAsset ? `${SECRET_STRING}`
                        : formatWallet(estBtc?.locked, estBtc?.assetDigit)} BTC</span>
                    </div>
                </div>
            </>
        )
    }, [estBtc, estUsd, state.hideAsset, currentTheme])

    useEffect(() => {
        if (r?.query?.action) {
           setState({ action: r.query.action })
        } else {
            setState({ action: null })
        }
    }, [r])

    useEffect(() => {
        if (state.action && Object.keys(EXCHANGE_ACTION).includes(state.action.toUpperCase())) {
            r.replace(`?action=${state.action}`)
        }
    }, [state.action])

    useEffect(() => {
        if (allAssets && Array.isArray(allAssets) && allAssets?.length) {
            const origin = dataHandler(allAssets, t, dispatch)
            let tableData = origin
            if (state.hideSmallAsset) {
                tableData = origin.filter(item => item?.sortByValue?.total > 1)
            }
            if (state.search) {
                tableData = tableData.filter(item => item?.sortByValue?.asset.includes(state.search?.toUpperCase()))
            }
            tableData && setState({ tableData })
        }
    }, [allAssets, state.hideSmallAsset, state.search])


    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="t-common whitespace-nowrap">
                    {t('common:overview')}
                </div>
                <div className="flex flex-wrap sm:flex-nowrap items-center w-full mt-3 sm:mt-0 sm:w-auto">

                    {/*<Link href={getV1Url('/wallet/account?type=portfolio')} prefetch>*/}
                        <a  href={getV1Url('/wallet/account?type=portfolio')}
                            className="py-1.5 md:py-2 text-center w-[45%] max-w-[180px] sm:w-[120px] md:w-[120px] lg:w-[150px]  mr-3.5 sm:mr-0 sm:ml-2 border border-dominant bg-dominant rounded-md font-medium text-xs xl:text-sm text-white hover:opacity-80 cursor-pointer whitespace-nowrap">
                            {t('common:portfolio')}
                        </a>
                    {/*</Link>*/}
                    <Link href={walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.DEPOSIT)}>
                        <a className="py-1.5 md:py-2 text-center w-[45%] max-w-[180px] sm:w-[80px] md:w-[120px] sm:mr-0 sm:ml-2 bg-bgContainer dark:bg-bgContainer-dark rounded-md font-medium text-xs xl:text-sm text-dominant border border-dominant hover:text-white hover:!bg-dominant cursor-pointer">
                            {t('common:deposit')}
                        </a>
                    </Link>

                    <div className="w-full h-[8px] sm:hidden"/>
                    <Link href={walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.WITHDRAW)}>
                        <a className="py-1.5 md:py-2 text-center w-[45%] max-w-[180px] sm:w-[80px] md:w-[120px]  mr-3.5 sm:mr-0 sm:ml-2 bg-bgContainer dark:bg-bgContainer-dark rounded-md font-medium text-xs xl:text-sm text-dominant border border-dominant hover:text-white hover:!bg-dominant cursor-pointer">
                            {t('common:withdraw')}
                        </a>
                    </Link>
                    {/*<Link href="/wallet/exchange/transfer?from=exchange" prefetch>*/}
                        <div onClick={() => dispatch(setTransferModal({ isVisible: true, fromWallet: WalletType.SPOT, toWallet: WalletType.FUTURES }))}
                             className="py-1.5 md:py-2 text-center w-[45%] max-w-[180px] sm:w-[80px] md:w-[120px] sm:mr-0 sm:ml-2 bg-bgContainer dark:bg-bgContainer-dark rounded-md font-medium text-xs xl:text-sm text-dominant border border-dominant hover:text-white hover:!bg-dominant cursor-pointer">
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
                        {renderEstWallet()}
                    </div>
                    <div className="hidden md:block">
                        <img src={getS3Url('/images/screen/wallet/wallet_overview_grp.png')} width="140" height="140" alt=""/>
                    </div>
                </div>
            </MCard>

            <div className="mt-16 lg:flex lg:items-center lg:justify-between">
                <div className="t-common">
                    Exchange
                </div>
                <div className="mt-2 lg:flex">
                    <div className="flex items-center justify-between lg:mr-5">
                        <div className="flex items-center select-none cursor-pointer lg:mr-5"
                             onClick={() => setState({ hideSmallAsset: !state.hideSmallAsset })}>
                        <span className={state.hideSmallAsset ?
                            'inline-flex items-center justify-center w-[16px] h-[16px] rounded-[4px] border border-dominant bg-dominant'
                            : 'inline-flex items-center justify-center w-[16px] h-[16px] rounded-[4px] border border-gray-3 dark:border-darkBlue-4'}>
                            {state.hideSmallAsset ? <Check size={10} color="#FFFFFF"/> : null}
                        </span>
                            <span className="ml-3 text-xs">
                                {t('wallet:hide_small_balance')}
                            </span>
                        </div>
                        {/*<div className="flex items-center rounded-[4px] lg:px-4 py-3 lg:bg-teal-lightTeal lg:dark:bg-teal-opacity select-none cursor-pointer hover:opacity-80">*/}
                        {/*    <img src={getS3Url('/images/logo/nami_maldives.png')} alt="" width="16" height="16"/>*/}
                        {/*    <a href="/" className="text-xs ml-3 text-dominant cursor-pointer">*/}
                        {/*        {width >= 640 ? t('wallet:convert_small', { asset: 'NAMI' }) : t('wallet:convert_small_mobile', { asset: 'NAMI' })}*/}
                        {/*    </a>*/}
                        {/*</div>*/}
                    </div>
                    <div
                        className="py-2 px-3 mt-4 lg:mt-0 lg:py-3 lg:px-5 flex items-center rounded-md bg-gray-5 dark:bg-darkBlue-4">
                        <Search size={width >= 768 ? 20 : 16}
                                className="text-txtSecondary dark:text-txtSecondary-dark"/>
                        <input className="text-sm w-full px-2.5"
                               value={state.search}
                               onChange={(e) => setState({ search: e?.target?.value })}
                               placeholder={t('common:search')}/>
                        {state.search && <X size={width >= 768 ? 20 : 16} className="cursor-pointer"
                                            onClick={() => setState({ search: '' })}/>}
                    </div>
                </div>
            </div>

            <MCard
                style={currentTheme === THEME_MODE.LIGHT ? { boxShadow: '0px 7px 23px rgba(0, 0, 0, 0.05)' } : {}}
                addClass="mt-5 pt-0 pb-0 px-0 overflow-hidden">
                {renderAssetTable()}
            </MCard>

            {renderPagination()}

            {/*<a href="/wallet/exchange?action=deposit" className={state.action === EXCHANGE_ACTION.DEPOSIT.toLowerCase() ? 'cursor-pointer mb-4 text-dominant' : 'cursor-pointer mb-4 hover:text-dominant'}>*/}
            {/*    {EXCHANGE_ACTION.DEPOSIT}*/}
            {/*</a><br/>*/}
            {/*<a href="/wallet/exchange?action=withdraw" className={state.action === EXCHANGE_ACTION.WITHDRAW.toLowerCase() ? 'cursor-pointer mb-4 text-dominant' : 'cursor-pointer mb-4 hover:text-dominant'}>*/}
            {/*    {EXCHANGE_ACTION.WITHDRAW}*/}
            {/*</a><br/>*/}
            {/*<a href="/wallet/exchange?action=transfer" className={state.action === EXCHANGE_ACTION.TRANSFER.toLowerCase() ? 'cursor-pointer mb-4 text-dominant' : 'cursor-pointer mb-4 hover:text-dominant'}>*/}
            {/*    {EXCHANGE_ACTION.TRANSFER}*/}
            {/*</a><br/>*/}
            {/*<a href="/wallet/exchange?action=portfolio" className={state.action === EXCHANGE_ACTION.PORTFOLIO.toLowerCase() ? 'cursor-pointer mb-4 text-dominant' : 'cursor-pointer mb-4 hover:text-dominant'}>*/}
            {/*    {EXCHANGE_ACTION.PORTFOLIO}*/}
            {/*</a>*/}
        </>
    )
}

const ASSET_ROW_LIMIT = 8

const dataHandler = (data, translator, dispatch) => {
    if (!data || !data?.length) {
        const skeleton = []
        for (let i = 0; i < ASSET_ROW_LIMIT; ++i) {
            skeleton.push({ ...ROW_LOADING_SKELETON, key: `asset_loading__skeleton_${i}`})
        }
        return skeleton
    }

    const result = []

    data.forEach(item => {
        let lockedValue = formatWallet(item?.wallet?.locked_value)
        if (lockedValue === 'NaN') {
            lockedValue = '0.0000'
        }

        result.push({
            key: `exchange_asset___${item?.assetName}`,
            asset: <div className="flex items-center">
                <AssetLogo assetCode={item?.assetName} size={32}/>
                <div className="ml-2">
                    <span>{item?.assetName}</span>
                </div>
            </div>,
            total: <span>{formatWallet(item?.wallet?.value)}</span>,
            available: <span>{formatWallet(item?.wallet?.value - item?.wallet?.locked_value)}</span>,
            in_order: <span>{item?.wallet?.locked_value ? lockedValue : '0.0000'}</span>,
            operation: renderOperationLink(item?.assetName, translator, dispatch),
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

const renderOperationLink = (assetName, translator, dispatch) => {
    return (
        <div className="flex pl-12">
            <a className="py-1.5 mr-3 w-[90px] flex items-center justify-center text-xs lg:text-sm text-dominant rounded-md border border-dominant hover:bg-dominant hover:text-white"
               href={walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.DEPOSIT, { type: 'crypto', asset: assetName })}>
                {/*`/wallet/exchange/deposit?type=crypto&asset=${assetName}`*/}
                {translator('common:deposit')}
            </a>
            <a className="py-1.5 mr-3 w-[90px] flex items-center justify-center text-xs lg:text-sm text-dominant rounded-md border border-dominant hover:bg-dominant hover:text-white"
               href={walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.WITHDRAW, { type: 'crypto', asset: assetName })}>
                {translator('common:withdraw')}
            </a>
            {ALLOWED_FUTURES_TRANSFER.includes(assetName) &&
            <div className="py-1.5 w-[90px] flex items-center justify-center text-xs lg:text-sm text-dominant rounded-md border border-dominant hover:bg-dominant hover:text-white"
                 onClick={() => dispatch(setTransferModal({ isVisible: true, fromWallet: WalletType.SPOT, toWallet: WalletType.FUTURES, asset: assetName }))}>
                {translator('common:transfer')}
            </div>}
        </div>
    )
}

const ALLOWED_FUTURES_TRANSFER = ['VNDC', 'USDT', 'NAMI', 'NAC']


const ROW_LOADING_SKELETON = {
    asset: <Skeletor width={65}/>,
    total: <Skeletor width={65}/>,
    available: <Skeletor width={65}/>,
    in_order: <Skeletor width={65}/>,
    operation: <Skeletor width={125}/>
}


export default ExchangeWallet
