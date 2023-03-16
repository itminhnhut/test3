import React from 'react';
import { useState, useEffect } from 'react';
import { formatPrice, formatTime } from 'src/redux/actions/utils';
import colors from 'styles/colors';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { useTranslation } from 'next-i18next';
import Note from 'components/common/Note';
import GroupFilterTime, { listTimeFilter } from 'components/common/GroupFilterTime';
import { ArrowDropDownIcon } from 'components/svg/SvgIcon';
import CollapseV2 from 'components/common/V2/CollapseV2';

import ChartJS from './ChartJS';
import { indexOf } from 'lodash';
const { subDays } = require('date-fns');

const PnlChanging = ({ t, isMobile, isDark }) => {
    const [curPnlFilter, setCurPnlFilter] = useState(listTimeFilter[0].value);
    const [pnlLabels, setPnlLabels] = useState([]);

    useEffect(() => {
        const curDate = new Date();
        const newLabels = [formatTime(curDate, 'dd/MM')];
        switch (curPnlFilter) {
            case 1: // 1 Tuan
                for (let i = 1; i < 7; i++) {
                    // Lấy ngày hôm trước i ngày
                    const pastDay = subDays(new Date(), 1);

                    // Định dạng ngày theo format 'dd/MM'
                    newLabels.push(formatTime(pastDay, 'dd/MM'));
                }
                break;
            case 2: // 1 Thang
                break;
            case 3: // all
                break;
            default:
                break;
        }
        setPnlLabels(newLabels);
    }, [curPnlFilter]);

    const minDuong = 500;
    const maxDuong = 30000;
    const minAm = -30000;
    const maxAm = -500;

    const pnlChartData = {
        labels: pnlLabels,
        datasets: [
            {
                fill: false,
                label: false,
                data: Array.from({ length: pnlLabels.length }, () => [minDuong, Math.floor(Math.random() * (maxDuong - minDuong + 1)) + minDuong]),
                backgroundColor: colors.green[6],
                stack: 'pnl'
            },
            {
                fill: false,
                label: false,
                data: Array.from({ length: pnlLabels.length }, () => [Math.floor(Math.random() * (maxAm - minAm + 1)) + minAm, maxAm]),
                backgroundColor: colors.red[2],
                stack: 'pnl'
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'x',
        barPercentage: 0.15,
        borderRadius: 3,
        borderSkipped: false,
        plugins: {
            tooltip: {
                // callbacks: {
                //     label: function (context) {
                //         const descriptions = {
                //             1: 'Mức PNL: ',
                //             2: ['Tài sản :', 'Vốn: '],
                //             3: ['Lượng tiền nạp: ', 'Lượng tiền rút: '],
                //             4: ['Tài sản: ', 'Vốn: ']
                //         };
                //         const index = context.dataIndex;
                //         const text1 =
                //             descriptions[chart5Config.tab] + (chartData[0][index] >= 0 ? '+' : '') + formatPrice(chartData[0][index], 0) + ' ' + props.currency;
                //         if (chart5Config.tab === 1) return text1;
                //         const text2 = descriptions[chart5Config.tab][0] + formatPrice(chartData[0][index], 0) + ' ' + props.currency ?? null;
                //         const text3 = descriptions[chart5Config.tab][1] + formatPrice(chartData[1][index], 0) + ' ' + props.currency ?? null;
                //         return [text2, text3];
                //     },
                //     // filter: function (context) {
                //     //     return context.datasetIndex === 0
                //     // },
                //     labelTextColor: function (context) {
                //         return colors.darkBlue;
                //     }
                // },
                // backgroundColor: colors.white,
                // displayColors: false,
                // titleColor: colors.gray[2]
            }
        },
        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: colors.darkBlue5,
                    showLabelBackdrop: false,
                    padding: 8,
                    fontSize: isMobile ? 9 : 12,
                    lineHeight: isMobile ? 20 : 16
                },
                grid: {
                    display: false,
                    drawBorder: false
                    // borderColor: currentTheme === THEME_MODE.DARK ? colors.divider.dark : colors.divider.DEFAULT
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: colors.darkBlue5,
                    callback: function (value, index, ticks) {
                        return formatPrice(value) + 'K';
                    },
                    crossAlign: 'far',
                    padding: 8,
                    fontSize: isMobile ? 9 : 12,
                    lineHeight: isMobile ? 20 : 16
                },
                grid: {
                    drawTicks: false,
                    borderDash: [1, 4],
                    borderDashOffset: 1,
                    // color: currentTheme === THEME_MODE.DARK ? colors.divider.dark : colors.divider.DEFAULT,
                    // borderDash: [1, 4],
                    // // color: colors.divider.DEFAULT,
                    color: function (context) {
                        if (context.tick.value === 0) {
                            return 'rgba(0, 0, 0, 0)';
                        }
                        return isDark ? colors.divider.dark : colors.divider.DEFAULT;
                    },
                    drawBorder: !!isMobile
                }
            }
        }
    };

    const plugins = [
        {
            id: 'middleText',
            afterDatasetsDraw(chart, args, options) {
                const { ctx } = chart;
                ctx.save();

                var xAxe = chart.config.options.scales.x;
                var xScale = chart.scales[xAxe.axis];
                var yAxe = chart.config.options.scales.y;
                var yScale = chart.scales[yAxe.axis];

                // You can define the color here
                ctx.strokeStyle = isDark ? colors.divider.dark : colors.divider.DEFAULT;

                var center =
                    yScale.bottom +
                    ((yScale.top - yScale.bottom) / (yScale.ticks.length - 1)) *
                        indexOf(
                            yScale.ticks,
                            yScale.ticks.find((item) => item?.value === 0)
                        );

                ctx.beginPath();
                ctx.lineWidth = 0.5;

                // The line is drawn from the bottom left ..
                // ctx.moveTo(xScale.left + 0.5, yScale.bottom);
                ctx.moveTo(xScale.left + 2, center);

                // .. to the top left ('+ 0.5' is more or less a fix but it is not essential)
                // ctx.lineTo(xScale.left + 0.5, yScale.top);
                ctx.lineTo(xScale.right + 0.5, center);

                ctx.stroke();
            }
        }
    ];

    return (
        <div className={`mt-12 md:p-8 bg-transparent  ${isMobile ? '' : 'border border-divider dark:border-transparent rounded-xl dark:bg-dark-4'}`}>
            {isMobile ? (
                <CollapseV2
                    className="w-full"
                    divLabelClassname="w-full justify-between"
                    chrevronStyled={{ size: 24, color: isDark ? '#E2E8F0' : '#1E1E1E' }}
                    label="Biến động lợi nhuận"
                    labelClassname="text-base font-semibold"
                >
                    <div>
                        <GroupFilterTime className={`mt-4`} curFilter={curPnlFilter} setCurFilter={setCurPnlFilter} GroupKey="Profit_changing" t={t} />
                    </div>
                    <div className="mt-6">
                        <ChartJS type="bar" data={pnlChartData} options={options} plugins={plugins} height="450px" />
                    </div>
                </CollapseV2>
            ) : (
                <>
                    <div className="flex items-center justify-between w-full">
                        <div className="text-2xl font-semibold">Biến động lợi nhuận</div>
                        <GroupFilterTime curFilter={curPnlFilter} setCurFilter={setCurPnlFilter} GroupKey="Profit_changing" t={t} />
                    </div>

                    <div className=" w-full max-h-[450px] mt-8">
                        <ChartJS type="bar" data={pnlChartData} options={options} plugins={plugins} height="450px" />
                    </div>
                    {/* Chu thich */}
                    <div className="flex items-center gap-x-4 mt-9">
                        <Note iconClassName="bg-green-6" title={'Lợi nhuận tăng'} />
                        <Note iconClassName="bg-red-2" title={'Lợi nhuận giảm'} />
                    </div>
                </>
            )}
        </div>
    );
};

export default PnlChanging;
