import { useMemo } from 'react'
import { formatNumber, formatTime } from 'redux/actions/utils'
import { FUTURES_RECORD_CODE } from './RecordTableTab'
import { customTableStyles } from './index'
import { ChevronDown } from 'react-feather'

import DataTable from 'react-data-table-component'
import FuturesTimeFilter from '../TimeFilter'

const FuturesTxHistory = ({ pickedTime, onChangeTimePicker, pairConfig }) => {
    const columns = useMemo(
        () => [
            {
                name: 'Time',
                selector: (row) => row?.created_at,
                cell: (row) =>
                    formatTime(row?.created_at, 'dd-MM-yyyy HH:mm:ss'),
                minWidth: '150px',
                sortable: true,
            },
            {
                name: 'Type',
                selector: (row) => row?.type,
                cell: () => <span>Limit</span>,
                sortable: true,
            },
            {
                name: 'Amount',
                selector: (row) => row?.amount,
                cell: (row) => (
                    <span>
                        {formatNumber(
                            row?.amount,
                            pairConfig?.quotePrecision || 2,
                            0,
                            true
                        )}{' '}
                        {row?.symbol?.quoteAsset}
                    </span>
                ),
                sortable: true,
            },
            {
                name: 'Asset',
                selector: (row) => row?.symbol?.quoteAsset,
                sortable: true,
            },
            {
                name: 'Symbol',
                selector: (row) => row?.symbol?.pair,
                sortable: true,
            },
        ],
        []
    )

    return (
        <>
            <FuturesTimeFilter
                currentTimeRange={pickedTime}
                onChange={(pickedTime) =>
                    onChangeTimePicker(
                        FUTURES_RECORD_CODE.tradingHistory,
                        pickedTime
                    )
                }
            />
            <DataTable
                responsive
                fixedHeader
                data={data}
                columns={columns}
                className='mt-3'
                sortIcon={<ChevronDown size={8} strokeWidth={1.5} />}
                customStyles={customTableStyles}
            />
        </>
    )
}

const data = [
    {
        id: 1,
        created_at: 1646607132000,
        symbol: { pair: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT' },
        type: 1,
        amount: 27.8,
    },
    {
        id: 2,
        created_at: 1646607132000,
        symbol: { pair: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT' },
        type: 1,
        amount: 27.8,
    },
    {
        id: 3,
        created_at: 1646607132000,
        symbol: { pair: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT' },
        type: 1,
        amount: 27.8,
    },
]

export default FuturesTxHistory
