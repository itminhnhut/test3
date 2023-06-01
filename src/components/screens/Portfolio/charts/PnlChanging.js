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
import { isNumber } from 'lodash';
import ModalV2 from 'components/common/V2/ModalV2';
import MCard from 'components/common/MCard';
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
    const [showDetails, setShowDetails] = useState(null)
    const router = useRouter();
    const [pnlChartData, setPnlChartData] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        if (dataPnl?.labels?.length > 0) {
            let labels = dataPnl.labels.map((obj) => parseTitle(obj.date, dataPnl?.interval));
            let values = dataPnl.values.map((obj) => obj.pnl);

            setPnlChartData({
                labels: labels || [],
                datasets: [
                    {
                        fill: false,
                        label: false,
                        data: values || [],
                        backgroundColor: values?.map((value) => (value > 0 ? colors.green[6] : colors.red[2])) || [],
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
        onClick: (evt, item) => {
            if (!isMobile) return;
            setShowDetails(item[0]?.index);
        },
        plugins: {
            // tooltip: {
            //     enabled: !isNeverTrade,
            //     usePointStyle: true,
            //     callbacks: {
            //         title: function (context) {
            //             if (dataPnl?.interval === INTERVAL.DAY) return context[0].label;
            //             const { dataIndex } = context[0];
            //             const curDate = new Date(dataPnl.labels[dataIndex]?.date);
            //             console.log('_____here: ', addMonths(curDate, 1), addWeeks(curDate, 1));
            //             if (dataPnl?.interval === INTERVAL.WEEK) return formatTime(curDate, 'dd/MM') + ' - ' + formatTime(addWeeks(curDate, 1), 'dd/MM');
            //             if (dataPnl?.interval === INTERVAL.MONTH)
            //                 return formatTime(curDate, 'dd/MM/yyyy') + ' - ' + formatTime(addMonths(curDate, 1), 'dd/MM/yyyy');
            //         },
            //         label: function (context) {
            //             const { dataIndex, label, raw } = context;
            //             let margin = dataPnl.values[dataIndex].margin ?? 1;
            //             let pnl = dataPnl.values[dataIndex].pnl;
            //             let ratePnl = pnl / margin;
            //             return [
            //                 ` - ${t('portfolio:pnl')}: ${raw > 0 ? '+' : ''}${formatNanNumber(pnl, isVndc ? 0 : 4)} (${formatNanNumber(ratePnl * 100, 2)}%)`
            //             ];
            //         }
            //     },
            //     backgroundColor: isDark ? colors.dark['2'] : colors.gray['15'],
            //     padding: 12,
            //     titleColor: isDark ? colors.gray['7'] : colors.gray['1'],
            //     titleFont: { weight: 'normal', size: 14, paddingBottom: 12, lineHeight: 1.43 },
            //     titleAlign: 'left',
            //     displayColors: false,
            //     bodyColor: isDark ? colors.gray['4'] : colors.gray['2'],
            //     bodyFont: { size: 16, lineHeight: 1.5 },
            //     caretSize: 5
            // },
            tooltip: {
                enabled: false,
                position: 'nearest',
                external: (context) => {
                    if (!isMobile) {
                        const { dataIndex } = context?.chart?.tooltip?.dataPoints?.['0'];

                        const title = parseTitle(dataPnl.labels[dataIndex]?.date, dataPnl?.interval)

                        let margin = dataPnl.values[dataIndex].margin ?? 1;
                        let pnl = dataPnl.values[dataIndex].pnl;
                        let ratePnl = pnl / margin;

                        externalTooltipHandler(context, isDark, t, isVndc, title, pnl, ratePnl);
                    }
                }
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
                <>
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
                <ModalV2 isVisible={isNumber(showDetails)} onBackdropCb={() => setShowDetails(null)} wrapClassName="px-6" className="dark:bg-dark" isMobile={true}>
                    <h1 className="text-xl font-semibold text-gray-15 dark:text-gray-4">{t('portfolio:historical_pnl_statistic')}</h1>
                    {showDetails && (
                        <MCard addClass={'!p-4 !font-semibold !mt-6'}>
                            <div className="flex items-center justify-between">
                                <span className="txtSecond-3">{t('common:day')}</span>
                                <div className="whitespace-nowrap font-semibold flex items-center">
                                    {parseTitle(dataPnl.labels[showDetails]?.date, dataPnl?.interval)}
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-2.5">
                                <span className="txtSecond-3">{t('portfolio:pnl')}</span>
                                <span className={dataPnl?.values?.[showDetails]?.pnl > 0 ? 'text-green-3 dark:text-green-2' : 'text-red-2'}>
                                    {`${dataPnl?.values?.[showDetails]?.pnl > 0 ? '+' : ''}${formatNanNumber(dataPnl?.values?.[showDetails]?.pnl, isVndc ? 0 : 4)} (${
                                        dataPnl?.values?.[showDetails]?.pnl > 0 ? '+' : ''
                                    }${formatNanNumber((dataPnl?.values?.[showDetails]?.pnl * 100) / dataPnl?.values?.[showDetails]?.margin, 2)}%)`}
                                </span>
                            </div>
                        </MCard>
                    )}
                </ModalV2>
                </>
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

const getOrCreateTooltip = (chart, isDark) => {
    let tooltipEl = chart.canvas.parentNode.querySelector('div');

    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.style.background = isDark ? colors.dark['2'] : colors.gray['15'];
        tooltipEl.style.borderRadius = '6px';
        tooltipEl.style.color = 'white';
        tooltipEl.style.opacity = 1;
        tooltipEl.style.pointerEvents = 'none';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.transform = 'translate(-50%, 0)';
        tooltipEl.style.transition = 'all .1s ease';

        const table = document.createElement('table');
        table.style.color = isDark ? colors.gray['4'] : colors.gray['15'];
        table.style.fontWeight = 'normal';
        table.style.fontSize = '16px';
        table.style.margin = '6px';
        // table.style.padding = '12px';
        // table.style.backgroundColor = isDark ? colors.dark['2'] : colors.gray['15']

        tooltipEl.appendChild(table);
        chart.canvas.parentNode.appendChild(tooltipEl);
    }

    return tooltipEl;
};

const generateThead = (isDark, label) => {
    const tableHead = document.createElement('thead');
    const tr = document.createElement('tr');
    tr.style.borderWidth = 0;
    const th = document.createElement('th');
    th.style.borderWidth = 0;
    th.style.textAlign = 'left';
    th.style.color = isDark ? colors.gray['7'] : colors.gray['1'];
    th.style.fontSize = '14px';
    th.style.fontWeight = 'normal';
    th.style.paddingBottom = '12px';
    const text = document.createTextNode(label);

    th.appendChild(text);
    tr.appendChild(th);
    tableHead.appendChild(tr);
    return tableHead;
};

const externalTooltipHandler = (context, isDark, t, isVndc, title, pnl, ratePnl) => {
    // Tooltip Element
    const { chart, tooltip } = context;
    const tooltipEl = getOrCreateTooltip(chart, isDark);

    // Hide if no tooltip
    if (tooltip.opacity === 0) {
        tooltipEl.style.opacity = 0;
        return;
    }

    // Set Text
    if (tooltip.body) {
        // Generate header
        const tableHead = generateThead(isDark, title);

        const tableBody = document.createElement('tbody');
        const ulElement = document.createElement('ul');
        ulElement.className = 'list-disc marker:text-xs ml-5 text-base !leading-[24px]';

        // Create first <li> element
        // const liElement1 = document.createElement('li');
        // liElement1.textContent = `${t('portfolio:amount_position')}: ${curData?.doc_count} (${rate}%)`;
        // ulElement.appendChild(liElement1);

        // Create second <li> element
        // const liElement2 = document.createElement('li');
        // liElement2.textContent = `Tỷ lệ: ${rate}%`;
        // ulElement.appendChild(liElement2);

        const liElement3 = document.createElement('li');
        liElement3.textContent = `${t('portfolio:pnl')}: `;
        const spanElement = document.createElement('span');
        spanElement.className = 'red-2 font-semibold';
        spanElement.style.color = pnl > 0 ? colors.green['2'] : colors.red['2'];
        spanElement.textContent = `${pnl > 0 ? '+' : ''}${formatNanNumber(pnl, isVndc ? 0 : 4)} (${formatNanNumber(ratePnl * 100, 2)}%)`;
        liElement3.appendChild(spanElement);
        ulElement.appendChild(liElement3);

        const tr = document.createElement('tr');
        tr.style.backgroundColor = 'inherit';
        tr.style.borderWidth = 0;

        const td = document.createElement('td');
        td.style.borderWidth = 0;

        // const text = document.createTextNode(body);

        td.appendChild(ulElement);
        // td.appendChild(text);
        tr.appendChild(td);
        tableBody.appendChild(tr);

        const tableRoot = tooltipEl.querySelector('table');

        // Remove old children
        while (tableRoot.firstChild) {
            tableRoot.firstChild.remove();
        }

        // Add new children
        tableRoot.appendChild(tableHead);
        tableRoot.appendChild(tableBody);
    }

    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;
    const tooltipWidth = tooltipEl.offsetWidth;

    tooltipEl.style.left = 28 + tooltipWidth / 2 + positionX + tooltip.caretX + 'px';
    tooltipEl.style.top = positionY + 'px'; // Position tooltip based on the bar's center
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
    tooltipEl.style.opacity = 1;

    // Create caret:
    const tooltipCaretClassName = 'tooltip-caret';
    let tooltipCaretEl = tooltipEl.querySelector(`.${tooltipCaretClassName}`);

    if (!tooltipCaretEl) {
        tooltipCaretEl = document.createElement('div');
        tooltipCaretEl.classList.add(tooltipCaretClassName);
        tooltipEl.appendChild(tooltipCaretEl);
    }

    tooltipCaretEl.classList.add('tooltip-caret');
    tooltipCaretEl.style.top = tooltipEl.offsetHeight / 2 + 'px'; // Đặt vị trí dọc của caret

    // tooltipCaretEl.style.left = caretX + 'px'; // Đặt vị trí ngang của caret
    // tooltipCaretEl.style.top = caretY + 'px'; // Đặt vị trí dọc của caret

    tooltipEl.appendChild(tooltipCaretEl);
};

const parseTitle = (stringDate, interval) => {
    let title = '';
    const curDate = new Date(stringDate);
    switch (interval) {
        case INTERVAL.DAY:
            title = formatTime(curDate, 'dd/MM') + ' - ' + formatTime(curDate, 'dd/MM');
            break;
        case INTERVAL.WEEK:
            title = formatTime(curDate, 'dd/MM') + ' - ' + formatTime(addWeeks(curDate, 1), 'dd/MM');
            break;
        case INTERVAL.MONTH:
            title = formatTime(curDate, 'dd/MM/yyyy') + ' - ' + formatTime(addMonths(curDate, 1), 'dd/MM/yyyy');
            break;
        default:
            break;
    }
    return title
};
