import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import CardWrapper from 'components/common/CardWrapper';
import Tabs, { TabItem } from 'src/components/common/Tabs/Tabs';
import ChartJS from 'components/screens/Portfolio/charts/ChartJS';
import Note from 'components/common/Note';
import colors from 'styles/colors';
import { formatTime, formatSwapRate } from 'redux/actions/utils';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import useFetchApi from 'hooks/useFetchApi';
import { API_GET_COMMISSION_STATISTIC_PARTNER } from 'redux/actions/apis';
import FilterTimeTab from 'components/common/FilterTimeTab';
import DarkNote from 'components/common/DarkNote';
import ModalV2 from 'components/common/V2/ModalV2';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import moment from 'moment';
import { isNumber } from 'lodash';
import FilterTokenTab from 'components/common/FilterTokenTab';

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

    const [showModalDetail, setShowModalDetail] = useState(null);
    const [curToken, setCurToken] = useState(72);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });

    const { data, loading, error } = useFetchApi(
        {
            url: API_GET_COMMISSION_STATISTIC_PARTNER,
            params: { from: +filter?.range?.startDate, to: +filter?.range?.endDate, type: typeTab, currency: curToken, interval: 'd' }
        },
        true,
        [filter, typeTab, curToken]
    );

    useEffect(() => {
        if (!data) return;

        setChartData({
            labels: data.labels,
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
                setShowModalDetail(elements[0].index);
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
                <h1 className="font-semibold text-[20px] leading-6">Báo cáo hoa hồng</h1>
                <FilterTokenTab curToken={curToken} setCurToken={setCurToken} />
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
                    <FilterTimeTab filter={filter} setFilter={setFilter} className="mb-6" />
                </div>
                <div className=" w-full max-h-[450px] mt-8">
                    <ChartJS type="bar" data={chartData} options={options} height="450px" />
                </div>
                {/* Chu thich */}
                <div className="flex justify-between items-center mt-6">
                    <div className="flex items-center gap-x-4">
                        <Note iconClassName="bg-purple-1" title={t('common:deposit')} />
                        <Note iconClassName="bg-green-6" title={t('common:withdraw')} />
                    </div>
                    <DarkNote variants="secondary" title={'Nhấn vào từng cột xem thống kê chi tiết theo ngày'} />
                </div>
            </CardWrapper>
            <ModalDetailChart
                isVisible={isNumber(showModalDetail)}
                onClose={() => setShowModalDetail(null)}
                t={t}
                data={data?.data?.[showModalDetail]}
                dateString={data?.labels?.[showModalDetail]}
            />
        </div>
    );
};

const ModalDetailChart = ({ onClose, isVisible, t, data, dateString }) => {
    if (!isVisible) return null;

    let buy = 0,
        sell = 0,
        totalBuySell = 0;

    data.forEach((item) => {
        if (item.value) {
            if (item.side === SIDE.BUY) buy = item.value;
            else if (item.side === SIDE.SELL) sell = item.value;
            totalBuySell += item.value;
        }
    });

    // Today is 06/04/2023: input '04/03' (MM/dd) => output 04/04/2023
    // Today is 06/04/2023: input '04/07' (MM/dd) => output 07/04/2022
    const currentYear = moment().year();
    const parsedDate = moment(dateString, 'MM/DD').year(currentYear);
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
                <h1 className="text-2xl">Tổng khối lượng nạp rút</h1>
                <CardWrapper className="!p-4 my-6">
                    <div className="flex items-center justify-between">
                        <span className="txtSecond-4">{t('common:time')}</span>
                        <div>{formatTime(parsedDate, 'dd/MM/yyyy')}</div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                        <span className="txtSecond-4">{t('common:total')}</span>
                        <div>{formatSwapRate(totalBuySell)} VNDC</div>
                    </div>
                </CardWrapper>
                <h3 className="txtSecond-3">{t('common:details')}</h3>
                <CardWrapper className="!p-4 mt-3">
                    <div className="flex items-center justify-between">
                        <span className="txtSecond-4">Khối lượng nạp</span>
                        <div>{formatSwapRate(buy)} VNDC</div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                        <span className="txtSecond-4">Khối lượng rút</span>
                        <div>{formatSwapRate(sell)} VNDC</div>
                    </div>
                </CardWrapper>
            </div>
        </ModalV2>
    );
};

export default SessionChart;
