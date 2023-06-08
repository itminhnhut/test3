import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import CardWrapper from 'components/common/CardWrapper';
import Tabs, { TabItem } from 'src/components/common/Tabs/Tabs';
import ChartJS from 'components/screens/Portfolio/charts/ChartJS';
import Note from 'components/common/Note';
import colors from 'styles/colors';
import { formatTime, formatSwapRate, convertDateToMs, formatNanNumber } from 'redux/actions/utils';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import useFetchApi from 'hooks/useFetchApi';
import { API_GET_COMMISSION_STATISTIC_PARTNER, API_GET_PARTNER_STATS_VOLUME_COMMISSION } from 'redux/actions/apis';
import FilterTimeTab from 'components/common/FilterTimeTab';
import DarkNote from 'components/common/DarkNote';
import ModalV2 from 'components/common/V2/ModalV2';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import moment from 'moment';
import { isNumber } from 'lodash';
import Spiner from 'components/common/V2/LoaderV2/Spiner';

const TabStatistic = [
    {
        value: 'depositwithdraw',
        localized: 'dw_partner:total_dw'
    },
    {
        value: 'commission',
        localized: 'common:partners'
    }
];

const SessionChart = ({ filter, setFilter }) => {
    const [typeTab, setTypeTab] = useState(TabStatistic[0].value);
    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    const { t } = useTranslation();

    const [dataIndex, setDataIndex] = useState(null);
    // const [curToken, setCurToken] = useState(72);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });
    console.log('chartData:', chartData);

    const { data, loading, error } = useFetchApi(
        {
            url: API_GET_PARTNER_STATS_VOLUME_COMMISSION,
            // url: API_GET_COMMISSION_STATISTIC_PARTNER,
            params: {
                from: !filter?.range?.startDate ? null : convertDateToMs(filter?.range?.startDate),
                to: convertDateToMs(filter?.range?.endDate ? filter.range.endDate : Date.now(), 'endOf'),
                type: typeTab,
                interval: filter?.range?.interval || 'd'
            }
        },
        true,
        [filter, typeTab]
    );

    useEffect(() => {
        if (!data) return;
        setChartData({
            labels: data.labels.map((label) => `${formatTime(new Date(label.date), data.interval === 'month' ? 'MM/yyyy' : 'dd/MM')}`),
            datasets: [
                {
                    fill: false,
                    label: false,
                    data: data.values.map((value) => value.totalBuy),
                    backgroundColor: colors.green[6]
                    // stack: 'pnl'
                },
                {
                    fill: false,
                    label: false,
                    data: data.values.map((value) => value.totalSell),
                    backgroundColor: colors.purple[1],
                    borderRadius: { topLeft: 2, topRight: 2, bottomLeft: 0, bottomRight: 0 }
                    // stack: 'pnl'
                }
            ]
        });
    }, [data, typeTab]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'x',
        barPercentage: 0.15,

        borderSkipped: false,
        plugins: {
            title: { align: 'left' },
            tooltip: {
                enabled: false // <-- this option disables tooltips
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
                    drawBorder: true,
                    borderColor: currentTheme === THEME_MODE.DARK ? colors.divider.dark : colors.divider.DEFAULT
                }
            },
            y: {
                stacked: true,
                ticks: {
                    color: colors.darkBlue5,
                    callback: function (value, index, ticks) {
                        return formatSwapRate(value);
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
                    // borderDash: [1, 4],
                    // color: colors.divider.DEFAULT,
                    color: function (context) {
                        if (context.tick.value === 0) {
                            return 'transparent';
                        }
                        return isDark ? colors.divider.dark : colors.divider.DEFAULT;
                    }
                    // drawBorder: true
                }
            }
        },
        onClick: (event, elements) => {
            if (elements.length > 0) {
                // do something with the clicked bar, e.g. update state, show a tooltip, etc.
                setDataIndex(elements[0].index);
            }
        },
        onHover: (event, chartElement) => {
            event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
        }
    };

    return (
        <div className="mt-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="font-semibold text-[20px] leading-6">{t('table:mini_chart')}</h1>
                {/* <FilterTokenTab curToken={curToken} setCurToken={setCurToken} /> */}
            </div>

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
                    {/* <FilterTimeTab filter={filter} setFilter={setFilter} className="mb-6" /> */}
                </div>
                <div className=" w-full max-h-[450px] mt-8">
                    {loading ? (
                        <div className="h-[450px] flex justify-center items-center">
                            <Spiner isDark={isDark} size={52} />
                        </div>
                    ) : (
                        <ChartJS type="bar" data={chartData} options={options} height="450px" redraw={false} />
                    )}
                </div>
                {/* Chu thich */}
                <div className="flex justify-between items-center mt-6">
                    <div className="flex items-center gap-x-4">
                        <Note iconClassName="bg-green-6" title={t('common:buy')} />
                        <Note iconClassName="bg-purple-1" title={t('common:sell')} />
                    </div>
                    <DarkNote variants="secondary" title={t('dw_partner:notice_chart_details')} />
                </div>
            </CardWrapper>
            <ModalDetailChart
                isVisible={isNumber(dataIndex)}
                onClose={() => setDataIndex(null)}
                t={t}
                data={data?.values?.[dataIndex]}
                dateString={data?.labels?.[dataIndex]?.date}
                typeTab={typeTab}
            />
        </div>
    );
};

const ModalDetailChart = ({ onClose, isVisible, t, data, dateString, typeTab }) => {
    if (!isVisible) return null;

    let totalBuySell = data.totalBuy + data.totalSell;

    // Today is 06/04/2023: input '04/03' (MM/dd) => output 04/04/2023
    // Today is 06/04/2023: input '04/07' (MM/dd) => output 07/04/2022
    const currentYear = moment().year();
    const parsedDate = moment(dateString).year(currentYear);
    if (parsedDate.isAfter(moment())) {
        parsedDate.year(currentYear - 1);
    }

    return (
        <ModalV2
            // isVisible={true}
            isVisible={isVisible}
            onBackdropCb={onClose}
            className={`w-[90%] !max-w-[488px] overflow-y-auto select-none border-divider `}
            wrapClassName="!font-semibold"
        >
            <div>
                <h1 className="text-2xl">{typeTab === TabStatistic[0].value ? t('common:volume') : t('common:partners')}</h1>
                <CardWrapper className="!p-4 my-6 bg-gray-13">
                    <div className="flex items-center justify-between">
                        <span className="txtSecond-4">{t('common:time')}</span>
                        <div>{formatTime(parsedDate, 'dd/MM/yyyy')}</div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                        <span className="txtSecond-4">{t('common:total')}</span>
                        <div>{formatNanNumber(totalBuySell, 0)} VNDC</div>
                    </div>
                </CardWrapper>
                <h3 className="txtSecond-3">{t('common:details')}</h3>
                <CardWrapper className="!p-4 mt-3 bg-gray-13">
                    <div className="flex items-center justify-between">
                        <span className="txtSecond-4">{typeTab === TabStatistic[0].value ? t('dw_partner:buy_volume') : t('dw_partner:buy_commission')}</span>
                        <div>{formatNanNumber(data.totalBuy, 0)} VNDC</div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                        <span className="txtSecond-4">{typeTab === TabStatistic[0].value ? t('dw_partner:sell_volume') : t('dw_partner:sell_commission')}</span>
                        <div>{formatNanNumber(data.totalSell, 0)} VNDC</div>
                    </div>
                </CardWrapper>
            </div>
        </ModalV2>
    );
};

export default SessionChart;
