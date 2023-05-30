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
import { BxsInfoCircle, HelpIcon } from 'components/svg/SvgIcon';
import Tooltip from 'components/common/Tooltip';
import HeaderTooltip from '../HeaderTooltip';
import classNames from 'classnames';
import { formatNanNumber, formatPair } from 'redux/actions/utils';
import { API_FUTURES_STATISTIC_PAIRS } from 'redux/actions/apis';
import FetchApi from 'utils/fetch-api';
import Spiner from 'components/common/V2/LoaderV2/Spiner';
import { ALLOWED_ASSET_ID } from 'components/screens/WithdrawDeposit/constants';
const { subDays } = require('date-fns');
import CollapseV2 from 'components/common/V2/CollapseV2';

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

const TradingPair = ({ isDark, t, typeProduct, typeCurrency, filter, isNeverTrade = true, isVndc = true, isMobile }) => {
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
            console.log('______ERROR', error);
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
                data: labels.length === 0 ? [1] : dataTradingPairs?.symbolsCount?.buckets?.map((obj) => obj?.doc_count),
                backgroundColor:
                    labels.length === 0
                        ? isDark
                            ? [colors.dark['6']]
                            : ['#b5c0c9']
                        : isDark
                        ? listDoughnutColorsDark.slice(0, labels.length)
                        : listDoughnutColorsLight.slice(0, labels.length),
                borderWidth: 0
            }
        ]
    };

    const totalPosition = dataTradingPairs?.symbolsCount?.buckets?.reduce((prev, cur) => {
        return (prev += cur?.doc_count);
    }, 0);

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '87%',
        plugins: {
            tooltip: {
                enabled: false,
                position: 'nearest',
                external: (context) => {
                    externalTooltipHandler(context, isDark, isVndc, totalPosition, dataTradingPairs?.symbolsCount?.buckets);
                }
            }
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

    if (isMobile) {
        return (
            <CollapseV2
                className="w-full"
                divLabelClassname="w-full justify-between"
                chrevronStyled={{ size: 24, color: isDark ? colors.gray['4'] : colors.gray['15'] }}
                label={<HeaderTooltip isMobile title="Cặp giao dịch" tooltipContent={'This is tooltip content'} tooltipId={'trading_pair_tooltip'} />}
                labelClassname="text-base font-semibold"
            >
                <div className={` ${isMobile ? '' : 'p-8 rounded-xl bg-gray-12 dark:bg-dark-4'}`}>
                    <GroupTextFilter curFilter={filterPnl} setCurFilter={setFilterPnl} GroupKey={'trading_pairs_filter'} t={t} listFilter={FILTER_PNL} />
                    <div className="flex items-center justify-center w-full mt-8">
                        <div className={`min-w-[200px] max-w-[312px] w-full`}>
                            {loadingTradingPairs ? (
                                <div className="flex items-center justify-center w-full min-h-[312px]">
                                    <Spiner isDark={isDark} />
                                </div>
                            ) : (
                                <ChartJS type="doughnut" data={mockData} options={options} plugins={plugins} />
                            )}
                        </div>
                    </div>
                    {/* Chu thich */}
                    <div className={`flex items-center gap-x-4 mt-9 py-1 justify-center ${labels.length === 0 && 'hidden'}`}>
                        {labels.map((label, idx) => (
                            <Note
                                key={'note_' + label}
                                style={{ backgroundColor: isDark ? listDoughnutColorsDark[idx] : listDoughnutColorsLight[idx] }}
                                title={label}
                            />
                        ))}
                    </div>
                    <div id="notice" className="flex mt-6 items-center gap-x-2 p-3 text-gray-1 dark:text-gray-7 rounded-xl bg-gray-12 dark:bg-dark-4">
                        <BxsInfoCircle />
                        <span>Nhấn vào từng mảng để xem thống kê chi tiết</span>
                    </div>
                </div>
            </CollapseV2>
        );
    }

    return (
        <div className="p-8 rounded-xl bg-gray-12 dark:bg-dark-4">
            <div className="flex items-center justify-between">
                <HeaderTooltip title="Cặp giao dịch" tooltipContent={'This is tooltip content'} tooltipId={'trading_pair_tooltip'} />
                <GroupTextFilter curFilter={filterPnl} setCurFilter={setFilterPnl} GroupKey={'trading_pairs_filter'} t={t} listFilter={FILTER_PNL} />
            </div>
            <div className="flex items-center justify-center w-full h-auto">
                <div className={`min-w-[352px] mt-8`}>
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
            <div className={`flex items-center gap-x-4 mt-9 py-1 justify-center ${labels.length === 0 && 'hidden'}`}>
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

const externalTooltipHandler = (context, isDark, isVndc, totalPosition, data) => {
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
        // begin:
        const { label, raw } = tooltip.dataPoints[0];

        const curData = data?.find((obj) => obj.key?.slice(0, -4) === label.split('/')[0]);
        const rate = formatNanNumber((raw * 100) / totalPosition, 2);
        const profit = curData?.profit?.value;
        const margin = curData?.margin?.value;
        const sign = profit > 0 ? '+' : '';

        const pnl = `${sign}${formatNanNumber(profit, isVndc ? 0 : 4)} (${sign}${formatNanNumber((profit * 100) / margin, 2)}%)`;

        // Generate header
        const tableHead = generateThead(isDark, label);

        const tableBody = document.createElement('tbody');
        const ulElement = document.createElement('ul');
        ulElement.className = 'list-disc marker:text-xs ml-5 text-base !leading-[24px]';

        // Create first <li> element
        const liElement1 = document.createElement('li');
        liElement1.textContent = `Tổng vị thế: ${curData?.doc_count}`;
        ulElement.appendChild(liElement1);

        // Create second <li> element
        const liElement2 = document.createElement('li');
        liElement2.textContent = `Tỷ lệ: ${rate}%`;
        ulElement.appendChild(liElement2);

        const liElement3 = document.createElement('li');
        liElement3.textContent = `Lợi nhuận: `;
        const spanElement = document.createElement('span');
        spanElement.className = 'red-2 font-semibold';
        spanElement.style.color = profit > 0 ? colors.green['2'] : colors.red['2'];
        spanElement.textContent = pnl;
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

    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = positionX + tooltip.caretX + 'px';
    tooltipEl.style.top = positionY + tooltip.caretY + 'px';
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
};
