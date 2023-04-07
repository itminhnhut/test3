import React, { useState, useEffect, useCallback } from 'react';
import DatePickerV2 from 'components/common/DatePicker/DatePickerV2';
import { useTranslation } from 'next-i18next';
import { TIME_FILTER } from '../../constants';
import classNames from 'classnames';
import CardWrapper from 'components/common/CardWrapper';
import Tabs, { TabItem } from 'src/components/common/Tabs/Tabs';
import ChartJS from 'components/screens/Portfolio/charts/ChartJS';
import Note from 'components/common/Note';
import colors from 'styles/colors';
import { formatCurrency, formatTime, formatPrice, getExchange24hPercentageChange, getV1Url, render24hChange } from 'redux/actions/utils';
import { subDays } from 'date-fns';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import useFetchApi from 'hooks/useFetchApi';
import { API_GET_COMMISSION_STATISTIC_PARTNER } from 'redux/actions/apis';
import FilterTimeTab from 'components/common/FilterTimeTab';

const TabStatistic = [
    { value: 'commission', localized: 'reference:referral.total_commissions' },
    { value: 'depositwithdraw', localized: 'dw_partner:total_dw' }
];

const mockData = {
    labels: [12, 13],
    data: [
        [
            {
                side: 'BUY',
                value: 1058583709
            },
            {
                side: 'SELL',
                value: 76434000
            }
        ],
        [
            {
                side: 'BUY',
                value: 1800000
            },
            {
                side: 'SELL',
                value: 0
            }
        ]
    ]
};

const SessionChart = () => {
    const [typeTab, setTypeTab] = useState(TabStatistic[0].value);
    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    const { t } = useTranslation();

    const [filter, setFilter] = useState({
        range: {
            startDate: null,
            endDate: Date.now(),
            key: 'selection'
        }
    });

    const { data, loading, error } = useFetchApi(
        {
            url: API_GET_COMMISSION_STATISTIC_PARTNER,
            params: { from: +filter?.range?.startDate, to: +filter?.range?.endDate, type: typeTab, currency: 72, interval: 'd' }
        },
        true,
        [filter, typeTab]
    );

    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        if (!data) return;

        setChartData({
            labels: mockData.labels,
            datasets: [
                {
                    fill: false,
                    label: false,
                    data: data.data.filter((arr) => arr.some((obj) => obj.side === 'BUY')).map((arr) => arr.find((obj) => obj.side === 'BUY').value),
                    backgroundColor: colors.purple[1]
                    // stack: 'pnl'
                },
                {
                    fill: false,
                    label: false,
                    data: data.data.filter((arr) => arr.some((obj) => obj.side === 'SELL')).map((arr) => arr.find((obj) => obj.side === 'SELL').value),
                    backgroundColor: colors.green[6],
                    borderRadius: { topLeft: 2, topRight: 2, bottomLeft: 0, bottomRight: 0 }
                    // stack: 'pnl'
                }
            ]
        });
    }, [data]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'x',
        barPercentage: 0.15,

        borderSkipped: false,
        plugins: {
            title: { align: 'left' },
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
                beginAtZero: false,
                stacked: true,
                ticks: {
                    color: colors.darkBlue5,
                    showLabelBackdrop: false,
                    padding: 8,
                    fontSize: 12,
                    lineHeight: 16,
                    crossAlign: 'near'
                },
                grid: {
                    display: false,
                    drawBorder: true
                    // borderColor: currentTheme === THEME_MODE.DARK ? colors.divider.dark : colors.divider.DEFAULT
                }
            },
            y: {
                stacked: true,
                ticks: {
                    color: colors.darkBlue5,
                    callback: function (value, index, ticks) {
                        return formatPrice(value);
                    },
                    crossAlign: 'far',
                    padding: 8,
                    fontSize: 12,
                    lineHeight: 16,
                    beginAtZero: true
                },
                grid: {
                    drawTicks: false,
                    borderDash: [1, 4],
                    borderDashOffset: 1,
                    // display: false,
                    drawBorder: false,
                    // color: currentTheme === THEME_MODE.DARK ? colors.divider.dark : colors.divider.DEFAULT,
                    // borderDash: [1, 4],
                    // // color: colors.divider.DEFAULT,
                    color: function (context) {
                        if (context.tick.value === 0) {
                            return 'rgba(0, 0, 0, 0)';
                        }
                        return isDark ? colors.divider.dark : colors.divider.DEFAULT;
                    }
                    // drawBorder: true
                }
            }
        }
    };

    return (
        <div className="mt-20">
            {/* Header */}
            <div className="font-semibold text-[20px] leading-6 mb-8">Báo cáo hoa hồng</div>

            {/* Body */}
            <CardWrapper>
                <div className="flex items-center justify-between">
                    {/* Tabs */}
                    <div>
                        <Tabs tab={typeTab} className="gap-6 border-b border-divider dark:border-divider-dark">
                            {TabStatistic.map((item) => (
                                <TabItem className="!px-0 select-none" value={item.value} onClick={() => setTypeTab(item.value)}>
                                    {t(item.localized)}
                                </TabItem>
                            ))}
                        </Tabs>
                    </div>

                    {/* Filter */}
                    <FilterTimeTab filter={filter} setFilter={setFilter} className="mb-6" />
                </div>
                <div className=" w-full max-h-[450px] mt-8">
                    <ChartJS type="bar" data={chartData} options={options} height="450px" />
                </div>
                {/* Chu thich */}
                <div className="flex items-center gap-x-4 mt-9">
                    <Note iconClassName="bg-purple-1" title={t('common:deposit')} />
                    <Note iconClassName="bg-green-6" title={t('common:withdraw')} />
                </div>
            </CardWrapper>
        </div>
    );
};

export default SessionChart;
