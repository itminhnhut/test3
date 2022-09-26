import useWindowSize from 'hooks/useWindowSize'
import React, { memo, Suspense, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import ChartLayout from './charts/ChartLayout'
import { renderApexChart, renderTabs } from './Portfolio';
import { formatPrice, formatTime } from 'src/redux/actions/utils';
import FetchApi from 'utils/fetch-api';
import { API_GET_VIP, API_PORTFOLIO_OVERVIEW, API_PORTFOLIO_ACCOUNT } from 'redux/actions/apis';
import { useEffect } from 'react';
import { Progressbar } from './styledPortfolio';
import { FEE_TABLE } from 'constants/constants';
import { PulseLoader } from 'react-spinners';
import { Popover, Transition } from '@headlessui/react';
import { ChevronDown } from 'react-feather';
import colors from 'styles/colors';
import _ from 'lodash'
import Account from './sections/Account'
import Summary from './sections/Summary'
import ChartJS from './charts/ChartJS'
import Orders from './sections/Orders';

const headerText = 'text-2xl leading-[30px] font-semibold'
const subHeaderText = 'text-base leading-6 font-medium'
const titleText = 'text-[20px] leading-10 font-semibold'

const gridTemplate = {
    display: 'grid',
    gridTemplateAreas: `
                    'chart1 chart1 chart4'
                    'chart2 chart2 chart4'
                    'chart3 chart3 chart4'
                    'chart5 chart5 chart5'
                    'chart6 chart6 chart6'
                    'chart7 chart7 chart7'
                `,
    gap: '32px'
}
const anotherGridTemplate = {
    display: 'grid',
    gridTemplateAreas: `
                    'chart1'
                    'chart2'
                    'chart3'
                    'chart4'
                    'chart5'
                    'chart6'
                    'chart7'
                `,
    gap: '32px'
}

const FuturePortfolio = (props) => {
    const [chart3Current, setChart3Current] = useState(true)
    const [chart5Config, setChart5Config] = useState({
        tab: 1,
        time: 1,
        type: 'number'
    })
    const [userData, setUserData] = useState(null)
    const [chart5Data, setChart5Data] = useState(null)
    const [chart6Tab, setChart6Tab] = useState(1)
    const [chart7Tab, setChart7Tab] = useState(1)

    const user = useSelector(state => state?.auth?.user)
    const { width } = useWindowSize()

    const displayByWidth = useCallback(() => {
        return width > 1169 ? 'flex' : 'flex flex-col'
    }, [width])

    useEffect(() => {
        FetchApi({
            url: API_PORTFOLIO_OVERVIEW,
            options: {
                method: 'GET',
            },
            params: {
                currency: props.currency === 'VNDC' ? 72 : 22,
            },
        }).then(async ({ data, status }) => {
            if (status === 200) {
                const res = await FetchApi({
                    url: API_GET_VIP,
                    options: {
                        method: 'GET',
                    },

                });
                if (res.data) setUserData({ ...data[0], nami: res.data })
                else setUserData({ ...data[0] })
            } else {
                setUserData(null)
            }
        });
    }, [props.currency])

    useEffect(() => {
        const date = new Date()
        switch (chart5Config.time) {
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
        const chartIds = { '1': 1, '2': 5, '3': 6, '4': 4, }
        FetchApi({
            url: API_PORTFOLIO_ACCOUNT,
            options: {
                method: 'GET',
            },
            params: {
                currency: props.currency === 'VNDC' ? 72 : 22,
                chart_id: chartIds[chart5Config.tab],
                timeFrame: 'H',
                value_type: 'number',
                from: date,
                to: new Date()
            },
        }).then(async ({ data, status }) => {
            if (status === 200) {
                setChart5Data(data)
            } else {
                setChart5Data(null)
            }
        });
    }, [props.currency, chart5Config])


    const renderChartTabs = (tabs, type, config, setConfig, reversed = false, isCenter = false) => {
        const bgColor = reversed ? 'bg-white' : 'bg-gray-4'
        return width >= 640 ? (
            <>
                {tabs.map((tab, index) => {
                    return (
                        <div className={`flex items-center w-auto justify-center min-h-[28px] px-2 py-1 rounded-md ${config[type] === index + 1 ? `${bgColor} rounded-md text-darkBlue` : 'text-darkBlue-5'} text-sm leading-5 font-medium cursor-pointer`}
                            onClick={_.debounce(() => {
                                setConfig({ ...config, [type]: tab.value }), 200
                            })}>
                            {tab.title}
                        </div>
                    )
                })}
            </>
        ) : (
            <>
                {tabs.map((tab, index) => {
                    return (
                        <div className={`flex items-center justify-end ${isCenter && '!justify-center'} w-full h-full text-xs font-medium leading-5 cursor-pointer ${config[type] === index + 1 ? `${isCenter && bgColor} rounded-md text-darkBlue` : 'text-darkBlue-5'}`}
                            onClick={_.debounce(() => {
                                setConfig({ ...config, [type]: tab.value }), 200
                            })}>
                            {tab.title}
                        </div>
                    )
                })}
            </>
        )
    }

    const renderTimePopover = (config, setConfig) => {
        const timeTabs = [
            { title: '1 Ngày', value: 1 },
            { title: '1 Tuần', value: 2 },
            { title: '1 Tháng', value: 3 },
            { title: '3 Tháng', value: 4 },
        ]

        return <Popover className="relative">
            {({ open, close }) => (
                <>
                    <Popover.Button >
                        <div
                            className="px-2 py-1 min-h-7 flex items-center bg-gray-4 text-xs font-medium leading-5 cursor-pointer hover:opacity-80 rounded-md text-darkBlue">
                            {timeTabs.find(e => e.value === config.time).title}
                            <ChevronDown size={16} className="ml-1" />
                        </div>
                    </Popover.Button>
                    <Transition
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className="absolute z-50 bg-white dark:bg-bgPrimary-dark">
                            <div
                                className="git reset --soft HEAD^ overflow-y-auto px-[12px] py-[8px] shadow-onlyLight font-medium text-xs flex flex-col">
                                {renderChartTabs(timeTabs, 'time', config, setConfig)}
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    }

    const renderChart1 = (gridArea) => {
        const level = +userData?.nami?.level || 0
        const nextLevel = level >= 9 ? 9 : level + 1
        return width >= 664 ? (
            <ChartLayout area={gridArea}>
                <div className='w-full h-full px-8 py-6'>
                    <div className={`min-h-[136px] ${displayByWidth()} justify-between w-full gap-[10%]`}>
                        <div className='flex w-full h-full'>
                            <div className='max-w-[136px] w-full'>
                                <img className='w-full h-auto rounded-full min-w-[136px]' src={user.avatar} />
                            </div>
                            <div className={`ml-8 ${headerText} w-full h-full min-w-[224px]`}>
                                {user.name || 'Unknown'}
                                <div className='w-full h-full mt-[14px]' >
                                    {renderInlineText(null, 'Nami ID', user.code)}
                                    {renderInlineText(null, 'Bắt đầu giao dịch từ', userData.trading_from ? formatTime(new Date(userData.trading_from * 1000), 'dd/MM/yyyy').toString() : 'Chưa thực hiện giao dịch')}
                                    {renderInlineText(null, 'Kinh nghiệm giao dịch', userData.trading_exp ? `${(Math.round(userData.trading_exp / 3600)).toString()} giờ` : 'Không có kinh nghiệm')}
                                </div>
                            </div>
                        </div>
                        <div className={`w-full h-full min-w-[224px] ${displayByWidth() !== 'flex' && 'pl-[168px] mt-2'}`}>
                            <div className={`${subHeaderText} w-full h-full`}>
                                Tài khoản đạt cấp VIP {level}
                                <div className='w-full h-full mt-4'>
                                    <div className='w-full h-6 flex justify-between items-center'>
                                        <div className='text-darkBlue-5 text-sm font-medium'>
                                            Số dư NAMI
                                        </div>
                                        <div className='text-sm font-medium'>
                                            <span className='text-teal cursor-pointer'>Mua Nami</span>
                                        </div>
                                    </div>
                                    <div className='w-full h-[10px] my-3 flex justify-between items-center bg-[#F2F4F7]'>
                                        <Progressbar
                                            background='#00C8BC'
                                            percent={
                                                ((userData?.nami?.metadata?.namiBalance || 0) / FEE_TABLE[nextLevel]?.nami_holding) * 100
                                            }
                                            height={10}
                                        />
                                    </div>
                                    <div className='w-full h-6 flex justify-between items-center'>
                                        <div className='text-darkBlue-5 text-sm font-medium'>
                                            VIP {level} <span className='text-darkBlue ml-2'>{formatPrice(userData?.nami?.metadata?.namiBalance || 0, 0)} NAMI / {Math.round(((userData?.nami?.metadata?.namiBalance || 0) / FEE_TABLE[nextLevel]?.nami_holding) * 100)}%</span>
                                        </div>
                                        <div className='text-sm font-medium'>
                                            {formatPrice(FEE_TABLE[nextLevel]?.nami_holding || 0, 0)} NAMI <span className='text-darkBlue-5 ml-2'>VIP {nextLevel}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ChartLayout>
        ) : (
            <ChartLayout area={gridArea}>
                <div className='w-full h-full px-6 py-4 flex flex-col justify-center items-center'>
                    <div className='max-w-[120px] w-full'>
                        <img className='w-full h-auto rounded-full' src={user.avatar} />
                    </div>
                    <div className='mt-6 w-full text-center'>
                        <div className='text-[20px] leading-6 font-semibold'>
                            {user.name || 'Unknown'}
                        </div>
                        <div className='text-sm text-gray-2 leading-6 font-medium w-full h-full mt-[6px]'>
                            TÀI KHOẢN <span className='text-teal font-semibold'>VIP {level}</span>
                        </div>
                    </div>
                    <div className='mt-[18px] border-t-[1px] border-gray-2 border-opacity-20 pt-[18px] w-full h-full'>
                        <div>
                            {renderInlineText(null, 'Nami ID', user.code, 'true')}
                        </div>
                        <div className='mt-1'>
                            {renderInlineText(null, 'Bắt đầu giao dịch từ', userData.trading_from ? formatTime(new Date(userData.trading_from * 1000), 'dd/MM/yyyy').toString() : 'Chưa thực hiện giao dịch', 'true')}
                        </div>
                        <div className='mt-1'>
                            {renderInlineText(null, 'Kinh nghiệm giao dịch', userData.trading_exp ? `${(Math.round(userData.trading_exp / 3600)).toString()} giờ` : 'Không có kinh nghiệm', 'true')}
                        </div>
                    </div>
                    <div className='mt-[18px] border-t-[1px] border-gray-2 border-opacity-20 pt-[18px] w-full h-full'>
                        <div className='w-full h-full'>
                            <div className='w-full h-6 flex justify-between items-center'>
                                <div className='text-darkBlue-5 text-sm font-medium'>
                                    Số dư NAMI
                                </div>
                                <div className='text-sm font-medium'>
                                    <span className='text-teal cursor-pointer'>Mua Nami</span>
                                </div>
                            </div>
                            <div className='w-full h-[10px] my-3 flex justify-between items-center bg-[#F2F4F7]'>
                                <Progressbar
                                    background='#00C8BC'
                                    percent={
                                        ((userData?.nami?.metadata?.namiBalance || 0) / FEE_TABLE[nextLevel]?.nami_holding) * 100
                                    }
                                    height={10}
                                />
                            </div>
                            <div className='w-full h-6 flex justify-between items-center'>
                                <div className='text-darkBlue-5 text-sm font-medium'>
                                    VIP {level} <span className='text-darkBlue ml-2'>{formatPrice(userData?.nami?.metadata?.namiBalance || 0, 0)} NAMI / {Math.round(((userData?.nami?.metadata?.namiBalance || 0) / FEE_TABLE[nextLevel]?.nami_holding) * 100)}%</span>
                                </div>
                                <div className='text-sm font-medium'>
                                    {formatPrice(FEE_TABLE[nextLevel].nami_holding || 0, 0)} NAMI <span className='text-darkBlue-5 ml-2'>VIP {nextLevel}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ChartLayout>
        )
    }

    const renderChart2 = (gridArea) => {
        const tabs = [
            {
                title: 'Tổng tài sản',
                value: formatPrice(userData.total_balance, props.currency === 'VNDC' ? 0 : 2),
                profit: <span className={`${userData.one_day_before?.total_balance >= 0 ? 'text-teal' : 'text-red'}`} >{userData.one_day_before?.total_balance >= 0 && '+'}{formatPrice(userData.one_day_before?.total_balance, props.currency === 'VNDC' ? 0 : 0)}</span>
            },
            {
                title: 'Tổng PNL',
                value: <span className={`${userData.total_pnl >= 0 ? 'text-teal' : 'text-red'}`} >{userData.total_pnl >= 0 && '+'} {formatPrice(userData.total_pnl, 0)}</span>,
                profit: <span className={`${userData.one_day_before?.total_pnl >= 0 ? 'text-teal' : 'text-red'}`} >{userData.one_day_before?.total_pnl >= 0 ? '▴' : '▾'} {formatPrice(userData.one_day_before?.total_pnl, 0)}%</span>
            },
            {
                title: 'Tỷ lệ tăng trưởng',
                value: `${formatPrice(userData.growth_rate, 0)}%`,
                profit: <span className={`${userData.one_day_before?.growth_rate >= 0 ? 'text-teal' : 'text-red'}`} >{userData.one_day_before?.growth_rate >= 0 ? '▴' : '▾'} {formatPrice(userData.one_day_before?.growth_rate, 0)}%</span>
            },
        ]
        return (
            <ChartLayout area={gridArea} className="!bg-[#F8F9FA]">
                <div className={`w-full h-full min-h-[126px] flex gap-4 ${width < 640 && '!rounded-xl flex-col gap-0 bg-white'}`}>
                    {tabs.map((tab, index) => {
                        return (
                            <div className={`px-4 pt-6 pb-[21px] h-full w-full rounded-lg bg-white ${width < 640 && '!bg-none !rounded-none border-b-[1px] border-gray-2 border-opacity-20'}`}>
                                <div className={`w-full h-full flex flex-col justify-between`}>
                                    <div className={`${subHeaderText} w-1/2 pt-2 pb-3 !leading-8 ${width >= 640 && 'border-t-2'} border-[#52EAD1]`}>
                                        {tab.title}
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <div className='text-[20px] leading-6 font-medium '>
                                            {tab.value}
                                        </div>
                                        <div className={`text-sm font-medium`}>
                                            {tab.profit}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </ChartLayout>
        )
    }

    const renderChart3 = (gridArea) => {
        const data = [
            [
                { type: 'price', title: 'Tổng vốn', value: +userData.total_equity },
                { type: 'price', title: 'Tổng lệnh', value: +userData.total_order },
                { type: 'percentage', title: 'Tỷ lệ lệnh lời', value: +userData.win_rate },
                { type: 'percentage', title: 'Tỷ suất lợi nhuận', value: +userData.roe }
            ],
            [
                { type: 'price', title: 'Tổng nạp', value: +userData.total_deposit },
                { type: 'string', title: 'Đòn bẩy thường sử dụng', value: `${userData.max_count_leverage || 0}x` },
                { type: 'price', title: 'Số lệnh trung bình/tuần', value: +userData.avg_order_week?.total },
                { type: 'popover', title: ['Balance drawdown', 'Equity drawdown'], value: [+userData.drawdown?.balance, +userData.drawdown?.equity] }
            ],
            [
                { type: 'price', title: 'Tổng rút', value: +userData.total_withdraw },
                { type: 'percentage', title: '% lợi nhuận cao nhất', value: +userData.max_profit > 0 ? +userData.max_profit : 0 },
                { type: 'string', title: 'Thời gian giữ trung bình', value: `${Math.round((+userData.avg_duration || 0) / 3600000)} giờ` },
                { type: 'percentage', title: 'Profit factor', value: +userData.profit_factor }
            ],
        ]
        return (
            <ChartLayout area={gridArea} className=''>
                <div className='p-6'>
                    <div className={`${titleText}`}>
                        Tổng quan
                    </div>
                    <div>
                        {data.map((group, groupIndex) =>
                            <div className={`flex justify-center items-center gap-6 ${width < 640 && 'flex-col !gap-2 mt-5'}`}>
                                {group.map((e, index) =>
                                    renderInlineText(e.type, e.title, e.value, width < 640 ? (groupIndex + 1) === data.length ? 'true' : ((index + 1) % 4 === 0 ? 'lowheight' : 'true') : groupIndex + 1 === 3 ? 'min-h' : 'false', setChart3Current, chart3Current)
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </ChartLayout>
        )
    }

    const renderChart4 = (gridArea) => {
        const data = {
            series: [{
                name: 'series-3',
                data: [30, 40, 35, 50, 49, 60, 70],
            }],
            options: {
                chart: {
                    id: 'chart3',
                    toolbar: {
                        show: false
                    },
                },
                markers: {
                    colors: ['#00C8BC', '#2AD9CE', '#33FFDD', '#80FFEA', '#BFFFF5', '#D9FFF9', '#EEF1FF'],
                },
                yaxis: {
                    show: false
                },
                xaxis: {
                    categories: ['Kiên nhẫn', 'Kỷ luật', 'Lợi nhuận', 'Khối lượng giao dịch', 'Kinh nghiệm', 'Quản lý rủi ro', 'Thường xuyên'],
                    labels: {
                        show: false
                    }
                },
                colors: ['#00C8BC']
            },
            type: 'radar',
        }

        return (
            <ChartLayout area={gridArea}>
                <div className='p-6 w-full h-full'>
                    <div className={`w-full h-10 flex items-center ${titleText}`}>
                        Chỉ số kinh nghiệm
                    </div>
                    <div className='h-full flex justify-center items-center'>
                        {renderApexChart(data, { height: '400px', width: '100%' })}
                    </div>
                </div>
            </ChartLayout>
        )
    }

    const renderChart5 = (gridArea) => {
        const chart5Tabs = [
            { title: 'PNL', value: 1 },
            { title: 'Tài sản và vốn', value: 2 },
            { title: 'Nạp và rút', value: 3 },
            { title: 'Drawdown', value: 4 },
        ]
        const chart5TimeTabs = [
            { title: '1 Ngày', value: 1 },
            { title: '1 Tuần', value: 2 },
            { title: '1 Tháng', value: 3 },
            { title: '3 Tháng', value: 4 },
        ]
        const chart5TypeTabs = [
            { title: 'Số tiền', value: 'number' },
            { title: 'Phần trăm', value: 'percent' }
        ]
        const chart5Descriptions = {
            '1': 'Số tiền',
            '2': ['Tài sản', 'Vốn'],
            '3': ['Lượng tiền nạp', 'Lượng tiền rút'],
            '4': ['Tài sản', 'Vốn'],
        }
        const chartData = []
        const labels = chart5Data.map(e => formatTime(e.time, 'dd/MM'))
        switch (chart5Config.tab) {
            case 1:
                chartData.push(chart5Data.map(e => Math.round(e.profit)))
                break
            case 2:
                chartData.push(chart5Data.map(e => Math.round(e.balance)))
                chartData.push(chart5Data.map(e => Math.round(e.equity)))
                break
            case 3:
                chartData.push(chart5Data.map(e => Math.round(e.deposit)))
                chartData.push(chart5Data.map(e => Math.round(e.withdraw)))
                break
            case 4:
                chartData.push(chart5Data.map(e => Math.round(e.balance)))
                chartData.push(chart5Data.map(e => Math.round(e.equity)))
                break

        }
        const data = {
            labels,
            datasets: chartData.length === 1 ? [{
                fill: true,
                label: false,
                data: chartData[0],
                lineTension: 0.2,
                backgroundColor: 'rgba(0, 201, 189, 0.08)',
                borderColor: colors.teal,
                borderWidth: 1.5,
                pointRadius: 0,
                pointBackgroundColor: colors.teal,
            }] : [{
                fill: false,
                label: false,
                data: chartData[0],
                lineTension: 0.2,
                borderColor: colors.teal,
                borderWidth: 1.5,
                pointRadius: 0,
                pointBackgroundColor: colors.teal,

            },
            {
                fill: false,
                label: false,
                data: chartData[1],
                lineTension: 0.2,
                borderColor: '#80FFEA',
                borderWidth: 1.5,
                pointRadius: 0,
                pointBackgroundColor: '#80FFEA',
            },],
        };
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const descriptions = {
                                '1': 'Mức PNL: ',
                                '2': ['Tài sản :', 'Vốn: '],
                                '3': ['Lượng tiền nạp: ', 'Lượng tiền rút: '],
                                '4': ['Tài sản: ', 'Vốn: '],
                            }
                            const index = context.dataIndex
                            const text1 = descriptions[chart5Config.tab] + (chartData[0][index] >= 0 ? '+' : '') + formatPrice(chartData[0][index], 0) + ' ' + props.currency
                            if (chart5Config.tab === 1) return text1
                            const text2 = descriptions[chart5Config.tab][0] + formatPrice(chartData[0][index], 0) + ' ' + props.currency ?? null
                            const text3 = descriptions[chart5Config.tab][1] + formatPrice(chartData[1][index], 0) + ' ' + props.currency ?? null
                            return [text2, text3]
                        },
                        // filter: function (context) {
                        //     return context.datasetIndex === 0
                        // },
                        labelTextColor: function (context) {
                            return colors.darkBlue
                        },
                    },
                    backgroundColor: colors.white,
                    displayColors: false,
                    titleColor: colors.grey2,
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        }

        return width > 640 ? (
            <ChartLayout area={gridArea}>
                <div className='p-6 w-full h-full'>
                    <div className={`${titleText}`}>
                        Thống kê biến động
                    </div>
                    <div className='flex p-2 items-center mt-6 justify-center rounded-xl bg-gray-4 h-14'>
                        {chart5Tabs.map((tab, index) =>
                            <div className={`flex items-center justify-center w-full h-full text-base font-medium leading-8 cursor-pointer ${chart5Config.tab === index + 1 ? 'bg-white rounded-xl text-darkBlue' : 'text-darkBlue-5'}`}
                                onClick={_.debounce(() => setChart5Config({
                                    ...chart5Config,
                                    tab: tab.value
                                }), 200)}>
                                {tab.title}
                            </div>
                        )}
                    </div>
                    <div className='w-full flex items-center justify-between'>
                        <div className='w-fit flex gap-2 items-center justify-between'>
                            {chart5Config.tab !== 1 ?
                                <div className='flex items-center gap-4'>
                                    <div className='flex gap-2 h-full items-center text-gray-2 text-sm font-medium leading-6'>
                                        <svg width="7" height="8" viewBox="0 0 7 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="3.5" cy="4" r="3.5" fill="#00C8BC" />
                                        </svg>
                                        {chart5Descriptions[chart5Config.tab]?.[0]}
                                    </div>
                                    <div className='flex gap-2 h-full items-center text-gray-2 text-sm font-medium leading-6'>
                                        <svg width="7" height="8" viewBox="0 0 7 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="3.5" cy="4" r="3.5" fill="#80FFEA" />
                                        </svg>
                                        {chart5Descriptions[chart5Config.tab]?.[1]}
                                    </div>
                                </div>
                                :
                                <div className='h-7 my-6 px-2 py-1 rounded-md text-sm leading-5 font-medium cursor-pointer bg-gray-4 !text-darkBlue'
                                >
                                    {chart5Descriptions[chart5Config.tab]}
                                </div>}
                        </div>
                        <div className='flex gap-3'>
                            {renderChartTabs(chart5TimeTabs, 'time', chart5Config, setChart5Config)}
                        </div>
                    </div>
                    <div className='flex w-full max-h-[600px] items-center justify-center'>
                        <ChartJS type='area' data={data} options={options} height='450px' />
                    </div>
                </div>
            </ChartLayout>
        ) : (
            <ChartLayout area={gridArea}>
                <div className='p-6 w-full h-full'>
                    <div className={`${titleText}`}>
                        Thống kê biến động
                    </div>
                    <div className='flex p-2 items-center mt-6 justify-center rounded-xl bg-gray-4 h-14'>
                        {chart5Tabs.map((tab, index) => {
                            return (
                                <div className={`flex items-center justify-center w-full h-full text-xs font-medium leading-5 cursor-pointer ${chart5Config.tab === index + 1 ? 'bg-white rounded-xl !text-darkBlue' : 'text-darkBlue-5'}`}
                                    onClick={_.debounce(() => setChart5Config({ ...chart5Config, tab: tab.value }), 200)}>
                                    {tab.title}
                                </div>
                            )
                        })}
                    </div>
                    <div className='w-full flex items-center justify-between'>
                        <div className='h-full flex w-fit justify-between gap-2'>
                            {chart5TypeTabs.map((tab) =>
                                <div className={`h-7 my-6 px-2 py-1 rounded-md text-sm leading-5 font-medium cursor-pointer text-gray-2 ${tab.value === chart5Config.type && 'bg-gray-4 !text-darkBlue'}`} >
                                    {tab.title}
                                </div>
                            )}
                        </div>
                        <div className='flex gap-3'>
                            {renderTimePopover(chart5Config, setChart5Config)}
                        </div>
                    </div>
                    <div className='max-h-[600px] flex w-full items-center justify-center'>
                        <ChartJS type='area' data={data} height='450px' />
                    </div>
                </div>
            </ChartLayout>
        )
    }

    const renderChart6 = (gridArea) => {
        const chart6Tabs = [
            { content: 'Tài khoản', value: 1 },
            { content: 'Tóm tắt', value: 2 }
        ]
        return <div className='w-full h-auto' style={{ gridArea }} >
            {renderTabs(chart6Tabs, chart6Tab, setChart6Tab, false)}
            {chart6Tab === 1 ?
                <Account
                    currency={props.currency}
                    renderChartTabs={renderChartTabs}
                    renderTimePopover={renderTimePopover}
                    loadingPlaceHolder={loadingPlaceHolder}
                    width={width}
                />
                :
                <Summary
                    currency={props.currency}
                    renderChartTabs={renderChartTabs}
                    renderTimePopover={renderTimePopover}
                    loadingPlaceHolder={loadingPlaceHolder}
                    width={width}
                />
            }
        </div>

    }

    const renderChart7 = (gridArea) => {
        const chart7Tabs = [
            { content: 'Lịch sử lệnh đang mở', value: 1 },
            { content: 'Lịch sử lệnh đã đóng', value: 2 },
            { content: 'Tổng quan lịch sử giao dịch', value: 3 }
        ]
        return <div className='w-full h-full' style={{ gridArea }} >
            <div className='overflow-hidden'>
                {renderTabs(chart7Tabs, chart7Tab, setChart7Tab, false)}
            </div>
            <div>
                <Orders tab={chart7Tab} width={width} currency={props.currency} />
            </div>
        </div>
    }

    return (
        <div className='w-auto h-auto !bg-[#F8F9FA]' style={width > 960 ? gridTemplate : anotherGridTemplate}>
            {user && userData ? renderChart1('chart1') : loadingPlaceHolder('chart1')}
            {user && userData ? renderChart2('chart2') : loadingPlaceHolder('chart2')}
            {user && userData ? renderChart3('chart3') : loadingPlaceHolder('chart3')}
            {user && userData ? renderChart4('chart4') : loadingPlaceHolder('chart4')}
            {user && userData && chart5Data ? renderChart5('chart5') : loadingPlaceHolder('chart5')}
            {user && userData ? renderChart6('chart6') : loadingPlaceHolder('chart6')}
            {user && userData ? renderChart7('chart7') : loadingPlaceHolder('chart7')}
        </div>

    )
}

export default FuturePortfolio

export const renderInlineText = (type, label, value, noUnderline = 'false', onClick, current) => {
    switch (type) {
        case 'price':
            value = <span className=''>{formatPrice(value, 0)}</span>
            break;
        case 'percentage':
            value = <span className={`${value >= 0 ? 'text-teal' : 'text-red'}`}>{formatPrice(value, 2)}%</span>
            break
        case 'popover':
            return (
                <Popover className="relative w-full">
                    {({ open, close }) => (
                        <>
                            <Popover.Button className={`w-full ${noUnderline === 'lowheight' ? 'pb-5' : 'min-h-[52px]'} border-b-[1px] border-gray-2 border-opacity-20`}>
                                <div className="w-full py-1 flex items-center justify-between text-sm font-medium leading-6 cursor-pointer hover:opacity-80 rounded-md text-darkBlue-5">
                                    <div className='flex h-full text-center items-center'>
                                        {current ? label[0] : label[1]}
                                        <ChevronDown size={16} className="ml-1" />
                                    </div>
                                    <div>
                                        {<span className={`${(current ? value[0] : value[1]) >= 0 ? 'text-teal' : 'text-red'}`}>{formatPrice(current ? value[0] : value[1], 2)}%</span>}
                                    </div>
                                </div>
                            </Popover.Button>
                            <Transition
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                            >
                                <Popover.Panel className="absolute z-50 bg-white dark:bg-bgPrimary-dark px-1 py-2 w-full border-[1px] rounded-lg">
                                    <div className="w-full h-10 px-2 py-1 flex items-center justify-between text-sm font-medium leading-6 cursor-pointer hover:bg-teal-600/[.05] rounded-md text-darkBlue-5  border-b-[1px] border-gray-2 border-opacity-20"
                                        onClick={() => onClick(true)}
                                    >
                                        {label[0]} <span className={`${value[0] >= 0 ? 'text-teal' : 'text-red'}`}>{formatPrice(value[0], 2)}%</span>
                                    </div>
                                    <div className="w-full h-10 px-2 py-1 flex items-center justify-between text-sm font-medium leading-6 cursor-pointer hover:bg-teal-600/[.05] rounded-md text-darkBlue-5"
                                        onClick={() => onClick(false)}
                                    >
                                        {label[1]} <span className={`${value[1] >= 0 ? 'text-teal' : 'text-red'}`}>{formatPrice(value[1], 2)}%</span>
                                    </div>
                                </Popover.Panel>
                            </Transition>
                        </>
                    )}
                </Popover>
            )
        case 'line':
            return (
                <div className='my-4 border-b-[1px] border-gray-2 h-[1px]' >
                </div>
            )
        default:
            break
    }
    return (
        <div className={`w-full flex justify-between items-center ${noUnderline === 'lowheight' && 'pb-5 border-b-[1px] border-gray-2 border-opacity-20'} ${(noUnderline === 'false') && 'min-h-[52px] border-b-[1px] border-gray-2 border-opacity-20'} ${noUnderline === 'min-h' && 'min-h-[52px]'}`}>
            <div className='text-darkBlue-5 text-sm font-medium leading-6'>
                {label}
            </div>
            <div className='text-sm font-medium leading-6'>
                {value}
            </div>
        </div>
    )
}

export const loadingPlaceHolder = (area) => {
    return (
        <div className='w-full h-full rounded-xl bg-white flex justify-center items-center min-h-[300px]' style={{ gridArea: area }} id={area} >
            <PulseLoader color='#F2F4F7' size={10} />
        </div>
    )
}
