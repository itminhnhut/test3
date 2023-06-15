import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import dynamic from 'next/dynamic';
import React, { useMemo, useRef, useState } from 'react';
import { formatNumber } from 'redux/actions/utils';
import styled from 'styled-components';
import colors from 'styles/colors';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { useTranslation } from 'next-i18next';

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

const TIMER = [
    { vi: '1 tháng', en: '1 tháng', value: 1 },
    { vi: '12 tháng', en: '12 tháng', value: 12 },
    { vi: '24 tháng', en: '24 tháng', value: 24 },
    { vi: '36 tháng', en: '36 tháng', value: 36 },
    { vi: '48 tháng', en: '48 tháng', value: 48 }
];

const APYInterestChart = () => {
    const [theme] = useDarkMode();
    const isDark = theme === THEME_MODE.DARK;
    const {
        i18n: { language }
    } = useTranslation();

    const [hoverData, setHoverData] = useState({
        value: 0,
        index: 0
    });

    const options = useMemo(
        () => ({
            chart: {
                height: 320,
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
                lineCap: 'butt'
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.9,
                    stops: [71, 204, 133],
                    gradientToColors: 'green'
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
                            index: dataPointIndex,
                            value: series?.[seriesIndex]?.[dataPointIndex]
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

    return (
        typeof window !== 'undefined' && (
            <Wrapper className="relative">
                <div className="absolute left-10 top-10">
                    <div className="font-semibold text-sm mb-4">Sau {hoverData.index + 1} tháng bạn sẽ nhận được</div>
                    <div className=" mb-4">
                        <div className="text-txtSecondary dark:text-txtSecondary-dark text-sm">Lãi suất</div>
                        <div className="font-semibold text-xl">{formatNumber(hoverData.value, 0)} VNDC</div>
                    </div>
                    <div className="mb-4">
                        <div className="text-txtSecondary dark:text-txtSecondary-dark text-sm">Số dư cuối kỳ</div>
                        <div className="font-semibold text-xl">{formatNumber(hoverData.value, 0)} VNDC</div>
                    </div>
                </div>
                <Chart options={options} series={series} type="area" width="100%" />

                <div className="ml-5 pr-2 flex justify-between">
                    {TIMER.map((item, key) => {
                        return (
                            <div
                                className="text-txtSecondary cursor-pointer dark:text-txtSecondary-dark
                                text-sm rounded-md px-4 py-2 flex items-center border
                            border-divider dark:border-divider-dark"
                            >
                                {item[language]}
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
