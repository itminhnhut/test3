import React, {useMemo, useState, useEffect} from 'react'
import {customTableStyles} from '../../TradeRecord/index'
import {ChevronDown} from 'react-feather'

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


const FuturesOrderHistoryVndc = ({onForceUpdate, pairConfig, hideOther}) => {
    const columns = useMemo(
        () => [
            {
                name: 'ID',
                selector: (row) => row?.displaying_id,
                sortable: true,
            },
            {
                name: 'Symbol',
                selector: (row) => row?.symbol,
                sortable: true,
            },
            {
                name: 'Open at',
                selector: (row) => row?.opened_at,
                cell: (row) => (
                    <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                        {formatTime(row?.opened_at)}
                    </span>
                ),
                sortable: true,
            },
            {
                name: 'Close at',
                selector: (row) => row?.closed_at,
                cell: (row) => (
                    <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                        {formatTime(row?.closed_at)}
                    </span>
                ),
                sortable: true,
            },
            {
                name: 'Type',
                selector: (row) => row?.type,
                sortable: true,
            },
            {
                name: 'Side',
                selector: (row) => row?.sdie,
                cell: (row) => <span
                    className={row?.side === VndcFutureOrderType.Side.BUY ? 'text-dominant' : 'text-red'}>{row?.side}</span>,
                sortable: true,
            },
            {
                name: 'Amount',
                cell: (row) => row?.quantity ? formatNumber(row?.quantity, 8, 0, true) : '-',
                sortable: true,
            },
            {
                name: 'Open Price',
                cell: (row) => row?.open_price ? formatNumber(row?.open_price, 0, 0, true) : '-',
                sortable: true,
            },
            {
                name: 'Close Price',
                cell: (row) => row?.close_price ? formatNumber(row?.close_price, 0, 0, true) : '-',
                sortable: true,
            },
            {
                name: 'TP/SL',
                cell: (row) => (
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
                cell: (row) => cellRenderRevenue(row),
                minWidth: '150px',
                sortable: true,
            },
            {
                name: 'Adjustment Details',
                cell: () => (
                    <div
                        className='px-[12px] py-1 bg-bgPrimary dark:bg-bgPrimary-dark text-xs text-dominant border border-dominant rounded-[4px]'>
                        View details
                    </div>
                ),
                sortable: true,
            },
        ],
        []
    )

    const [dataSource, setDataSource] = useState([])
    const [loading, setLoading] = useState(false)
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
            setTimeout(() => {
                setLoading(false)
                onForceUpdate()
            }, 2000)
        }
    }

    const cellRenderRevenue = (row) => {
        const profit = formatNumber(String(row?.profit).replace(',', ''), 0, 0, true)
        const percent = formatNumber((row?.profit / row?.margin), 2, 0, true);
        if (!row?.profit) return '-'
        return <div className={getPriceColor(Number(row?.profit)) + ' flex'}>
            {profit}
            <div>
                ({percent > 0 ? '+' : ''}
                {percent + '%'})
            </div>
        </div>
    }

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

export default FuturesOrderHistoryVndc
