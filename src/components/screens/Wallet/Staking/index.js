import { memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { ApiStatus } from 'redux/actions/const'
import { Eye, EyeOff } from 'react-feather'
import { API_GET_STAKING_ORDER } from 'redux/actions/apis'

import Axios from 'axios'
import useWindowSize from 'hooks/useWindowSize'
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'
import MCard from 'components/common/MCard'
import ReTable from 'components/common/ReTable'
import Empty from 'components/common/Empty'
import Skeleton from 'react-loading-skeleton'
import AssetName from 'components/wallet/AssetName'
import AssetLogo from 'components/wallet/AssetLogo'
import { formatTime, formatWallet } from 'redux/actions/utils'
import AssetValue from 'components/common/AssetValue'
import Skeletor from 'components/common/Skeletor'


const INITIAL_STATE = {
    hideAsset: false,
    hideSmallAsset: false,
    tableData: null,
    search: '',
    currentPage: 1,
    action: null, // action = null is wallet overview
    allAssets: null,
    tableTab: 0, // 0. staking, 1. redeem history
    columns: [],
    loadingTableData: false,
    page: 1,

    // ...
}

const PAGE_SIZE = 10

const StakingWallet = memo(() => {
    // Init State
    const [state, set] = useState(INITIAL_STATE)
    const setState = state => set(prevState => ({...prevState, ...state}))

    // Rdx


    // Use Hooks
    const [currentTheme, ] = useDarkMode()
    const { width } = useWindowSize()
    const { t } = useTranslation()

    // Helper
    const getOrder = async (page, tab) => {
        setState({ loadingTableData: true })

        try {
            let url
            if (tab === 0) {
                url = `${API_GET_STAKING_ORDER}&status=1&sort=create_at&page=${page}&pageSize=${PAGE_SIZE}`
            } else if (tab === 1) {
                url = `${API_GET_STAKING_ORDER}&list_status=0,2&sort=-updated_at&page=${page}&pageSize=${PAGE_SIZE}`
            }

            const { data  } = await Axios.get(url)
            if (data?.status === ApiStatus.SUCCESS && data?.data) {
                setState({ tableData: data.data })
            }
        } catch (e) {

        }  finally {
            setState({ loadingTableData: false })
        }
    }

    // Render Handler
    const renderTableTab = useCallback(() => {
        return (
            <div className="flex items-center px-4 md:px-5">
                <div className="flex flex-col items-center justify-center mr-8 lg:mr-12 cursor-pointer select-none"
                     onClick={() => setState({ tableTab: 0 })}>
                    <div className={state.tableTab === 0 ? 'font-bold text-sm xl:text-[16px] pb-2 xl:pb-4'
                        : 'font-bold text-txtSecondary dark:text-txtSecondary-dark text-sm xl:text-[16px] pb-2 xl:pb-4'}>
                        Staking
                    </div>
                    <div className={state.tableTab === 0 ? 'w-[30px] lg:w-[40px] h-[2px] bg-dominant' : 'w-[30px] lg:w-[40px] h-[2px] bg-dominant invisible'}/>
                </div>
                <div className="flex flex-col items-center justify-center cursor-pointer select-none"
                     onClick={() => setState({ tableTab: 1 })}>
                    <div className={state.tableTab === 1 ? 'font-bold text-sm xl:text-[16px] pb-2 xl:pb-4'
                        : 'font-bold text-txtSecondary dark:text-txtSecondary-dark text-sm xl:text-[16px] pb-2 xl:pb-4'}>
                        Redeem History
                    </div>
                    <div className={state.tableTab === 1 ? 'w-[30px] lg:w-[40px] h-[2px] bg-dominant' : 'w-[30px] lg:w-[40px] h-[2px] bg-dominant invisible'}/>
                </div>
            </div>
        )
    }, [state.tableTab])

    const renderOrder = useCallback(() => {
        let tableStatus
        const dataSource = dataHandler(state.tableData?.histories, state.loadingTableData, state.tableTab)

        if (!dataSource?.length) {
            tableStatus = <Empty/>
        }

        const columns = [
            { key: 'id', dataIndex: 'id', title: 'ID', fixed: 'left', align: 'left', width: 90 },
            { key: 'token_stake', dataIndex: 'token_stake', title: 'Token Stake', align: 'left', width: 128 },
            { key: 'stake_time', dataIndex: 'stake_time', title: 'Stake Time', align: 'left', width: 128 },
            { key: 'redeem_time', dataIndex: 'redeem_time', title: 'Redeem Time', align: 'left', width: 128 },
            { key: 'pool', dataIndex: 'pool', title: 'Pool', align: 'left', width: 80 },
            { key: 'amount', dataIndex: 'amount', title: 'Amount', align: 'right', width: 128 },
            { key: 'accruing_interest', dataIndex: 'accruing_interest', title: 'Accruing Interest', align: 'right', width: 128 },
            { key: 'annual_interest_rate', dataIndex: 'annual_interest_rate', title: 'Annual Interest Rate (APY)', align: 'right', width: 168 },
            { key: 'operation', dataIndex: 'operation', title: '', align: 'right', width: 100 }
        ]

        return (
            <ReTable useRowHover
                     data={dataSource}
                     columns={columns}
                     rowKey={item => `${item?.key}`}
                     loading={state.loadingTableData}
                     scroll={{ x: true }}
                     tableStatus={tableStatus}
                     tableStyle={{
                         paddingHorizontal: width >= 768 ? '1.75rem' : '0.75rem',
                         tableStyle: { minWidth: '992px !important' },
                         headerStyle: {},
                         rowStyle: {},
                         shadowWithFixedCol: width < 1366,
                         noDataStyle: {
                             minHeight: '480px'
                         }
                     }}
                     paginationProps={{
                         total: state.tableData?.count,
                         current: state.page,
                         pageSize: PAGE_SIZE,
                         onChange: (page) => setState({ page })
                     }}
            />
        )
    }, [state.tableTab, state.tableData, state.page, state.loadingTableData, width])

    const renderRedeemHistory = useCallback(() => {
        let tableStatus
        const dataSource = dataHandler(state.tableData?.histories, state.loadingTableData, state.tableTab)

        if (!dataSource?.length) {
            tableStatus = <Empty/>
        }

        const columns = [
            { key: 'id', dataIndex: 'id', title: 'ID', fixed: 'left', align: 'left', width: 90 },
            { key: 'redeem_time', dataIndex: 'redeem_time', title: 'Redeem Time', align: 'left', width: 128 },
            { key: 'asset', dataIndex: 'asset', title: 'Asset', align: 'left', width: 128 },
            { key: 'pool', dataIndex: 'pool', title: 'Pool', align: 'left', width: 90 },
            { key: 'amount', dataIndex: 'amount', title: 'Amount', align: 'right', width: 128 },
            { key: 'interest', dataIndex: 'interest', title: 'Interest', align: 'right', width: 100 },
            { key: 'status', dataIndex: 'status', title: 'Status', align: 'center', width: 138 },
        ]

        return (
            <ReTable useRowHover
                     data={dataSource}
                     columns={columns}
                     rowKey={item => `${item?.key}`}
                     loading={state.loadingTableData}
                     scroll={{ x: true }}
                     tableStatus={tableStatus}
                     tableStyle={{
                         paddingHorizontal: width >= 768 ? '1.75rem' : '0.75rem',
                         tableStyle: { minWidth: '768px !important' },
                         headerStyle: {
                             'font-size': '14px !imporant',
                         },
                         rowStyle: {},
                         shadowWithFixedCol: width < 1366,
                         noDataStyle: {
                             minHeight: '480px'
                         }
                     }}
                     paginationProps={{
                         total: state.tableData?.count,
                         current: state.page,
                         pageSize: PAGE_SIZE,
                         onChange: (page) => setState({ page })
                     }}
            />
        )
    }, [state.tableTab, state.tableData, state.loadingTableData, state.page, width])

    useEffect(() => {
        getOrder(state.page, state.tableTab)
    }, [state.page, state.tableTab])

    useEffect(() => {
        console.log('namidev-DEBUG: Staking State => ', state)
    }, [state])

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
                <div className="mt-8">
                    {state.tableTab === 0 && renderOrder()}
                    {state.tableTab === 1 && renderRedeemHistory()}
                </div>
            </MCard>
        </div>
    )
})

const dataHandler = (data, loading, tab) => {
    if (loading) {
        const loadingSkeleton = []

        for (let i = 0; i < 20; ++i) {
           tab === 0 ?
               loadingSkeleton.push({...ROW_LOADING_SKELETON_ORDER, key: `staking_order_loading__skeleton_${i}`})
               : loadingSkeleton.push({...ROW_LOADING_SKELETON_REDEEM_HISTORY, key: `staking_order_loading__skeleton_${i}`})
        }
        return loadingSkeleton
    }

    if (!Array.isArray(data) || !data || !data.length) return []

    const result = []

    data.forEach(stake => {
        if (tab === 0) {
            result.push({
                key: `staking_order__${stake?.id}`,
                id: <span>{stake?.display_id}</span>,
                token_stake: <div className="flex items-center">
                    <AssetLogo assetId={stake?.currency} size={24}/>
                    <span className="ml-1.5 font-bold">
                        <AssetName assetId={stake?.currency}/>
                    </span>
                </div>,
                stake_time: <span>{formatTime(stake?.start_at, 'HH:mm dd-MM-yyyy')}</span>,
                redeem_time: <span>{formatTime(stake?.redeem_at, 'HH:mm dd-MM-yyyy')}</span>,
                pool: <span>{stake?.metadata?.earn_config?.duration} day</span>,
                amount: <span><AssetValue value={stake?.amount}/> <AssetName assetId={stake?.currency}/></span>,
                accruing_interest: <span><AssetValue value={stake?.estimate_interest_by_day}/> <AssetName assetId={stake?.earn_currency}/></span>,
                annual_interest_rate: <span>{stake?.metadata?.earn_config?.interest_rate * 100}%</span>,
                operation: <div className="text-dominant cursor-pointer hover:opacity-80">
                    Cancel
                </div>
            })
        } else if (tab === 1) {
            result.push({
                key: `staking_redeem__${stake?.id}`,
                id: <span>{stake?.display_id}</span>,
                redeem_time: <span>{formatTime(stake?.redeem_at, 'HH:mm dd-MM-yyyy')}</span>,
                asset: <div className="flex items-center">
                             <AssetLogo assetId={stake?.currency} size={24}/>
                             <span className="ml-1.5 font-bold">
                                <AssetName assetId={stake?.currency}/>
                             </span>
                </div>,
                pool: <span>{stake?.metadata?.earn_config?.duration} day</span>,
                amount: <span><AssetValue value={stake?.amount}/> <AssetName assetId={stake?.currency}/></span>,
                interest: <span>{formatWallet(stake?.interest, 2)} <AssetName assetId={stake?.earn_currency}/></span>,
                status: <span>{stake?.status?.id}</span>
            // { key: 'id', dataIndex: 'id', title: 'ID', fixed: 'left', align: 'left', width: 90 },
            // { key: 'redeem_time', dataIndex: 'redeem_time', title: 'Redeem Time', align: 'left', width: 100 },
            // { key: 'token_name', dataIndex: 'token_name', title: 'Token Name', align: 'left', width: 128 },
            // { key: 'asset_code', dataIndex: 'asset_code', title: 'Asset', align: 'left', width: 100 },
            // { key: 'pool', dataIndex: 'pool', title: 'Pool', align: 'left', width: 90 },
            // { key: 'amount', dataIndex: 'amount', title: 'Amount', align: 'right', width: 138 },
            // { key: 'interest', dataIndex: 'interest', title: 'Interest', align: 'right', width: 100 },
            // { key: 'status', dataIndex: 'status', title: 'Status', align: 'center', width: 138 },
            })
        }
    })

    return result
}

const ROW_LOADING_SKELETON_ORDER = {
    id: <Skeletor width={65}/>,
    token_stake: <Skeletor width={65}/>,
    stake_time: <Skeletor width={65}/>,
    redeem_time: <Skeletor width={65}/>,
    pool: <Skeletor width={65}/>,
    amount: <Skeletor width={65}/>,
    accruing_interest: <Skeletor width={65}/>,
    annual_interest_rate: <Skeletor width={65}/>,
    operation: <Skeletor width={65}/>
}

const ROW_LOADING_SKELETON_REDEEM_HISTORY = {
    id: <Skeletor width={65}/>,
    redeem_time: <Skeletor width={65}/>,
    asset: <Skeletor width={65}/>,
    pool: <Skeletor width={65}/>,
    amount: <Skeletor width={65}/>,
    interest: <Skeletor width={65}/>,
    status: <Skeletor width={65}/>
}

export default StakingWallet
