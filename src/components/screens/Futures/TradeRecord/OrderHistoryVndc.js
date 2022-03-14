import { useMemo } from 'react'
import { customTableStyles } from './index'
import { ChevronDown } from 'react-feather'

import DataTable from 'react-data-table-component'

const FuturesOrderHistoryVndc = () => {
    const columns = useMemo(
        () => [
            {
                name: 'ID',
                selector: (row) => row?.id,
                sortable: true,
            },
            {
                name: 'Symbol',
                selector: (row) => row?.symbol?.pair,
                sortable: true,
            },
            {
                name: 'Open at',
                selector: (row) => row?.open_at,
                sortable: true,
            },
            {
                name: 'Close at',
                selector: (row) => row?.close_at,
                sortable: true,
            },
            {
                name: 'Type',
                selector: (row) => row?.type,
                sortable: true,
            },
            {
                name: 'Amount',
                selector: (row) => row?.amount,
                sortable: true,
            },
            {
                name: 'Open Price',
                selector: (row) => row?.openPrice,
                sortable: true,
            },
            {
                name: 'Close Price',
                selector: (row) => row?.closePrice,
                sortable: true,
            },
            {
                name: 'Stop-loss',
                selector: (row) => row?.stopLoss,
                sortable: true,
            },
            {
                name: 'Take-profit',
                selector: (row) => row?.takeProfit,
                sortable: true,
            },
            {
                name: 'revenue',
                selector: (row) => row?.revenue,
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

    return (
        <DataTable
            responsive
            fixedHeader
            expandableRows
            sortIcon={<ChevronDown size={8} strokeWidth={1.5} />}
            data={data}
            columns={columns}
            customStyles={customTableStyles}
        />
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
