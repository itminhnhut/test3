import React from 'react';
import { useState, useEffect } from 'react';
import { formatPrice, formatTime, formatPercentage } from 'src/redux/actions/utils';
import colors from 'styles/colors';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { useTranslation } from 'next-i18next';
import Note from 'components/common/Note';
import GroupTextFilter, { listTimeFilter } from 'components/common/GroupTextFilter';
import ChartJS from './ChartJS';
import { indexOf } from 'lodash';
import { HelpIcon } from 'components/svg/SvgIcon';
import Tooltip from 'components/common/Tooltip';
import HeaderTooltip from '../HeaderTooltip';
import classNames from 'classnames';
import { formatNanNumber, formatPair } from 'redux/actions/utils';
import { API_FUTURES_STATISTIC_PAIRS } from 'redux/actions/apis';
import FetchApi from 'utils/fetch-api';
import Spiner from 'components/common/V2/LoaderV2/Spiner';
import { ALLOWED_ASSET_ID } from 'components/screens/WithdrawDeposit/constants';
const { subDays } = require('date-fns');

// note: white always in the tail of list <=> Others
const listDoughnutColorsLight = [colors.green[6], colors.purple[1], colors.green[7], colors.yellow[5], colors.gray[12]];
const listDoughnutColorsDark = [colors.green[6], colors.purple[1], colors.green[7], colors.yellow[5], '#fff'];

const FILTER_PNL = [
    {
        localized: 'common:all',
        value: 'ALL'
    },
    {
        localized: 'portfolio:profit',
        value: 'PROFIT'
    },
    {
        localized: 'portfolio:loss',
        value: 'LOSS'
    }
];

const TradingPair = ({ isDark, t, typeProduct, typeCurrency, filter, isNeverTrade = true }) => {
    const [filterPnl, setFilterPnl] = useState(FILTER_PNL[0].value);

    // Data trading pairs
    const [dataTradingPairs, setDataTradingPairs] = useState();
    const [loadingTradingPairs, setLoadingTradingPairs] = useState(false);
    const fetchDataTradingPairs = async () => {
        try {
            setLoadingTradingPairs(true);
            const { data } = await FetchApi({
                url: API_FUTURES_STATISTIC_PAIRS,
                params: {
                    currency: typeCurrency,
                    product: typeProduct,
                    from: filter?.range?.startDate,
                    to: filter?.range?.endDate,
                    pnlType: filterPnl
                }
            });
            setDataTradingPairs(data);
        } catch (error) {
            console.log('________________', error);
        } finally {
            setLoadingTradingPairs(false);
        }
    };

    useEffect(() => {
        fetchDataTradingPairs();
    }, [typeProduct, typeCurrency, filterPnl, filter]);

    // mock data
    // console.log("___________dataTradingPairs?.symbolsCount?.buckets?.map(obj => obj?.key)", dataTradingPairs?.symbolsCount?.buckets?.map(obj => obj?.key));
    const labels = dataTradingPairs?.symbolsCount?.buckets?.map((obj) => formatPair(obj?.key)) ?? [];
    const mockData = {
        labels,
        datasets: [
            {
                label: 'Trading Pair Volumns',
                data: isNeverTrade ? [1] :  dataTradingPairs?.symbolsCount?.buckets?.map((obj) => obj?.doc_count),
                backgroundColor: isNeverTrade ? (isDark ? [colors.dark['6']] : [colors.dark['7']]) :  isDark ? listDoughnutColorsDark.slice(0, labels.length) : listDoughnutColorsLight.slice(0, labels.length),
                borderWidth: 0,
            }
        ]
    };
    const totalPosition = dataTradingPairs?.symbolsCount?.buckets?.reduce((prev, cur) => {
        return (prev += cur?.doc_count);
    }, 0);

    const isVndc = typeCurrency === ALLOWED_ASSET_ID.VNDC

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '90%',
        plugins: {
            tooltip: {
                enabled: !isNeverTrade,
                usePointStyle: true,
                callbacks: {
                    title: function (context) {
                        return context[0].label;
                    },
                    label: function (context) {
                        console.log("______context: ", dataTradingPairs?.symbolsCount?.buckets?.[context.dataIndex]?.margin?.value)
                        const index = context.dataIndex;
                        const total = ' - Số lượng: ' + context.raw;
                        const rate = ' - Tỷ lệ: ' + context.raw / totalPosition;
                        const profit = dataTradingPairs?.symbolsCount?.buckets?.[context.dataIndex]?.profit?.value
                        const margin = dataTradingPairs?.symbolsCount?.buckets?.[context.dataIndex]?.margin?.value
                        const sign = profit > 0 ? '+' : ''

                        const pnl = ` - Lợi nhuận: ${sign}${formatNanNumber(profit, isVndc ? 0 : 4)} (${sign}${formatNanNumber(profit * 100 / margin, 2)}%)`;
                        return [total, rate, pnl];
                    },
                },
                backgroundColor: isDark ? colors.dark['2'] : colors.gray['15'],
                padding: 12,
                titleColor: isDark ? colors.gray['7'] : colors.gray['1'],
                titleFont: { weight: 'normal', size: 14, paddingBottom: 12, lineHeight: 1.43 },
                titleAlign: 'left',
                displayColors: false,
                bodyColor: isDark ? colors.gray['4'] : colors.gray['2'],
                bodyFont: { size: 16, lineHeight: 1.5 },
            }
            // tooltip: {
            //     enabled: false,
            //     position: 'nearest',
            //     external: (context) =>{ externalTooltipHandler(context, isDark);}
            // }
        }
    };

    // Const handle draw chart custom:

    const percent = formatNanNumber(totalPosition, 0);
    const percentColor = isDark ? colors.gray[4] : colors.gray[15];

    const secondaryColor = isDark ? colors.gray[7] : colors.gray[1];

    const plugins = [
        {
            id: 'middleText',
            afterDatasetsDraw(chart, args, options) {
                const {
                    ctx,
                    chartArea: { left, right, top, bottom, width, height }
                } = chart;
                ctx.save();

                // draw Primary text
                ctx.font = '600 32px SF-Pro';
                ctx.fillStyle = percentColor;
                ctx.textAlign = 'center';

                ctx.fillText(percent, width / 2, height / 2 + top);

                // draw Secondary text
                ctx.font = 'normal 16px SF-Pro';
                ctx.fillStyle = secondaryColor;
                ctx.textAlign = 'center';
                ctx.fillText('Tổng vị thế', width / 2, height / 2 + 32);
            }
        }
    ];

    return (
        <div className="p-8 rounded-xl bg-gray-12 dark:bg-dark-4">
            <div className="flex items-center justify-between">
                <HeaderTooltip title="Cặp giao dịch" tooltipContent={'This is tooltip content'} tooltipId={'trading_pair_tooltip'} />
                <GroupTextFilter curFilter={filterPnl} setCurFilter={setFilterPnl} GroupKey={'trading_pairs_filter'} t={t} listFilter={FILTER_PNL} />
            </div>
            <th></th>
            <div className="flex items-center justify-center w-full">
                <div className="min-w-[352px] mt-8">
                    {loadingTradingPairs ? (
                        <div className="flex items-center justify-center w-full min-h-[350px]">
                            <Spiner isDark={isDark} />
                        </div>
                    ) : (
                        <ChartJS type="doughnut" data={mockData} options={options} plugins={plugins} />
                    )}
                </div>
            </div>
            {/* Chu thich */}
            <div className={`flex items-center gap-x-4 mt-9 py-1 justify-center ${isNeverTrade && 'hidden'}`}>
                {labels.map((label, idx) => (
                    <Note
                        key={'note_' + label}
                        style={{ backgroundColor: isDark ? listDoughnutColorsDark[idx] : listDoughnutColorsLight[idx] }}
                        title={label}
                    />
                ))}
            </div>
        </div>
    );
};

export default TradingPair;

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

const externalTooltipHandler = (context, isDark) => {
    // Tooltip Element
    const { chart, tooltip } = context;
    console.log('______-tooltip: ', isDark);
    const tooltipEl = getOrCreateTooltip(chart, isDark);

    // Hide if no tooltip
    if (tooltip.opacity === 0) {
        tooltipEl.style.opacity = 0;
        return;
    }

    // Set Text
    if (tooltip.body) {
        const titleLines = tooltip.title || [];
        const bodyLines = tooltip.body.map((b) => b.lines);

        // begin:
        const { label, raw } = tooltip.dataPoints[0];

        // Generate header
        const tableHead = document.createElement('thead');
        tableHead.style.paddingBottom = '12px';

        const tr = document.createElement('tr');
        tr.style.borderWidth = 0;
        const th = document.createElement('th');
        th.style.borderWidth = 0;
        th.style.textAlign = 'left';
        th.style.color = isDark ? colors.gray['7'] : colors.gray['1'];
        th.style.fontSize = '14px';
        th.style.fontWeight = 'normal';
        const text = document.createTextNode(label);

        th.appendChild(text);
        tr.appendChild(th);
        tableHead.appendChild(tr);

        const tableBody = document.createElement('tbody');
        bodyLines.forEach((body, i) => {
            const colors = tooltip.labelColors[i];

            const span = document.createElement('span');
            span.style.background = colors.backgroundColor;
            span.style.borderColor = colors.borderColor;
            span.style.borderWidth = '2px';
            span.style.marginRight = '10px';
            span.style.height = '10px';
            span.style.width = '10px';
            span.style.display = 'inline-block';

            const tr = document.createElement('tr');
            tr.style.backgroundColor = 'inherit';
            tr.style.borderWidth = 0;

            const td = document.createElement('td');
            td.style.borderWidth = 0;

            const text = document.createTextNode(body);

            td.appendChild(span);
            td.appendChild(text);
            tr.appendChild(td);
            tableBody.appendChild(tr);
        });

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

    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = positionX + tooltip.caretX + 'px';
    tooltipEl.style.top = positionY + tooltip.caretY + 'px';
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
};
