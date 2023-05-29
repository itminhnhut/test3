import React from 'react';
import { useState, useEffect } from 'react';
import { formatPrice, formatTime } from 'src/redux/actions/utils';
import colors from 'styles/colors';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { useTranslation } from 'next-i18next';
import Note from 'components/common/Note';
import GroupTextFilter, { listTimeFilter } from 'components/common/GroupTextFilter';
import { ArrowDropDownIcon, HelpIcon } from 'components/svg/SvgIcon';
import CollapseV2 from 'components/common/V2/CollapseV2';

import ChartJS from './ChartJS';
import { indexOf } from 'lodash';
import Tooltip from 'components/common/Tooltip';
import HeaderTooltip from '../HeaderTooltip';
import TableNoData from 'components/common/table.old/TableNoData';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import Spiner from 'components/common/V2/LoaderV2/Spiner';
import { useRouter } from 'next/router';
import { formatNanNumber } from 'redux/actions/utils';
const { subDays, format } = require('date-fns');

const PnlChanging = ({
    t,
    isMobile,
    isDark,
    isNeverTrade = false,
    loadingPnlChanging = false,
    dataPnl = { labels: [], values: [] },
    filter = { startDate: null, endDate: null },
    isVndc = true
}) => {
    const router = useRouter();
    const [curPnlFilter, setCurPnlFilter] = useState(listTimeFilter[0].value);
    const [chartData, setChartData] = useState({ labels: [], profitValues: [], lossValues: [] });
    useEffect(() => {
        if (dataPnl?.labels?.length > 0) {
            const { labels, values } = dataPnl;
            const interval = 86400000;

            const tempLabels = [];
            const tempProfitValues = [];
            const tempLossValues = [];

            if (filter.startDate) {
                for (let i = labels[0].rawDate - interval; i >= filter.startDate - interval; i -= interval) {
                    tempLabels.unshift(i);
                    tempProfitValues.push(0);
                    tempLossValues.push(0);
                }
            }

            for (let i = 0; i < labels.length; i++) {
                const curLabel = labels[i];
                if (i === 0) {
                    tempLabels.push(curLabel.rawDate);
                    tempProfitValues.push(values[i].profit);
                    tempLossValues.push(values[i].loss);
                    continue;
                }

                const lastLabel = tempLabels[tempLabels.length - 1];
                for (let j = 1; j < (curLabel.rawDate - lastLabel) / interval; j++) {
                    tempLabels.push(lastLabel + j * interval);
                    tempProfitValues.push(0);
                }

                tempLabels.push(curLabel.rawDate);
                tempProfitValues.push(values[i].profit);
                tempLossValues.push(values[i].loss);
            }

            if (filter.endDate) {
                for (let i = labels[labels.length - 1].rawDate + interval; i <= filter.endDate; i += interval) {
                    tempLabels.push(i);
                    tempProfitValues.push(0);
                    tempLossValues.push(0);
                }
            }

            setChartData({ labels: tempLabels, profitValues: tempProfitValues, lossValues: tempLossValues });
        }
    }, [dataPnl, filter]);

    const pnlChartData = {
        labels: chartData.labels.map((label) => format(label, 'dd/MM')),
        datasets: [
            {
                fill: false,
                label: false,
                data: chartData.profitValues,
                backgroundColor: colors.green[6],
                stack: 'pnl'
            },
            {
                fill: false,
                label: false,
                data: chartData.lossValues,
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
                enabled: !isNeverTrade,
                usePointStyle: true,
                callbacks: {
                    title: function (context) {
                        return context[0].label;
                    },
                    label: function (context) {
                        const { dataIndex, label, raw } = context;
                        let pnl = 0;
                        let ratePnl = 0;
                        if (raw >= 0) {
                            pnl = chartData?.profitValues?.[dataIndex];
                            const margin = 1;
                            ratePnl = pnl / margin;
                        } else {
                            pnl = chartData?.lossValues?.[dataIndex];
                            const margin = 1;
                            ratePnl = pnl / margin;
                        }
                        return [` - Lợi nhuận: ${raw > 0 ? '+' : ''}${formatNanNumber(pnl, isVndc ? 0 : 4)} (${formatNanNumber(ratePnl * 100, 2)}%)`];
                    }
                },
                backgroundColor: isDark ? colors.dark['2'] : colors.gray['15'],
                padding: 12,
                titleColor: isDark ? colors.gray['7'] : colors.gray['1'],
                titleFont: { weight: 'normal', size: 14, paddingBottom: 12, lineHeight: 1.43 },
                titleAlign: 'left',
                displayColors: false,
                bodyColor: isDark ? colors.gray['4'] : colors.gray['2'],
                bodyFont: { size: 16, lineHeight: 1.5 }
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
                    drawBorder: false,
                    // borderColor: isDark ? colors.divider.dark : colors.divider.DEFAULT
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
                    borderDash: [2, 4],
                    borderDashOffset: 2,
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
        <div className={`mt-12 md:p-8 bg-transparent transition-all ${isMobile ? '' : 'rounded-xl bg-gray-12 dark:bg-dark-4'}`}>
            {isMobile ? (
                <CollapseV2
                    className="w-full"
                    divLabelClassname="w-full justify-between"
                    chrevronStyled={{ size: 24, color: isDark ? '#E2E8F0' : '#1E1E1E' }}
                    label="Biến động lợi nhuận"
                    labelClassname="text-base font-semibold"
                >
                    <div>
                        <GroupTextFilter className={`mt-4`} curFilter={curPnlFilter} setCurFilter={setCurPnlFilter} GroupKey="Profit_changing" t={t} />
                    </div>
                    <div className="mt-6">
                        <ChartJS type="bar" data={pnlChartData} options={options} plugins={plugins} height="450px" />
                    </div>
                </CollapseV2>
            ) : (
                <>
                    <HeaderTooltip
                        title="Biến động lợi nhuận"
                        tooltipContent={[t('portfolio:pnl_changing.des_01'), t('portfolio:pnl_changing.des_02')]}
                        tooltipId={'pnl_changing_tooltip'}
                    />
                    {loadingPnlChanging ? (
                        <div className="flex items-center justify-center w-full min-h-[504px]">
                            <Spiner isDark={isDark} />
                        </div>
                    ) : isNeverTrade ? (
                        <div className="flex flex-col justify-center items-center">
                            <TableNoData className="!py-8" title="Bạn hiện không có biến động lợi nhuận" />
                            <ButtonV2 className="w-auto !px-6" onClick={() => router.push('./futures/BTCVNDC')}>
                                {'Giao dịch ngay'}
                            </ButtonV2>
                        </div>
                    ) : (
                        <div>
                            <div className=" w-full max-h-[450px] mt-8">
                                <ChartJS type="bar" data={pnlChartData} options={options} plugins={plugins} height="450px" />
                            </div>
                            {/* Chu thich */}
                            <div className="flex items-center gap-x-4 mt-9">
                                <Note iconClassName="bg-green-6" title={'Lợi nhuận tăng'} />
                                <Note iconClassName="bg-red-2" title={'Lợi nhuận giảm'} />
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PnlChanging;
