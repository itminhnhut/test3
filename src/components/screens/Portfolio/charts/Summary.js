import React, { useEffect, useState } from 'react'
import colors from 'styles/colors'
import FetchApi from 'utils/fetch-api'
import ChartLayout from './ChartLayout'
import { API_PORTFOLIO_SUMMARY } from 'redux/actions/apis';
import { formatPrice, formatTime } from 'src/redux/actions/utils';
import ChartJS from './ChartJS';

const chart6SectionsTemplate = {
    display: 'grid',
    gridTemplateAreas: `
                    'section1 section1'
                    'section2 section3'
                    'section4 section5'
                    'section6 section8'
                    'section7 section8'
                    'section9 section9'
                    'section10 section10'
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

    useEffect(() => {
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
    }, [currency, section1Config])

    useEffect(() => {
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
    }, [currency, section2Config])

    useEffect(() => {
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
    }, [currency, section3Config])

    useEffect(() => {
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

    console.log(section4Data)

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
        return (
            <ChartLayout area={gridArea} >
                <div className='w-full h-full'>
                    <div className='w-full h-full p-6 border-[1px] border-[#E2E8F0] rounded-xl'>
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
                            <div className='flex w-full justify-between'>
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
                    titleColor: colors.gray[2],
                    displayColors: false
                },
            },
        }

        return (
            <ChartLayout area={gridArea} >
                <div className='w-full h-full' style={{ width: width >= 640 ? `${(width - 96 - 24) / 2}px` : 'w-full' }} >
                    <div className='w-full h-full p-6 border-[1px] border-[#E2E8F0] rounded-xl'>
                        <div className='flex w-full justify-between items-center'>
                            <div className={`${titleText}`}>
                                Thống kê tổng số lệnh theo giờ
                            </div>
                            <div className='bg-gray-4 flex items-center justify-between h-9 rounded-md p-1'>
                                {renderChartTabs(section2TypeTabs, 'type', section2Config, setSection2Config, true)}
                            </div>
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
        return (
            <ChartLayout area={gridArea} >
                <div className='w-full h-full' style={{ width: width >= 640 ? `${(width - 96 - 24) / 2}px` : 'w-full' }}>
                    <div className='w-full p-6 border-[1px] border-[#E2E8F0] rounded-xl'>
                        <div className='flex w-full justify-between items-center'>
                            <div className={`${titleText}`}>
                                Tỷ lệ lời/lỗ
                            </div>
                            <div className='bg-gray-4 flex items-center justify-between h-9 rounded-md p-1'>
                                {renderChartTabs(section3TypeTabs, 'type', section3Config, setSection3Config, true)}
                            </div>
                        </div>
                        <div className='w-full flex justify-center h-full items-center'>
                            <div className='w-3/5'>
                                <ChartJS type='doughnut' data={data} options={options} />
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

    return (
        <div className='w-auto h-auto bg-white rounded-xl p-6' style={width >= 640 ? chart6SectionsTemplate : anotherChart6SectionsTemplate}>
            {section1Data ? renderSection1('section1') : loadingPlaceHolder('section1')}
            {section2Data ? renderSection2('section2') : loadingPlaceHolder('section2')}
            {section3Data ? renderSection3('section3') : loadingPlaceHolder('section3')}
            {section4Data ? renderSection4('section4') : loadingPlaceHolder('section4')}
            {section4Data ? renderSection5('section5') : loadingPlaceHolder('section5')}
        </div>
    )
}

export default Summary