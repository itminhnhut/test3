import React from 'react';
import { useState, useEffect } from 'react';
import { formatPrice, formatTime } from 'src/redux/actions/utils';
import colors from 'styles/colors';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { useTranslation } from 'next-i18next';
import Note from 'components/common/Note';
import GroupTextFilter, { listTimeFilter } from 'components/common/GroupTextFilter';
import { ArrowDropDownIcon, BxsInfoCircle, HelpIcon } from 'components/svg/SvgIcon';
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
const { subDays, format, addMonths, addWeeks } = require('date-fns');

const INTERVAL = {
    DAY: 'day',
    WEEK: 'week',
    MONTH: 'month'
};

const PnlChanging = ({
    t,
    isMobile,
    isDark,
    isNeverTrade = false,
    loadingPnlChanging = false,
    dataPnl = { labels: [], values: [], interval: 'day' },
    filter = { startDate: null, endDate: null },
    isVndc = true
}) => {
    const router = useRouter();
    const [chartData, setChartData] = useState({ labels: [], values: [], margins: [] });
    const [pnlChartData, setPnlChartData] = useState({});

    console.log('______debug pnl changing: ', isNeverTrade, dataPnl);
    useEffect(() => {
        if (dataPnl?.labels?.length > 0) {
            let labels;
            switch (dataPnl.interval) {
                case INTERVAL.DAY:
                    labels = dataPnl.labels.map((obj) => format(new Date(obj.date), 'dd/MM'));
                    break;
                case INTERVAL.WEEK:
                    labels = dataPnl.labels.map((_, i) => `${t('common:week')} ${i + 1}`);
                    break;
                case INTERVAL.MONTH:
                    labels = dataPnl.labels.map((obj) => formatTime(obj.date, 'MM/yyyy'));
                    break;
                default:
                    break;
            }

            let values = dataPnl.values.map((obj) => obj.pnl);
            setPnlChartData({
                labels: labels,
                datasets: [
                    {
                        fill: false,
                        label: false,
                        data: values,
                        backgroundColor: values?.map((value) => (value > 0 ? colors.green[6] : colors.red[2])),
                        hoverBackgroundColor: values?.map((value) => (value > 0 ? '#2daf57' : '#d51d1d')),
                        stack: 'pnl'
                    }
                ]
            });
        }
    }, [dataPnl, filter, t]);

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
                        if (dataPnl?.interval === INTERVAL.DAY) return context[0].label;
                        const { dataIndex } = context[0];
                        const curDate = new Date(dataPnl.labels[dataIndex]?.date);
                        console.log('_____here: ', addMonths(curDate, 1), addWeeks(curDate, 1));
                        if (dataPnl?.interval === INTERVAL.WEEK) return formatTime(curDate, 'dd/MM') + ' - ' + formatTime(addWeeks(curDate, 1), 'dd/MM');
                        if (dataPnl?.interval === INTERVAL.MONTH)
                            return formatTime(curDate, 'dd/MM/yyyy') + ' - ' + formatTime(addMonths(curDate, 1), 'dd/MM/yyyy');
                    },
                    label: function (context) {
                        const { dataIndex, label, raw } = context;
                        let margin = dataPnl.values[dataIndex].margin ?? 1;
                        let pnl = dataPnl.values[dataIndex].pnl;
                        let ratePnl = pnl / margin;
                        return [
                            ` - ${t('portfolio:pnl')}: ${raw > 0 ? '+' : ''}${formatNanNumber(pnl, isVndc ? 0 : 4)} (${formatNanNumber(ratePnl * 100, 2)}%)`
                        ];
                    }
                },
                backgroundColor: isDark ? colors.dark['2'] : colors.gray['15'],
                padding: 12,
                titleColor: isDark ? colors.gray['7'] : colors.gray['1'],
                titleFont: { weight: 'normal', size: 14, paddingBottom: 12, lineHeight: 1.43 },
                titleAlign: 'left',
                displayColors: false,
                bodyColor: isDark ? colors.gray['4'] : colors.gray['2'],
                bodyFont: { size: 16, lineHeight: 1.5 },
                caretSize: 5
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
                    // borderColor: isDark ? colors.divider.dark : colors.divider.DEFAULT
                }
            },
            y: {
                beginAtZero: true,
                stacked: true,
                ticks: {
                    color: colors.darkBlue5,
                    callback: function (value, index, ticks) {
                        return formatPrice(value);
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
        <div className={`mt-12 md:p-8 transition-all ${isMobile ? 'bg-transparent' : 'rounded-xl bg-gray-13 dark:bg-dark-4'}`}>
            {isMobile ? (
                <CollapseV2
                    className="w-full"
                    divLabelClassname="w-full justify-between"
                    chrevronStyled={{ size: 24, color: isDark ? '#E2E8F0' : '#1E1E1E' }}
                    label={
                        <HeaderTooltip
                            isMobile
                            title={t('portfolio:historical_pnl')}
                            tooltipContent={t('portfolio:pnl_changing_tooltip')}
                            tooltipId={'pnl_changing_tooltip'}
                        />
                    }
                    labelClassname="text-base font-semibold"
                    isDividerBottom={true}
                >
                    <div className="mt-6">
                        <ChartJS type="bar" data={pnlChartData} options={options} plugins={plugins} height="450px" />
                    </div>
                    {/* Chu thich */}
                    <div className="flex items-center gap-x-4 mt-9">
                        <Note iconClassName="bg-green-6" title={t('portfolio:profit')} />
                        <Note iconClassName="bg-red-2" title={t('portfolio:loss')} />
                    </div>
                    <div className="flex mt-6 items-center gap-x-2 p-3 text-gray-1 dark:text-gray-7 rounded-xl bg-gray-13 dark:bg-dark-4">
                        <BxsInfoCircle />
                        <span>{t('portfolio:click_column_for_details')}</span>
                    </div>
                </CollapseV2>
            ) : (
                <>
                    <HeaderTooltip
                        isMobile
                        title={t('portfolio:historical_pnl')}
                        tooltipContent={t('portfolio:pnl_changing_tooltip')}
                        tooltipId={'pnl_changing_tooltip'}
                    />
                    {loadingPnlChanging ? (
                        <div className="flex items-center justify-center w-full min-h-[504px]">
                            <Spiner isDark={isDark} />
                        </div>
                    ) : isNeverTrade ? (
                        <div className="flex flex-col justify-center items-center">
                            <TableNoData titleClassname="!text-base !text-gray-1 dark:!text-gray-7" className="!py-8" title={t('portfolio:no_pnl_recorded')} />
                            <ButtonV2 className="w-auto !px-6" onClick={() => router.push('./futures/BTCVNDC')}>
                                {t('portfolio:trading_now')}
                            </ButtonV2>
                        </div>
                    ) : (
                        <div>
                            <div className=" w-full max-h-[450px] mt-8">
                                <ChartJS type="bar" data={pnlChartData} options={options} plugins={plugins} height="450px" />
                            </div>
                            {/* Chu thich */}
                            <div className="flex items-center gap-x-4 mt-9">
                                <Note iconClassName="bg-green-6" title={t('portfolio:profit')} />
                                <Note iconClassName="bg-red-2" title={t('portfolio:loss')} />
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PnlChanging;
