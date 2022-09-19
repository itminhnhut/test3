import React, { useCallback, useEffect, useState } from 'react'
import ReTable, { RETABLE_SORTBY } from 'components/common/ReTable';
import useWindowSize from 'hooks/useWindowSize'
import { API_GET_VIP, API_PORTFOLIO_OVERVIEW, API_PORTFOLIO_ACCOUNT } from 'redux/actions/apis';
import FetchApi from 'utils/fetch-api';
import { formatPrice, formatTime } from 'src/redux/actions/utils';
import { renderInlineText } from '../FuturePortfolio';
import colors from 'styles/colors';
import ChartJS from '../charts/ChartJS';
import ChartLayout from '../charts/ChartLayout';

const headerText = 'text-2xl leading-[30px] font-semibold'
const subHeaderText = 'text-base leading-6 font-medium'
const titleText = 'text-[20px] leading-10 font-semibold'

const Account = (props) => {
    const {
        renderChartTabs,
        renderTimePopover,
        currency,
        loadingPlaceHolder,
        width
    } = props

    const [winlossData, setWinLossData] = useState(null)
    const [winlossConfig, setWinLossConfig] = useState({
        time: 1,
        type: 1,
        orderBy: 1,
    })

    const [PNLData, setPNLData] = useState(null)
    const [PNLConfig, setPNLConfig] = useState({
        orderBy: 1,
    })
    useEffect(() => {
        const date = new Date()
        switch (winlossConfig.time) {
            case 1:
                date.setDate(date.getDate() - 1);
                break;
            case 2:
                date.setDate(date.getDate() - 7);
                break;
            case 3:
                date.setDate(date.getDate() - 30);
                break;
            case 4:
                date.setDate(date.getDate() - 90);
                break;
            default:
                break
        }
        date.toLocaleDateString();
        const chartIds = { '1': 2, '2': 3, }
        FetchApi({
            url: API_PORTFOLIO_ACCOUNT,
            options: {
                method: 'GET',
            },
            params: {
                currency: props.currency === 'VNDC' ? 72 : 22,
                chart_id: chartIds[winlossConfig.type],
                timeFrame: 'D',
                from: date,
                to: new Date()
            },
        }).then(async ({ data, status }) => {
            if (status === 200) {
                setWinLossData(data)
            } else {
                setWinLossData(null)
            }
        });
    }, [props.currency, winlossConfig])

    useEffect(() => {
        const orderBy = { '1': 'W', '2': 'M', }
        FetchApi({
            url: API_PORTFOLIO_ACCOUNT,
            options: {
                method: 'GET',
            },
            params: {
                currency: props.currency === 'VNDC' ? 72 : 22,
                chart_id: 7,
                timeFrame: orderBy[PNLConfig.orderBy],
            },
        }).then(async ({ data, status }) => {
            if (status === 200) {
                setPNLData(data)
            } else {
                setPNLData(null)
            }
        });
    }, [props.currency, PNLConfig])

    const renderChart6PNLTable = useCallback(() => {
        const renderTableData = (profit, roe) => {
            if (!profit || !roe) return <span className='text-sm leading-6 font-medium'>+0 &nbsp; (+0%)</span>

            return profit >= 0 ?
                <span className='text-teal text-sm leading-6 font-medium'>+{formatPrice(profit, 0)} &nbsp; (+{formatPrice(roe, 2)}%)</span> :
                <span className='text-red text-sm leading-6 font-medium'>{formatPrice(profit, 0)} &nbsp; ({formatPrice(roe, 2)}%)</span>
        }
        if (width < 640) {
            return PNLData.map(data => {
                const title = PNLConfig.orderBy === 1 ? `Tháng ${formatTime(data.key, 'MM/yyyy')}` : `Năm ${formatTime(data.key, 'yyyy')}`
                return (
                    <div className='font-semibold text-sm leading-[17px] mb-6'>
                        {title}
                        <div className='mt-2'>
                            {data.data?.map((e, index) => {
                                const myData = {
                                    title: (PNLConfig.orderBy === 1 ? 'Tuần ' : 'Tháng ') + e.key,
                                    value: renderTableData(e.data?.profit, e.data?.roe)
                                }
                                return (
                                    <div>
                                        {renderInlineText(null, myData.title, myData.value, index + 1 === data.data.length ? 'min-h' : undefined)}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            })
        }
        const mappedData = []
        PNLData.map(e => {
            mappedData.push({
                key: e.key,
                week1: renderTableData(e.data[0]?.data?.profit, e.data[0]?.data?.roe),
                week2: renderTableData(e.data[1]?.data?.profit, e.data[1]?.data?.roe),
                week3: renderTableData(e.data[2]?.data?.profit, e.data[2]?.data?.roe),
                week4: renderTableData(e.data[3]?.data?.profit, e.data[3]?.data?.roe),
                week5: renderTableData(e.data[4]?.data?.profit, e.data[4]?.data?.roe),
            })
        })

        const columns = [
            { key: 'time', dataIndex: 'key', title: 'Thời gian', width: 60, fixed: 'left', align: 'left' },
            { key: 'week1', dataIndex: 'week1', title: 'Tuần 1', width: 100, align: 'left' },
            { key: 'week2', dataIndex: 'week2', title: 'Tuần 2', width: 100, align: 'left' },
            { key: 'week3', dataIndex: 'week3', title: 'Tuần 3', width: 100, align: 'left' },
            { key: 'week4', dataIndex: 'week4', title: 'Tuần 4', width: 100, align: 'left' },
            { key: 'week5', dataIndex: 'week5', title: 'Tuần 5', width: 100, align: 'left' },
        ]
        return <ReTable
            // useRowHover
            sort
            data={mappedData}
            columns={columns}
            rowKey={item => item?.key}
            scroll={{ x: true }}
            tableStyle={{
                tableStyle: { minWidth: '560 !important' },
                headerStyle: {},
                rowStyle: {},
                shadowWithFixedCol: width < 1024,
                noDataStyle: {
                    minHeight: '280px'
                }
            }}
        />

    }, [props.currency, PNLData])

    const renderChart6Account = () => {
        const chart6TimeTabs = [
            { title: '1 Ngày', value: 1 },
            { title: '1 Tuần', value: 2 },
            { title: '1 Tháng', value: 3 },
            { title: '3 Tháng', value: 4 },
        ]
        const chart6TypeTabs = [
            { title: 'Lời/Lỗ', value: 1 },
            { title: 'Mua/Bán', value: 2 },
        ]
        const chart6OrderByTabs = [
            { title: 'Theo tuần', value: 1 },
            { title: 'Theo tháng', value: 2 },
        ]
        const labels = []
        const datasetLabel = {
            wl: ['Tổng số lệnh lời: ', 'Tổng số lệnh lỗ: '],
            bs: ['Tổng số lệnh mua: ', 'Tổng số lệnh bán: ']
        }

        // map data
        const totalWin = []
        const totalLoss = []
        const winProfit = []
        const originWinProfit = []
        const lossProfit = []
        const originLossProfit = []
        winlossData.map(e => {
            labels.push(formatTime(e.time, 'dd/MM'))
            totalWin.push(+e[winlossConfig.type === 1 ? 'win' : 'buy']?.total)
            totalLoss.push(winlossConfig.type === 1 ? -e['loss']?.total : e['sell']?.total)
            winProfit.push(+e[winlossConfig.type === 1 ? 'win' : 'buy']?.profit_rate / 5 + +e[winlossConfig.type === 1 ? 'win' : 'buy']?.total)
            originWinProfit.push(+e[winlossConfig.type === 1 ? 'win' : 'buy']?.profit_rate)
            lossProfit.push(+e[winlossConfig.type === 1 ? 'loss' : 'sell']?.profit_rate / 5 - +e[winlossConfig.type === 1 ? 'loss' : 'sell']?.total)
            originLossProfit.push(+e[winlossConfig.type === 1 ? 'loss' : 'sell']?.profit_rate)
        })
        console.log('data', winlossData)
        const data = {
            labels,
            datasets: [{
                type: 'bar',
                label: datasetLabel[winlossConfig.type === 1 ? 'wl' : 'bs'][0],
                data: totalWin,
                backgroundColor: '#52EAD1',
                borderColor: '#52EAD1',
                maxBarThickness: width >= 640 ? 32 : 8,
                borderRadius: 2,
                order: 4,
                barPercentage: 0.7,
            },
            {
                type: 'line',
                label: '% lệnh lời: ',
                data: winProfit,
                backgroundColor: '#00C8BC',
                borderColor: '#00C8BC',
                fill: false,
                borderDash: [5, 5],
                borderWidth: 1.5,
                pointRadius: width >= 640 ? 3 : 1,
                order: 3
            },
            {
                type: 'bar',
                label: datasetLabel[winlossConfig.type === 1 ? 'wl' : 'bs'][1],
                data: totalLoss,
                backgroundColor: '#C0F9EE',
                borderColor: '#C0F9EE',
                maxBarThickness: width >= 640 ? 32 : 8,
                borderRadius: 2,
                order: 2,
                barPercentage: 0.7,
            },
            {
                type: 'line',
                label: '% lệnh lỗ:  ',
                data: lossProfit,
                backgroundColor: '#52EAD1',
                borderColor: '#52EAD1',
                fill: false,
                borderDash: [5, 5],
                borderWidth: 1.5,
                pointRadius: width >= 640 ? 3 : 1,
                order: 1,
            }]
        };
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    usePointStyle: true,
                    callbacks: {
                        label: function (context) {
                            const index = context.dataIndex
                            if (winlossConfig.type === 1) {
                                const win = winlossData[index]['win']
                                const loss = winlossData[index]['loss']
                                const text1 = 'Tổng số lệnh lời: ' + win.total
                                const text2 = 'Tổng PNL lệnh lời: ' + '+' + formatPrice(win.profit, 0) + ' ' + props.currency + ` (+${formatPrice(win.profit_rate, 0)}%)`
                                const text3 = 'Tổng số lệnh lỗ: ' + loss.total
                                const text4 = 'Tổng PNL lệnh lỗ: ' + formatPrice(loss.profit, 0) + ' ' + props.currency + ` (${formatPrice(loss.profit_rate, 0)}%)`
                                return [text1, text2, text3, text4]
                            }
                            const text1 = 'Tổng số lệnh: ' + winlossData[index].total
                            const text2 = 'Tổng số lệnh mua: ' + winlossData[index]['buy'].total
                            const text3  = 'Tổng số lệnh bán: ' + winlossData[index]['sell'].total
                            return [text1, text2, text3]
                        },
                        labelPointStyle: function (context) {
                            return {
                                pointStyle: 'circle',
                            };
                        },
                        labelTextColor: function (context) {
                            return colors.darkBlue
                        }
                    },
                    backgroundColor: colors.white,
                    titleColor: colors.grey2,
                    displayColors: false,
                },
            },
            scales: {
                x: {
                    stacked: true,
                    // combined: true,
                },
                y: {
                    // stacked: true,
                    ticks: {
                        callback: function (value, index, values) {
                            return Math.abs(value);
                        }
                    }
                },
            },
        }
        return width >= 640 ?
            <ChartLayout className='p-6 !h-auto'>
                <div className='px-6 pb-6 w-full rounded-xl border-[1px] border-[#E2E8F0] '>
                    <div className='flex items-center justify-between'>
                        <div className={`${titleText}`}>
                            Thống kê số lệnh lời/lỗ
                        </div>
                        <div>
                            <div className='flex items-center w-fit h-auto gap-4'>
                                {renderChartTabs(chart6TimeTabs, 'time', winlossConfig, setWinLossConfig)}
                                <div className='bg-gray-4 flex items-center justify-between h-9 rounded-md p-1'>
                                    {renderChartTabs(chart6TypeTabs, 'type', winlossConfig, setWinLossConfig, true)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='max-h-[600px] flex w-full items-center justify-center'>
                        <ChartJS type='bar' data={data} options={options} height='450px' />
                    </div>
                    <div className='flex items-center gap-4 mt-6'>
                        <div className='flex items-center gap-1 h-full'>
                            <svg width="7" height="8" viewBox="0 0 7 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="3.5" cy="4" r="3.5" fill="#52EAD1" />
                            </svg>
                            {winlossConfig.type === 1 ? 'Lệnh lời' : 'Lệnh mua'}
                        </div>
                        <div className='flex items-center  gap-1 h-full'>
                            <svg width="7" height="8" viewBox="0 0 7 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="3.5" cy="4" r="3.5" fill="#C0F9EE" />
                            </svg>
                            {winlossConfig.type === 1 ? 'Lệnh lỗ' : 'Lệnh bán'}
                        </div>
                    </div>
                </div>
                <div className='mt-6 px-6 w-full rounded-xl border-[1px] border-[#E2E8F0] '>
                    <div className='flex items-center justify-between'>
                        <div className={`${titleText}`}>
                            Thống kê PNL (%ROI)
                        </div>
                        <div>
                            <div className='flex items-center w-fit h-fit gap-4'>
                                {renderChartTabs(chart6OrderByTabs, 'orderBy', PNLConfig, setPNLConfig)}
                            </div>
                        </div>
                    </div>
                    <div className=''>
                        {renderChart6PNLTable()}
                    </div>
                </div>
            </ChartLayout>
            :
            <ChartLayout className='py-6 px-4 !h-auto'>
                <div className='p-4 w-full rounded-xl border-[1px] border-[#E2E8F0] '>
                    <div className='flex items-center justify-between'>
                        <div className={`${titleText}`}>
                            Thống kê số lệnh lời/lỗ
                        </div>
                    </div>
                    <div>
                        <div className='flex items-center w-full h-fit mb-6'>
                            <div className='bg-gray-4 w-full flex items-center justify-between h-9 rounded-md p-1'>
                                {renderChartTabs(chart6TypeTabs, 'type', winlossConfig, setWinLossConfig, true, true)}
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center w-full justify-between'>
                        <div className='flex items-center gap-4'>
                            <div className='flex items-center gap-1 h-full'>
                                <svg width="7" height="8" viewBox="0 0 7 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="3.5" cy="4" r="3.5" fill="#52EAD1" />
                                </svg>
                                {winlossConfig.type === 1 ? 'Lệnh lời' : 'Lệnh mua'}
                            </div>
                            <div className='flex items-center  gap-1 h-full'>
                                <svg width="7" height="8" viewBox="0 0 7 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="3.5" cy="4" r="3.5" fill="#C0F9EE" />
                                </svg>
                                {winlossConfig.type === 1 ? 'Lệnh lỗ' : 'Lệnh bán'}
                            </div>
                        </div>
                        <div>
                            {renderTimePopover(winlossConfig, setWinLossConfig)}
                        </div>
                    </div>
                    <div className='max-h-[600px] flex w-full items-center justify-center mt-6'>
                        <ChartJS type='stackedBar' data={data} options={options} height='450px' />
                    </div>
                </div>
                <div className='mt-6 px-4 pt-4 w-full rounded-xl border-[1px] border-[#E2E8F0] '>
                    <div className={`${titleText} mb-4`}>
                        Thống kê PNL (%ROI)
                    </div>
                    <div>
                        <div className='flex items-center w-full h-fit bg-gray-4 p-1 h-9 rounded-md'>
                            {renderChartTabs(chart6OrderByTabs, 'orderBy', PNLConfig, setPNLConfig, true, true)}
                        </div>
                    </div>
                    <div className='mt-5'>
                        {renderChart6PNLTable()}
                    </div>
                </div>
            </ChartLayout>
    }

    return winlossData && PNLData ? renderChart6Account() : loadingPlaceHolder('chart6')
}

export default Account