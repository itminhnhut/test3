import React, {useMemo, useState, useEffect} from 'react'
import {customTableStyles} from '../../TradeRecord/index'
import {ChevronDown, Share2} from 'react-feather'

import DataTable from 'react-data-table-component'
import fetchApi from 'utils/fetch-api'
import {API_GET_VNDC_FUTURES_HISTORY_ORDERS} from 'redux/actions/apis'
import {ApiStatus} from 'redux/actions/const'
import Skeletor from 'src/components/common/Skeletor'
import {formatTime, formatNumber, getPriceColor, getS3Url} from 'redux/actions/utils'
import {VndcFutureOrderType} from './VndcFutureOrderType';
import FuturesTimeFilter2 from "components/screens/Futures/TradeRecord/FuturesTimeFilter2";
import {FilterTradeOrder} from "components/screens/Futures/FilterTradeOrder";
import {tableStyle} from "config/tables";
import {useSelector} from "react-redux";
import TableLoader from "components/loader/TableLoader";
import { FUTURES_RECORD_CODE } from '../../TradeRecord/RecordTableTab';
import { useTranslation } from 'next-i18next';
import ShareFuturesOrder from 'components/screens/Futures/ShareFuturesOrder';

const FuturesOrderHistoryVndc = ({ pairPrice, pairConfig, onForceUpdate, hideOther, isAuth, onLogin }) => {
    const { t } = useTranslation()
    const [dataSource, setDataSource] = useState([])
    const [loading, setLoading] = useState(false)
    const [shareOrder, setShareOrder] = useState(null)
    const columns = useMemo(() => [
        {
            name: 'ID',
            cell: (row) => loading ? <Skeletor width={65} /> : row?.displaying_id,
            sortable: true,
            selector: (row) => row?.displaying_id,
        },
        {
            name: 'Symbol',
            cell: (row) => loading ? <Skeletor width={65} /> : row?.symbol,
            sortable: true,
            selector: (row) => row?.symbol,
        },
        {
            name: 'Open at',
            selector: (row) => row?.opened_at,
            cell: (row) => loading ? <Skeletor width={65} /> : (
                <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                    {formatTime(row?.opened_at)}
                </span>
            ),
            sortable: true,
        },
        {
            name: 'Close at',
            selector: (row) => row?.closed_at,
            cell: (row) => loading ? <Skeletor width={65} /> : (
                <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                    {formatTime(row?.closed_at)}
                </span>
            ),
            sortable: true,
        },
        {
            name: 'Type',
            cell: (row) => loading ? <Skeletor width={65} /> : row?.type,
            selector: (row) => row?.type,
            sortable: true,
        },
        {
            name: 'Side',
            selector: (row) => row?.sdie,
            cell: (row) => loading ? <Skeletor width={65} /> : <span className={row?.side === VndcFutureOrderType.Side.BUY ? 'text-dominant' : 'text-red'}>{row?.side}</span>,
            sortable: true,
        },
        {
            name: 'Amount',
            cell: (row) => loading ? <Skeletor width={65} /> : row?.quantity ? formatNumber(row?.quantity, 8, 0, true) : '-',
            sortable: true,
        },
        {
            name: 'Open Price',
            cell: (row) => loading ? <Skeletor width={100} /> : row?.open_price ? formatNumber(row?.open_price, 0, 0, true) : '-',
            sortable: true,
        },
        {
            name: 'Close Price',
            cell: (row) => loading ? <Skeletor width={100} /> : row?.close_price ? formatNumber(row?.close_price, 0, 0, true) : '-',
            sortable: true,
        },
        {
            name: 'TP/SL',
            cell: (row) => loading ? <Skeletor width={100} /> : (
                <div className='flex items-center'>
                    <div className='text-txtSecondary dark:text-txtSecondary-dark'>
                        <div>{formatNumber(row?.tp, 0, 0, true)}/</div>
                        <div>{formatNumber(row?.sl, 0, 0, true)}</div>
                    </div>
                </div>
            ),
            minWidth: '150px',
            sortable: true,
        },
        {
            name: 'Revenue',
            cell: (row) => loading ? <Skeletor width={100} /> : cellRenderRevenue(row),
            minWidth: '150px',
            sortable: true,
        },
        {
            name: 'Adjustment Details',
            cell: () => loading ? <Skeletor width={65} /> : (
                <div className='px-[12px] py-1 bg-bgPrimary dark:bg-bgPrimary-dark text-xs text-dominant border border-dominant rounded-[4px]'>
                    View details
                </div>
            ),
            sortable: true,
        },
    ], [loading]
    )

    const [filters, setFilters] = useState({
        timeFrom: null,
        timeTo: null,
        symbol: '',
        side: '',
    })

    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        pageSize: 10
    })

    const darkMode = useSelector(state => state.user.theme === 'dark');
    const allPairConfigs = useSelector((state) => state.futures.pairConfigs);

    const symbolOptions = useMemo(() => {
        return allPairConfigs?.filter(e => e.quoteAsset === 'VNDC')?.map(e => ({value: e.symbol}))
    }, [allPairConfigs])

    useEffect(() => {
        setFilters({...filters, symbol: hideOther ? pairConfig?.symbol : ''})
    }, [hideOther])


    useEffect(() => {
        getOrders();
    }, [pagination.page, pagination.pageSize])

    const getOrders = async () => {
        setLoading(true)
        try {
            const {status, data} = await fetchApi({
                url: API_GET_VNDC_FUTURES_HISTORY_ORDERS,
                options: {method: 'GET'},
                params: {
                    pageSize: pagination.pageSize,
                    page: pagination.page,
                    ...filters,
                    timeFrom: filters.timeFrom?.valueOf(),
                    timeTo: filters.timeTo?.valueOf(),
                },
            })

            if (status === ApiStatus.SUCCESS) {
                setDataSource(data.orders)
                setPagination({...pagination, total: data.total})
            } else {
                setDataSource([])
            }
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
            onForceUpdate()
        }
    }

    const cellRenderRevenue = (row) => {
        const profit = formatNumber(String(row?.profit).replace(',', ''), 0, 0, true)
        const percent = formatNumber((row?.profit / row?.margin), 2, 0, true);
        if (!row?.profit) return '-'
        return <div className='flex flex-row'>
            <div className={getPriceColor(Number(row?.profit))}>
                <div>
                    {profit} {pairConfig.quoteAsset}
                </div>
                <div>
                    ({percent > 0 ? '+' : ''}
                    {percent + '%'})
                </div>
            </div>
            <Share2 size={16} onClick={() => setShareOrder(row)} className='ml-1 cursor-pointer hover:opacity-60' />
        </div>
    }

    if (!isAuth) return <div className="cursor-pointer flex items-center justify-center h-full">
        <div
            className='w-[200px] bg-dominant text-white font-medium text-center py-2.5 rounded-lg cursor-pointer hover:opacity-80'
            onClick={onLogin}
        >
            {t('futures:order_table:login_to_continue')}
        </div>
    </div>

    const customStyles = {
        headCells: {
            style: {
                whiteSpace: 'nowrap',
            },
        },
        rows: {
            style: {
                marginBottom: '8px',
            },
        },
        pagination: {
            style: {
                ...tableStyle.pagination?.style,
                color: darkMode ? '#DBE3E6' : '#8B8C9B',
                backgroundColor: darkMode ? '#141523' : '#FFFFFF',
            },
            pageButtonsStyle: {
                color: darkMode ? '#DBE3E6' : '#8B8C9B',
                fill: darkMode ? '#DBE3E6' : '#8B8C9B',
                '&:hover:not(:disabled)': {
                    backgroundColor: darkMode ? '#212738' : '#DBE3E6',
                },
                '&:focus': {
                    outline: 'none',
                    backgroundColor: darkMode ? '#212738' : '#DBE3E6',
                },
                '&:disabled': {
                    cursor: 'unset',
                    color: darkMode ? '#8B8C9B' : '#d1d1d1',
                    fill: darkMode ? '#8B8C9B' : '#d1d1d1',
                },
            },
        },
    }

    return (
        <>
            <ShareFuturesOrder isClosePrice isVisible={!!shareOrder} order={shareOrder} pairPrice={pairPrice} onClose={() => setShareOrder(null)} />
            <div className='flex flex-row items-center'>
                <FuturesTimeFilter2
                    currentTimeRange={[filters.timeFrom, filters.timeTo]}
                    onChange={(value = []) => {
                        setFilters({...filters, timeFrom: value[0], timeTo: value[1]})
                    }}
                />
                <FilterTradeOrder
                    label='Symbol'
                    options={symbolOptions}
                    value={filters.symbol}
                    onChange={(value) => {
                        setFilters({...filters, symbol: value})
                    }}
                />
                <FilterTradeOrder
                    label='Side'
                    options={[{value: 'Buy'}, {value: 'Sell'}]}
                    value={filters.side}
                    onChange={(value) => {
                        setFilters({...filters, side: value})
                    }}
                />
                <div
                    onClick={() => getOrders()}
                    className="px-[8px] flex items-center py-[1px] mr-2 text-xs font-medium bg-bgSecondary dark:bg-bgSecondary-dark cursor-pointer hover:opacity-80 rounded-md">
                    <img className='w-[12px] h-[12px]' src={getS3Url("/images/icon/ic_search.png")}/>&nbsp; Search
                </div>
                <div
                    onClick={() => {
                        setFilters({
                            timeFrom: null,
                            timeTo: null,
                            symbol: '',
                            side: '',
                        })
                        getOrders()
                    }}
                    className="px-[8px] flex py-[1px] mr-2 text-xs font-medium bg-bgSecondary dark:bg-bgSecondary-dark cursor-pointer hover:opacity-80 rounded-md">
                    Reset
                </div>
            </div>
            <DataTable
                responsive
                fixedHeader
                expandableRows
                sortIcon={<ChevronDown size={8} strokeWidth={1.5}/>}
                data={dataSource}
                columns={columns}
                customStyles={customStyles}
                pagination
                paginationServer
                paginationTotalRows={pagination.total}
                onChangeRowsPerPage={(pageSize) => {
                    setPagination({...pagination, pageSize})
                }}
                onChangePage={(page) => {
                    setPagination({...pagination, page})
                }}
                currentPage={pagination.page}
                progressPending={loading}
                progressComponent={<TableLoader/>}
            />
        </>
    )
}

const data = [
    {
        id: 1,
    },
    {
        id: 2,
    },
    {
        id: 3,
    },
    {
        id: 4,
    },
    {
        id: 5,
    },
    {
        id: 6,
    },
]

export default FuturesOrderHistoryVndc
