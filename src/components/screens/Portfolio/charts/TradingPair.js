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
import ModalV2 from 'components/common/V2/ModalV2';
import MCard from 'components/common/MCard';

// note: white always in the tail of list <=> Others
const listDoughnutColorsLight = [colors.yellow[5], colors.green[6], colors.purple[1], colors.green[7], '#fff'];
const listDoughnutColorsDark = [colors.yellow[5], colors.green[6], colors.purple[1], colors.green[7], '#fff'];
const listDoughnutColorsHover = ['#c49b3c', '#3d9f5c', '#496fbc', '#72bfa1', '#d9d9d9'];

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
    const [showDetails, setShowDetails] = useState(null);

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
        if (!filter?.range?.endDate) return;
        fetchDataTradingPairs();
    }, [typeProduct, typeCurrency, filterPnl, filter]);

    // mock data
    const labels = dataTradingPairs?.symbolsCount?.buckets?.map((obj) => formatPair(obj?.key, t)) ?? [];
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
                borderWidth: 0,
                hoverBackgroundColor: labels.length === 0 ? (isDark ? [colors.dark['6']] : ['#b5c0c9']) : listDoughnutColorsHover
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
        onClick: (evt, item) => {
            if (!isMobile || !labels?.length) return;
            const curPair = dataTradingPairs?.symbolsCount?.buckets[item[0]?.index || 0];
            setShowDetails(curPair);
        },
        plugins: {
            tooltip: {
                enabled: false,
                position: 'nearest',
                external: (context) => {
                    if (!isMobile && labels?.length) {
                        const { dataIndex } = context?.chart?.tooltip?.dataPoints?.['0'];
                        const curData = dataTradingPairs?.symbolsCount?.buckets[dataIndex];

                        const { doc_count, margin, profit } = curData;
                        const ratePnl = profit?.value / margin?.value;
                        const rate = doc_count / totalPosition;

                        externalTooltipHandler(context, isDark, t, isVndc, doc_count, rate, profit?.value, ratePnl);
                    }
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
                ctx.fillText(t('portfolio:total_position'), width / 2, height / 2 + 32);
            }
        }
    ];

    if (isMobile) {
        return (
            <>
                <CollapseV2
                    className="w-full"
                    divLabelClassname="w-full justify-between"
                    chrevronStyled={{ size: 24, color: isDark ? colors.gray['4'] : colors.gray['15'] }}
                    label={
                        <HeaderTooltip
                            isMobile
                            title={t('portfolio:position_by_asset')}
                            tooltipContent={t('portfolio:trading_pair_tooltip')}
                            tooltipId={'trading_pair_tooltip'}
                        />
                    }
                    labelClassname="text-base font-semibold"
                    isDividerBottom={true}
                >
                    <div className={` ${isMobile ? '' : 'p-8 rounded-xl bg-gray-13 dark:bg-dark-4'}`}>
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
                        <div className={`flex items-center gap-4 mt-9 py-1 justify-center flex-wrap ${labels.length === 0 && 'hidden'}`}>
                            {labels.map((label, idx) => (
                                <Note
                                    key={'note_' + label}
                                    style={{ backgroundColor: isDark ? listDoughnutColorsDark[idx] : listDoughnutColorsLight[idx] }}
                                    title={label}
                                />
                            ))}
                        </div>
                        <div id="notice" className="flex mt-6 items-center gap-x-2 p-3 text-gray-1 dark:text-gray-7 rounded-xl bg-gray-13 dark:bg-dark-4">
                            <BxsInfoCircle />
                            <span>{t('portfolio:click_array_for_details')}</span>
                        </div>
                    </div>
                </CollapseV2>
                <ModalV2 isVisible={!!showDetails} onBackdropCb={() => setShowDetails(null)} wrapClassName="px-6" className="dark:bg-dark" isMobile={true}>
                    <h1 className="text-xl font-semibold text-gray-15 dark:text-gray-4">{t('portfolio:position_statistic_by_asset')}</h1>
                    {showDetails && (
                        <MCard addClass={'!p-4 !font-semibold !mt-6'}>
                            <div className="flex items-center justify-between">
                                <span className="txtSecond-3">{t('portfolio:position_by_asset')}</span>
                                <div className="whitespace-nowrap font-semibold flex items-center">
                                    {showDetails?.key === 'other' ? (
                                        <span className="txtPri-1">{t('common:others_2')}</span>
                                    ) : (
                                        <>
                                            <span className="txtPri-1">{showDetails?.key?.slice(0, -4)}</span>
                                            <span className="txtSecond-2 !font-semibold">{`/${showDetails?.key?.slice(-4)}`}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-2.5">
                                <span className="txtSecond-3">{t('portfolio:amount_position')}</span>
                                <span>{`${formatNanNumber(showDetails?.doc_count, 0)} (${formatNanNumber(
                                    (showDetails?.doc_count * 100) / totalPosition,
                                    2
                                )}%)`}</span>
                            </div>
                            {/* <div className="flex items-center justify-between mt-2.5">
                                <span className="txtSecond-3">Tỷ lệ</span>
                                <span>{formatNanNumber((showDetails?.doc_count * 100) / totalPosition, 2)}</span>
                            </div> */}
                            <div className="flex items-center justify-between mt-2.5">
                                <span className="txtSecond-3">{t('portfolio:total_pnl')}</span>
                                <span className={showDetails?.profit?.value > 0 ? 'text-green-3 dark:text-green-2' : 'text-red-2'}>
                                    {`${showDetails?.profit?.value > 0 ? '+' : ''}${formatNanNumber(showDetails?.profit?.value, isVndc ? 0 : 4)} (${
                                        showDetails?.profit?.value > 0 ? '+' : ''
                                    }${formatNanNumber((showDetails?.profit?.value * 100) / showDetails?.margin?.value, 2)}%)`}
                                </span>
                            </div>
                        </MCard>
                    )}
                </ModalV2>
            </>
        );
    }

    return (
        <div className="p-8 rounded-xl bg-gray-13 dark:bg-dark-4">
            <div className="flex items-center justify-between">
                <HeaderTooltip
                    title={t('portfolio:position_by_asset')}
                    tooltipContent={t('portfolio:trading_pair_tooltip')}
                    tooltipId={'trading_pair_tooltip'}
                />
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
            <div className={`flex items-center gap-4 mt-9 py-1 justify-center flex-wrap ${labels.length === 0 && 'hidden'}`}>
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

const externalTooltipHandler = (context, isDark, t, isVndc, doc_count, rate, profit, ratePnl) => {
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

        const sign = profit > 0 ? '+' : '';

        const pnl = `${sign}${formatNanNumber(profit, isVndc ? 0 : 4)} (${sign}${formatNanNumber(ratePnl * 100, 2)}%)`;

        // Generate header
        const tableHead = generateThead(isDark, label);

        const tableBody = document.createElement('tbody');
        const ulElement = document.createElement('ul');
        ulElement.className = 'list-disc marker:text-xs ml-5 text-base !leading-[24px]';

        // Create first <li> element
        const liElement1 = document.createElement('li');
        liElement1.textContent = `${t('portfolio:amount_position')}: ${doc_count} (${formatNanNumber(rate * 100, 2)}%)`;
        ulElement.appendChild(liElement1);

        const liElement3 = document.createElement('li');
        liElement3.textContent = `${t('portfolio:total_pnl')}: `;
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
    const tooltipWidth = tooltipEl.offsetWidth;
    const tooltipHeight = tooltipEl.offsetHeight;

    // Display, position, and set styles for font

    tooltipEl.style.left = 16 + tooltipWidth / 2 + positionX + tooltip.caretX + 'px';
    tooltipEl.style.top = positionY - tooltipHeight / 2 + tooltip.caretY + 'px';
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
