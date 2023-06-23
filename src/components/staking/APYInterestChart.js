import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import dynamic from 'next/dynamic';
import React, { useMemo, useState, memo, useRef } from 'react';
import { formatNumber, scrollHorizontal } from 'redux/actions/utils';
import styled from 'styled-components';
import colors from 'styles/colors';
import { useTranslation } from 'next-i18next';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import Chip from 'components/common/V2/Chip';
import { STAKING_RANGE } from 'constants/staking';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

/* Công thức tính series Data.
    function f(x) {
        return x * x;
    }
    let xValues = Array.from({ length: 48 }, (_, i) => i + 1);
    let yValues = xValues.map(f);
*/

const series = [
    {
        name: 'Series 1',
        data: [
            1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256, 289, 324, 361, 400, 441, 484, 529, 576, 625, 676, 729, 784, 841, 900, 961, 1024,
            1089, 1156, 1225, 1296, 1369, 1444, 1521, 1600, 1681, 1764, 1849, 1936, 2025, 2116, 2209, 2304
        ] // data = yValues
    }
];

const getApyByMonth = ({ allowAmount, amount, percentPerDay, numberOfMonth }) => {
    const monthsToDays = {
        1: 30,
        12: 365,
        24: 730,
        36: 1095,
        48: 1460
    };
    // công thức tính lãi kép theo tháng
    const compoundInterestAmount = +allowAmount * Math.pow(1 + percentPerDay / 100, monthsToDays[+numberOfMonth] || numberOfMonth * 30);
    const interestAmount = +compoundInterestAmount - +allowAmount;
    return {
        interestAmount,
        realBalanceAmount: +amount + interestAmount
    };
};

const TIMER = [
    { vi: '1 tháng', en: '1 month', key: 1 },
    { vi: '12 tháng', en: '12 months', key: 12 },
    { vi: '24 tháng', en: '24 months', key: 24 },
    { vi: '36 tháng', en: '36 months', key: 36 },
    { vi: '48 tháng', en: '48 months', key: 48 }
];

const APYInterestChart = ({ amount, currencyId, currencyDayInterest }) => {
    const [theme] = useDarkMode();
    const isDark = theme === THEME_MODE.DARK;
    const timerListRef = useRef(null);
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const [hoverData, setHoverData] = useState({
        value: 0,
        index: 0
    });

    const assetConfigs = useSelector((state) => state.utils?.assetConfig) || [];
    const currencyConfig = useMemo(() => {
        return assetConfigs.find((asset) => asset?.id === currencyId);
    }, [currencyId, assetConfigs]);

    const options = useMemo(
        () => ({
            chart: {
                width: '100%',
                type: 'area',
                toolbar: {
                    show: false
                },
                zoom: {
                    enabled: false
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'straight',
                lineCap: 'butt',
                width: 1
            },
            colors: [colors.teal],
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'light',
                    shadeIntensity: 0,
                    opacityFrom: isDark ? 1 : 0.8,
                    opacityTo: isDark ? 0.1 : 0.3,
                    stops: isDark ? [0, 100] : []
                }
            },
            yaxis: {
                labels: {
                    show: false
                },
                axisBorder: {
                    show: true,
                    color: isDark ? colors.divider.dark : colors.divider.DEFAULT
                }
            },
            xaxis: {
                labels: {
                    show: false
                },

                crosshairs: {
                    show: false
                },

                axisBorder: {
                    show: true,
                    color: isDark ? colors.divider.dark : colors.divider.DEFAULT
                },

                axisTicks: {
                    show: false
                }
            },
            grid: {
                show: false,
                xaxis: {
                    lines: {
                        show: false
                    }
                }
            },
            tooltip: {
                x: {
                    formatter: (_, { series, seriesIndex, dataPointIndex }) => {
                        setHoverData({
                            index: dataPointIndex
                        });
                    }
                }
            },

            markers: {
                hover: {
                    size: 5
                },
                colors: colors.teal,
                strokeWidth: 0
            }
        }),
        [isDark]
    );

    const apyByMonth = useMemo(() => {
        const allowAmount = amount > STAKING_RANGE[currencyId].max ? STAKING_RANGE[currencyId].max : amount;
        return getApyByMonth({ allowAmount, amount, percentPerDay: currencyDayInterest, numberOfMonth: hoverData.index + 1 });
    }, [hoverData.index, currencyDayInterest, currencyId, amount]);

    const isAmountSmallerThanMin = amount < STAKING_RANGE[currencyId].min;

    return (
        typeof window !== 'undefined' && (
            <Wrapper className="relative -ml-5 -mr-2 lg:m-0">
                <div className="absolute left-10 top-10">
                    <div className="font-semibold text-sm mb-4">{t('staking:calculate_interest.after_xx_month', { month: hoverData.index + 1 })}</div>
                    <div className="space-y-1 mb-4">
                        <div className="text-txtSecondary dark:text-txtSecondary-dark text-xs md:text-sm">
                            {t('staking:calculate_interest.total_interest')}:
                        </div>
                        <div className="font-semibold md:text-xl">
                            {isAmountSmallerThanMin
                                ? '--'
                                : `${formatNumber(apyByMonth.interestAmount, currencyConfig?.assetDigit || 0)} ${currencyConfig?.assetCode}`}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-txtSecondary dark:text-txtSecondary-dark text-xs md:text-sm">
                            {' '}
                            {t('staking:calculate_interest.total_balance')}:
                        </div>
                        <div className="font-semibold md:text-xl">
                            {isAmountSmallerThanMin
                                ? amount || 0
                                : apyByMonth.realBalanceAmount >= 1e20
                                ? apyByMonth.realBalanceAmount
                                : formatNumber(apyByMonth.realBalanceAmount, currencyConfig?.assetDigit || 0)}{' '}
                            {currencyConfig?.assetCode}
                        </div>
                    </div>
                </div>
                <div>
                    <Chart options={options} series={series} type="area" height={320} />
                </div>

                <div ref={timerListRef} className="ml-5 gap-2 mr-2 z-[5] -mt-5 flex justify-between relative overflow-x-auto no-scrollbar">
                    {TIMER.map((item) => {
                        const selected = item.key === hoverData.index + 1;
                        return (
                            <div
                                id={'chip' + item.key}
                                key={item.key}
                                onClick={() => {
                                    setHoverData({ index: item.key - 1 });
                                    const thisElement = document.getElementById('chip' + item.key);
                                    scrollHorizontal(thisElement, timerListRef.current);
                                }}
                            >
                                <Chip
                                    selected={selected}
                                    className={classNames('min-w-[80px]', {
                                        'dark:!bg-dark-2': !selected
                                    })}
                                >
                                    {item[language]}
                                </Chip>
                            </div>
                        );
                    })}
                </div>
            </Wrapper>
        )
    );
};

const Wrapper = styled.div`
    .apexcharts-tooltip {
        display: none;
    }
    .apexcharts-xaxistooltip {
        display: none;
    }
`;

export default memo(APYInterestChart);
