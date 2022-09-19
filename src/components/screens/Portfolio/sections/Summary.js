import React, { useEffect, useState } from 'react'
import colors from 'styles/colors'
import FetchApi from 'utils/fetch-api'
import ChartLayout from '../charts/ChartLayout'
import { API_PORTFOLIO_SUMMARY } from 'redux/actions/apis';
import { formatPrice, formatTime } from 'redux/actions/utils';
import ChartJS from '../charts/ChartJS';
import useIsMount from 'hooks/useIsMount'

const chart6SectionsTemplate = {
    display: 'grid',
    gridTemplateAreas: `
                    'section1 section1'
                    'section2 section3'
                    'section4 section5'
                    'section6 section8'
                    'section7 section8'
                    'section9 section9'
                `,
    gap: '24px',
}

const anotherChart6SectionsTemplate = {
    display: 'grid',
    gridTemplateAreas: `
                    'section1'
                    'section2'
                    'section3'
                    'section4'
                    'section5'
                    'section6'
                    'section7'
                    'section8'
                    'section9'
                `,
    gap: '24px',
}

const titleText = 'text-[20px] font-semibold leading-10'

const Summary = (props) => {
    const {
        currency,
        renderChartTabs,
        renderTimePopover,
        loadingPlaceHolder,
        width
    } = props
    const [section1Data, setSection1Data] = useState(null)
    const [section1Config, setSection1Config] = useState({
        type: 1,
        time: 1,
    })
    const [section2Data, setSection2Data] = useState(null)
    const [section2Config, setSection2Config] = useState({
        type: 1,
    })
    const [section3Data, setSection3Data] = useState(null)
    const [section3Config, setSection3Config] = useState({
        type: 1,
    })
    const [section4Data, setSection4Data] = useState(null)

    const [section6Data, setSection6Data] = useState(null)
    const [section6Config, setSection6Config] = useState({
        type: 1,
        time: 1
    })

    const [section7Data, setSection7Data] = useState(null)
    const [section7Config, setSection7Config] = useState({
        time: 1
    })

    const [section8Data, setSection8Data] = useState(null)
    const [section8Config, setSection8Config] = useState({
        type: 1,
        time: 1
    })

    const [section9Data, setSection9Data] = useState(null)
    const [section9Config, setSection9Config] = useState({
        type: 1,
        time: 1
    })

    // fetch all in first render
    useEffect(() => {
        // const date = new Date()
        // date.setDate(date.getDate() - 1);
        // date.toLocaleDateString();
        FetchApi({
            url: API_PORTFOLIO_SUMMARY,
            options: {
                method: 'GET',
            },
            params: {
                currency: props.currency === 'VNDC' ? 72 : 22,
                chart_id: [2, 1, 6, 12, 3, 8, 11, 9],
                // from: date,
                // to: new Date(),
            },
        }).then(async ({ data, status }) => {
            if (status === 200) {
                setSection1Data(data['2'])
                setSection2Data(data['1'])
                setSection3Data(data['6'])
                setSection4Data({ '12': data['12'], '3': data['3'] })
                setSection6Data(data['8'])
                setSection7Data(data['11'])
                setSection9Data(data['9'])
            } else {
                setSection1Data(null)
            }
        });
    }, [currency])

    const isMount = useIsMount();
    //section 1
    useEffect(() => {
        if (isMount) return
        const date = new Date()
        switch (section1Config.time) {
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
        FetchApi({
            url: API_PORTFOLIO_SUMMARY,
            options: {
                method: 'GET',
            },
            params: {
                currency: props.currency === 'VNDC' ? 72 : 22,
                chart_id: 2,
                from: date,
                to: new Date()
            },
        }).then(async ({ data, status }) => {
            if (status === 200) {
                setSection1Data(data)
            } else {
                setSection1Data(null)
            }
        });
    }, [section1Config])

    //section 2
    useEffect(() => {
        if (isMount) return
        const chartTypes = { '1': 'WW', '2': 'HH' }
        FetchApi({
            url: API_PORTFOLIO_SUMMARY,
            options: {
                method: 'GET',
            },
            params: {
                currency: props.currency === 'VNDC' ? 72 : 22,
                chart_id: 1,
                timeFrame: chartTypes[section2Config.type]
            },
        }).then(async ({ data, status }) => {
            if (status === 200) {
                setSection2Data(data)
            } else {
                setSection2Data(null)
            }
        });
    }, [section2Config])

    //section 3
    useEffect(() => {
        if (isMount) return
        const chartTypes = {
            '1': 6,
            '2': 5
        }
        FetchApi({
            url: API_PORTFOLIO_SUMMARY,
            options: {
                method: 'GET',
            },
            params: {
                currency: props.currency === 'VNDC' ? 72 : 22,
                chart_id: chartTypes[section3Config.type],
            },
        }).then(async ({ data, status }) => {
            if (status === 200) {
                setSection3Data(data)
            } else {
                setSection3Data(null)
            }
        });
    }, [section3Config])

    //section 4 5
    useEffect(() => {
        if (isMount) return
        FetchApi({
            url: API_PORTFOLIO_SUMMARY,
            options: {
                method: 'GET',
            },
            params: {
                currency: props.currency === 'VNDC' ? 72 : 22,
                chart_id: [12, 3],
            },
        }).then(async ({ data, status }) => {
            if (status === 200) {
                setSection4Data(data)
            } else {
                setSection4Data(null)
            }
        });
    }, [currency])

    //section 6
    useEffect(() => {
        if (isMount) return
        const date = new Date()
        switch (section6Config.time) {
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
        FetchApi({
            url: API_PORTFOLIO_SUMMARY,
            options: {
                method: 'GET',
            },
            params: {
                currency: props.currency === 'VNDC' ? 72 : 22,
                chart_id: 8,
                from: date,
                to: new Date(),
            },
        }).then(async ({ data, status }) => {
            if (status === 200) {
                setSection6Data(data)
            } else {
                setSection6Data(null)
            }
        });
    }, [section6Config])

    //section 7
    useEffect(() => {
        if (isMount) return
        const date = new Date()
        switch (section7Config.time) {
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
        FetchApi({
            url: API_PORTFOLIO_SUMMARY,
            options: {
                method: 'GET',
            },
            params: {
                currency: props.currency === 'VNDC' ? 72 : 22,
                chart_id: 11,
                timeFrame: 'D',
                from: date,
                to: new Date(),
            },
        }).then(async ({ data, status }) => {
            if (status === 200) {
                setSection7Data(data)
            } else {
                setSection7Data(null)
            }
        });
    }, [section7Config])

    //section 9
    useEffect(() => {
        if (isMount) return
        const chartTypes = { '1': '9', '2': '10' }
        const date = new Date()
        switch (section9Config.time) {
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
        FetchApi({
            url: API_PORTFOLIO_SUMMARY,
            options: {
                method: 'GET',
            },
            params: {
                currency: props.currency === 'VNDC' ? 72 : 22,
                chart_id: chartTypes[section9Config.type],
                from: date,
                to: new Date(),
            },
        }).then(async ({ data, status }) => {
            if (status === 200) {
                setSection9Data(data)
            } else {
                setSection9Data(null)
            }
        });
    }, [section9Config])

    const renderSection1 = (gridArea) => {
        section1Data.data?.sort((a, b) => b.key_count - a.key_count);
        const top = section1Data.data.slice(0, section1Data.length < 5 ? section1Data.length : 5);
        const others = section1Data.data.slice(section1Data.length < 5 ? section1Data.length : 5, section1Data.length);

        let totalOthers = 0
        others.map(e => totalOthers += e.key_count)
        const timeTabs = [
            { title: '1 Ngày', value: 1 },
            { title: '1 Tuần', value: 2 },
            { title: '1 Tháng', value: 3 },
            { title: '3 Tháng', value: 4 },
        ]
        const bgcolors = ['bg-teal-800', 'bg-teal-900', 'bg-teal-1000', 'bg-teal-1100', 'bg-teal-1200']
        return width >= 640 ? (
            <ChartLayout area={gridArea} >
                <div className='w-full h-full'>
                    <div className='w-full h-full p-6 border-[1px] border-[#E2E8F0] rounded-xl mb-6'>
                        <div className='w-full flex justify-between items-center'>
                            <div className={`${titleText}`}>
                                Thống kê tài sản
                            </div>
                            <div className='flex gap-3'>
                                {renderChartTabs(timeTabs, 'time', section1Config, setSection1Config)}
                            </div>
                        </div>
                        <div className='w-full'>
                            <div className='font-semibold text-4xl leading-10'>
                                100%  <span className='font-medium text-lg leading-10 text-gray-2'>({section1Data.buy} lệnh mua và {section1Data.sell} lệnh bán)</span>
                            </div>
                            <div className='flex w-full bg-[#F2F4F7] h-4 rounded transition-all my-6'>
                                {top.map((e, index) => {
                                    return (
                                        <div className={`${bgcolors[index]} h-4`} style={{ width: (e.key_count / e.total) * 100 + '%' }}>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className='flex w-full h-auto justify-between flex-wrap'>
                                {top.map((e, index) => {
                                    return (
                                        <div className='flex gap-2 items-center justify-center text-gray-2 font-medium text-sm leading-6'>
                                            <svg width="9" height="8" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="4.60156" cy="4" r="4" fill={colors.portfolio.teal[index]} />
                                            </svg>
                                            {e.key} <span className='text-darkBlue'>{formatPrice(e.key_count / e.total * 100, 2)}%</span>
                                        </div>
                                    )
                                })}
                                {others.length > 0 && <div className='flex gap-2 items-center justify-center text-gray-2 font-medium text-sm leading-6'>
                                    <svg width="9" height="8" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="4.60156" cy="4" r="4" fill='#F2F4F7' />
                                    </svg>
                                    Others <span className='text-darkBlue'>{formatPrice(totalOthers, 2)}%</span>
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </ChartLayout>
        ) : (
            <ChartLayout area={gridArea} >
                <div className='w-full h-full'>
                    <div className='w-full h-full p-6 border-[1px] border-[#E2E8F0] rounded-xl'>
                        <div className={`${titleText}`}>
                            Thống kê tài sản
                        </div>
                        <div className='flex gap-3 bg-gray-4 p-1 rounded-md h-8 items-center my-4'>
                            {renderChartTabs(timeTabs, 'time', section1Config, setSection1Config, true, true)}
                        </div>
                        <div className='w-full'>
                            <div className='font-semibold text-4xl leading-10'>
                                100%  <span className='font-medium text-lg leading-10 text-gray-2'>({section1Data.buy} lệnh mua và {section1Data.sell} lệnh bán)</span>
                            </div>
                            <div className='flex w-full bg-[#F2F4F7] h-4 rounded transition-all my-6'>
                                {top.map((e, index) => {
                                    return (
                                        <div className={`${bgcolors[index]} h-4`} style={{ width: (e.key_count / e.total) * 100 + '%' }}>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className='flex w-full h-auto justify-between flex-wrap'>
                                {top.map((e, index) => {
                                    return (
                                        <div className='flex gap-2 items-center justify-center text-gray-2 font-medium text-sm leading-6'>
                                            <svg width="9" height="8" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="4.60156" cy="4" r="4" fill={colors.portfolio.teal[index]} />
                                            </svg>
                                            {e.key} <span className='text-darkBlue'>{formatPrice(e.key_count / e.total * 100, 2)}%</span>
                                        </div>
                                    )
                                })}
                                {others.length > 0 && <div className='flex gap-2 items-center justify-center text-gray-2 font-medium text-sm leading-6'>
                                    <svg width="9" height="8" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="4.60156" cy="4" r="4" fill='#F2F4F7' />
                                    </svg>
                                    Others <span className='text-darkBlue'>{formatPrice(totalOthers, 2)}%</span>
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </ChartLayout>
        )
    }

    const sortDayOrWeek = (data, isWeekDay = false) => {
        const weekdaySorter = { mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6, sun: 7 }
        return data.sort(function sortByDay(a, b) {
            let day1 = a.time.toLowerCase()
            let day2 = b.time.toLowerCase()
            return isWeekDay ? weekdaySorter[day1] - weekdaySorter[day2] : +day1 - +day2;
        });
    }
    const formatHour = (hour) => {
        return hour > 9 ? `${hour}:00` : `0${hour}:00`
    }

    const renderSection2 = (gridArea) => {
        const section2TypeTabs = [
            { title: 'Theo thứ', value: 1 },
            { title: 'Theo giờ', value: 2 },
        ]

        const sortedData = sortDayOrWeek(section2Data, section2Config.type === 1)

        const weekDays = { Mon: 'Thứ 2', Tue: 'Thứ 3', Wed: 'Thứ 4', Thu: 'Thứ 5', Fri: 'Thứ 6', Sat: 'Thứ 7', Sun: 'Chủ Nhật', }

        const labels = sortedData.map(e => section2Config.type === 1 ? weekDays[e.time] : formatHour(+e.time))
        const chartData = sortedData.map(e => e.total)

        const data = {
            labels,
            datasets: [{
                type: 'bar',
                data: chartData,
                backgroundColor: colors.portfolio.teal[0],
                borderColor: colors.portfolio.teal[0],
                maxBarThickness: width >= 640 ? 32 : 8,
                borderRadius: 2,
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
                            const total = 'Tổng lệnh: ' + sortedData[index].total
                            const proportion = 'Tỷ trọng lệnh: ' + formatPrice(sortedData[index].win_rate, 2) + '%'
                            const profit = 'Tỷ lệ PNL: ' + (sortedData[index].profit >= 0 ? '+' : '') + formatPrice(sortedData[index].profit, 2) + '%'
                            return [total, proportion, profit]

                        },
                        labelPointStyle: function (context) {
                            return {
                                pointStyle: 'circle',
                            };
                        },
                        labelTextColor: function (context) {
                            return colors.darkBlue
                        },
                    },
                    backgroundColor: colors.white,
                    titleColor: colors.grey2,
                    displayColors: false
                },
            },
        }

        return width >= 640 ? (
            <ChartLayout area={gridArea} >
                <div className='w-full h-full' style={{ width: width >= 640 ? `${(width - 96 - 24) / 2}px` : 'w-full' }} >
                    <div className='w-full h-full p-6 border-[1px] border-[#E2E8F0] rounded-xl'>
                        <div className='flex w-full justify-between items-center mb-6'>
                            <div className={`${titleText}`}>
                                Thống kê tổng số lệnh theo giờ
                            </div>
                            <div className='bg-gray-4 flex items-center justify-between min-h-[36px] rounded-md p-1'>
                                {renderChartTabs(section2TypeTabs, 'type', section2Config, setSection2Config, true)}
                            </div>
                        </div>
                        <div className='w-full mt-6'>
                            <ChartJS type='bar' data={data} options={options} height='400px' />
                        </div>
                    </div>
                </div>
            </ChartLayout>
        ) : (
            <ChartLayout area={gridArea} >
                <div className='w-full h-full' style={{ width: width >= 640 ? `${(width - 96 - 24) / 2}px` : 'w-full' }} >
                    <div className='w-full h-full p-6 border-[1px] border-[#E2E8F0] rounded-xl'>
                        <div className={`${titleText}`}>
                            Thống kê tổng số lệnh theo giờ
                        </div>
                        <div className='bg-gray-4 flex items-center justify-between min-h-[36px] rounded-md p-1 my-4'>
                            {renderChartTabs(section2TypeTabs, 'type', section2Config, setSection2Config, true, true)}
                        </div>
                        <div className='w-full mt-6'>
                            <ChartJS type='bar' data={data} options={options} height='400px' />
                        </div>
                    </div>
                </div>
            </ChartLayout>
        )
    }

    const renderSection3 = (gridArea) => {
        const section3TypeTabs = [
            { title: 'Lời/lỗ', value: 1 },
            { title: 'Mua/bán', value: 2 },
        ]
        const chartData = section3Config.type === 1 ?
            [section3Data[1].win_rate, section3Data[1].loss_rate] :
            [section3Data[1].buy_rate, section3Data[1].sell_rate]

        const labels = section3Config.type === 1 ?
            ['Tỷ lệ lệnh lời: ', 'Tỷ lệ lệnh lỗ: '] :
            ['Tỷ lệ lệnh mua: ', 'Tỷ lệ lệnh bán: ']
        const data = {
            labels,
            datasets: [{
                data: chartData,
                backgroundColor: [colors.portfolio.teal[0], '#C0F9EE'],
                borderColor: [colors.portfolio.teal[0], '#C0F9EE'],
                hoverOffset: 4,
                spacing: 4,
                rotation: 180,
                // radius: 200,
            }]
        };

        const pnl = formatPrice(section3Data[0]?.total_pnl, currency === 'VNDC' ? 0 : 2)
        const middleText = {
            id: 'middleText',
            afterDatasetsDraw(chart, args, options) {
                const { ctx, chartArea: { left, right, top, bottom, width, height } } = chart
                ctx.save()
                ctx.font = 'bold 26px Barlow'
                ctx.fillStyle = '#00C8BC'
                ctx.textAlign = 'center'
                ctx.fillText((section3Data[0]?.total_pnl >= 0 ? '+' : '') + pnl, width / 2, height / 2 + top)
                ctx.font = 'normal 12px Barlow'
                ctx.fillStyle = '#A0AEC0'
                ctx.textAlign = 'center'
                ctx.fillText('Total PNL', width / 2, height / 2 + 24)
            }
        }

        const plugins = [middleText]

        const options = {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '90%',
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return context.label + formatPrice(context.raw, 2) + '%'
                        },
                        labelTextColor: function (context) {
                            return colors.darkBlue
                        },
                    },
                    backgroundColor: colors.white,
                    displayColors: false
                },
            },
        }
        return width >= 640 ? (
            <ChartLayout area={gridArea} >
                <div className='w-full h-full' style={{ width: width >= 640 ? `${(width - 96 - 24) / 2}px` : 'w-full' }}>
                    <div className='w-full h-full p-6 border-[1px] border-[#E2E8F0] rounded-xl'>
                        <div className='flex w-full justify-between items-center '>
                            <div className={`${titleText}`}>
                                Tỷ lệ lời/lỗ
                            </div>
                            <div className='bg-gray-4 flex items-center justify-between min-h-[36px] rounded-md p-1'>
                                {renderChartTabs(section3TypeTabs, 'type', section3Config, setSection3Config, true)}
                            </div>
                        </div>
                        <div className='w-full flex justify-center h-full items-center'>
                            <div className='w-[300px]'>
                                <ChartJS type='doughnut' data={data} options={options} plugins={plugins} />
                                <div className='flex items-center justify-center gap-4 mt-6'>
                                    <div className='flex items-center gap-2'>
                                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="4" cy="4" r="3.5" fill="#52EAD1" />
                                        </svg>
                                        {section3Config.type === 1 ? 'Lệnh lời' : 'Lệnh mua'}
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="4" cy="4" r="3.5" fill="#C0F9EE" />
                                        </svg>
                                        {section3Config.type === 1 ? 'Lệnh lỗ' : 'Lệnh bán'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ChartLayout>
        ) : (
            <ChartLayout area={gridArea} >
                <div className='w-full h-auto'>
                    <div className='w-full h-full p-6 border-[1px] border-[#E2E8F0] rounded-xl'>
                        <div className={`${titleText}`}>
                            Tỷ lệ lời/lỗ
                        </div>
                        <div className='bg-gray-4 flex items-center justify-between min-h-[36px] rounded-md p-1 my-4'>
                            {renderChartTabs(section3TypeTabs, 'type', section3Config, setSection3Config, true, true)}
                        </div>
                        <div className='w-full flex justify-center h-full items-center mt-6'>
                            <div className='max-w-[300px] w-full'>
                                <ChartJS type='doughnut' data={data} options={options} plugins={plugins} />
                                <div className='flex items-center justify-center gap-4 mt-6'>
                                    <div className='flex items-center gap-2'>
                                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="4" cy="4" r="3.5" fill="#52EAD1" />
                                        </svg>
                                        {section3Config.type === 1 ? 'Lệnh lời' : 'Lệnh mua'}
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="4" cy="4" r="3.5" fill="#C0F9EE" />
                                        </svg>
                                        {section3Config.type === 1 ? 'Lệnh lỗ' : 'Lệnh bán'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ChartLayout>
        )
    }

    const renderGraySection = (data) => {
        const renderText = (topText, bottomText, isRight = false) => {
            return (
                <div className={`w-full h-full bg-white py-4 px-6 flex flex-col gap-[2px] ${isRight ? 'rounded-r-lg' : 'rounded-l-lg'}`}>
                    <div className='font-medium text-base leading-8'>
                        {topText}
                    </div>
                    <div className='font-medium text-[26px] leading-[31px]'>
                        {bottomText}
                    </div>
                </div>
            )
        }
        const { title, leftSide, rightSide } = data
        return (
            <div className='w-full p-6 bg-[#F8F9FA] rounded-xl'>
                <div className='w-1/5 h-[2px] bg-teal-800'></div>
                <div className={`${titleText} my-2`}>
                    {title}
                </div>
                <div className='w-full h-full flex items-center justify-between gap-1'>
                    {renderText(leftSide.title, leftSide.value, false)}
                    {renderText(rightSide.title, rightSide.value, true)}
                </div>
            </div>
        )
    }

    const renderSection4 = (gridArea) => {
        const mappedData = {
            title: 'Thời gian giữ lệnh mua/bán trung bình',
            leftSide: {
                title: 'Lệnh mua',
                value: formatPrice(section4Data['12'][0]?.buy?.avg_duration / 3600000, 0) + ' giờ'
            },
            rightSide: {
                title: 'Lệnh bán',
                value: formatPrice(section4Data['12'][0]?.sell?.avg_duration / 3600000, 0) + ' giờ'
            }
        }
        return (
            <ChartLayout area={gridArea} >
                <div className='w-full h-full'>
                    {renderGraySection(mappedData)}
                </div>
            </ChartLayout>
        )
    }

    const renderSection5 = (gridArea) => {
        const mappedData = {
            title: 'Thời gian giữ lệnh lời/lỗ trung bình',
            leftSide: {
                title: 'Lệnh lời',
                value: formatPrice(section4Data['3'][0]?.win?.avg_duration / 3600000, 0) + ' giờ'
            },
            rightSide: {
                title: 'Lệnh lỗ',
                value: formatPrice(section4Data['3'][0]?.lose?.avg_duration / 3600000, 0) + ' giờ'
            }
        }
        return (
            <ChartLayout area={gridArea} >
                <div className='w-full h-full'>
                    {renderGraySection(mappedData)}
                </div>
            </ChartLayout>
        )
    }

    const renderSection6 = (gridArea) => {
        const section6TimeTabs = [
            { title: '1 Ngày', value: 1 },
            { title: '1 Tuần', value: 2 },
            { title: '1 Tháng', value: 3 },
            { title: '3 Tháng', value: 4 },
        ]
        const section6TypeTabs = [
            { title: '%ROI', value: 1 },
            { title: 'PNL', value: 2 },
        ]
        const section6Tooltips = {
            '1': 'Tỷ lệ PNL: ',
            '2': 'Tổng PNL: ',
        }
        const labels = ['Lệnh lời', 'Lệnh lỗ']
        const winData = []
        const loseData = []
        section6Data.map(e => {
            const type = section6Config.type === 1 ? 'roi' : 'profit'
            e[type] >= 0 ?
                winData.push({
                    x: e[type],
                    y: e.duration,
                    r: 6
                }) :
                loseData.push({
                    x: e[type],
                    y: e.duration,
                    r: 6
                })
        })
        const data = {
            labels,
            datasets: [{
                label: 'Lệnh lời',
                data: winData,
                backgroundColor: colors.portfolio.teal[0],
                borderColor: colors.portfolio.teal[0],
            }, {
                label: 'Lệnh lỗ',
                data: loseData,
                backgroundColor: '#C0F9EE',
                borderColor: '#C0F9EE',
            }]
        };
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = section6Config.type === 1 ? ' %' : ` ${currency}`
                            const text1 = section6Tooltips[section6Config.type] + ' ' + formatPrice(context.raw?.x, 2) + label
                            const text2 = 'Thời gian nắm giữ: ' + formatPrice(context.raw?.y, 0) + ' giờ'
                            return [text1, text2]
                        },
                        labelTextColor: function (context) {
                            return colors.darkBlue
                        },
                    },
                    backgroundColor: colors.white,
                    displayColors: false
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        }

        return width >= 1280 ? (
            <ChartLayout area={gridArea} >
                <div className='w-full h-full' style={{ width: width >= 640 ? `${(width - 96 - 24) / 2}px` : 'w-full' }}>
                    <div className='w-full h-full p-6 border-[1px] border-[#E2E8F0] rounded-xl'>
                        <div className='w-full items-center justify-between flex mb-6'>
                            <div className={`${titleText} h-auto`}>
                                Thống kê thời gian giữ lệnh
                            </div>
                            <div className='flex items-center justify-between gap-4'>
                                <div className='flex items-center'>
                                    {renderChartTabs(section6TimeTabs, 'time', section6Config, setSection6Config)}
                                </div>
                                <div className='bg-gray-4 flex items-center min-h-[36px] rounded-md p-1 w-[95px]'>
                                    {renderChartTabs(section6TypeTabs, 'type', section6Config, setSection6Config, true, true)}
                                </div>
                            </div>
                        </div>
                        <div className='w-full relative'>
                            <ChartJS type='bubble' data={data} options={options} height='400px' />
                        </div>
                        <div className='flex items-center gap-4 mt-6'>
                            <div className='flex items-center gap-1 h-full'>
                                <svg width="7" height="8" viewBox="0 0 7 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="3.5" cy="4" r="3.5" fill="#52EAD1" />
                                </svg>
                                Lệnh lời
                            </div>
                            <div className='flex items-center gap-1 h-full'>
                                <svg width="7" height="8" viewBox="0 0 7 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="3.5" cy="4" r="3.5" fill="#C0F9EE" />
                                </svg>
                                Lệnh lỗ
                            </div>
                        </div>
                    </div>
                </div>
            </ChartLayout>
        ) : (
            <ChartLayout area={gridArea} >
                <div className='w-full h-full' style={{ width: width >= 640 ? `${(width - 96 - 24) / 2}px` : 'w-full' }}>
                    <div className='w-full h-full p-6 border-[1px] border-[#E2E8F0] rounded-xl'>
                        <div className={`${titleText} h-auto`}>
                            Thống kê thời gian giữ lệnh
                        </div>
                        <div className='bg-gray-4 flex items-center min-h-[36px] rounded-md p-1 my-4 w-full'>
                            {renderChartTabs(section6TypeTabs, 'type', section6Config, setSection6Config, true, true)}
                        </div>
                        <div className='flex items-center justify-between my-4'>
                            <div className='flex items-center gap-4'>
                                <div className='flex items-center gap-1 h-full'>
                                    <svg width="7" height="8" viewBox="0 0 7 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="3.5" cy="4" r="3.5" fill="#52EAD1" />
                                    </svg>
                                    Lệnh lời
                                </div>
                                <div className='flex items-center gap-1 h-full'>
                                    <svg width="7" height="8" viewBox="0 0 7 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="3.5" cy="4" r="3.5" fill="#C0F9EE" />
                                    </svg>
                                    Lệnh lỗ
                                </div>
                            </div>
                            {renderTimePopover(section6Config, setSection6Config)}
                        </div>
                        <div className='w-full relative'>
                            <ChartJS type='bubble' data={data} options={options} height='400px' />
                        </div>

                    </div>
                </div>
            </ChartLayout>
        )
    }

    const renderSection7 = (gridArea) => {
        const section7TimeTabs = [
            { title: '1 Ngày', value: 1 },
            { title: '1 Tuần', value: 2 },
            { title: '1 Tháng', value: 3 },
            { title: '3 Tháng', value: 4 },
        ]

        const labels = section7Data.map(e => formatTime(e.time, 'dd/MM'))
        const chartData = section7Data.map(e => e.order_value)
        const data = {
            labels,
            datasets: [{
                data: chartData,
                backgroundColor: colors.portfolio.teal[0],
                borderColor: colors.portfolio.teal[0],
                maxBarThickness: width >= 640 ? 32 : 8,
                borderRadius: 2,
            }]
        };
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const index = context.dataIndex
                            const text1 = 'Tổng lệnh: ' + section7Data[index]?.total
                            const text2 = 'Tổng khối lượng giao dịch: ' + formatPrice(section7Data[index]?.order_value, 0) + ' ' + currency
                            const text3 = 'Tỷ lệ PNL: ' + (section7Data[index]?.profit >= 0 ? '+' : '') + formatPrice(section7Data[index]?.profit, 2) + '%'
                            return [text1, text2, text3]
                        },
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
        return width >= 640 ? (
            <ChartLayout area={gridArea} >
                <div className='w-full h-full' style={{ width: width >= 640 ? `${(width - 96 - 24) / 2}px` : 'w-full' }}>
                    <div className='w-full h-full p-6 border-[1px] border-[#E2E8F0] rounded-xl'>
                        <div className='flex items-center justify-between w-full mb-6'>
                            <div className={titleText} >
                                Biến động khối lượng
                            </div>
                            <div className='flex items-center justify-between p-1 h-8 rounded-md'>
                                {renderChartTabs(section7TimeTabs, 'time', section7Config, setSection7Config)}
                            </div>
                        </div>
                        <div className='w-full relative'>
                            <ChartJS type='bar' data={data} options={options} height='400px' />
                        </div>
                    </div>
                </div>
            </ChartLayout>
        ) : (
            <ChartLayout area={gridArea} >
                <div className='w-full h-full' style={{ width: width >= 640 ? `${(width - 96 - 24) / 2}px` : 'w-full' }}>
                    <div className='w-full h-full p-6 border-[1px] border-[#E2E8F0] rounded-xl'>
                        <div className={titleText} >
                            Biến động khối lượng
                        </div>
                        <div className='flex items-center justify-between bg-gray-4 p-1 h-8 my-6 rounded-md'>
                            {renderChartTabs(section7TimeTabs, 'time', section7Config, setSection7Config, true, true)}
                        </div>
                        <div className='w-full relative'>
                            <ChartJS type='bar' data={data} options={options} height='400px' />
                        </div>
                    </div>
                </div>
            </ChartLayout>
        )
    }

    const renderSection9 = (gridArea) => {
        const section9TimeTabs = [
            { title: '1 Ngày', value: 1 },
            { title: '1 Tuần', value: 2 },
            { title: '1 Tháng', value: 3 },
            { title: '3 Tháng', value: 4 },
        ]
        const section9TypeTabs = [
            { title: 'Ký quỹ', value: 1 },
            { title: 'PNL', value: 2 },
        ]
        const labels = []
        const buy = []
        const sell = []
        section9Data.map(e => {
            labels.push(e.leverage + 'x')
            buy.push(e.total_buy)
            sell.push(e.total_sell)
        })
        const data = {
            labels,
            datasets: [{
                type: 'bar',
                label: 'Lệnh mua',
                data: buy,
                backgroundColor: '#52EAD1',
                borderColor: '#52EAD1',
                maxBarThickness: width >= 640 ? 32 : 8,
                borderRadius: 2,
                barPercentage: 0.7,
                order: 2
            }, {
                type: 'bar',
                label: 'Lệnh bán',
                data: sell,
                backgroundColor: '#C0F9EE',
                borderColor: '#C0F9EE',
                maxBarThickness: width >= 640 ? 32 : 8,
                borderRadius: 2,
                barPercentage: 0.7,
                order: 1
            },
            ]
        };
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const index = context.dataIndex
                            const text1 = 'Mức đòn bẩy: ' + labels[index]
                            const text2 = 'Giá ký quỹ tổng: ' + formatPrice(section9Data[index].total, 0) + ' ' + currency
                            const text3 = 'Giá ký quỹ lệnh mua: ' + formatPrice(section9Data[index].total_buy, 0) + ' ' + currency
                            const text4 = 'Giá ký quỹ lệnh bán: ' + formatPrice(section9Data[index].total_sell, 0) + ' ' + currency
                            return [text1, text2, text3, text4]
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
                    ticks: {
                        callback: function (label, index, labels) {
                            return label / 1000 + 'K';
                        }
                    },
                    scaleLabel: {
                        display: true,
                        labelString: '1k = 1000'
                    }
                }
            },
        }
        return width >= 640 ?
            <ChartLayout area={gridArea}>
                <div className='p-6 w-full rounded-xl border-[1px] border-[#E2E8F0] '>
                    <div className='flex items-center justify-between mb-6'>
                        <div className={`${titleText} h-auto`}>
                            Thống kê đòn bẩy theo giá ký quỹ
                        </div>
                        <div className='flex items-center w-fit h-fit gap-4'>
                            {renderChartTabs(section9TimeTabs, 'time', section9Config, setSection9Config)}
                            <div className='bg-gray-4 flex items-center justify-between min-h-[36px] rounded-md p-1'>
                                {renderChartTabs(section9TypeTabs, 'type', section9Config, setSection9Config, true)}
                            </div>
                        </div>
                    </div>
                    <div className='flex w-full items-center justify-center'>
                        <ChartJS type='bar' data={data} options={options} height='400px' />
                    </div>
                    <div className='flex items-center gap-4 mt-6'>
                        <div className='flex items-center gap-1 h-full'>
                            <svg width="7" height="8" viewBox="0 0 7 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="3.5" cy="4" r="3.5" fill="#52EAD1" />
                            </svg>
                            Lệnh mua
                        </div>
                        <div className='flex items-center  gap-1 h-full'>
                            <svg width="7" height="8" viewBox="0 0 7 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="3.5" cy="4" r="3.5" fill="#C0F9EE" />
                            </svg>
                            Lệnh bán
                        </div>
                    </div>
                </div>
            </ChartLayout>
            :
            <ChartLayout area={gridArea}>
                <div className='p-4 w-full rounded-xl border-[1px] border-[#E2E8F0] '>
                    <div className='flex items-center justify-between'>
                        <div className={`${titleText} h-auto`}>
                            Thống kê đòn bẩy theo giá ký quỹ
                        </div>
                    </div>
                    <div>
                        <div className='flex items-center w-full h-fit mb-6 mt-4'>
                            <div className='bg-gray-4 w-full flex items-center justify-between min-h-[36px] rounded-md p-1'>
                                {renderChartTabs(section9TypeTabs, 'type', section9Config, setSection9Config, true, true)}
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center w-full justify-between'>
                        <div className='flex items-center gap-4'>
                            <div className='flex items-center gap-1 h-full'>
                                <svg width="7" height="8" viewBox="0 0 7 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="3.5" cy="4" r="3.5" fill="#52EAD1" />
                                </svg>
                                Lệnh mua
                            </div>
                            <div className='flex items-center  gap-1 h-full'>
                                <svg width="7" height="8" viewBox="0 0 7 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="3.5" cy="4" r="3.5" fill="#C0F9EE" />
                                </svg>
                                Lệnh bán
                            </div>
                        </div>
                        <div>
                            {renderTimePopover(section9Config, setSection9Config)}
                        </div>
                    </div>
                    <div className='flex w-full items-center justify-center mt-6'>
                        <ChartJS type='stackedBar' data={data} options={options} height='400px' />
                    </div>
                </div>
            </ChartLayout>
    }

    return (
        <div className='w-auto h-auto bg-white rounded-xl p-6' style={width >= 640 ? chart6SectionsTemplate : anotherChart6SectionsTemplate}>
            {section1Data ? renderSection1('section1') : loadingPlaceHolder('section1')}
            {section2Data ? renderSection2('section2') : loadingPlaceHolder('section2')}
            {section3Data ? renderSection3('section3') : loadingPlaceHolder('section3')}
            {section4Data ? renderSection4('section4') : loadingPlaceHolder('section4')}
            {section4Data ? renderSection5('section5') : loadingPlaceHolder('section5')}
            {section6Data ? renderSection6('section6') : loadingPlaceHolder('section6')}
            {section7Data ? renderSection7('section7') : loadingPlaceHolder('section7')}
            {/* {true ? renderSection8('section8') : loadingPlaceHolder('section8')} */}
            {section9Data ? renderSection9('section9') : loadingPlaceHolder('section9')}
        </div>
    )
}

export default Summary