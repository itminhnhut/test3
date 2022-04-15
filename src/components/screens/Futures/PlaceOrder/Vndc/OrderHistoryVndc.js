import { useMemo, useState, useEffect } from 'react'
import { customTableStyles } from '../../TradeRecord/index'
import { ChevronDown } from 'react-feather'

import DataTable from 'react-data-table-component'
import fetchApi from 'utils/fetch-api'
import { API_GET_FUTURES_ORDER } from 'redux/actions/apis'
import { ApiStatus } from 'redux/actions/const'
import Skeletor from 'src/components/common/Skeletor'
import FuturesTimeFilter from '../../TimeFilter'
import { FUTURES_RECORD_CODE } from '../../TradeRecord/RecordTableTab'
import { formatTime, formatNumber, getPriceColor } from 'redux/actions/utils'
import { VndcFutureOrderType } from './VndcFutureOrderType';


const FuturesOrderHistoryVndc = ({ pairConfig, onForceUpdate, onChangeTimePicker, pickedTime }) => {
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
                cell: (row) => <span className={row?.side === VndcFutureOrderType.Side.BUY ? 'text-dominant' : 'text-red'}>{row?.side}</span>,
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
                    <div className='px-[12px] py-1 bg-bgPrimary dark:bg-bgPrimary-dark text-xs text-dominant border border-dominant rounded-[4px]'>
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

    useEffect(() => {
        getOrders();
    }, [])

    const getOrders = async (filter) => {
        setLoading(true)
        try {
            const { status, data } = await fetchApi({
                url: API_GET_FUTURES_ORDER,
                options: { method: 'GET' },
                params: {
                    status: 1,
                    pageSize: 20,
                    page: 0,
                    ...filter
                },
            })

            if (status === ApiStatus.SUCCESS) {
                setDataSource(data.orders)
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

    return (
        <>
            <FuturesTimeFilter
                currentTimeRange={pickedTime}
                onChange={(pickedTime) =>
                    onChangeTimePicker(
                        FUTURES_RECORD_CODE.orderHistoryVndc,
                        pickedTime
                    )}
                onFilter={getOrders}
            />
            {loading ?
                <div className='px-[20px] mt-3'>
                    <Skeletor width={'100%'} height={30} />
                    <Skeletor width={'100%'} count={5} height={40} />
                </div>
                :
                <DataTable
                    responsive
                    fixedHeader
                    expandableRows
                    sortIcon={<ChevronDown size={8} strokeWidth={1.5} />}
                    data={dataSource}
                    columns={columns}
                    customStyles={customTableStyles}
                />
            }
        </>
    )
}

const data = [
    {
        id: 1,
        symbol: { pair: 'ETHUSDT', baseAsset: 'ETH', quoteAsset: 'USDT' },
        open_at: '2022-07-15  13:05:20',
        close_at: '2022-07-15  13:05:20',
        type: 'BUY LIMIT',
        amount: 5,
        openPrice: '-',
        closePrice: '-',
        stopLoss: 42.548,
        takeProfit: 47.154,
        revenue: '- VNDC',
    },
]

export default FuturesOrderHistoryVndc
