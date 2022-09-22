import React, { useCallback, useEffect, useMemo } from 'react'
import { useState } from 'react';
import { API_GET_FUTURES_ORDER } from 'redux/actions/apis';
import FetchApi from 'utils/fetch-api';
import { formatPrice, formatTime } from 'src/redux/actions/utils';
import ReTable from 'components/common/ReTable';

const Orders = (props) => {
    const {
        tab,
        currency,
        width
    } = props

    const [orderList, setOrderList] = useState(null)
    const [currentPage, setCurrentPage] = useState(null)
    const [numberOfOrdersToShow, setNumberOfOrdersToShow] = useState(5)

    useEffect(() => {
        const statuses = {
            '1': 0,
            '2': 1
        }
        FetchApi({
            url: API_GET_FUTURES_ORDER,
            options: {
                method: 'GET',
            },
            params: {
                status: statuses[tab]
            },
        }).then(async ({ data, status }) => {
            if (status === 'ok') {
                const positions = data?.orders?.filter(item => item.status === tab) ?? [];
                setOrderList(positions)
            } else {
                setOrderList(null)
            }
        });
    }, [tab])

    console.log(orderList)

    const renderOrders = useCallback(() => {
        if (!orderList) return
        const renderTableData = (data, isRed = false) => {
            return isRed ?
                <span className='text-red text-sm leading-6 font-medium'>{data}</span> :
                <span className='text-teal text-sm leading-6 font-medium'>{data}</span>
        }
        const mappedData = orderList.map(e => {
            const sl_rate = formatPrice(Math.abs(e.sl / e.order_value - 100), 2)
            return {
                pair: e.symbol,
                volume: formatPrice(e.order_value, 0),
                price: formatPrice(e.price, 0),
                open_price: formatPrice(e.open_price, 0),
                unpnl: renderTableData(123),
                type: renderTableData(e.side + '/' + e.type, e.side === 'Buy' ? false : true),
                leverage: e.leverage + 'x',
                sl: e.sl ? renderTableData(`${e.sl} (-${sl_rate})%`, true) : '',
                opened_at: formatTime(e.opened_at, 'dd-MM hh:mm:ss')
            }
        })
        const columns = [
            { key: 'pair', dataIndex: 'pair', title: 'Cặp', width: 60, fixed: 'left', align: 'left' },
            { key: 'volume', dataIndex: 'volume', title: 'Volume', width: 100, align: 'left' },
            { key: 'price', dataIndex: 'price', title: 'Giá', width: 100, align: 'left' },
            { key: 'open_price', dataIndex: 'open_price', title: 'Giá mở', width: 100, align: 'left' },
            { key: 'unpnl', dataIndex: 'unpnl', title: 'UnPNL', width: 100, align: 'left' },
            { key: 'type', dataIndex: 'type', title: 'Loại lệnh', width: 100, align: 'left' },
            { key: 'leverage', dataIndex: 'leverage', title: 'Mức đòn bẩy', width: 100, align: 'left' },
            { key: 'sl', dataIndex: 'sl', title: 'Cắt lỗ', width: 100, align: 'left' },
            { key: 'opened_at', dataIndex: 'opened_at', title: 'Thời gian mở lệnh', width: 100, align: 'left' },
        ]
        return <ReTable
            // useRowHover
            sort
            data={mappedData}
            columns={columns}
            rowKey={item => item?.key}
            scroll={{ x: true }}
            tableStyle={{
                tableStyle: {},
                headerStyle: {},
                rowStyle: { paddingLeft: '32px !important' },
                shadowWithFixedCol: width < 1024,
                noDataStyle: {
                    minHeight: '280px'
                }
            }}
            paginationProps={{
                hide: mappedData.length <= 10,
                current: currentPage,
                pageSize: 10,
                onChange: (currentPage) => setCurrentPage(currentPage)
            }}
        />
    }, [currency, orderList, currentPage])

    const renderInlineText = (text1, text2) => {
        return (
            <div className='w-full flex items-center justify-between'>
                <div className='text-xs font-medium leading-5 text-gray-2'>
                    {text1}
                </div>
                <div className='text-xs font-medium leading-5 text-darkBlue'>
                    {text2}
                </div>
            </div>
        )
    }


    const renderOrderBlock = (order) => {
        if (!order) return
        const sl_rate = formatPrice(Math.abs(order.sl / order.order_value - 100), 2)
        return (
            <div className='w-full h-auto py-6 border-b-[1px] border-gray-2 border-opacity-20'>
                <div className='flex w-full justify-between items-center mb-[20px]'>
                    <div className=''>
                        <div className='font-semibold text-base leading-[22px] text-darkBlue'>
                            {order.symbol}
                        </div>
                        <div className='text-gray-2 font-medium text-xs leading-6'>
                            {formatTime(order.opened_at, 'dd-MM-yyyy hh:mm:ss')}
                        </div>
                    </div>
                    <div className='flex items-center'>
                        <div className='px-2 py-1 rounded-md bg-teal bg-opacity-5'>
                            <span className={order.side === 'Buy' ? 'text-teal' : 'text-red'}>{order.side}/{order.type}</span>
                        </div>
                    </div>
                </div>
                <div className='w-full h-[66px] rounded-md border-gray-2 border-[1px] border-opacity-20 py-2 flex items-center'>
                    <div className='h-full w-full text-center border-gray-2 border-r-[1px] border-opacity-20'>
                        <div className='font-medium text-xs leading-5  text-gray-2'>
                            Cắt lỗ
                        </div>
                        <div className='font-medium text-sm leading-6 text-red'>
                            {order.sl ? `${order.sl} (-${sl_rate})%` : ''}
                        </div>
                    </div>
                    <div className='h-full w-full text-center'>
                        <div className='font-medium text-xs leading-5 text-gray-2'>
                            UnPNL
                        </div>
                        <div className='font-medium text-sm leading-6 text-red'>
                            {order.sl ? `${order.sl} (-${sl_rate})%` : ''}
                        </div>
                    </div>
                </div>
                <div className='w-full rounded-md py-2 flex items-center gap-5'>
                    <div className='w-full flex flex-col gap-2'>
                        {renderInlineText('Đòn bẩy', order.leverage + 'x')}
                        {renderInlineText('Giá mở', formatPrice(order.open_price, 0))}
                    </div>
                    <div className='w-full'>
                        <div className='w-full flex flex-col gap-2'>
                            {renderInlineText('Khối lượng', formatPrice(order.order_value, 0))}
                            {renderInlineText('Giá trị trường', formatPrice(order.price, 0))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const renderOrdersMobile = useCallback(() => {
        if (!orderList) return
        const shownOrders = orderList.slice(0, numberOfOrdersToShow)
        return shownOrders.map(order => renderOrderBlock(order))
    }, [orderList, numberOfOrdersToShow])

    const renderOrdersTab = () => {
        return width >= 640 ? (
            <div>
                <div className='pt-8 pb-6 px-8 pb text-[20px] leading-10 font-semibold'>
                    {tab === 1 ? ' Lệnh đang mở' : 'Lệnh đã đóng'}
                </div>
                <div className='px-8'>
                    {renderOrders()}
                </div>
            </div>
        ) : (
            <div className='w-full'>
                <div className='pt-6 px-4 pb text-[20px] leading-10 font-semibold'>
                    {tab === 1 ? ' Lệnh đang mở' : 'Lệnh đã đóng'}
                </div>
                <div className='px-4'>
                    {renderOrdersMobile()}
                </div>
                {orderList?.length > numberOfOrdersToShow ? <div className='font-medium text-sm leading-6 text-teal underline cursor-pointer w-full p-8 flex justify-center'
                    onClick={() => setNumberOfOrdersToShow(numberOfOrdersToShow + 5)}
                >
                    Xem thêm
                </div> : null}
            </div>
        )
    }

    const renderTransactionHistory = () => {
        return (
            <div>
                <div className='p-8 text-[20px] leading-10 font-semibold'>
                    Lịch sử giao dịch
                </div>
            </div>
        )
    }

    const renderByTab = {
        '1': renderOrdersTab(),
        '2': renderOrdersTab(),
        '3': renderTransactionHistory()
    }

    return orderList && (
        <div className='bg-white w-full rounded-xl'>
            {renderByTab[tab]}
        </div>
    )
}

export default Orders