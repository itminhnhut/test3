import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import dynamic from 'next/dynamic';
import React, { useMemo, useRef, useState } from 'react';
import { formatNumber } from 'redux/actions/utils';
import styled from 'styled-components';
import colors from 'styles/colors';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { useTranslation } from 'next-i18next';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { find } from 'lodash';

function f(x) {
    return x * x;
}
var xValues = Array.from({ length: 48 }, (_, i) => i + 1);
var yValues = xValues.map(f);

const series = [
    {
        name: 'Series 1',
        data: yValues
    }
];

const getApyByMonth = ({ amount, percentPerMonth, numberOfMonth }) => {
    const realAmount = amount * Math.pow(1 + percentPerMonth / 100, numberOfMonth);
    return {
        interestRate: realAmount - amount,
        realAmount
    };
};

const TIMER = [
    { vi: '1 tháng', en: '1 tháng', value: 1 },
    { vi: '12 tháng', en: '12 tháng', value: 12 },
    { vi: '24 tháng', en: '24 tháng', value: 24 },
    { vi: '36 tháng', en: '36 tháng', value: 36 },
    { vi: '48 tháng', en: '48 tháng', value: 48 }
];

const MONTHS_PER_YEAR = 12;

const APYInterestChart = ({ amount, currency }) => {
    const [theme] = useDarkMode();
    const isDark = theme === THEME_MODE.DARK;
    const {
        i18n: { language }
    } = useTranslation();

    const assetConfigs = useSelector((state) => state.utils?.assetConfig) || null;
    const currencyConfig = useMemo(() => {
        return find(assetConfigs, {
            id: currency.value
        });
    }, [currency.value, assetConfigs]);
    const [hoverData, setHoverData] = useState({
        value: 0,
        index: 0
    });

    const options = useMemo(
        () => ({
            chart: {
                height: 320,
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

    const apyByMonth = useMemo(
        () => getApyByMonth({ amount, percentPerMonth: currency.apyPercent / MONTHS_PER_YEAR, numberOfMonth: hoverData.index + 1 }),
        [hoverData.index, currency.apyPercent, amount]
    );

    return (
        typeof window !== 'undefined' && (
            <Wrapper className="relative -ml-5 -mr-2 md:m-0">
                <div className="absolute left-10 top-10">
                    <div className="font-semibold text-sm mb-4">Sau {hoverData.index + 1} tháng bạn sẽ nhận được</div>
                    <div className="space-y-1 mb-4">
                        <div className="text-txtSecondary dark:text-txtSecondary-dark text-xs md:text-sm">Lãi cuối kỳ</div>
                        <div className="font-semibold md:text-xl">
                            {formatNumber(apyByMonth.interestRate, currencyConfig?.assetDigit || 0)} {currencyConfig?.assetCode}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-txtSecondary dark:text-txtSecondary-dark text-xs md:text-sm">Số dư cuối kỳ</div>
                        <div className="font-semibold md:text-xl">
                            {formatNumber(apyByMonth.realAmount, currencyConfig?.assetDigit || 0)} {currencyConfig?.assetCode}
                        </div>
                    </div>
                </div>
                <div className="">
                    <Chart options={options} series={series} type="area" />
                </div>

                <div className="ml-5 z-[5] -mt-4 mr-2 flex md:justify-between relative">
                    {TIMER.map((item, key) => {
                        return (
                            <div
                                onClick={() => {
                                    setHoverData({ index: item.value - 1 });
                                }}
                                className="first:pl-0 pl-2 w-1/5 md:w-auto  md:pl-0 w"
                                key={item.value}
                            >
                                <div
                                    className={classNames(
                                        `text-txtSecondary bg-hover-1 dark:bg-dark-2 cursor-pointer dark:text-txtSecondary-dark
                               text-xs md:text-sm rounded-md md:px-4 py-2 flex items-center justify-center`,
                                        {
                                            '!bg-teal/10 !text-teal font-semibold': item.value === hoverData.index + 1
                                        }
                                    )}
                                >
                                    {item[language]}
                                </div>
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

export default React.memo(APYInterestChart);
