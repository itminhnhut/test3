import { useMemo } from 'react'
import { formatNumber, formatTime } from 'redux/actions/utils'
import { FUTURES_RECORD_CODE } from './RecordTableTab'
import { customTableStyles } from './index'
import { ChevronDown } from 'react-feather'

import FuturesRecordSymbolItem from './SymbolItem'
import FuturesTimeFilter from '../TimeFilter'
import DataTable from 'react-data-table-component'

const FuturesTradeHistory = ({
    pickedTime,
    onChangeTimePicker,
    pairConfig,
}) => {
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
                name: 'Symbol',
                selector: (row) => row?.symbol?.pair,
                cell: (row) => (
                    <FuturesRecordSymbolItem symbol={row?.symbol?.pair} />
                ),
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
                name: 'Side',
                selector: (row) => row?.side,
                cell: () => <span className='text-dominant'>BUY</span>,
                sortable: true,
            },
            {
                name: 'Price',
                selector: (row) => row?.price,
                cell: (row) => (
                    <span>
                        {formatNumber(
                            row?.price,
                            pairConfig?.quotePrecision || 2
                        )}{' '}
                        {row?.symbol?.quoteAsset}
                    </span>
                ),
                sortable: true,
            },
            {
                name: 'Quantity',
                selector: (row) => row?.quantity,
                cell: (row) => (
                    <span>
                        {formatNumber(
                            row?.quantity,
                            pairConfig?.quotePrecision || 2
                        )}{' '}
                        {row?.symbol?.quoteAsset}
                    </span>
                ),
                sortable: true,
            },
            {
                name: 'Fee',
                selector: (row) => row?.fee,
                cell: (row) => (
                    <span>
                        {formatNumber(
                            row?.fee,
                            pairConfig?.quotePrecision || 2
                        )}{' '}
                        {row?.symbol?.quoteAsset}
                    </span>
                ),
                sortable: true,
            },
            {
                name: 'Realized Profit',
                selector: (row) => row?.realizedProfit,
                cell: (row) => (
                    <span>
                        {formatNumber(
                            row?.realizedProfit,
                            pairConfig?.quotePrecision || 2
                        )}{' '}
                        {row?.symbol?.quoteAsset}
                    </span>
                ),
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
        side: 2,
        price: 17.99,
        quantity: 27.8,
        fee: 0.1032,
        realizedProfit: 0.1032,
    },
    {
        id: 2,
        created_at: 1646607132000,
        symbol: { pair: 'SLPUSDT', baseAsset: 'SLP', quoteAsset: 'USDT' },
        type: 1,
        side: 2,
        price: 17.99,
        quantity: 27.8,
        fee: 0.1032,
        realizedProfit: 0.1032,
    },
    {
        id: 3,
        created_at: 1646607132000,
        symbol: { pair: 'AXSUSDT', baseAsset: 'AXS', quoteAsset: 'USDT' },
        type: 1,
        side: 2,
        price: 17.99,
        quantity: 27.8,
        fee: 0.1032,
        realizedProfit: 0.1032,
    },
]

export default FuturesTradeHistory
