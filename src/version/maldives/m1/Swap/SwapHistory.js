import { useCallback } from 'react'

import MCard from 'components/common/MCard'
import ReTable from 'components/common/ReTable'

const SwapHistory = ({ width }) => {

    const renderTable = useCallback(() => {
        return (
            <ReTable
                data={[]}
                columns={columns}
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
            />
        )
    }, [width])

    return (
        <div className="mal-container mt-12 lg:md-20">
            <div className="px-4 lg:px-0 text-[18px] md:text-[20px] lg:text-[26px] font-bold">
                Swap History
            </div>
            <MCard addClass="mt-5 px-0">
                {renderTable()}
            </MCard>
        </div>
    )
}

const columns = [
    { key: 'id', dataIndex: 'id', title: 'Order#ID', width: 100, fixed: 'left' },
    { key: 'swap_pair', dataIndex: 'swap_pair', title: 'Swap Pair', width: 100 },
    { key: 'from_qty', dataIndex: 'from_qty', title: 'From Quantity', width: 100 },
    { key: 'to_qty', dataIndex: 'to_qty', title: 'To Quantity', width: 100 },
    { key: 'rate', dataIndex: 'rate', title: 'Rate', width: 100 },
    { key: 'time', dataIndex: 'time', title: 'Time', width: 100 },
    { key: 'status', dataIndex: 'status', title: 'Status', width: 100 },
]

export default SwapHistory
