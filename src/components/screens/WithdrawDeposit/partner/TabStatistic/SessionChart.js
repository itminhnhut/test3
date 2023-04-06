import React, { useState, useEffect } from 'react';
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

const TabStatistic = [
    { value: 'commission', localized: 'reference:total_commissions' },
    { value: 'depositwithdraw', localized: 'Tổng nạp rút' }
];

const SessionChart = () => {
    const [timeTab, setTimeTab] = useState(TIME_FILTER[0].value);
    const [typeTab, setTypeTab] = useState(TabStatistic[0].value);
    const [chartLabels, setChartLabels] = useState([]);
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

    useEffect(() => {
        if (timeTab !== 'custom') {
            const date = new Date();
            switch (timeTab) {
                case TIME_FILTER[0].value:
                    date.setDate(date.getDate() - 1);
                    break;
                case TIME_FILTER[1].value:
                    date.setDate(date.getDate() - 7);
                    break;
                case TIME_FILTER[2].value:
                    date.setDate(date.getDate() - 31);
                    break;
                default:
                    break;
            }
            date.toLocaleDateString();
            setFilter({
                range: {
                    startDate: date.getTime(),
                    endDate: Date.now(),
                    key: 'selection'
                }
            });
            return;
        } else {
            setFilter({
                range: {
                    startDate: new Date(filter?.range?.startDate ?? null).getTime(),
                    endDate: new Date(filter?.range?.endDate ?? null).getTime(),
                    key: 'selection'
                }
            });
        }
    }, [timeTab]);

    useEffect(() => {
        const curDate = new Date();
        const newLabels = [formatTime(curDate, 'dd/MM')];
        switch (timeTab) {
            case TIME_FILTER[0].value: // 1 Tuan
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
        setChartLabels(newLabels);
    }, [timeTab]);

    const { data, loading, error } = useFetchApi(
        {
            url: API_GET_COMMISSION_STATISTIC_PARTNER,
            params: { from: +filter?.range?.startDate, to: +filter?.range?.endDate, type: typeTab, currency: 72, interval: 'd' }
        },
        true,
        [filter]
    );

    console.log('data: ', data);

    const pnlChartData = {
        labels: chartLabels,
        datasets: [
            {
                fill: false,
                label: false,
                data: Array.from({ length: chartLabels.length }, () => Math.floor(Math.random() * 10898789)),
                // data: Array.from({ length: chartLabels.length }, () => 100),
                backgroundColor: colors.purple[1]
                // stack: 'pnl'
            },
            {
                fill: false,
                label: false,
                data: Array.from({ length: chartLabels.length }, () => Math.floor(Math.random() * 10898789)),
                backgroundColor: colors.green[6],
                borderRadius: { topLeft: 2, topRight: 2, bottomLeft: 0, bottomRight: 0 }
                // stack: 'pnl'
            }
        ]
    };

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
                                <TabItem className="!px-0" value={item.value} onClick={() => setTypeTab(0)}>
                                    {t(item.localized)}
                                </TabItem>
                            ))}

                            {/* <TabItem className="!px-0" value={1} active={typeTab === 1} onClick={() => setTypeTab(1)}>
                                Tổng hoa hồng
                            </TabItem> */}
                        </Tabs>
                    </div>

                    {/* Filter */}
                    <div className="flex gap-3">
                        {TIME_FILTER.map((item) => {
                            return (
                                <div
                                    key={item.value}
                                    onClick={() => setTimeTab(item.value)}
                                    className={classNames('px-5 py-3 border rounded-full cursor-pointer font-normal', {
                                        'text-txtSecondary dark:text-txtSecondary-dark border-divider dark:border-divider-dark': timeTab !== item.value,
                                        'text-teal border-teal bg-teal/[.1] !font-semibold': timeTab === item.value
                                    })}
                                >
                                    {t(item.localized)}
                                </div>
                            );
                        })}
                        <DatePickerV2
                            initDate={filter.range}
                            onChange={(e) => {
                                setFilter({
                                    range: {
                                        startDate: new Date(e?.selection?.startDate ?? null).getTime(),
                                        endDate: new Date(e?.selection?.endDate ?? null).getTime(),
                                        key: 'selection'
                                    }
                                });
                            }}
                            month={2}
                            hasShadow
                            position="right"
                            text={
                                <div
                                    onClick={() => setTimeTab('custom')}
                                    className={classNames('px-5 py-3 border rounded-full cursor-pointer font-normal select-none', {
                                        'text-txtSecondary dark:text-txtSecondary-dark border-divider dark:border-divider-dark': timeTab !== 'custom',
                                        'text-teal border-teal bg-teal/[.1] !font-semibold': timeTab === 'custom'
                                    })}
                                >
                                    {t('dw_partner:filter.custom')}
                                </div>
                            }
                        />
                    </div>
                </div>
                <div className=" w-full max-h-[450px] mt-8">
                    <ChartJS type="bar" data={pnlChartData} options={options} height="450px" />
                </div>
                {/* Chu thich */}
                <div className="flex items-center gap-x-4 mt-9">
                    <Note iconClassName="bg-purple-1" title={'Nap'} />
                    <Note iconClassName="bg-green-6" title={'Rut'} />
                </div>
            </CardWrapper>
        </div>
    );
};

export default SessionChart;
