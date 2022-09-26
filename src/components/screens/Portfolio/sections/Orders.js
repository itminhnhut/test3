import React, { useCallback, useEffect, useMemo } from 'react'
import { useState } from 'react';
import { API_GET_FUTURES_ORDER, API_PORTFOLIO_SUMMARY } from 'redux/actions/apis';
import FetchApi from 'utils/fetch-api';
import { formatPrice, formatTime } from 'src/redux/actions/utils';
import ReTable from 'components/common/ReTable';
import { getProfitVndc } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import CalculatePNL from '../CalculatePNL';
import { useDispatch, useSelector } from 'react-redux';
import {  getFuturesMarketWatch } from 'redux/actions/futures';

const Orders = (props) => {
    const {
        tab,
        currency,
        width
    } = props
    const [orderList, setOrderList] = useState(null)
    const [ordersOverviewList, setOrdersOverviewList] = useState(null)
    const [currentPage, setCurrentPage] = useState(null)
    const [numberOfOrdersToShow, setNumberOfOrdersToShow] = useState(5)
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(getFuturesMarketWatch());
    }, []);
    const marketWatch = useSelector((state) => state.futures.marketWatch);

    useEffect(() => {
        setNumberOfOrdersToShow(5)
        setCurrentPage(1)
        if (tab === 3) return
        const statuses = {
            '1': 0,
            '2': 1,
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
    }, [tab, currency])

    useEffect(() => {
        if (tab !== 3) return
        FetchApi({
            url: API_PORTFOLIO_SUMMARY,
            options: {
                method: 'GET',
            },
            params: {
                currency: currency === 'VNDC' ? 72 : 22,
                chart_id: 13,
                timeFrame: 'M'
            },
        }).then(async ({ data, status }) => {
            if (status === 200) {
                setOrdersOverviewList(data)
            } else {
                setOrdersOverviewList(null)
            }
        });
    }, [tab, currency])

    const renderTableData = (data, isRed = false) => {
        return isRed ?
            <span className='text-red text-sm leading-6 font-medium'>{data}</span> :
            <span className='text-teal text-sm leading-6 font-medium'>{data}</span>
    }
    
    const renderOrdersTable = useCallback(() => {
        if (!orderList || !marketWatch) return
        const mappedData = orderList.map(e => {
            const dataMarketWatch = marketWatch[e?.symbol];
            const sl_rate = formatPrice(Math.abs(e.sl / e.order_value - 100), 2)
            const profit_rate = formatPrice((e.profit / e.order_value), 2)
            return {
                pair: <span>{e.symbol.slice(0, 3)}/<span className='text-gray-2'>{e.symbol.slice(3, 7)}</span></span>,
                volume: formatPrice(e.order_value, 0),
                price: formatPrice(e.price, 0),
                open_price: formatPrice(e.open_price, 0),
                unpnl: <CalculatePNL key={e.displaying_id} order={e} initPairPrice={dataMarketWatch} isMobile decimal={0} />,
                type: renderTableData(e.side + '/' + e.type, e.side === 'Buy' ? false : true),
                leverage: e.leverage + 'x',
                sl: e.sl ? renderTableData(`${formatPrice(e.sl, 0)} (-${sl_rate})%`, true) : '',
                opened_at: formatTime(e.opened_at, 'dd-MM hh:mm:ss'),
                close_price: formatPrice(e.close_price, 0),
                pnl: e.profit ? renderTableData(`${formatPrice(e.profit, 0)} (${e.profit >= 0 ? '+' + profit_rate : profit_rate})%`, e.profit < 0) : '',
                closed_at: formatTime(e.closed_at, 'dd-MM hh:mm:ss')
            }
        })
        const columns = tab === 1 ? [
            { key: 'pair', dataIndex: 'pair', title: 'Cặp', width: 60, fixed: 'left', align: 'left' },
            { key: 'volume', dataIndex: 'volume', title: 'Volume', width: 90, align: 'left' },
            { key: 'price', dataIndex: 'price', title: 'Giá', width: 100, align: 'left' },
            { key: 'open_price', dataIndex: 'open_price', title: 'Giá mở', width: 90, align: 'left' },
            { key: 'unpnl', dataIndex: 'unpnl', title: 'UnPNL', width: 80, align: 'left' },
            { key: 'type', dataIndex: 'type', title: 'Loại lệnh', width: 70, align: 'left' },
            { key: 'leverage', dataIndex: 'leverage', title: 'Mức đòn bẩy', width: 70, align: 'left' },
            { key: 'sl', dataIndex: 'sl', title: 'Cắt lỗ', width: 80, align: 'left' },
            { key: 'opened_at', dataIndex: 'opened_at', title: 'Thời gian mở lệnh', width: 100, align: 'left' },
        ] : [
            { key: 'pair', dataIndex: 'pair', title: 'Cặp', width: 60, fixed: 'left', align: 'left' },
            { key: 'volume', dataIndex: 'volume', title: 'Volume', width: 90, align: 'left' },
            { key: 'close_price', dataIndex: 'close_price', title: 'Giá đóng', width: 90, align: 'left' },
            { key: 'open_price', dataIndex: 'open_price', title: 'Giá mở', width: 90, align: 'left' },
            { key: 'pnl', dataIndex: 'pnl', title: 'PNL', width: 80, align: 'left' },
            { key: 'type', dataIndex: 'type', title: 'Loại lệnh', width: 60, align: 'left' },
            { key: 'leverage', dataIndex: 'leverage', title: 'Mức đòn bẩy', width: 70, align: 'left' },
            { key: 'sl', dataIndex: 'sl', title: 'Cắt lỗ', width: 100, align: 'left' },
            { key: 'opened_at', dataIndex: 'opened_at', title: 'Thời gian mở lệnh', width: 70, align: 'left' },
            { key: 'closed_at', dataIndex: 'closed_at', title: 'Thời gian đóng lệnh', width: 70, align: 'left' },
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
    }, [currency, orderList, currentPage, marketWatch])

    const renderHistoryTable = useCallback(() => {
        if (!ordersOverviewList) return
        const mappedData = ordersOverviewList.map(e => {
            return {
                time: formatTime(e.time, 'MM/yyyy'),
                total_buy: e.total_buy,
                total_sell: e.total_sell,
                most_used_leverage: e.max_count_leverage + 'x',
                pnl: <span className={`${e.profit >= 0 ? 'text-teal' : 'text-red'}`}>{e.profit >= 0 ? '+' : ''}{formatPrice(e.profit, currency === 'VNDC' ? 0 : 2)} ({e.profit_rate >= 0 ? '+' : ''}{formatPrice(e.profit_rate, 2)}%)</span>,
                win_rate: formatPrice(e.win_rate, 0) + '%',
                profit_factor: formatPrice(e.profit_factor, 0)
            }
        })
        const columns = [
            { key: 'time', dataIndex: 'time', title: 'Thời gian', width: 80, fixed: 'left', align: 'left' },
            { key: 'total_buy', dataIndex: 'total_buy', title: 'Tổng lệnh mua', width: 70, align: 'left' },
            { key: 'total_sell', dataIndex: 'total_sell', title: 'Tổng lệnh bán', width: 70, align: 'left' },
            { key: 'most_used_leverage', dataIndex: 'most_used_leverage', title: 'Đòn bẩy thường dùng', width: 100, align: 'left' },
            { key: 'pnl', dataIndex: 'pnl', title: 'PNL', width: 100, align: 'left' },
            { key: 'win_rate', dataIndex: 'win_rate', title: 'Tỷ lệ lãi', width: 100, align: 'left' },
            { key: 'profit_factor', dataIndex: 'profit_factor', title: 'Profit factor', width: 100, align: 'left' },
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
    }, [currency, ordersOverviewList, currentPage])

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

    const renderClosedOrders = (order, noUnderline = false) => {
        if (!order) return
        const sl_rate = formatPrice(Math.abs(order.sl / order.order_value - 100), 2)
        const profit_rate = formatPrice((order.profit / order.order_value), 2)
        const mappedData = {
            pair: <span>{order.symbol.slice(0, 3)}/<span className='text-gray-2'>{order.symbol.slice(3, 7)}</span></span>,
            volume: formatPrice(order.order_value, 0),
            price: formatPrice(order.price, 0),
            open_price: formatPrice(order.open_price, 0),
            unpnl: renderTableData(123),
            type: renderTableData(order.side + '/' + order.type, order.side === 'Buy' ? false : true),
            leverage: order.leverage + 'x',
            sl: order.sl ? renderTableData(`${formatPrice(order.sl, 0)} (-${sl_rate})%`, true) : '',
            opened_at: formatTime(order.opened_at, 'dd-MM hh:mm:ss'),
            close_price: formatPrice(order.close_price, 0),
            pnl: order.profit ? renderTableData(`${formatPrice(order.profit, 0)} (${order.profit >= 0 ? '+' + profit_rate : profit_rate})%`, order.profit < 0) : '',
            closed_at: formatTime(order.closed_at, 'dd-MM hh:mm:ss')
        }
        return (
            <div className={`w-full h-auto py-6 border-b-[1px] border-gray-2 border-opacity-20 ${noUnderline ? '!border-b-0' : ''}`}>
                <div className='flex w-full justify-between items-center mb-[20px]'>
                    <div className=''>
                        <div className='font-semibold text-base leading-[22px] text-darkBlue'>
                            {mappedData.pair}
                        </div>
                        <div className='text-gray-2 font-medium text-xs leading-6'>
                            {mappedData.closed_at}
                        </div>
                    </div>
                    <div className='flex items-center'>
                        <div className='px-2 py-1 rounded-md bg-teal bg-opacity-5'>
                            {mappedData.type}
                        </div>
                    </div>
                </div>

                <div className='w-full rounded-md flex flex-col items-center gap-[6px]'>
                    {renderInlineText('Đòn bẩy', mappedData.leverage)}
                    {renderInlineText('Khối lượng', mappedData.volume)}
                    {renderInlineText('Giá mở', mappedData.open_price)}
                    {renderInlineText('Giá đóng', mappedData.close_price)}
                    {renderInlineText('PNL', mappedData.pnl)}
                    {renderInlineText('Cắt lỗ', mappedData.sl)}
                    {renderInlineText('Thời gian mở lệnh', mappedData.opened_at)}
                    {renderInlineText('Thời gian đóng lệnh', mappedData.closed_at)}
                </div>
            </div >
        )
    }

    const renderOpeningOrders = (order, noUnderline = false) => {
        const sl_rate = formatPrice(Math.abs(order.sl / order.order_value - 100), 2)
        return (
            <div className={`w-full h-auto py-6 border-b-[1px] border-gray-2 border-opacity-20 ${noUnderline ? '!border-b-0' : ''}`}>
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

    const renderOrdersOverviewHistory = (order, noUnderline) => {
        const profit = <span className={`${order.profit >= 0 ? 'text-teal' : 'text-red'}`}>{order.profit >= 0 ? '+' : ''}{formatPrice(order.profit, 0)}</span>
        return (
            <div className={`w-full h-auto py-6 border-b-[1px] border-gray-2 border-opacity-20 ${noUnderline ? '!border-b-0' : ''}`}>
                <div className='flex w-full justify-between items-center'>
                    <div className='font-semibold text-sm leading-[17px] mb-2'>
                        Tháng {formatTime(order.time, 'MM/yyyy')}
                    </div>
                </div>
                <div className='w-full rounded-md py-2 flex items-center gap-5'>
                    <div className='w-full flex flex-col gap-2'>
                        {renderInlineText('Tổng lệnh mở', order.total_buy + 'x')}
                        {renderInlineText('Đòn bẩy thường dùng', order.max_count_leverage + 'x')}
                        {renderInlineText('Tỉ lệ lãi', formatPrice(order.win_rate, 0))}
                    </div>
                    <div className='w-full flex flex-col gap-2'>
                        {renderInlineText('Tổng lệnh đóng', order.total_sell)}
                        {renderInlineText('PNL', profit)}
                        {renderInlineText('Profit factor', formatPrice(order.profit_factor, 0))}
                    </div>
                </div>

            </div>
        )
    }

    const renderOrderBlock = (order, noUnderline = false) => {
        if (!order) return
        switch (tab) {
            case 1:
                return renderOpeningOrders(order, noUnderline)
            case 2:
                return renderClosedOrders(order, noUnderline)
            case 3:
                return renderOrdersOverviewHistory(order, noUnderline)
            default:
                return <div>Invalid tab</div>
        }

    }

    const renderOrdersMobile = useCallback(() => {
        if (!orderList || orderList.length === 0) return <div className='w-full py-6'>No data</div>
        const shownOrders = orderList.slice(0, numberOfOrdersToShow)
        return (
            <div>
                {shownOrders.map((order, index) => renderOrderBlock(order, index + 1 === shownOrders.length))}
                {orderList?.length > numberOfOrdersToShow ? <div className='font-medium text-sm leading-6 text-teal underline cursor-pointer w-full p-8 flex justify-center'
                    onClick={() => setNumberOfOrdersToShow(numberOfOrdersToShow + 5)}
                >
                    Xem thêm
                </div> : null}
            </div>
        )
    }, [orderList, numberOfOrdersToShow])

    const renderOrdersTab = () => {
        return width >= 640 ? (
            <div>
                <div className='pt-8 pb-6 px-8 pb text-[20px] leading-10 font-semibold'>
                    {tab === 1 ? ' Lệnh đang mở' : 'Lệnh đã đóng'}
                </div>
                <div className='px-8 pb-6'>
                    {renderOrdersTable()}
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
            </div>
        )
    }

    const renderTransactionHistory = () => {
        if (!ordersOverviewList) return <div className='w-full py-6'>No data</div>
        const shownOrders = ordersOverviewList.slice(0, numberOfOrdersToShow)
        return width >= 640 ? (
            <div>
                <div className='px-8 pt-8 text-[20px] leading-10 font-semibold'>
                    Lịch sử giao dịch
                </div>
                <div className='w-full px-8 pb-6'>
                    {renderHistoryTable()}
                </div>
            </div>
        ) : (
            <div>
                <div className='px-8 pt-8 text-[20px] leading-10 font-semibold'>
                    Lịch sử giao dịch
                </div>
                <div className='w-full px-8'>
                    {shownOrders.map((e, index) => renderOrderBlock(e, index + 1 === shownOrders.length))}
                </div>
            </div>

        )
    }

    return tab !== 3 ? (
        <div className='bg-white w-full rounded-xl'>
            {renderOrdersTab()}
        </div>
    ) : (
        <div className='bg-white w-full rounded-xl'>
            {renderTransactionHistory()}
        </div>
    )
}

export default Orders
